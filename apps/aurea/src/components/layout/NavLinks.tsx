"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/content/navigation";
import { cx } from "@/lib/utils";

/** Desktop navigation. Client only to mark the current section with aria-current. */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-10">
      {items.map((item) => {
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={cx(
                "relative inline-flex min-h-11 items-center text-nav font-medium uppercase text-espresso",
                "after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:origin-left after:bg-espresso after:transition-transform",
                current ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
