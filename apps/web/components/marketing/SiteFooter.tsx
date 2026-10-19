export function SiteFooter() {
  const legalName = process.env.LEGAL_NAME ?? "PLACEHOLDER_LEGAL_NAME";
  const cnpj = process.env.CNPJ ?? "PLACEHOLDER_CNPJ";

  return (
    <footer className="bg-surface-base border-t border-subtle py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <a href="#" className="flex items-baseline gap-0 mb-2">
              <span className="font-display font-bold text-ink-primary text-lg tracking-tight">Vitrine</span>
              <span className="font-display font-bold text-brand-gold text-lg">72</span>
            </a>
            <p className="text-ink-subtle text-xs leading-relaxed">
              {legalName} — CNPJ {cnpj}
            </p>
            <p className="text-ink-faint text-xs mt-1">São Paulo, Brasil</p>
          </div>

          {/* Footer nav — improved contrast: text-ink-muted instead of text-gray-600 */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            <a href="#como-funciona" className="hover:text-ink-primary transition">Como funciona</a>
            <a href="#portfolio" className="hover:text-ink-primary transition">Portfólio</a>
            <a href="#preco" className="hover:text-ink-primary transition">Preços</a>
            <a href="#faq" className="hover:text-ink-primary transition">FAQ</a>
            <a href="/privacidade" className="hover:text-ink-primary transition">Privacidade</a>
            <a href="/termos" className="hover:text-ink-primary transition">Termos</a>
          </nav>
        </div>

        <div
          aria-hidden
          className="mt-8 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, var(--border-soft), transparent)",
          }}
        />
        <p className="text-ink-faint text-xs text-center mt-6">
          © {new Date().getFullYear()} Vitrine72. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
