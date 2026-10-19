"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#preco", label: "Preços" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-brand-dark/90 backdrop-blur-xl border-b border-white/6 shadow-2xl shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-baseline gap-0.5 group">
          <span className="font-display font-bold text-white text-xl tracking-tight group-hover:text-white/90 transition">
            Vitrine
          </span>
          <span className="font-display font-bold text-brand-gold text-xl tracking-tight">72</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#preco"
          className="btn-gold text-sm px-5 py-2.5 rounded-lg"
        >
          Ver preços
        </a>
      </div>
    </header>
  );
}
