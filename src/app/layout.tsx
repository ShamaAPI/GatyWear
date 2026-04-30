import type { Metadata } from "next";
import Header from "@/components/Header";
import MobileBottomNav from "@/components/MobileBottomNav";
import NetworkFallback from "@/components/NetworkFallback";
import PageViewTracker from "@/components/PageViewTracker";
import Providers from "@/components/Providers";
import TrackingScripts from "@/components/TrackingScripts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gaty Wear",
  description: "???? Gaty Wear ??????? ????? ???",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Gaty Wear",
    description: "???? Gaty Wear ??????? ????? ???",
    type: "website",
    locale: "ar_EG",
    siteName: "Gaty Wear",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaty Wear",
    description: "???? Gaty Wear ??????? ????? ???",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <TrackingScripts />
        <PageViewTracker />
        <Providers>
          <div className="mx-auto flex min-h-full w-full max-w-screen-xl flex-col bg-background pb-20 md:pb-0">
            <Header />
            <NetworkFallback />
            <main className="flex-1">{children}</main>
            <MobileBottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
