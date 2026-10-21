import type { Metadata } from "next";
import { config, getServiceDescription } from "@/lib/config";
import { buildWhatsAppServiceUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `Serviços`,
  description: `Conheça todos os serviços de ${config.businessName} em ${config.neighborhoods[0] || "São Paulo"}.`,
};

export default function ServicosPage() {
  return (
    <div className="pt-20">
      {/* Page header */}
      <div
        className="py-20 px-4 text-center"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="container-narrow">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Nossos Serviços
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Atendemos {config.neighborhoods.slice(0, 3).join(", ")} e região.
          </p>
        </div>
      </div>

      {/* Services detail */}
      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-narrow px-4">
          <div className="flex flex-col gap-8">
            {config.services.map((service, i) => {
              const description = getServiceDescription(config, service.name) || service.description;
              const whatsappUrl = buildWhatsAppServiceUrl(config.phone, service.name);
              return (
                <div
                  key={service.name}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        >
                          {i + 1}
                        </div>
                        <h2 className="text-2xl font-display font-bold text-[var(--color-text)]">
                          {service.name}
                        </h2>
                      </div>

                      {description && (
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line mb-4">
                          {description}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 md:min-w-[200px] md:items-end">
                      {service.price && (
                        <div
                          className="text-lg font-bold font-display rounded-xl px-4 py-2 text-center"
                          style={{
                            backgroundColor: "var(--color-secondary)",
                            color: "var(--color-primary)",
                          }}
                        >
                          {service.price}
                        </div>
                      )}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent text-sm text-center"
                      >
                        Solicitar orçamento
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
