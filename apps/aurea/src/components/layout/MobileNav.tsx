"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { NavItem } from "@/content/navigation";
import { Logo } from "./Logo";

interface MobileNavProps {
  items: NavItem[];
  /** Rendered inside the panel (server-built CTA and contact details). */
  footer: ReactNode;
}

/**
 * Full-screen navigation for < lg. Uses a native modal <dialog>, which gives
 * focus containment, Escape-to-close and an inert background for free.
 */
export function MobileNav({ items, footer }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-3 text-nav font-semibold uppercase text-espresso"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="menu-principal"
        onClick={() => setOpen(true)}
      >
        Menu
        <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
          <span className="h-px w-full bg-espresso" />
          <span className="h-px w-2/3 self-end bg-espresso" />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        id="menu-principal"
        aria-label="Menu principal"
        onClose={() => setOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-ivory p-0 text-espresso backdrop:bg-espresso/40"
      >
        <div className="flex h-full flex-col px-gutter pb-8">
          <div className="flex h-header items-center justify-between">
            <Logo showDescriptor={false} onClick={() => setOpen(false)} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center text-nav font-semibold uppercase"
            >
              Fechar
            </button>
          </div>

          <nav aria-label="Principal" className="mt-6 flex-1">
            <ul className="flex flex-col border-t border-line">
              {items.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="flex min-h-16 items-center justify-between py-4 font-display text-h3"
                  >
                    {item.label}
                    <span aria-hidden="true" className="font-sans text-small text-umber">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10">{footer}</div>
        </div>
      </dialog>
    </>
  );
}
