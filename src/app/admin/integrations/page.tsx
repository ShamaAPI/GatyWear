"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type IntegrationFormState = {
  gtmId: string;
  gaId: string;
  googleAdsId: string;
  facebookPixelId: string;
  shippoApiKey: string;
  hotjarTrackingCode: string;
};

type IntegrationApiData = {
  google_tag_manager_id?: string | null;
  google_analytics_id?: string | null;
  google_ads_id?: string | null;
  facebook_pixel_id?: string | null;
  shippo_api_key?: string | null;
  hotjar_tracking_code?: string | null;
};

const initialState: IntegrationFormState = {
  gtmId: "",
  gaId: "",
  googleAdsId: "",
  facebookPixelId: "",
  shippoApiKey: "",
  hotjarTrackingCode: "",
};

function mapApiToForm(data?: IntegrationApiData): IntegrationFormState {
  return {
    gtmId: data?.google_tag_manager_id ?? "",
    gaId: data?.google_analytics_id ?? "",
    googleAdsId: data?.google_ads_id ?? "",
    facebookPixelId: data?.facebook_pixel_id ?? "",
    shippoApiKey: data?.shippo_api_key ?? "",
    hotjarTrackingCode: data?.hotjar_tracking_code ?? "",
  };
}

export default function AdminIntegrationsPage() {
  const [form, setForm] = useState<IntegrationFormState>(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string>("");

  function setField<K extends keyof IntegrationFormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function loadIntegrations() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/integrations", { method: "GET", cache: "no-store" });
      const json = (await response.json()) as { ok?: boolean; message?: string; data?: IntegrationApiData };

      if (!response.ok || !json.ok) {
        throw new Error(json.message || "???? ????? ??????? ?????");
      }

      setForm(mapApiToForm(json.data));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "???? ????? ????????");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadIntegrations();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = (await response.json()) as { ok?: boolean; message?: string; data?: IntegrationApiData };
      if (!response.ok || !json.ok) {
        throw new Error(json.message || "??? ??? ????? ?????");
      }

      // Real-time UI update without reload
      setForm(mapApiToForm(json.data));
      setMessage("?? ??? ??????? ????? ?????");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "???? ??? ????????");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminShell title="??????? ?????" subtitle="????? ????? ?????? ??????? ?????">
      <section className="rounded-xl border border-black/10 bg-white p-5">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1.5 text-sm">
            <span className="font-bold text-primary">Google Tag Manager ID</span>
            <input
              className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primary"
              value={form.gtmId}
              onChange={(event) => setField("gtmId", event.target.value)}
              placeholder="GTM-XXXXXXX"
              disabled={isLoading}
            />
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="font-bold text-primary">Google Analytics ID</span>
            <input
              className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primary"
              value={form.gaId}
              onChange={(event) => setField("gaId", event.target.value)}
              placeholder="G-XXXXXXXXXX"
              disabled={isLoading}
            />
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="font-bold text-primary">Google Ads ID</span>
            <input
              className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primary"
              value={form.googleAdsId}
              onChange={(event) => setField("googleAdsId", event.target.value)}
              placeholder="AW-XXXXXXXXX"
              disabled={isLoading}
            />
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="font-bold text-primary">Facebook Pixel ID</span>
            <input
              className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primary"
              value={form.facebookPixelId}
              onChange={(event) => setField("facebookPixelId", event.target.value)}
              placeholder="123456789012345"
              disabled={isLoading}
            />
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="font-bold text-primary">Shippo API Key</span>
            <input
              className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primary"
              value={form.shippoApiKey}
              onChange={(event) => setField("shippoApiKey", event.target.value)}
              placeholder="shippo_live_xxxxxxxxx"
              disabled={isLoading}
            />
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="font-bold text-primary">Hotjar Tracking Code</span>
            <textarea
              className="min-h-28 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primary"
              value={form.hotjarTrackingCode}
              onChange={(event) => setField("hotjarTrackingCode", event.target.value)}
              placeholder="?? ??? Hotjar ???"
              disabled={isLoading}
            />
          </label>

          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60 md:w-auto"
          >
            {isLoading ? "???? ???????..." : isSaving ? "???? ?????..." : "??? ?????????"}
          </button>

          {message ? <p className="rounded-lg bg-black/5 px-3 py-2 text-sm text-primary">{message}</p> : null}
        </form>
      </section>
    </AdminShell>
  );
}
