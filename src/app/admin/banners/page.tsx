"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type BannerRow = {
  id: number;
  title: string | null;
  targetType: string;
  sortOrder: number;
  isActive: boolean;
};

export default function AdminBannersPage() {
  const [rows, setRows] = useState<BannerRow[]>([]);
  const [title, setTitle] = useState("");
  const [imageUrlDesktop, setImageUrlDesktop] = useState("");

  async function load() {
    const res = await fetch("/api/admin/banners");
    const json = await res.json();
    setRows((json.data ?? []) as BannerRow[]);
  }

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, []);

  async function saveBanner() {
    await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        imageUrlDesktop,
        targetType: "url",
        targetUrl: "/",
        isActive: true,
      }),
    });
    setTitle("");
    setImageUrlDesktop("");
    await load();
  }

  async function deleteBanner(id: number) {
    await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <AdminShell title="???????" subtitle="????? ????? ?????? ????????">
      <section className="space-y-2 rounded-2xl border border-black/10 bg-white p-4">
        <h3 className="text-sm font-semibold">????? ???</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <input
            className="rounded-lg border border-black/15 px-3 py-2 text-sm"
            placeholder="???????"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="rounded-lg border border-black/15 px-3 py-2 text-sm"
            placeholder="???? ??????"
            value={imageUrlDesktop}
            onChange={(e) => setImageUrlDesktop(e.target.value)}
          />
          <button className="rounded-lg bg-primary px-3 py-2 text-sm text-white" onClick={saveBanner}>
            ???
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-right text-black/55">
                <th className="pb-2">???????</th>
                <th className="pb-2">?????</th>
                <th className="pb-2">???????</th>
                <th className="pb-2">??????</th>
                <th className="pb-2">?????</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((banner) => (
                <tr key={banner.id} className="border-t border-black/5">
                  <td className="py-2">{banner.title ?? "-"}</td>
                  <td className="py-2">{banner.targetType}</td>
                  <td className="py-2">{banner.sortOrder}</td>
                  <td className="py-2">{banner.isActive ? "???" : "????"}</td>
                  <td className="py-2">
                    <button onClick={() => deleteBanner(banner.id)} className="text-red-600">
                      ???
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
