/**
 * Google Places API research pass.
 * Uses official Places API only — never scrapes Google HTML.
 */

import type { GBPData, GBPReview, Competitor } from "./types.js";

const PLACES_BASE = "https://maps.googleapis.com/maps/api/place";

export async function runResearch(params: {
  businessName: string;
  address: string;
  city: string;
  apiKey?: string;
}): Promise<GBPData | null> {
  const apiKey = params.apiKey ?? process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey || apiKey.startsWith("PLACEHOLDER")) {
    console.warn("Google Places API key not configured (NEEDS #7). Skipping research.");
    return null;
  }

  try {
    // Step 1: Find the place
    const findUrl = new URL(`${PLACES_BASE}/findplacefromtext/json`);
    findUrl.searchParams.set("input", `${params.businessName} ${params.address}`);
    findUrl.searchParams.set("inputtype", "textquery");
    findUrl.searchParams.set(
      "fields",
      "place_id,name,rating,user_ratings_total"
    );
    findUrl.searchParams.set("key", apiKey);

    const findRes = await fetch(findUrl.toString());
    const findData = await findRes.json();

    const candidate = findData.candidates?.[0];
    if (!candidate) return null;

    const placeId = candidate.place_id as string;

    // Step 2: Get details + reviews
    const detailUrl = new URL(`${PLACES_BASE}/details/json`);
    detailUrl.searchParams.set("place_id", placeId);
    detailUrl.searchParams.set(
      "fields",
      "name,rating,user_ratings_total,reviews"
    );
    detailUrl.searchParams.set("language", "pt");
    detailUrl.searchParams.set("key", apiKey);

    const detailRes = await fetch(detailUrl.toString());
    const detailData = await detailRes.json();
    const result = detailData.result;

    const reviews: GBPReview[] = (result?.reviews ?? []).slice(0, 5).map(
      (r: Record<string, unknown>) => ({
        author: r.author_name as string,
        rating: r.rating as number,
        text: (r.text as string) ?? "",
        date: r.relative_time_description as string,
      })
    );

    // Step 3: Nearby competitors (same type, within 2km)
    const nearbyUrl = new URL(`${PLACES_BASE}/nearbysearch/json`);
    nearbyUrl.searchParams.set("location", `${params.address}`);
    nearbyUrl.searchParams.set("radius", "2000");
    nearbyUrl.searchParams.set("keyword", params.businessName.split(" ")[0]);
    nearbyUrl.searchParams.set("key", apiKey);

    let competitors: Competitor[] = [];
    try {
      const nearbyRes = await fetch(nearbyUrl.toString());
      const nearbyData = await nearbyRes.json();
      competitors = (nearbyData.results ?? [])
        .filter((r: Record<string, unknown>) => r.place_id !== placeId)
        .slice(0, 5)
        .map((r: Record<string, unknown>) => ({
          name: r.name as string,
          rating: (r.rating as number) ?? 0,
          reviewCount: (r.user_ratings_total as number) ?? 0,
          hasWebsite: false, // Would need another API call
        }));
    } catch {
      // Competitor lookup is optional
    }

    // Extract customer phrases (n-gram from review text)
    const customerPhrases = extractPhrases(reviews);

    return {
      placeId,
      rating: result?.rating ?? candidate.rating ?? 0,
      reviewCount: result?.user_ratings_total ?? candidate.user_ratings_total ?? 0,
      reviews,
      competitors,
      customerPhrases,
    };
  } catch (err) {
    console.error("Google Places API error:", err);
    return null;
  }
}

function extractPhrases(reviews: GBPReview[]): string[] {
  const allText = reviews.map((r) => r.text).join(" ").toLowerCase();
  const words = allText.split(/\s+/).filter((w) => w.length > 3);

  // Simple bigram frequency
  const bigramCounts: Record<string, number> = {};
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    bigramCounts[bigram] = (bigramCounts[bigram] ?? 0) + 1;
  }

  return Object.entries(bigramCounts)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([phrase]) => phrase);
}
