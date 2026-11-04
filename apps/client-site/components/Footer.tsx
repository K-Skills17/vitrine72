import Link from "next/link";
import { config } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl(config.phone);
  const { palette } = config;

  return (
    <footer
      className="border-t"
      style={{ borderColor: `${palette.text}10`, backgroundColor: palette.background }}
    >
      <div className="container-wide px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="font-display font-bold text-lg mb-3" style={{ color: palette.accent }}>
              {config.businessName}
            </p>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: `${palette.text}50` }}>
              {config.copyBlocks.heroSubheadline}
            </p>
            {config.gbpData && (
              <div className="flex items-center gap-2">
                <StarRating rating={config.gbpData.rating} />
                <span className="text-sm" style={{ color: `${palette.text}50` }}>
                  {config.gbpData.rating.toFixed(1)} ({config.gbpData.reviewCount} avaliações)
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: `${palette.text}40` }}>
              Páginas
            </p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Início" },
                { href: "/servicos", label: "Serviços" },
                { href: "/sobre", label: "Sobre nós" },
                { href: "/faq", label: "Perguntas frequentes" },
                { href: "/contato", label: "Contato" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: `${palette.text}50` }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: `${palette.text}40` }}>
              Contato
            </p>
            <div className="flex flex-col gap-3">
              {config.address && (
                <div className="flex gap-2 text-sm" style={{ color: `${palette.text}50` }}>
                  <LocationIcon color={`${palette.text}50`} />
                  <span>{config.address}</span>
                </div>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 text-sm transition-opacity hover:opacity-100"
                style={{ color: `${palette.text}50` }}
              >
                <PhoneIcon color={`${palette.text}50`} />
                <span>{formatPhone(config.phone)}</span>
              </a>
              {config.hours && (
                <div className="flex gap-2 text-sm" style={{ color: `${palette.text}50` }}>
                  <ClockIcon color={`${palette.text}50`} />
                  <span className="whitespace-pre-line">{config.hours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 border-t flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: `${palette.text}08` }}
        >
          <p className="text-xs" style={{ color: `${palette.text}30` }}>
            © {year} {config.businessName}. Todos os direitos reservados.
          </p>
          <p className="text-xs" style={{ color: `${palette.text}20` }}>
            Atualizado em {config.updatedAt}
          </p>
        </div>
      </div>
    </footer>
  );
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) => i < full);
  return (
    <div className="flex gap-0.5" aria-label={`${rating} estrelas`}>
      {stars.map((filled, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#fbbc04" : "#e0e0e0"} aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return phone;
}

function LocationIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function PhoneIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41C1.6 2.33 2.33 1.4 3.41 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 7.18 7.18l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function ClockIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
