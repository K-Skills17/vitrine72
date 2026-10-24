"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#preco", label: "Preços" },
  { href: "#faq", label: "FAQ" },
  { href: "/sobre", label: "Sobre" },
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
        scrolled ? "border-b border-subtle shadow-2xl shadow-black/20" : ""
      }`}
      style={scrolled ? { background: "var(--nav-glass-bg)", backdropFilter: "blur(16px)" } : {}}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-baseline gap-0 group">
          <span className="font-display font-bold text-ink-primary text-xl tracking-tight group-hover:opacity-80 transition">
            Vitrine
          </span>
          <span className="font-display font-bold text-brand-gold text-xl tracking-tight">72</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted hover:text-ink-primary transition-colors duration-200 tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="#preco" className="btn-gold text-sm px-5 py-2.5 rounded-lg">
            Ver preços
          </a>
        </div>
      </div>
    </header>
  );
}
