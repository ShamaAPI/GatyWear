import type { Metadata } from "next";
import Header from "@/components/Header";
import MobileBottomNav from "@/components/MobileBottomNav";
import NetworkFallback from "@/components/NetworkFallback";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gaty Wear",
  description: "متجر Gaty Wear للملابس ستريت وير",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <Providers>
          <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col bg-background pb-20 md:pb-0">
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
