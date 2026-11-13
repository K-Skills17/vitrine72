import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vitrini72 studio palette (new homepage, light only). Contrast on
        // paper: ink 16.5:1, muted 6.2:1, signal 4.65:1 (white on signal 5.2:1).
        v: {
          paper: "#F4F2ED",
          card: "#FBFAF7",
          ink: "#141414",
          muted: "#5C5A54",
          line: "#DAD6CD",
          signal: "#C8381C",
          "signal-dark": "#A42D16",
        },
        brand: {
          // Themed gold — adapts for text contrast (darker on light bg)
          gold: "rgb(var(--gold-rgb) / <alpha-value>)",
          // Fixed dark values — used by ops/admin pages (never themed)
          dark: "#111111",
          "dark-2": "#1a1a1a",
          "dark-3": "#242424",
        },
        // Semantic surface tokens — themed backgrounds for marketing pages
        surface: {
          base: "rgb(var(--surface-base) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
          overlay: "rgb(var(--surface-overlay) / <alpha-value>)",
        },
        // Semantic ink tokens — themed text for marketing pages
        ink: {
          primary: "rgb(var(--ink-primary) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          subtle: "rgb(var(--ink-subtle) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        grotesk: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderColor: {
        subtle: "var(--border-subtle)",
        soft: "var(--border-soft)",
      },
    },
  },
  plugins: [],
};

export default config;
