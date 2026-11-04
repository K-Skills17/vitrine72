"use client";

import { useState } from "react";

interface Props {
  data: Record<string, unknown>;
  onNext: (_update: Record<string, unknown>) => void;
  onBack: () => void;
}

const STYLE_OPTIONS = [
  {
    value: "dark-luxury",
    label: "Luxo & Exclusividade",
    description: "Sofisticado, premium, exclusivo. Fundo escuro, dourado e cores ricas. Para clínicas e marcas de alto padrão.",
    swatches: ["#111111", "#c5a368", "#faf9f7"],
    example: "Beautifully, you. • Experience the art of aesthetic enhancement.",
  },
  {
    value: "clean-clinical",
    label: "Clínico & Minimalista",
    description: "Branco, clean, credibilidade científica. Transmite confiança médica e profissionalismo.",
    swatches: ["#ffffff", "#1565c0", "#f5f8ff"],
    example: "Good skin should be easy. • Dermatologist-developed results.",
  },
  {
    value: "conversion-driven",
    label: "Conversão & Resultados",
    description: "Direto, preços à vista, múltiplos CTAs. Para quem quer agendar agora. Alta conversão.",
    swatches: ["#ffffff", "#ff6b35", "#1a1a1a"],
    example: "Better Results. Flat-rate pricing, always. • Book Now",
  },
  {
    value: "editorial-expert",
    label: "Autoridade do Especialista",
    description: "Médico como marca. Sua história e credenciais no centro. Para quem vende o nome próprio.",
    swatches: ["#faf9f7", "#702f8a", "#1a3a5c"],
    example: "Experience the art of Dr. [Nome]. • Board-certified. 20+ years.",
  },
  {
    value: "vibrant-boutique",
    label: "Boutique & Acolhedor",
    description: "Caloroso, próximo, bairro. Cores vibrantes e linguagem humana. Para quem quer aproximar o cliente.",
    swatches: ["#f7e6d8", "#a44e2d", "#4f7661"],
    example: "Your glow is waiting. • Making beauty accessible. • Falar com a gente.",
  },
] as const;

export function IntakeStepStyle({ data, onNext, onBack }: Props) {
  const [selected, setSelected] = useState((data.style_group as string) ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) {
      setError("Escolha um estilo para continuar.");
      return;
    }
    setError(null);
    onNext({ style_group: selected });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-display font-semibold text-white">
          Escolha o estilo do seu site
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Selecione o visual que mais combina com a sua marca. Usaremos isso para criar um site único.
        </p>
      </div>

      <div className="space-y-3">
        {STYLE_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelected(opt.value)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                isSelected
                  ? "border-brand-gold bg-brand-dark-2 ring-1 ring-brand-gold"
                  : "border-white/10 bg-brand-dark-2 hover:border-white/30"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Color swatches */}
                <div className="flex gap-1 mt-0.5 shrink-0">
                  {opt.swatches.map((color) => (
                    <span
                      key={color}
                      className="w-5 h-5 rounded-full border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${isSelected ? "text-brand-gold" : "text-white"}`}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <span className="text-brand-gold text-xs">✓</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                    {opt.description}
                  </p>
                  <p className="text-gray-600 text-xs mt-1.5 italic truncate">
                    {opt.example}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-white/20 text-gray-400 py-3 rounded-xl hover:bg-brand-dark-2 transition"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="flex-1 bg-brand-gold text-brand-dark font-bold py-3 rounded-xl hover:brightness-110 transition"
        >
          Próximo
        </button>
      </div>
    </form>
  );
}
