"use client";

import { useEffect, useState } from "react";

function hasWeakConnection() {
  if (typeof navigator === "undefined") {
    return false;
  }

  const connection = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; downlink?: number };
    }
  ).connection;

  if (!connection) {
    return false;
  }

  return (
    connection.effectiveType === "2g" ||
    connection.effectiveType === "slow-2g" ||
    (connection.downlink ?? 10) < 1
  );
}

export default function NetworkFallback() {
  const [isOffline, setIsOffline] = useState(false);
  const [isWeak, setIsWeak] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setIsOffline(!navigator.onLine);
      setIsWeak(hasWeakConnection());
    };

    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (!isOffline && !isWeak) {
    return null;
  }

  return (
    <div className="mx-4 mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-center text-xs text-primary">
      {isOffline
        ? "أنت غير متصل بالإنترنت الآن. بعض الميزات قد لا تعمل."
        : "الاتصال بالإنترنت ضعيف حاليًا. قد يحدث بطء في التحميل."}
    </div>
  );
}
