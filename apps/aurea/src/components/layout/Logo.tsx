import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cx } from "@/lib/utils";

interface LogoProps {
  tone?: "light" | "dark";
  showDescriptor?: boolean;
  className?: string;
  /** Lets a client parent react to navigation (e.g. close the mobile menu). */
  onClick?: () => void;
}

/** Typographic wordmark. A drawn logo is out of scope for the demo. */
export function Logo({ tone = "light", showDescriptor = true, className, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cx("group inline-flex flex-col leading-none", tone === "light" ? "text-espresso" : "text-ivory", className)}
      aria-label={`${siteConfig.name}, ${siteConfig.descriptor} — página inicial`}
    >
      <span className="font-display text-[1.75rem] font-medium tracking-[0.22em]">{siteConfig.name}</span>
      {showDescriptor && (
        <span
          className={cx(
            "mt-1.5 hidden text-[0.625rem] font-medium uppercase tracking-[0.24em] sm:block",
            tone === "light" ? "text-umber" : "text-taupe",
          )}
        >
          {siteConfig.descriptor}
        </span>
      )}
    </Link>
  );
}
