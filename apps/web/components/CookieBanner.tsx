"use client";

import { useEffect, useState } from "react";

/** Compact consent notice. Neutral ink/white so it fits light and dark pages. */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("v72_cookie_consent")) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem("v72_cookie_consent", "1");
    } catch {
      /* storage blocked: hide for this page view only */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-4 rounded-2xl bg-[#141414] px-4 py-3 text-[0.82rem] leading-snug text-white/75 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] sm:inset-x-auto sm:left-5 sm:max-w-md"
    >
      <p className="flex-1">
        Usamos cookies essenciais e um de atribuição de origem.{" "}
        <a href="/privacidade" className="text-white underline underline-offset-2">
          Privacidade
        </a>
      </p>
      <button
        onClick={accept}
        className="min-h-10 shrink-0 rounded-full bg-white px-4 text-[0.82rem] font-semibold text-[#141414] transition-opacity hover:opacity-85"
      >
        Entendi
      </button>
    </div>
  );
}
