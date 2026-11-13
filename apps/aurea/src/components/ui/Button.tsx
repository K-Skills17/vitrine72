import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "text";
/** Surface the button sits on. */
export type ButtonTone = "light" | "dark";
/** "compact" is for the header, where vertical space is fixed. */
export type ButtonSize = "default" | "compact";

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const base = "inline-flex items-center justify-center gap-3 font-sans text-button font-semibold uppercase transition-colors";

/** Height and padding per size. The text variant has its own fixed geometry. */
const sizes: Record<ButtonSize, string> = {
  default: "min-h-12 px-7",
  compact: "min-h-11 px-5",
};

const variants: Record<ButtonVariant, Record<ButtonTone, string>> = {
  primary: {
    light: "bg-espresso text-ivory hover:bg-umber",
    dark: "bg-ivory text-espresso hover:bg-champagne",
  },
  secondary: {
    light: "border border-espresso text-espresso hover:bg-espresso hover:text-ivory",
    dark: "border border-ivory/60 text-ivory hover:border-ivory hover:bg-ivory hover:text-espresso",
  },
  text: {
    light: "min-h-11 border-b border-espresso/35 pb-1 text-espresso hover:border-espresso",
    dark: "min-h-11 border-b border-ivory/40 pb-1 text-ivory hover:border-ivory",
  },
};

/** Class names for anything that should look like a button, including <button type="submit">. */
export function buttonStyles({ variant = "primary", tone = "light", size = "default", fullWidth = false }: ButtonStyleOptions = {}) {
  return cx(base, variant !== "text" && sizes[size], variants[variant][tone], fullWidth && "w-full");
}

type ButtonLinkProps = ButtonStyleOptions &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
    href: string;
    children: ReactNode;
    className?: string;
  };

/** Every CTA on the site is a link. Internal paths use next/link; external URLs open in a new tab. */
export function ButtonLink({ href, variant, tone, size, fullWidth, className, children, ...rest }: ButtonLinkProps) {
  const classes = cx(buttonStyles({ variant, tone, size, fullWidth }), className);
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
