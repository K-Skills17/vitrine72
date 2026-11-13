import { Wordmark } from "./HomeNav";
import { container } from "./ui";

export function HomeFooter() {
  const legalName = process.env.LEGAL_NAME;
  const cnpj = process.env.CNPJ;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-v-line">
      <div className={`${container} flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between`}>
        <div className="flex flex-col gap-3">
          <Wordmark />
          <p className="font-grotesk text-[0.85rem] text-v-muted">
            {legalName && cnpj ? `${legalName} · CNPJ ${cnpj}` : "Sites para negócios locais em todo o Brasil"}
          </p>
          {email && (
            <a href={`mailto:${email}`} className="font-mono text-[0.8rem] text-v-muted hover:text-v-ink">
              {email}
            </a>
          )}
        </div>
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-grotesk text-[0.9rem] text-v-muted">
            <li><a href="/sobre" className="hover:text-v-ink">Sobre</a></li>
            <li><a href="/termos" className="hover:text-v-ink">Termos</a></li>
            <li><a href="/privacidade" className="hover:text-v-ink">Privacidade</a></li>
            <li className="font-mono text-[0.8rem]">© {year} Vitrini72</li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
