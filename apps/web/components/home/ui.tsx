import type { ReactNode } from "react";

export const container = "mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-12";

/** Mono label used above section titles and for clock markers. */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-[0.78rem] uppercase tracking-[0.08em] text-v-muted ${className}`}>{children}</p>;
}

export function SectionTitle({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <h2 id={id} className={`text-balance font-grotesk text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.025em] sm:text-[3rem] lg:text-[3.6rem] ${className}`}>
      {children}
    </h2>
  );
}

export const btnPrimary =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-v-signal px-7 font-grotesk text-[1rem] font-semibold text-white transition-colors hover:bg-v-signal-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v-ink";
export const btnSecondary =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-v-ink px-7 font-grotesk text-[1rem] font-semibold text-v-ink transition-colors hover:bg-v-ink hover:text-v-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v-ink";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Desktop screenshot in a minimal browser frame. */
export function BrowserFrame({ src, alt, url, priority = false, className = "" }: { src: string; alt: string; url: string; priority?: boolean; className?: string }) {
  return (
    <figure className={`overflow-hidden rounded-[14px] border border-v-ink/15 bg-v-card shadow-[0_30px_60px_-30px_rgba(20,20,20,0.35)] ${className}`}>
      <div className="flex items-center gap-3 border-b border-v-ink/10 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-v-line" />
          <span className="size-2.5 rounded-full bg-v-line" />
          <span className="size-2.5 rounded-full bg-v-line" />
        </span>
        <span className="truncate rounded-full bg-v-paper px-3 py-0.5 font-mono text-[0.7rem] text-v-muted">{url}</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- static, pre-sized WebP */}
      <img src={src} alt={alt} width={1600} height={1000} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} className="block h-auto w-full" />
    </figure>
  );
}

/** Mobile screenshot in a phone outline. */
export function PhoneFrame({ src, alt, priority = false, className = "" }: { src: string; alt: string; priority?: boolean; className?: string }) {
  return (
    <figure className={`overflow-hidden rounded-[26px] border-[6px] border-v-ink bg-v-ink shadow-[0_30px_50px_-25px_rgba(20,20,20,0.45)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static, pre-sized WebP */}
      <img src={src} alt={alt} width={780} height={1688} loading={priority ? "eager" : "lazy"} className="block h-auto w-full rounded-[20px]" />
    </figure>
  );
}
