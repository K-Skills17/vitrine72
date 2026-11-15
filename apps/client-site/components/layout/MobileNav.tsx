"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Cta } from "@/lib/config";
import { ButtonLink } from "../ui/Button";
import { navItems } from "./nav";

/** Full-screen menu on a native modal <dialog>: focus containment and Escape for free. */
export function MobileNav({ cta, brand }: { cta: Cta; brand: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="menu"
        className="inline-flex min-h-11 items-center gap-3 text-small font-medium text-ink"
      >
        Menu
        <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
          <span className="h-px w-full bg-ink" />
          <span className="h-px w-2/3 self-end bg-ink" />
        </span>
      </button>
      <dialog
        ref={ref}
        id="menu"
        aria-label="Menu"
        onClose={close}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-ink"
      >
        {/* Any link inside closes the menu (capture phase, before navigation). */}
        <div
          className="flex h-full flex-col px-gutter pb-8"
          onClickCapture={(e) => {
            if ((e.target as Element).closest("a")) close();
          }}
        >
          <div className="flex h-[4.5rem] items-center justify-between">
            {brand}
            <button type="button" onClick={close} className="inline-flex min-h-11 items-center text-small font-medium">
              Fechar
            </button>
          </div>
          <nav aria-label="Principal" className="mt-6 flex-1">
            <ul className="border-t border-line">
              {navItems.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link href={item.href} className="flex min-h-16 items-center justify-between font-display text-h3">
                    {item.label}
                    <span aria-hidden="true" className="font-body text-small text-muted">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ButtonLink href={cta.href} external={cta.external} className="w-full">
            {cta.label}
          </ButtonLink>
        </div>
      </dialog>
    </>
  );
}
