import type { ElementType, ReactNode } from "react";
import { cx } from "./cx";

export function Container({ as: Tag = "div", className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  return <Tag className={cx("mx-auto w-full max-w-page px-gutter", className)}>{children}</Tag>;
}

/** Hairline + small caps label that opens a section. */
export function SectionLabel({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "inverse" }) {
  return (
    <p className={cx("flex items-center gap-3 text-eyebrow font-semibold uppercase", tone === "default" ? "text-primary" : "text-inverse-ink")}>
      <span aria-hidden="true" className={cx("h-px w-8", tone === "default" ? "bg-primary" : "bg-inverse-ink")} />
      {children}
    </p>
  );
}

/** Label column (lg: 3/12) beside content (lg: 9/12). */
export function SpecGrid({ label, children, className }: { label?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cx("grid gap-8 lg:grid-cols-12 lg:gap-10", className)}>
      <div className="lg:col-span-3 lg:pt-2">{label}</div>
      <div className="lg:col-span-9">{children}</div>
    </div>
  );
}
