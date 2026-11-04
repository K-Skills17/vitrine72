/**
 * Reference site registry per vertical.
 *
 * Each entry captures the AESTHETIC of a real site — Claude uses this to generate
 * varied copy, pick palettes, and match the client's chosen style group.
 *
 * HOW TO ADD A NEW VERTICAL:
 * 1. Add at least 5 entries with the new vertical name
 * 2. Cover at least 3 different styleGroups for variety
 * 3. Run `node scripts/analyze-references.mjs` to auto-generate styleNotes via Claude Vision
 * WARNING: If a vertical has fewer than 3 entries, the builder will log a warning.
 *
 * styleGroup maps to the client's style choice during intake:
 *   "dark-luxury"        — luxurious, exclusive, premium dark/gold aesthetic
 *   "clean-clinical"     — minimal, white, clinical, dermatologist credibility
 *   "conversion-driven"  — bold pricing, booking-first, multi-location energy
 *   "editorial-expert"   — doctor-led, personal brand, authority positioning
 *   "vibrant-boutique"   — warm, boutique, neighbourhood feel, approachable
 *
 * layoutVariant: 1 = standard (hero → services → reviews → about → faq → contact)
 *                2 = services-first (services grid prominent → about → reviews → contact)
 *                3 = story-first (brand/about anchor → services → social proof → contact)
 */

export type Mood =
  | "luxurious"
  | "warm"
  | "minimal"
  | "bold"
  | "clinical"
  | "playful"
  | "natural"
  | "vibrant"
  | "classic"
  | "artisan";

export type ColorScheme = "light" | "dark" | "colorful";
export type FontPersonality = "elegant" | "modern" | "friendly" | "bold" | "clean";

export type StyleGroup =
  | "dark-luxury"
  | "clean-clinical"
  | "conversion-driven"
  | "editorial-expert"
  | "vibrant-boutique";

export type ReferenceSite = {
  id: string;
  url: string;
  vertical: string;
  styleGroup: StyleGroup;
  mood: Mood;
  colorScheme: ColorScheme;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontPersonality: FontPersonality;
  layoutVariant: 1 | 2 | 3;
  styleNotes: string;
};

/** Convert a Supabase DB row to the ReferenceSite type used by the builder. */
export function referenceSiteFromDb(row: {
  id: string; url: string; vertical: string; style_group: string;
  mood: string; color_scheme: string; primary_color: string; accent_color: string;
  background_color: string; font_personality: string; layout_variant: number; style_notes: string;
}): ReferenceSite {
  return {
    id: row.id,
    url: row.url,
    vertical: row.vertical,
    styleGroup: row.style_group as StyleGroup,
    mood: row.mood as Mood,
    colorScheme: row.color_scheme as ColorScheme,
    primaryColor: row.primary_color,
    accentColor: row.accent_color,
    backgroundColor: row.background_color,
    fontPersonality: row.font_personality as FontPersonality,
    layoutVariant: row.layout_variant as 1 | 2 | 3,
    styleNotes: row.style_notes,
  };
}

// ─── ESTETICA ────────────────────────────────────────────────────────────────

