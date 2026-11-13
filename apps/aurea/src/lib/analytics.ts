import { analyticsConfig, analyticsEvents, type AnalyticsEvent, type AnalyticsParams } from "@/config/analytics";

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params: AnalyticsParams) => void;
  }
}

const ALLOWED_PARAMS: ReadonlyArray<keyof AnalyticsParams> = ["page_path", "treatment_slug", "cta_location", "destination", "qualifier_step"];

/** Drops any key that is not on the allow-list, so personal data cannot leak through. */
export function sanitizeParams(params: object): AnalyticsParams {
  const source = params as Record<string, unknown>;
  const clean: Record<string, unknown> = {};
  for (const key of ALLOWED_PARAMS) {
    const value = source[key];
    if (typeof value === "string" && value.length > 0) clean[key] = value;
  }
  return clean as AnalyticsParams;
}

export function isAnalyticsEvent(name: string): name is AnalyticsEvent {
  return (analyticsEvents as readonly string[]).includes(name);
}

/** Client-side only. Safe to call when no provider is configured. */
export function track(name: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  const payload = sanitizeParams({ page_path: window.location.pathname, ...params });

  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${name}`, payload);
  }
  if (analyticsConfig.ga4Id && typeof window.gtag === "function") {
    window.gtag("event", name, payload);
  }
}
