import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "text";
export type Tone = "default" | "inverse";

/**
 * The only button implementation. Primary = accent fill with a white label
 * (the pair the builder contrast-checks). Square edges; colour change on
 * hover, never lift, glow or scale.
 */
export function buttonClass(variant: ButtonVariant = "primary", tone: Tone = "default", extra?: string) {
  const base = "inline-flex items-center justify-center gap-3 text-small font-medium tracking-[0.02em] transition-colors duration-200";
  const box = "min-h-12 px-7 text-center";
  const variants: Record<ButtonVariant, Record<Tone, string>> = {
    primary: {
      default: `${box} bg-accent text-white hover:bg-ink`,
      inverse: `${box} bg-accent text-white hover:bg-inverse-ink hover:text-inverse-bg`,
    },
    secondary: {
      default: `${box} border border-ink text-ink hover:bg-ink hover:text-bg`,
      inverse: `${box} border border-inverse-ink text-inverse-ink hover:bg-inverse-ink hover:text-inverse-bg`,
    },
    text: {
      default: "min-h-11 border-b border-line text-ink hover:border-ink",
      inverse: "min-h-11 border-b border-inverse-line text-inverse-ink hover:border-inverse-ink",
    },
  };
  return cx(base, variants[variant][tone], extra);
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  tone?: Tone;
  external?: boolean;
  className?: string;
}

export function ButtonLink({ href, children, variant, tone, external, className }: ButtonLinkProps) {
  const classes = buttonClass(variant, tone, className);
  const isExternal = external ?? /^(https?:|tel:|mailto:)/.test(href);
  if (!isExternal) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  const newTab = href.startsWith("http");
  return (
    <a href={href} className={classes} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

export const Arrow = () => (
  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);
