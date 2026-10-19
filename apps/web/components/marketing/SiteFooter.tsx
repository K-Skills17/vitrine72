export function SiteFooter() {
  const legalName = process.env.LEGAL_NAME ?? "PLACEHOLDER_LEGAL_NAME";
  const cnpj = process.env.CNPJ ?? "PLACEHOLDER_CNPJ";

  return (
    <footer className="bg-brand-dark border-t border-white/5 py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-600">
        <div>
          <p className="font-semibold text-gray-500">
            Vitrine<span className="text-brand-gold">72</span>
          </p>
          <p>
            {legalName} — CNPJ {cnpj}
          </p>
        </div>
        <nav className="flex flex-wrap gap-4">
          <a href="/privacidade" className="hover:text-gray-300 transition">
            Privacidade
          </a>
          <a href="/termos" className="hover:text-gray-300 transition">
            Termos
          </a>
        </nav>
      </div>
    </footer>
  );
}
