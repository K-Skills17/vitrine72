import type { Config } from "tailwindcss";

/**
 * Every colour comes from the builder's palette via CSS variables (see
 * lib/theme.ts). Tailwind's default palette is replaced, not extended, so
 * off-brand colours cannot appear in a generated site.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      bg: "var(--c-bg)",
      ink: "var(--c-ink)",
      muted: "var(--c-muted)",
      line: "var(--c-line)",
      surface: "var(--c-surface)",
      primary: "var(--c-primary)",
      accent: "var(--c-accent)",
      inverse: {
        bg: "var(--c-inverse-bg)",
        ink: "var(--c-inverse-ink)",
        muted: "var(--c-inverse-muted)",
        line: "var(--c-inverse-line)",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.75rem, 1.5rem + 5vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        h1: ["clamp(2.5rem, 1.6rem + 3.4vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        h2: ["clamp(2rem, 1.5rem + 2vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.005em" }],
        h3: ["clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem)", { lineHeight: "1.2" }],
        lead: ["clamp(1.125rem, 1.05rem + 0.3vw, 1.3125rem)", { lineHeight: "1.55" }],
        body: ["clamp(1rem, 0.97rem + 0.15vw, 1.0625rem)", { lineHeight: "1.7" }],
        small: ["0.9375rem", { lineHeight: "1.6" }],
        eyebrow: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.18em" }],
        legal: ["0.8125rem", { lineHeight: "1.55" }],
      },
      spacing: {
        gutter: "clamp(1.25rem, 0.5rem + 3vw, 4rem)",
        section: "clamp(4.5rem, 3rem + 6vw, 9rem)",
        "sticky-cta": "4.5rem",
      },
      maxWidth: {
        page: "86rem",
        prose: "38rem",
        lead: "34rem",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
