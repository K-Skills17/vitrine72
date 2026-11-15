import Link from "next/link";
import { config } from "@/lib/config";
import { formatPhone, telHref, whatsappHref } from "@/lib/whatsapp";
import { Container } from "../ui/Layout";
import { navItems } from "./nav";

export default function Footer() {
  const instagram = config.instagramLink?.replace(/^@/, "");
  return (
    <footer className="bg-inverse-bg text-inverse-ink">
      <Container className="grid gap-12 py-section lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="font-display text-h2 leading-tight">{config.businessName}</p>
          {config.neighborhoods.length > 0 && (
            <p className="mt-4 max-w-sm text-small text-inverse-muted">
              Atendemos {config.neighborhoods.slice(0, 4).join(", ")} e região.
            </p>
          )}
        </div>

        <nav aria-label="Rodapé" className="lg:col-span-2">
          <ul className="space-y-1 text-small">
            <li>
              <Link href="/" className="inline-block py-1 hover:underline">Início</Link>
            </li>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-1 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-5 text-small lg:col-span-5">
          {config.address && <address className="not-italic text-inverse-muted">{config.address}</address>}
          {config.hours && <p className="whitespace-pre-line text-inverse-muted">{config.hours}</p>}
          <ul className="space-y-1">
            {config.phone && (
              <>
                <li>
                  <a href={whatsappHref(config.phone, config.businessName, { kind: "contact" })} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:underline">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={telHref(config.phone)} className="inline-block py-1 hover:underline">
                    {formatPhone(config.phone)}
                  </a>
                </li>
              </>
            )}
            {instagram && (
              <li>
                <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:underline">
                  Instagram @{instagram}
                </a>
              </li>
            )}
            {config.gbpLink && (
              <li>
                <a href={config.gbpLink} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:underline">
                  Google Maps
                </a>
              </li>
            )}
          </ul>
        </div>
      </Container>
      <Container className="border-t border-inverse-line py-6 text-legal text-inverse-muted">
        © {new Date().getFullYear()} {config.businessName}
      </Container>
    </footer>
  );
}
