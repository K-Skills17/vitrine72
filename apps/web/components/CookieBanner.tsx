"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("v72_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("v72_cookie_consent", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-0 inset-x-0 z-50 bg-brand-dark-2 border-t border-white/10 px-4 py-4"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-gray-400 flex-1">
          Usamos cookies essenciais e um cookie de atribuição de origem. Veja
          nossa{" "}
          <a href="/privacidade" className="text-brand-gold underline">
            Política de Privacidade
          </a>
          .
        </p>
        <button
          onClick={accept}
          className="flex-shrink-0 bg-brand-gold text-brand-dark text-sm font-semibold px-5 py-2 rounded-lg hover:brightness-110 transition"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
