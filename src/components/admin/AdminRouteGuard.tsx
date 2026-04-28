"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";
  const isAdmin = typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    if (!isLoginPage && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [isLoginPage, isAdmin, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAdmin) {
    return <div className="px-4 py-8 text-center text-sm text-black/60">جاري التحقق...</div>;
  }

  return <>{children}</>;
}
