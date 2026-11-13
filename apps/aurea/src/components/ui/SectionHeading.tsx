import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3";
type HeadingSize = "display" | "h1" | "h2" | "h3";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Semantic level. Independent of visual size so hierarchy stays correct. */
  as?: HeadingLevel;
  size?: HeadingSize;
  tone?: "light" | "dark";
  /** id on the heading element, for aria-labelledby on the section. */
  id?: string;
  className?: string;
}

const sizes: Record<HeadingSize, string> = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
};

export function Eyebrow({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p
      className={cx(
        "font-sans text-eyebrow font-semibold uppercase",
        tone === "light" ? "text-sage-deep" : "text-champagne",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, lead, as: Tag = "h2", size = "h2", tone = "light", id, className }: SectionHeadingProps) {
  return (
    <div className={cx("flex flex-col gap-5", className)}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Tag id={id} className={cx("font-display font-normal text-balance", sizes[size], tone === "light" ? "text-espresso" : "text-ivory")}>
        {title}
      </Tag>
      {lead && (
        <p className={cx("max-w-lead text-lead text-pretty", tone === "light" ? "text-umber" : "text-ivory/80")}>{lead}</p>
      )}
    </div>
  );
}
