import { compareSync } from "bcryptjs";
import {
  adminCoupons,
  adminOrders,
  getAovDelivered,
  getBestSellers,
  getDeliveredSales,
  getLowStockItems,
  getOrderTotals,
  getOrdersByStatus,
  homeBannersAdmin,
  shippingGovernorates,
  type AdminOrder,
} from "@/data/adminMock";
import { governorates } from "@/data/checkoutMock";
import { allProducts, homeCategories } from "@/data/homeMock";

export function isDatabaseUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");

  return [
    "Authentication failed against database server",
    "Can't reach database server",
    "Prisma Client could not locate the Query Engine",
    "P1000",
    "P1001",
  ].some((item) => message.includes(item));
}

export function getMockProducts() {
  return allProducts.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    category: {
      id: homeCategories.find((category) => category.slug === product.categorySlug)?.id ?? product.id,
      slug: product.categorySlug,
      name: product.categoryName,
    },
    images: product.gallery.map((image, index) => ({
      id: index + 1,
      imageUrl: image,
      sortOrder: index,
    })),
    variants: product.variants.map((variant, index) => ({
      id: variant.id ?? product.id * 100 + index + 1,
      color: variant.color,
      size: variant.size,
      stockQty: variant.stock,
      reservedQty: 0,
      sku: null,
      isActive: true,
    })),
  }));
}

export function getMockCategories() {
  return homeCategories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: null,
    imageUrl: category.image,
    isActive: true,
    sortOrder: category.id,
    productsCount: allProducts.filter((product) => product.categorySlug === category.slug).length,
  }));
}

export function getMockDashboardData() {
  const ordersByStatus = getOrdersByStatus();

  return {
    deliveredSales: getDeliveredSales(),
    aov: getAovDelivered(),
    ordersByStatus,
    bestSellers: getBestSellers(),
    lowStock: getLowStockItems().map((item, index) => ({
      id: index + 1,
      product: { name: item.productName },
      color: item.color,
      size: item.size,
      stockQty: item.stock,
    })),
  };
}

export function getMockInventoryRows() {
  return allProducts.flatMap((product) =>
    product.variants.map((variant, index) => ({
      id: Number(`${product.id}${index + 1}`),
      product: {
        name: product.name,
        slug: product.slug,
      },
      sku: null,
      color: variant.color,
      size: variant.size,
      stockQty: variant.stock,
    })),
  );
}

export function getMockOrderList(status?: string) {
  const rows = status ? adminOrders.filter((order) => order.status === status) : adminOrders;
  return rows.map((order) => ({
    id: Number(order.id),
    customerName: order.customerName,
    status: order.status,
    total: getOrderTotals(order).total,
    subtotal: getOrderTotals(order).subtotal,
    discountTotal: order.discount,
    shippingFeeSnapshot: order.shippingFee,
    createdAt: order.createdAt,
  }));
}

export function getMockOrderDetails(id: number) {
  const order = adminOrders.find((item) => Number(item.id) === id);
  if (!order) return null;

  const totals = getOrderTotals(order);

  return {
    id,
    orderNumber: order.id,
    status: order.status,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    addressText: order.address,
    subtotal: totals.subtotal,
    discountTotal: order.discount,
    shippingFeeSnapshot: order.shippingFee,
    total: totals.total,
    governorate: { id: 0, name: order.governorate },
    items: order.items.map((item, index) => ({
      id: index + 1,
      productId: item.productId,
      variantId: index + 1,
      productNameSnapshot: item.name,
      colorSnapshot: item.color,
      sizeSnapshot: item.size,
      qty: item.qty,
      unitPriceSnapshot: item.unitPrice,
      lineTotal: item.unitPrice * item.qty,
    })),
    internalNotes: order.notes.map((note, index) => ({ id: index + 1, note })),
    statusLogs: order.timeline.map((entry, index) => ({
      id: index + 1,
      toStatus: entry.key,
      note: entry.label,
      createdAt: entry.at,
    })),
  };
}

export function getMockAdminProducts() {
  return getMockProducts().map((product) => ({
    id: product.id,
    categoryId: product.category.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    category: {
      id: product.category.id,
      name: product.category.name,
    },
    variants: product.variants.map((variant) => ({
      color: variant.color,
      size: variant.size,
      stockQty: variant.stockQty,
    })),
    images: product.images,
  }));
}

export function getMockAdminCategories() {
  return getMockCategories().map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    isActive: category.isActive,
    sortOrder: category.sortOrder,
    productsCount: category.productsCount,
  }));
}

export function getMockCoupons() {
  return adminCoupons.map((coupon, index) => ({
    id: index + 1,
    code: coupon.code,
    type: coupon.type.toLowerCase().includes("percentage") ? "percentage" : "fixed",
    value: coupon.type.toLowerCase().includes("percentage")
      ? Number(coupon.value.replace("%", "").trim())
      : Number(coupon.value.replace("EGP", "").trim()),
    isActive: coupon.active,
    startsAt: null,
    endsAt: null,
    maxUses: coupon.max,
    usedCount: coupon.used,
    eligibleProductIds: [],
  }));
}

export function getMockShippingRows() {
  return shippingGovernorates.map((item, index) => ({
    id: index + 1,
    name: item.name,
    fee: item.fee,
    isActive: item.active,
  }));
}

export function getMockBannerRows() {
  return homeBannersAdmin.map((banner) => ({
    id: banner.id,
    title: banner.title,
    subtitle: null,
    buttonText: null,
    imageUrlDesktop: "/images/products/placeholder.svg",
    imageUrlMobile: null,
    targetType: "url",
    targetProductId: null,
    targetCategoryId: null,
    targetUrl: banner.target,
    sortOrder: banner.order,
    isActive: banner.active,
    startsAt: null,
    endsAt: null,
  }));
}

export function getMockIntegrations() {
  return {
    google_tag_manager_id: "",
    google_analytics_id: "",
    google_ads_id: "",
    facebook_pixel_id: "",
    shippo_api_key: "",
    hotjar_tracking_code: "",
  };
}

export function getMockGovernorates() {
  return governorates;
}

export function isEmergencyAdminLogin(email: string, password: string) {
  const fallbackEmail = process.env.EMERGENCY_ADMIN_EMAIL?.trim().toLowerCase();
  const fallbackPassword = process.env.EMERGENCY_ADMIN_PASSWORD ?? "";
  const fallbackHash = process.env.EMERGENCY_ADMIN_PASSWORD_HASH ?? "";

  if (!fallbackEmail || email !== fallbackEmail) return false;
  if (fallbackPassword && password === fallbackPassword) return true;
  if (fallbackHash) return compareSync(password, fallbackHash);
  return false;
}

export function getEmergencyAdminSession() {
  return {
    id: 1,
    email: process.env.EMERGENCY_ADMIN_EMAIL?.trim().toLowerCase() ?? "admin@gatywear.com",
    role: "admin" as const,
  };
}

export function buildPatchedMockOrder(order: ReturnType<typeof getMockOrderDetails>, status: AdminOrder["status"]) {
  if (!order) return null;
  const statusLabels: Record<AdminOrder["status"], string> = {
    pending: "تم إنشاء الطلب",
    processing: "قيد التجهيز",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
    canceled: "تم الإلغاء",
  };

  return {
    ...order,
    status,
    statusLogs: [
      ...order.statusLogs,
      {
        id: order.statusLogs.length + 1,
        toStatus: status,
        note: statusLabels[status],
        createdAt: new Date().toISOString(),
      },
    ],
  };
}
