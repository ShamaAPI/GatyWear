"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
  isActive: boolean;
};

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function load() {
    const res = await fetch("/api/admin/categories");
    const json = await res.json();
    setRows((json.data ?? []) as CategoryRow[]);
  }

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, []);

  async function createCategory() {
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, isActive: true }),
    });
    setName("");
    setSlug("");
    await load();
  }

  async function deleteCategory(id: number) {
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <AdminShell title="الفئات" subtitle="إدارة الفئات">
      <section className="rounded-2xl border border-black/10 bg-white p-4 space-y-2">
        <h3 className="text-sm font-semibold">إضافة فئة</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <input className="rounded-lg border border-black/15 px-3 py-2 text-sm" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-lg border border-black/15 px-3 py-2 text-sm" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <button className="rounded-lg bg-primary px-3 py-2 text-sm text-white" onClick={createCategory}>حفظ</button>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-right text-black/55"><th className="pb-2">الاسم</th><th className="pb-2">Slug</th><th className="pb-2">عدد المنتجات</th><th className="pb-2">الحالة</th><th className="pb-2">إجراء</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-t border-black/5"><td className="py-2">{item.name}</td><td className="py-2">{item.slug}</td><td className="py-2">{item.productsCount}</td><td className="py-2">{item.isActive ? "نشطة" : "مخفية"}</td><td className="py-2"><button onClick={() => deleteCategory(item.id)} className="text-red-600">حذف</button></td></tr>)}</tbody></table></div>
      </section>
    </AdminShell>
  );
}