const ESTETICA: ReferenceSite[] = [
  // ── GROUP 1: Dark Luxury & High-End Exclusivity ──────────────────────────
  {
    id: "est-01",
    url: "https://www.lyevbeverlyhills.com",
    vertical: "estetica",
    styleGroup: "dark-luxury",
    mood: "luxurious",
    colorScheme: "light",
    primaryColor: "#1a1a1a",
    accentColor: "#b8a99a",
    backgroundColor: "#faf9f7",
    fontPersonality: "elegant",
    layoutVariant: 1,
    styleNotes: "Poetic, understated luxury. Headlines are 2–4 words: 'Beautifully, you.' or 'Quiet rooms. Unhurried care.' Never sells procedures — sells the experience of being cared for. Services framed as 'bespoke solutions determined through expert evaluation', never as a menu. CTA: 'Discover the experience', 'Book Appointment'. aboutText reads like a philosophy statement. Italics used for emphasis on key words. Whitespace is generous, pace is slow and deliberate.",
  },
  {
    id: "est-02",
    url: "https://www.beverlyhillsmedspa.com",
    vertical: "estetica",
    styleGroup: "dark-luxury",
    mood: "luxurious",
    colorScheme: "dark",
    primaryColor: "#c5a368",
    accentColor: "#c5a368",
    backgroundColor: "#0d0d0d",
    fontPersonality: "elegant",
    layoutVariant: 1,
    styleNotes: "Dark gold luxury — the Hollywood med spa archetype. Black background, gold accents everywhere. Hero headline is a bold transformation promise: 'Redefine Your Beauty'. Services listed as premium investments with procedure names in full (Morpheus8, PRF, Juvederm). Trust signals: board-certified, 15+ years. CTA: 'Book Your Consultation'. Copy is confident and aspirational, not soft.",
  },
  {
    id: "est-03",
    url: "https://theeramclinic.com",
    vertical: "estetica",
    styleGroup: "dark-luxury",
    mood: "clinical",
    colorScheme: "light",
    primaryColor: "#1a1a1a",
    accentColor: "#8b7355",
    backgroundColor: "#ffffff",
    fontPersonality: "clean",
    layoutVariant: 1,
    styleNotes: "Swiss precision luxury — the apex of restrained aesthetic. Zero decorative elements. Headlines are factual and final: 'Aesthetic Medicine. Zürich.' Service names are clinical procedure names only, no flowery description. About copy is a single authoritative paragraph about credentials. CTA: 'Request Appointment'. Never uses superlatives or emotional language. Trust comes from silence and restraint.",
  },
  {
    id: "est-04",
    url: "https://www.skinneymedspa.com",
    vertical: "estetica",
    styleGroup: "dark-luxury",
    mood: "bold",
    colorScheme: "dark",
    primaryColor: "#1a1a1a",
    accentColor: "#e6e2e4",
    backgroundColor: "#000000",
    fontPersonality: "bold",
    layoutVariant: 2,
    styleNotes: "Editorial B&W luxury — think fashion magazine meets med spa. Condensed lowercase headers: 'one stop shop for all things beauty'. Membership model prominent: 'Join $199/month'. Service descriptions are outcome-only: 'Remove Stubborn Fat', 'Prevent & Smooth Wrinkles'. CTA: 'Book Now', 'Free Consultation'. Copy is sleek and efficient — never more than 2 sentences per service.",
  },
  {
    id: "est-05",
    url: "https://www.aleamedspa.com",
    vertical: "estetica",
    styleGroup: "dark-luxury",
    mood: "luxurious",
    colorScheme: "light",
    primaryColor: "#2d2d2d",
    accentColor: "#c0a882",
    backgroundColor: "#f8f6f3",
    fontPersonality: "elegant",
    layoutVariant: 1,
    styleNotes: "New York understated luxury. Warm neutrals — cream, linen, warm gray. Headlines are sophisticated and outcome-focused: 'The Art of Natural Enhancement'. Services grouped by face zone (eyes, lips, contour, skin). aboutText references specific neighborhoods (Upper East Side). CTA: 'Schedule a Consultation'. Never aggressive — premium positioning through restraint.",
  },

  // ── GROUP 2: Clean Clinical & Organic Minimalist ──────────────────────────
  {
    id: "est-06",
    url: "https://facileskin.com",
    vertical: "estetica",
    styleGroup: "clean-clinical",
    mood: "clinical",
    colorScheme: "light",
    primaryColor: "#eb1256",
    accentColor: "#eb1256",
    backgroundColor: "#f9f7f4",
    fontPersonality: "modern",
    layoutVariant: 2,
    styleNotes: "Dermatologist credibility meets accessible luxury. Tagline philosophy: 'Good skin should be easy.' Hero copy leads with credentials: 'Dermatologist-developed, easy to follow.' Services organized by skin concern (Acne, Dry, Sensitive, Mature) not by procedure name. Bright pink CTA button is the only color accent on a cream/white palette — creates strong conversion contrast. Copy is warm but scientific.",
  },
  {
    id: "est-07",
    url: "https://theaiveeclinic.com",
    vertical: "estetica",
    styleGroup: "clean-clinical",
    mood: "clinical",
    colorScheme: "light",
    primaryColor: "#1a3a5c",
    accentColor: "#4a90d9",
    backgroundColor: "#ffffff",
    fontPersonality: "modern",
    layoutVariant: 1,
    styleNotes: "International prestige clinic. Doctor's name and face prominent in hero. Headlines combine clinical authority with warmth: 'Science-backed beauty that lasts.' Services use international procedure names (Thermage, Ultherapy, PicoSure) with 1-line benefit description. About section is a full biography of the founding doctor — credentials, training abroad, philosophy. CTA: 'Book a Consultation'.",
  },
  {
    id: "est-08",
    url: "https://www.lkmddermatology.com",
    vertical: "estetica",
    styleGroup: "clean-clinical",
    mood: "minimal",
    colorScheme: "light",
    primaryColor: "#1a1a1a",
    accentColor: "#0ea5e9",
    backgroundColor: "#ffffff",
    fontPersonality: "clean",
    layoutVariant: 2,
    styleNotes: "New York dermatology precision. Pure white background, black text, single blue accent. Headlines are diagnostic: 'Clearer skin. Expert care.' No lifestyle language. Each service has: name, 1-sentence medical description, and 'Who it's for'. FAQ is extensive and anticipates clinical objections. Trust signals: board certification logos, medical school affiliations. CTA: 'Request Appointment'.",
  },
  {
    id: "est-09",
    url: "https://auraderm.ch",
    vertical: "estetica",
    styleGroup: "clean-clinical",
    mood: "minimal",
    colorScheme: "light",
    primaryColor: "#2d4a3e",
    accentColor: "#7ab3a0",
    backgroundColor: "#fafafa",
    fontPersonality: "clean",
    layoutVariant: 1,
    styleNotes: "Swiss organic aesthetic — clinical minimalism with a natural soul. Muted sage/forest green accents on white. Headlines are brief and declarative: 'Skin. Refined.' Services described in 1-2 sentences with ingredient callouts (hyaluronic acid, vitamin C, retinol). No urgency language ever. About copy explains the Swiss quality philosophy. CTA: 'Make an Appointment'. Photographs are close-up skin textures, never faces.",
  },
  {
    id: "est-10",
    url: "https://minimaleskin.com",
    vertical: "estetica",
    styleGroup: "clean-clinical",
    mood: "minimal",
    colorScheme: "light",
    primaryColor: "#1a1a1a",
    accentColor: "#1a1a1a",
    backgroundColor: "#ffffff",
    fontPersonality: "clean",
    layoutVariant: 2,
    styleNotes: "Extreme minimalism — the design IS the message. Black on white, one typeface, no images. Service names are single nouns: 'Cleanse. Treat. Protect.' Hero headline is a 3-word statement. No adjectives. No emotional language. Pricing shown directly. The absence of decoration signals premium, not budget. CTA is a text link, not a button. For clients who hate clutter and trust science over marketing.",
  },

  // ── GROUP 3: Conversion-Driven & Multi-Location ───────────────────────────
  {
    id: "est-11",
    url: "https://www.peachystudio.com",
    vertical: "estetica",
    styleGroup: "conversion-driven",
    mood: "bold",
    colorScheme: "light",
    primaryColor: "#1a1a1a",
    accentColor: "#ff6b6b",
    backgroundColor: "#ffffff",
    fontPersonality: "modern",
    layoutVariant: 2,
    styleNotes: "Radical pricing transparency meets clinical excellence. Headlines are bold value propositions: 'Better Botox, Better Results' and 'Flat-rate pricing, always.' Each service shows the flat price immediately ($425). Service grid is the hero — no soft intro. Conversion elements layered throughout: 'Book Now' repeated, location selector, 'Schedule a free consult'. aboutText is about the system and trust, not the owner's story.",
  },
  {
    id: "est-12",
    url: "https://www.viomedspa.com",
    vertical: "estetica",
    styleGroup: "conversion-driven",
    mood: "bold",
    colorScheme: "light",
    primaryColor: "#c0392b",
    accentColor: "#e74c3c",
    backgroundColor: "#ffffff",
    fontPersonality: "bold",
    layoutVariant: 2,
    styleNotes: "Multi-location franchise energy. Services listed as a comprehensive menu with categories. Hero highlights the number of locations and how easy it is to find one near you. 'Find a Location' is a primary CTA alongside 'Book Now'. Pricing is package-based with membership tiers. aboutText focuses on the brand promise, not a person. Testimonials are volume-based ('Join 50,000+ happy clients').",
  },
  {
    id: "est-13",
    url: "https://revive.md",
    vertical: "estetica",
    styleGroup: "conversion-driven",
    mood: "clinical",
    colorScheme: "light",
    primaryColor: "#1565c0",
    accentColor: "#0288d1",
    backgroundColor: "#f5f9ff",
    fontPersonality: "modern",
    layoutVariant: 2,
    styleNotes: "California clinical-luxury conversion machine. Blue medical palette builds trust while keeping energy high. Headlines combine outcome + ease: 'Look refreshed. No downtime.' Service descriptions use treatment category + 1 key benefit + pricing tier. Multiple CTAs compete but 'Book Free Consultation' wins. FAQ positioned to remove objections. Neighborhood SEO woven into headings naturally.",
  },
  {
    id: "est-14",
    url: "https://www.thedermspecs.com",
    vertical: "estetica",
    styleGroup: "conversion-driven",
    mood: "clinical",
    colorScheme: "light",
    primaryColor: "#1a3a5c",
    accentColor: "#2980b9",
    backgroundColor: "#f7f9fc",
    fontPersonality: "modern",
    layoutVariant: 1,
    styleNotes: "NYC multi-location dermatology conversion focus. Hero leads with geography: 'Expert Dermatology in [bairro], New York.' Services listed with insurance acceptance info (adapt: payment methods). 'Same-week appointments available' is a trust/urgency signal. Each neighborhood location gets its own callout. CTA: 'Book Your Appointment' — large, blue, repeated every 2 sections.",
  },
  {
    id: "est-15",
    url: "https://www.upkeepmedspa.com",
    vertical: "estetica",
    styleGroup: "conversion-driven",
    mood: "warm",
    colorScheme: "light",
    primaryColor: "#c0696e",
    accentColor: "#d4a090",
    backgroundColor: "#fdfafa",
    fontPersonality: "friendly",
    layoutVariant: 1,
    styleNotes: "Anti-establishment conversion. Headline: 'Not Your Mother's Med Spa' and 'Making Aesthetics Accessible.' Botanical imagery (florals, peonies) softens the clinical. 7 studio locations shown as a flex. Pricing transparency throughout. CTAs are warm: 'Schedule Your Visit', 'Ready to Glow?' Service descriptions 1-2 lines max with the body area: 'Cheeks, jawline, chin & smile lines.' Newsletter popup after 12 seconds.",
  },

  // ── GROUP 4: Editorial, Doctor-Led & Personal Branding ────────────────────
  {
    id: "est-16",
    url: "https://www.nassifmdmedspa.com",
    vertical: "estetica",
    styleGroup: "editorial-expert",
    mood: "luxurious",
    colorScheme: "dark",
    primaryColor: "#702f8a",
    accentColor: "#702f8a",
    backgroundColor: "#1a1a1a",
    fontPersonality: "elegant",
    layoutVariant: 1,
    styleNotes: "Celebrity doctor branding — the ultimate authority positioning. Purple (#702f8a) is a signature distinctive color. Dr. name appears in headline: 'Experience the art of [Doctor Name]\'s aesthetic enhancements.' Credentials listed like a biography: board-certified, 20+ years, TV appearances. Services framed as 'rejuvenate, revitalize, sculpt, restore.' CTA: 'Schedule Consultation'. Purple horizontal rules under every major heading reinforce the signature color.",
  },
  {
    id: "est-17",
    url: "https://www.drarielostad.com",
    vertical: "estetica",
    styleGroup: "editorial-expert",
    mood: "clinical",
    colorScheme: "light",
    primaryColor: "#1a3a5c",
    accentColor: "#8b7355",
    backgroundColor: "#faf9f7",
    fontPersonality: "elegant",
    layoutVariant: 3,
    styleNotes: "New York physician personal brand — the aboutText IS the site. Hero leads with doctor's full name and credentials. The about section is long (5-6 sentences) covering training, philosophy, and what makes this doctor different from 'med spas run by non-physicians'. Services are secondary to the person. CTA: 'Request a Consultation with Dr. [Name]'. Photography is exclusively of the doctor in clinical settings.",
  },
  {
    id: "est-18",
    url: "https://www.hudsondermatology.com",
    vertical: "estetica",
    styleGroup: "editorial-expert",
    mood: "minimal",
    colorScheme: "light",
    primaryColor: "#1a1a1a",
    accentColor: "#8b7355",
    backgroundColor: "#ffffff",
    fontPersonality: "elegant",
    layoutVariant: 1,
    styleNotes: "Editorial dermatology — where fashion meets medicine. Headlines read like magazine titles: 'Skin Expertise. Hudson Valley.' Photography editorial and aspirational. Services use fashion/editorial language alongside clinical terms. About section written as a profile piece, not a biography. CTA: 'Book a Visit'. Social proof includes press mentions and 'featured in' logos.",
  },
  {
    id: "est-19",
    url: "https://www.michaelkimdermatology.com",
    vertical: "estetica",
    styleGroup: "editorial-expert",
    mood: "clinical",
    colorScheme: "light",
    primaryColor: "#2c3e50",
    accentColor: "#16a085",
    backgroundColor: "#f8fafb",
    fontPersonality: "modern",
    layoutVariant: 3,
    styleNotes: "Personal brand dermatology with educational authority. Doctor's approach explained in depth in the hero area. Services include extensive educational content about each procedure. FAQ is 10+ questions per service. Blog/research section prominent as an authority signal. CTA: 'Schedule an Appointment'. Copy shows thinking: 'We believe in treating the cause, not just the symptom.'",
  },
  {
    id: "est-20",
    url: "https://www.drdebrapricemd.com",
    vertical: "estetica",
    styleGroup: "editorial-expert",
    mood: "warm",
    colorScheme: "light",
    primaryColor: "#c0a882",
    accentColor: "#c0a882",
    backgroundColor: "#fdf8f3",
    fontPersonality: "elegant",
    layoutVariant: 3,
    styleNotes: "Miami female physician luxury brand. Warm golden neutrals — the Miami sun in a palette. Headlines feminine and aspirational: 'Your best skin starts here.' Doctor is the story: photo front and center, personal about narrative written in first person. Services described as 'personalized treatments crafted for you.' CTA: 'Book Your Consultation with Dr. Price'. Testimonials from named patients with photos.",
  },

  // ── GROUP 5: Vibrant, Warm & Boutique ────────────────────────────────────
  {
    id: "est-21",
    url: "https://dermatologyandco.sg",
    vertical: "estetica",
    styleGroup: "vibrant-boutique",
    mood: "warm",
    colorScheme: "light",
    primaryColor: "#a44e2d",
    accentColor: "#4f7661",
    backgroundColor: "#f7e6d8",
    fontPersonality: "friendly",
    layoutVariant: 1,
    styleNotes: "Warm terracotta boutique clinic — earthy, human, neighbourhood-focused. Palette: terracotta #a44e2d + beige #dfcdc1 + sage #4f7661. Fonts: Urbanist + Coralith display. Tagline: 'Your Skin. Our Speciality.' Hero leads with doctor image and warm welcome. Services grouped by skin condition, described in patient-friendly language. WhatsApp CTA is co-primary with appointment booking. About section mentions the neighbourhood and community connection.",
  },
  {
    id: "est-22",
    url: "https://lumemilano.it",
    vertical: "estetica",
    styleGroup: "vibrant-boutique",
    mood: "luxurious",
    colorScheme: "light",
    primaryColor: "#8b6914",
    accentColor: "#d4af37",
    backgroundColor: "#fdfaf5",
    fontPersonality: "elegant",
    layoutVariant: 3,
    styleNotes: "Italian boutique luxury — Milan fashion meets aesthetic medicine. Golden champagne palette. Headlines have Italian elegance translated to Portuguese: poetic, never clinical. Services named in Italian-influenced style ('Trattamento Luminoso'). About section is a brand story about Italian craftsmanship and beauty philosophy. CTA: 'Prenota / Agendar'. Imagery is editorial, fashion-forward. Never mentions price first.",
  },
  {
    id: "est-23",
    url: "https://www.tribecamedspa.com",
    vertical: "estetica",
    styleGroup: "vibrant-boutique",
    mood: "classic",
    colorScheme: "light",
    primaryColor: "#2c3e50",
    accentColor: "#7f8c8d",
    backgroundColor: "#ffffff",
    fontPersonality: "modern",
    layoutVariant: 1,
    styleNotes: "Tribeca boutique professional — New York neighbourhood pride. Headlines lead with geography: 'TriBeCa\'s Premier Medical Spa.' Services listed clearly in a card grid with clean before/after imagery. About section mentions the neighbourhood and years of serving the community. CTA: 'Book a Treatment.' Social proof from Google and Yelp prominently displayed. Professional but approachable — the local expert you trust.",
  },
  {
    id: "est-24",
    url: "https://www.gloestheticsmedspa.com",
    vertical: "estetica",
    styleGroup: "vibrant-boutique",
    mood: "vibrant",
    colorScheme: "light",
    primaryColor: "#e8a0b4",
    accentColor: "#c06090",
    backgroundColor: "#fff8fa",
    fontPersonality: "friendly",
    layoutVariant: 1,
    styleNotes: "Warm glowy boutique spa — Instagram-era feminine energy. 'Glow' used as a verb and noun throughout copy: 'Your glow is waiting', 'Start glowing'. Hero is an invitation, not a statement. Services described in terms of how the client will FEEL: 'Walk out luminous.' Pricing shown with 'Starting at R$XX'. Testimonials with real selfie-style photos. CTA: 'Book Your Glow'. Neighborhood featured as part of the brand identity.",
  },
  {
    id: "est-25",
    url: "https://www.laserclinicschweiz.ch",
    vertical: "estetica",
    styleGroup: "vibrant-boutique",
    mood: "clinical",
    colorScheme: "light",
    primaryColor: "#1a5276",
    accentColor: "#2e86c1",
    backgroundColor: "#f4f9fd",
    fontPersonality: "clean",
    layoutVariant: 2,
    styleNotes: "Swiss boutique clinic — precision with a human touch. Clean blue and white, no decorative elements. Headlines state the service and location: 'Laser treatments in [bairro] — fast, safe, effective.' Services listed with sessions count and downtime info ('0 downtime, 3 sessions recommended'). Pricing shown as ranges. About section: team photo + brief qualifications. CTA: 'Book Free Consultation'. Trust through specificity, not emotion.",
  },
];

