"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type ProductRow = { id: number; name: string; categoryId: number; price: number; variants: { color: string; size: string; stockQty: number }[]; category: { name: string } };
type Category = { id: number; name: string };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState(0);

  async function load() {
    const [productsRes, categoriesRes] = await Promise.all([fetch("/api/admin/products"), fetch("/api/admin/categories")]);
    setProducts((await productsRes.json()).data ?? []);
    setCategories((await categoriesRes.json()).data ?? []);
  }

  useEffect(() => { const timer = setTimeout(() => void load(), 0); return () => clearTimeout(timer); }, []);

  async function createProduct() {
    if (!name || !slug || !price || !categoryId) return;
    await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, slug, description: "", price, categoryId, variants: [], images: [] }) });
    setName(""); setSlug(""); setPrice(0); await load();
  }

  async function deleteProduct(id: number) { await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" }); await load(); }

  return (
    <AdminShell title="المنتجات" subtitle="إدارة المنتجات والأسعار">
      <section className="rounded-2xl border border-black/10 bg-white p-4 space-y-2">
        <h3 className="text-sm font-semibold">إضافة منتج جديد</h3>
        <div className="grid gap-2 md:grid-cols-4">
          <input className="rounded-lg border border-black/15 px-3 py-2 text-sm" placeholder="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-lg border border-black/15 px-3 py-2 text-sm" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <input className="rounded-lg border border-black/15 px-3 py-2 text-sm" placeholder="السعر" type="number" value={price || ""} onChange={(e) => setPrice(Number(e.target.value))} />
          <select className="rounded-lg border border-black/15 px-3 py-2 text-sm" value={categoryId || ""} onChange={(e) => setCategoryId(Number(e.target.value))}><option value="">اختر الفئة</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </div>
        <button className="rounded-lg bg-primary px-3 py-2 text-sm text-white" onClick={createProduct}>حفظ المنتج</button>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-right text-black/55"><th className="pb-2">المنتج</th><th className="pb-2">الفئة</th><th className="pb-2">السعر</th><th className="pb-2">عدد المتغيرات</th><th className="pb-2">إجمالي المخزون</th><th className="pb-2">إجراء</th></tr></thead><tbody>{products.map((product) => { const stockTotal = product.variants.reduce((sum, item) => sum + item.stockQty, 0); return <tr key={product.id} className="border-t border-black/5"><td className="py-2 font-medium">{product.name}</td><td className="py-2">{product.category?.name}</td><td className="py-2">{product.price} جنيه</td><td className="py-2">{product.variants.length}</td><td className="py-2">{stockTotal}</td><td className="py-2"><button onClick={() => deleteProduct(product.id)} className="text-red-600">حذف</button></td></tr>; })}</tbody></table></div>
      </section>
    </AdminShell>
  );
}
