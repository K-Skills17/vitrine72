import { ExternalLink } from "lucide-react";
import portfolio from "@/../../config/portfolio.json";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

interface SiteEntry {
  slug: string;
  name: string;
  url: string;
  vertical: string;
  screenshotUrl: string;
  enabled: boolean;
}

const VERTICAL_LABELS: Record<string, string> = {
  estetica: "Estética",
  "fisioterapia-pilates": "Fitness & Pilates",
};

export function Portfolio() {
  const sites = (portfolio.sites as SiteEntry[]).filter((s) => s.enabled);

  return (
    <section id="portfolio" className="py-28 px-6 bg-brand-dark-2">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-16">
          <span className="section-label">Portfólio</span>
          <h2
            data-copy="provisional"
            className="text-4xl md:text-5xl font-display font-bold text-white mt-1"
          >
            Sites que já criamos
          </h2>
          <span className="divider-gold mt-6" />
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Negócios reais em São Paulo que já estão recebendo clientes online.
          </p>
        </Reveal>

        {sites.length === 0 ? (
          <Reveal>
            <p className="text-center text-gray-500 py-12">Portfólio em breve.</p>
          </Reveal>
        ) : (
          <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <RevealItem key={site.slug}>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-brand-dark rounded-2xl overflow-hidden border border-white/6 hover:border-brand-gold/30 transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-gold/10"
                >
                  <div className="aspect-video bg-brand-dark-3 relative overflow-hidden">
                    {site.screenshotUrl.startsWith("PLACEHOLDER") ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-3">
                            <ExternalLink className="w-5 h-5 text-brand-gold/60" aria-hidden />
                          </div>
                          <p className="text-gray-600 text-xs">Screenshot em breve</p>
                        </div>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={site.screenshotUrl}
                        alt={`Screenshot do site ${site.name}`}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                      />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="flex items-center gap-2 text-white text-sm font-semibold border border-white/30 rounded-lg px-4 py-2 backdrop-blur-sm">
                        Visitar site
                        <ExternalLink className="w-4 h-4" aria-hidden />
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white font-semibold">{site.name}</h3>
                      <span className="text-xs text-brand-gold/70 bg-brand-gold/10 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                        {VERTICAL_LABELS[site.vertical] ?? site.vertical}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {site.url.replace(/^https?:\/\//, "")}
                    </p>
                  </div>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
