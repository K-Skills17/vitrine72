"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { NicheConfig } from "../lib/niche";
import Qualifier from "./Qualifier";
import { MenuIcon, XIcon, WhatsAppIcon } from "./Icon";

interface Props {
  config: NicheConfig;
}

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/servicos/", label: "Serviços" },
  { href: "/sobre/", label: "Sobre" },
];

export default function Nav({ config }: Props) {
  const [qualifierOpen, setQualifierOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backgroundColor: "var(--color-surface)",
          borderBottom: scrolled ? "1px solid #e5e7eb" : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.07)" : "none",
          transition: "box-shadow 0.2s, border-color 0.2s",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "0 1.25rem",
            height: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <Link
            href="/"
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              fontFamily: `"${config.fontDisplay}", serif`,
              color: "var(--color-text)",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            {config.brandName}
          </Link>

          {/* Desktop nav links */}
          <nav
            aria-label="Navegação principal"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--color-muted)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    "var(--color-muted)")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <button
            onClick={() => setQualifierOpen(true)}
            data-testid="nav-cta-btn"
            className="desktop-nav"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              borderRadius: "9999px",
              padding: "0.5rem 1.1rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "var(--color-primary)",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <WhatsAppIcon size={16} color="#fff" />
            Falar no WhatsApp
          </button>

          {/* Mobile: WhatsApp + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="mobile-nav">
            <button
              onClick={() => setQualifierOpen(true)}
              data-testid="nav-cta-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                borderRadius: "9999px",
                padding: "0.45rem 0.85rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#fff",
                backgroundColor: "var(--color-primary)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <WhatsAppIcon size={14} color="#fff" />
              WhatsApp
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "var(--color-text)" }}
            >
              {menuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            aria-label="Menu mobile"
            style={{
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "var(--color-surface)",
              padding: "1rem 1.25rem 1.5rem",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "0.75rem 0",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--color-text)",
                  textDecoration: "none",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>

      {qualifierOpen && (
        <Qualifier config={config} onClose={() => setQualifierOpen(false)} />
      )}
    </>
  );
}
