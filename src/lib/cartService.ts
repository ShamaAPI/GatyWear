import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const CART_COOKIE_KEY = "cart_token";
const CART_EXPIRY_HOURS = 24;

type CartWithRelations = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            images: true;
          };
        };
        variant: true;
      };
    };
  };
}>;

export async function getCartToken() {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE_KEY)?.value ?? null;
}

export async function getOrCreateCartToken() {
  const cookieStore = await cookies();
  let token = cookieStore.get(CART_COOKIE_KEY)?.value;

  if (!token) {
    token = randomUUID();
    cookieStore.set(CART_COOKIE_KEY, token, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: CART_EXPIRY_HOURS * 60 * 60,
    });
  }

  return token;
}

export function getCartExpiryDate() {
  const now = new Date();
  return new Date(now.getTime() + CART_EXPIRY_HOURS * 60 * 60 * 1000);
}

export async function releaseExpiredCartReservations() {
  const expiredCarts = await prisma.cart.findMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
    include: {
      items: true,
    },
  });

  if (!expiredCarts.length) return;

  await prisma.$transaction(async (tx) => {
    for (const cart of expiredCarts) {
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            reservedQty: {
              decrement: item.qty,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });
      await tx.cart.delete({
        where: {
          id: cart.id,
        },
      });
    }
  });
}

export function mapCartResponse(cart: CartWithRelations | null) {
  if (!cart) {
    return {
      id: null,
      token: null,
      expiresAt: null,
      items: [],
      summary: {
        subtotal: 0,
        itemCount: 0,
      },
    };
  }

  const items = cart.items.map((item) => {
    const image = item.product.images.sort((first, second) => first.sortOrder - second.sortOrder)[0];
    const unitPrice = Number(item.unitPriceSnapshot);
    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.qty,
      unitPrice,
      lineTotal: unitPrice * item.qty,
      product: {
        id: item.product.id,
        slug: item.product.slug,
        name: item.product.name,
        image: image?.imageUrl ?? "/images/products/placeholder.svg",
        imageFallback: "/images/products/placeholder.svg",
      },
      variant: {
        id: item.variant.id,
        color: item.variant.color,
        size: item.variant.size,
        stock: item.variant.stockQty,
        reserved: item.variant.reservedQty,
      },
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    token: cart.cartToken,
    expiresAt: cart.expiresAt,
    items,
    summary: {
      subtotal,
      itemCount,
    },
  };
}
