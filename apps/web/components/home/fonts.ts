import { IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";

/** Homepage type: Schibsted Grotesk (display and text) + IBM Plex Mono (clock, numbers, labels). */
export const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});
