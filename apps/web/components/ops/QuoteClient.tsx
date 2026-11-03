"use client";

import { useState } from "react";
import { Copy, Check, Link } from "lucide-react";

const SKU_OPTIONS = [
  { value: "SITE_5P", label: "Site até 5 páginas — R$ 1.997" },
  { value: "ANCHOR_SITE_GBP_BOT", label: "Site + GMN + Agente IA — R$ 3.497" },
  { value: "LANDING_1P", label: "Landing page 1 página — R$ 997" },
  { value: "MANUT", label: "Manutenção mensal — R$ 97" },
];

const EXPIRY_OPTIONS = [
  { value: "1", label: "1 dia" },
  { value: "3", label: "3 dias" },
  { value: "7", label: "7 dias" },
  { value: "30", label: "30 dias" },
];

interface QuoteResult {
  url: string;
  sku: string;
  discount: number;
  expireDays: number;
  originalPix: number;
  originalCard: number;
  discountedPix: number;
  discountedCard: number;
}

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

export function QuoteClient() {
  const [sku, setSku] = useState("SITE_5P");
  const [discount, setDiscount] = useState(10);
  const [expireDays, setExpireDays] = useState("7");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `/api/ops/quote?sku=${sku}&discount=${discount}&expireDays=${expireDays}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao gerar link");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  function copyUrl() {
    if (!result) return;
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-display font-bold text-white">Cotação com desconto</h1>
      <p className="text-gray-400 text-sm">
        Gera um link de pagamento Mercado Pago com desconto assinado. O link expira automaticamente.
      </p>

      <div className="bg-brand-dark-2 rounded-xl p-5 space-y-4 border border-white/5">
        {/* SKU */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Produto</label>
          <select
            value={sku}
            onChange={(e) => { setSku(e.target.value); setResult(null); }}
            className="w-full bg-brand-dark-3 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
          >
            {SKU_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Discount */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Desconto — <span className="text-brand-gold font-semibold">{discount}%</span>
          </label>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={discount}
            onChange={(e) => { setDiscount(Number(e.target.value)); setResult(null); }}
            className="w-full accent-yellow-500"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>5%</span><span>50%</span>
          </div>
        </div>

        {/* Expiry */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Validade do link</label>
          <div className="flex gap-2">
            {EXPIRY_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => { setExpireDays(o.value); setResult(null); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                  expireDays === o.value
                    ? "bg-brand-gold text-black"
                    : "bg-brand-dark-3 text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-brand-gold text-black font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
        >
          <Link className="w-4 h-4" />
          {loading ? "Gerando..." : "Gerar link"}
        </button>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>

      {result && (
        <div className="bg-brand-dark-2 rounded-xl p-5 space-y-4 border border-white/5">
          <h2 className="text-sm font-semibold text-white">Link gerado</h2>

          {/* Price breakdown */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-brand-dark-3 rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-1">Pix (original)</p>
              <p className="text-gray-400 line-through text-xs">R$ {fmt(result.originalPix)}</p>
              <p className="text-green-400 font-bold">R$ {fmt(result.discountedPix)}</p>
            </div>
            <div className="bg-brand-dark-3 rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-1">Cartão (original)</p>
              <p className="text-gray-400 line-through text-xs">R$ {fmt(result.originalCard)}</p>
              <p className="text-green-400 font-bold">R$ {fmt(result.discountedCard)}</p>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Expira em <span className="text-gray-300">{result.expireDays} dia{result.expireDays !== 1 ? "s" : ""}</span>
          </p>

          {/* URL */}
          <div className="flex gap-2">
            <input
              readOnly
              value={result.url}
              className="flex-1 bg-brand-dark-3 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 font-mono focus:outline-none"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={copyUrl}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-dark-3 border border-white/10 text-xs text-gray-300 hover:text-white hover:border-white/20 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