// ─── PLANEJADOS ───────────────────────────────────────────────────────────────
const PLANEJADOS: ReferenceSite[] = [
  {
    id: "pla-01",
    url: "https://ref-pla-01.example.com",
    vertical: "planejados",
    styleGroup: "clean-clinical",
    mood: "minimal",
    colorScheme: "light",
    primaryColor: "#1a1a1a",
    accentColor: "#c5a368",
    backgroundColor: "#ffffff",
    fontPersonality: "clean",
    layoutVariant: 2,
    styleNotes: "Minimalist furniture studio. Portfolio-first layout. Copy is restrained — lets photos speak. Services described by room (cozinha, closet, home office). CTA: 'Solicitar orçamento sem compromisso'.",
  },
  {
    id: "pla-02",
    url: "https://ref-pla-02.example.com",
    vertical: "planejados",
    styleGroup: "vibrant-boutique",
    mood: "warm",
    colorScheme: "light",
    primaryColor: "#8b6914",
    accentColor: "#d4af37",
    backgroundColor: "#faf7f0",
    fontPersonality: "friendly",
    layoutVariant: 3,
    styleNotes: "Family-friendly furniture company. Copy emphasizes 'o lar dos seus sonhos'. Uses family scenarios. Services listed by family room. About section tells founding story. CTA: 'Vamos criar juntos'.",
  },
  {
    id: "pla-03",
    url: "https://ref-pla-03.example.com",
    vertical: "planejados",
    styleGroup: "dark-luxury",
    mood: "bold",
    colorScheme: "dark",
    primaryColor: "#2c3e50",
    accentColor: "#e74c3c",
    backgroundColor: "#1a1a2e",
    fontPersonality: "modern",
    layoutVariant: 1,
    styleNotes: "Bold modern furniture brand. Architecture-inspired copy. Headlines with strong verbs ('Projete. Viva. Transforme.'). Services described with material specs. CTA: 'Iniciar projeto'.",
  },
];

