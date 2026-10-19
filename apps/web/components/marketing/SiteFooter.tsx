export function SiteFooter() {
  const legalName = process.env.LEGAL_NAME ?? "PLACEHOLDER_LEGAL_NAME";
  const cnpj = process.env.CNPJ ?? "PLACEHOLDER_CNPJ";

  return (
    <footer className="bg-brand-dark border-t border-white/5 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <a href="#" className="flex items-baseline gap-0.5 mb-2">
              <span className="font-display font-bold text-white text-lg tracking-tight">Vitrine</span>
              <span className="font-display font-bold text-brand-gold text-lg">72</span>
            </a>
            <p className="text-gray-600 text-xs leading-relaxed">
              {legalName} — CNPJ {cnpj}
            </p>
            <p className="text-gray-700 text-xs mt-1">São Paulo, Brasil</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <a href="#como-funciona" className="hover:text-gray-400 transition">Como funciona</a>
            <a href="#portfolio" className="hover:text-gray-400 transition">Portfólio</a>
            <a href="#preco" className="hover:text-gray-400 transition">Preços</a>
            <a href="#faq" className="hover:text-gray-400 transition">FAQ</a>
            <a href="/privacidade" className="hover:text-gray-400 transition">Privacidade</a>
            <a href="/termos" className="hover:text-gray-400 transition">Termos</a>
          </nav>
        </div>

        <div
          aria-hidden
          className="mt-8 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
          }}
        />
        <p className="text-gray-700 text-xs text-center mt-6">
          © {new Date().getFullYear()} Vitrine72. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
