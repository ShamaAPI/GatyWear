import { allProducts } from "@/data/homeMock";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "canceled";

export type AdminOrderItem = {
  productId: number;
  name: string;
  color: string;
  size: string;
  qty: number;
  unitPrice: number;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  governorate: string;
  status: OrderStatus;
  shippingFee: number;
  discount: number;
  createdAt: string;
  timeline: { key: string; label: string; at: string }[];
  notes: string[];
  shippingProvider?: string;
  trackingNumber?: string;
  items: AdminOrderItem[];
};

export const adminOrders: AdminOrder[] = [
  {
    id: "1001",
    customerName: "أحمد سامي",
    customerPhone: "01012345678",
    address: "مدينة نصر، شارع الطيران",
    governorate: "القاهرة",
    status: "pending",
    shippingFee: 70,
    discount: 80,
    createdAt: "2026-04-25 10:20",
    timeline: [{ key: "created", label: "تم إنشاء الطلب", at: "2026-04-25 10:20" }],
    notes: ["طلب أول مرة", "التواصل بعد 6 مساءً"],
    items: [
      { productId: 1, name: "تيشيرت أوفر سايز أسود", color: "أسود", size: "M", qty: 1, unitPrice: 799 },
      { productId: 8, name: "كاب ستريتوير", color: "أسود", size: "One Size", qty: 1, unitPrice: 399 },
    ],
  },
  {
    id: "1002",
    customerName: "ملك علي",
    customerPhone: "01122223333",
    address: "سموحة، شارع فوزي معاذ",
    governorate: "الإسكندرية",
    status: "processing",
    shippingFee: 85,
    discount: 0,
    createdAt: "2026-04-25 12:15",
    timeline: [
      { key: "created", label: "تم إنشاء الطلب", at: "2026-04-25 12:15" },
      { key: "processing", label: "قيد التجهيز", at: "2026-04-25 13:40" },
    ],
    notes: ["تأكيد المقاس قبل الشحن"],
    items: [{ productId: 2, name: "هودي قطن ثقيل", color: "رمادي", size: "L", qty: 1, unitPrice: 1299 }],
  },
  {
    id: "1003",
    customerName: "محمد عادل",
    customerPhone: "01233334444",
    address: "المعادي، زهراء المعادي",
    governorate: "القاهرة",
    status: "shipped",
    shippingFee: 70,
    discount: 100,
    createdAt: "2026-04-24 18:50",
    timeline: [
      { key: "created", label: "تم إنشاء الطلب", at: "2026-04-24 18:50" },
      { key: "processing", label: "قيد التجهيز", at: "2026-04-24 19:20" },
      { key: "shipped", label: "تم الشحن", at: "2026-04-25 11:00" },
    ],
    notes: [],
    shippingProvider: "Bosta",
    trackingNumber: "BST-55661",
    items: [{ productId: 4, name: "جاكيت دينم رمادي", color: "رمادي", size: "M", qty: 1, unitPrice: 1499 }],
  },
  {
    id: "1004",
    customerName: "نور كريم",
    customerPhone: "01544445555",
    address: "المنصورة، حي الجامعة",
    governorate: "المنصورة",
    status: "delivered",
    shippingFee: 80,
    discount: 90,
    createdAt: "2026-04-22 09:30",
    timeline: [
      { key: "created", label: "تم إنشاء الطلب", at: "2026-04-22 09:30" },
      { key: "processing", label: "قيد التجهيز", at: "2026-04-22 10:00" },
      { key: "shipped", label: "تم الشحن", at: "2026-04-22 16:30" },
      { key: "delivered", label: "تم التسليم", at: "2026-04-23 14:10" },
    ],
    notes: ["العميل أكد الاستلام"],
    shippingProvider: "Aramex",
    trackingNumber: "ARM-88912",
    items: [{ productId: 3, name: "بنطال كارغو ستريت", color: "زيتي", size: "34", qty: 2, unitPrice: 999 }],
  },
  {
    id: "1005",
    customerName: "سارة حسن",
    customerPhone: "01055556666",
    address: "الشيخ زايد، الحي 12",
    governorate: "الجيزة",
    status: "canceled",
    shippingFee: 75,
    discount: 0,
    createdAt: "2026-04-21 20:10",
    timeline: [
      { key: "created", label: "تم إنشاء الطلب", at: "2026-04-21 20:10" },
      { key: "canceled", label: "تم الإلغاء", at: "2026-04-22 10:30" },
    ],
    notes: ["إلغاء بطلب العميل"],
    items: [{ productId: 6, name: "هودي سحاب كلاسيك", color: "أسود", size: "M", qty: 1, unitPrice: 1199 }],
  },
];

export const adminCoupons = [
  { code: "SAVE10", type: "Percentage", value: "10%", active: true, used: 14, max: 100 },
  { code: "TSHIRT10", type: "Percentage", value: "10%", active: true, used: 7, max: 50 },
  { code: "EXPIRED", type: "Fixed", value: "100 EGP", active: false, used: 50, max: 50 },
];

export const shippingGovernorates = [
  { name: "القاهرة", fee: 70, active: true },
  { name: "الجيزة", fee: 75, active: true },
  { name: "الإسكندرية", fee: 85, active: true },
  { name: "المنصورة", fee: 80, active: true },
  { name: "أسيوط", fee: 95, active: false },
];

export const homeBannersAdmin = [
  { id: 1, title: "مجموعة الشارع الجديدة", target: "Category /tshirts", active: true, order: 1 },
  { id: 2, title: "خصم أسبوع الإطلاق", target: "URL /sale", active: true, order: 2 },
  { id: 3, title: "هوديز الموسم", target: "Category /hoodies", active: false, order: 3 },
];

export function getOrderTotals(order: AdminOrder) {
  const subtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const total = subtotal - order.discount + order.shippingFee;
  return { subtotal, total };
}

export function getDeliveredSales() {
  return adminOrders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + getOrderTotals(order).total, 0);
}

export function getAovDelivered() {
  const deliveredOrders = adminOrders.filter((order) => order.status === "delivered");
  if (!deliveredOrders.length) return 0;
  return Math.round(getDeliveredSales() / deliveredOrders.length);
}

export function getOrdersByStatus() {
  return {
    pending: adminOrders.filter((order) => order.status === "pending").length,
    processing: adminOrders.filter((order) => order.status === "processing").length,
    shipped: adminOrders.filter((order) => order.status === "shipped").length,
    delivered: adminOrders.filter((order) => order.status === "delivered").length,
    canceled: adminOrders.filter((order) => order.status === "canceled").length,
  };
}

export function getBestSellers() {
  const map = new Map<string, number>();
  adminOrders.forEach((order) => {
    order.items.forEach((item) => {
      const current = map.get(item.name) ?? 0;
      map.set(item.name, current + item.qty);
    });
  });
  return [...map.entries()]
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 4);
}

export function getLowStockItems() {
  return allProducts
    .flatMap((product) =>
      product.variants.map((variant) => ({
        productName: product.name,
        color: variant.color,
        size: variant.size,
        stock: variant.stock,
      })),
    )
    .filter((variant) => variant.stock <= 4)
    .slice(0, 8);
}
