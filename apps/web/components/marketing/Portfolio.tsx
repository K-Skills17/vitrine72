import portfolio from "@/../../config/portfolio.json";

interface SiteEntry {
  slug: string;
  name: string;
  url: string;
  vertical: string;
  screenshotUrl: string;
  enabled: boolean;
}

export function Portfolio() {
  const sites = (portfolio.sites as SiteEntry[]).filter((s) => s.enabled);

  return (
    <section id="portfolio" className="py-20 px-4 bg-brand-dark-2">
      <div className="max-w-5xl mx-auto">
        <h2
          data-copy="provisional"
          className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-4"
        >
          Sites que já criamos
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Negócios reais em São Paulo que já estão recebendo clientes online.
        </p>

        {sites.length === 0 ? (
          <p className="text-center text-gray-500">
            PLACEHOLDER: portfólio em breve.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <a
                key={site.slug}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-brand-dark rounded-xl overflow-hidden border border-white/5 hover:border-brand-gold/40 transition"
              >
                <div className="aspect-video bg-brand-dark-3 relative">
                  {site.screenshotUrl.startsWith("PLACEHOLDER") ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
                      Screenshot pendente (NEEDS #12)
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={site.screenshotUrl}
                      alt={`Screenshot do site ${site.name}`}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold">{site.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {site.url.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
