import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCartExpiryDate,
  getOrCreateCartToken,
  mapCartResponse,
  releaseExpiredCartReservations,
} from "@/lib/cartService";

async function loadCartWithRelations(cartToken: string) {
  return prisma.cart.findUnique({
    where: { cartToken },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
          variant: true,
        },
      },
    },
  });
}

export async function GET() {
  try {
    await releaseExpiredCartReservations();
    const cartToken = await getOrCreateCartToken();
    const cart = await loadCartWithRelations(cartToken);

    return NextResponse.json({
      ok: true,
      data: mapCartResponse(cart),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to load cart",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await releaseExpiredCartReservations();

    const body = await request.json();
    const productId = Number(body.productId);
    const variantId = Number(body.variantId);
    const quantity = Number(body.quantity ?? 1);

    if (!productId || !variantId || quantity <= 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid cart payload",
        },
        { status: 400 },
      );
    }

    const cartToken = await getOrCreateCartToken();

    await prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant || !variant.isActive || variant.productId !== productId) {
        throw new Error("Variant not found");
      }

      const available = variant.stockQty - variant.reservedQty;
      if (available < quantity) {
        throw new Error(`OUT_OF_STOCK:${available}`);
      }

      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product || !product.isActive) {
        throw new Error("Product not found");
      }

      const cart =
        (await tx.cart.findUnique({
          where: { cartToken },
        })) ??
        (await tx.cart.create({
          data: {
            cartToken,
            expiresAt: getCartExpiryDate(),
          },
        }));

      const existing = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          variantId,
        },
      });

      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: {
            qty: { increment: quantity },
            updatedAt: new Date(),
          },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            variantId,
            qty: quantity,
            unitPriceSnapshot: product.price,
          },
        });
      }

      await tx.productVariant.update({
        where: { id: variantId },
        data: {
          reservedQty: { increment: quantity },
        },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          expiresAt: getCartExpiryDate(),
        },
      });
    });

    const cart = await loadCartWithRelations(cartToken);

    return NextResponse.json({
      ok: true,
      data: mapCartResponse(cart),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.startsWith("OUT_OF_STOCK")) {
      const available = message.split(":")[1] ?? "0";
      return NextResponse.json(
        {
          ok: false,
          message: `المتاح ${available} فقط`,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to add cart item",
        error: message,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const itemId = Number(body.itemId);
    const quantity = Number(body.quantity);

    if (!itemId || quantity < 0) {
      return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
    }

    const cartToken = await getOrCreateCartToken();

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { cartToken } });
      if (!cart) throw new Error("Cart not found");

      const item = await tx.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
      if (!item) throw new Error("Cart item not found");

      const delta = quantity - item.qty;
      const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
      if (!variant) throw new Error("Variant not found");

      if (delta > 0) {
        const available = variant.stockQty - variant.reservedQty;
        if (available < delta) {
          throw new Error(`OUT_OF_STOCK:${available}`);
        }
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { reservedQty: { increment: delta } },
        });
      } else if (delta < 0) {
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { reservedQty: { decrement: Math.abs(delta) } },
        });
      }

      if (quantity === 0) {
        await tx.cartItem.delete({ where: { id: item.id } });
      } else {
        await tx.cartItem.update({
          where: { id: item.id },
          data: { qty: quantity },
        });
      }
    });

    const cart = await loadCartWithRelations(cartToken);
    return NextResponse.json({ ok: true, data: mapCartResponse(cart) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.startsWith("OUT_OF_STOCK")) {
      const available = message.split(":")[1] ?? "0";
      return NextResponse.json({ ok: false, message: `المتاح ${available} فقط` }, { status: 400 });
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to update cart item",
        error: message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = Number(searchParams.get("itemId"));

    if (!itemId) {
      return NextResponse.json({ ok: false, message: "Invalid item id" }, { status: 400 });
    }

    const cartToken = await getOrCreateCartToken();

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { cartToken } });
      if (!cart) return;

      const item = await tx.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
      if (!item) return;

      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          reservedQty: { decrement: item.qty },
        },
      });

      await tx.cartItem.delete({ where: { id: item.id } });
    });

    const cart = await loadCartWithRelations(cartToken);
    return NextResponse.json({ ok: true, data: mapCartResponse(cart) });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to remove cart item",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
