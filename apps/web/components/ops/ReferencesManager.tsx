"use client";

import { useState } from "react";

const VERTICALS = [
  "estetica",
  "odontologia",
  "moveis-planejados",
  "energia-solar",
  "fisioterapia-pilates",
  "buffet-eventos",
  "generico",
];

const STYLE_GROUP_LABELS: Record<string, string> = {
  "dark-luxury": "Dark Luxury",
  "clean-clinical": "Clean Clinical",
  "conversion-driven": "Conversion",
  "editorial-expert": "Editorial Expert",
  "vibrant-boutique": "Vibrant Boutique",
};

type ReferenceSite = {
  id: string;
  url: string;
  vertical: string;
  style_group: string;
  mood: string;
  color_scheme: string;
  primary_color: string;
  accent_color: string;
  background_color: string;
  font_personality: string;
  layout_variant: number;
  style_notes: string;
  created_at: string;
};

interface Props {
  initialSites: ReferenceSite[];
}

export function ReferencesManager({ initialSites }: Props) {
  const [sites, setSites] = useState<ReferenceSite[]>(initialSites);
  const [vertical, setVertical] = useState("estetica");
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<ReferenceSite[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setAnalyzing(true);
    setError(null);
    setLastAdded([]);

    try {
      const res = await fetch("/api/ops/references", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, vertical }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Erro ao analisar. Tente novamente.");
        return;
      }
      const added = json.saved as ReferenceSite[];
      setLastAdded(added);
      setSites((prev) => [...added, ...prev]);
      setText("");
    } catch {
      setError("Erro de conexão.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/ops/references/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSites((prev) => prev.filter((s) => s.id !== id));
        setLastAdded((prev) => prev.filter((s) => s.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  // Group by vertical
  const grouped = sites.reduce<Record<string, ReferenceSite[]>>((acc, s) => {
    (acc[s.vertical] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* ── Add form ─────────────────────────────────────────────── */}
      <section className="bg-brand-dark-2 border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-lg">Adicionar referências</h2>
        <p className="text-gray-400 text-sm">
          Cole URLs, texto copiado de sites ou qualquer descrição. A IA extrai tudo automaticamente.
        </p>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Vertical</label>
            <select
              value={vertical}
              onChange={(e) => setVertical(e.target.value)}
              className="input-field w-48"
            >
              {VERTICALS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              URLs e notas — cole tudo aqui
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              placeholder={`https://exemplo.com grupo dark luxury, fundo preto dourado\nhttps://outra.com.br estilo clean, dermatologista credibilidade\n\nVocê também pode colar texto copiado de sites ou qualquer descrição do estilo que quer capturar.`}
              className="w-full bg-brand-dark-3 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-brand-gold resize-y"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={analyzing || !text.trim()}
            className="bg-brand-gold text-brand-dark font-bold px-6 py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-brand-dark border-t-transparent rounded-full" />
                Analisando com IA…
              </>
            ) : (
              "Analisar e salvar"
            )}
          </button>
        </form>

        {/* Success preview */}
        {lastAdded.length > 0 && (
          <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-4 space-y-2">
            <p className="text-green-400 text-sm font-semibold">
              ✓ {lastAdded.length} entrada(s) adicionada(s) com sucesso
            </p>
            {lastAdded.map((s) => (
              <div key={s.id} className="text-xs text-gray-400 flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border border-white/10 shrink-0"
                  style={{ backgroundColor: s.primary_color }}
                />
                <span className="text-gray-300">{s.url}</span>
                <span className="text-gray-600">
                  {STYLE_GROUP_LABELS[s.style_group] ?? s.style_group} · {s.mood}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Existing entries ─────────────────────────────────────── */}
      <section className="space-y-6">
        <h2 className="text-white font-semibold text-lg">
          Sites cadastrados{" "}
          <span className="text-gray-500 font-normal text-sm">({sites.length} total)</span>
        </h2>

        {Object.keys(grouped).length === 0 && (
          <p className="text-gray-500 text-sm">Nenhum site cadastrado ainda.</p>
        )}

        {Object.entries(grouped).map(([v, group]) => (
          <div key={v} className="space-y-2">
            <h3 className="text-brand-gold text-xs font-semibold uppercase tracking-widest">
              {v} — {group.length} referências
            </h3>
            <div className="space-y-1">
              {group.map((s) => (
                <div
                  key={s.id}
                  className="bg-brand-dark-2 border border-white/5 rounded-lg px-4 py-3 flex items-start gap-3 group"
                >
                  {/* Color swatches */}
                  <div className="flex gap-1 mt-0.5 shrink-0">
                    {[s.background_color, s.primary_color, s.accent_color].map((c) => (
                      <span
                        key={c}
                        className="w-3.5 h-3.5 rounded-full border border-white/10"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-200 hover:text-brand-gold truncate max-w-xs transition"
                      >
                        {s.url}
                      </a>
                      <span className="text-xs text-gray-600 border border-white/10 rounded px-1.5 py-0.5 shrink-0">
                        {STYLE_GROUP_LABELS[s.style_group] ?? s.style_group}
                      </span>
                      <span className="text-xs text-gray-600">{s.mood} · {s.font_personality}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {s.style_notes}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                    className="text-gray-700 hover:text-red-400 transition text-xs shrink-0 opacity-0 group-hover:opacity-100"
                  >
                    {deleting === s.id ? "…" : "Excluir"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