// ─── GENERICO ─────────────────────────────────────────────────────────────────
const GENERICO: ReferenceSite[] = [
  {
    id: "gen-01",
    url: "https://ref-gen-01.example.com",
    vertical: "generico",
    styleGroup: "vibrant-boutique",
    mood: "warm",
    colorScheme: "light",
    primaryColor: "#2d6a4f",
    accentColor: "#d4a853",
    backgroundColor: "#f9f7f2",
    fontPersonality: "friendly",
    layoutVariant: 1,
    styleNotes: "General services business. Warm, community-focused. Local neighborhood pride in copy. Clear service descriptions with pricing. Trust signals from Google reviews. CTA: 'Falar com a gente'.",
  },
];

// ─── Registry ─────────────────────────────────────────────────────────────────

const ALL_SITES: ReferenceSite[] = [...ESTETICA, ...PLANEJADOS, ...GENERICO];

/** Returns all reference sites for a given vertical */
export function getReferenceSitesForVertical(vertical: string): ReferenceSite[] {
  const sites = ALL_SITES.filter((s) => s.vertical === vertical);
  if (sites.length === 0) {
    return ALL_SITES.filter((s) => s.vertical === "generico");
  }
  return sites;
}

/**
 * Picks a reference site for a project.
 * If styleGroup is provided (from client intake choice), filters to that group first.
 * Falls back to full vertical pool if no match. Uses last 4 chars of projectId as seed.
 */
export function pickReferenceSite(
  vertical: string,
  projectId: string,
  styleGroup?: StyleGroup
): ReferenceSite {
  const all = getReferenceSitesForVertical(vertical);
  const pool = styleGroup ? (all.filter((s) => s.styleGroup === styleGroup) || all) : all;
  const sites = pool.length > 0 ? pool : all;
  const seed = parseInt(projectId.slice(-4), 16) || 0;
  return sites[seed % sites.length]!;
}
