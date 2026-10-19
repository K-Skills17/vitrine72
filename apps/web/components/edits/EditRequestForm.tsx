"use client";

import { useState } from "react";

interface Props {
  projectId: string;
  token: string;
  freeRemaining: number;
}

const EDIT_PRICES = {
  nova_pagina: 197,
  outro: 97,
};

export function EditRequestForm({ token, freeRemaining }: Props) {
  const [description, setDescription] = useState("");
  const [editType, setEditType] = useState<"nova_pagina" | "outro">("outro");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const isFree = freeRemaining > 0;
  const price = isFree ? 0 : EDIT_PRICES[editType];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) {
      setError("Descreva o que precisa ser editado");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/edits/${token}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, editType }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Erro ao enviar");
        return;
      }
      if (body.paymentLink) {
        setPaymentLink(body.paymentLink);
      } else {
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-900/30 border border-green-600 rounded-xl p-6 text-center space-y-2">
        <p className="text-green-300 font-semibold">Solicitação enviada!</p>
        <p className="text-gray-400 text-sm">
          Você receberá a edição em até 2 dias úteis.
        </p>
      </div>
    );
  }

  if (paymentLink) {
    return (
      <div className="bg-brand-dark-2 border border-white/10 rounded-xl p-6 text-center space-y-4">
        <p className="text-white font-semibold">
          Esta edição é cobrada separadamente.
        </p>
        <p className="text-gray-400 text-sm">
          Valor: R$ {price.toLocaleString("pt-BR")}
        </p>
        <a
          href={paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-gold text-brand-dark font-bold px-6 py-3 rounded-xl hover:brightness-110 transition"
        >
          Pagar e confirmar edição
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isFree && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de edição
          </label>
          <div className="flex gap-4">
            {(["outro", "nova_pagina"] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="editType"
                  value={t}
                  checked={editType === t}
                  onChange={() => setEditType(t)}
                  className="accent-brand-gold"
                />
                <span className="text-gray-300 text-sm">
                  {t === "nova_pagina" ? "Nova página" : "Outra edição"} — R${" "}
                  {EDIT_PRICES[t].toLocaleString("pt-BR")}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          O que precisa ser editado? *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Descreva a edição com o máximo de detalhes possível…"
          className="input-field w-full"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">
          {isFree
            ? `Gratuita (${freeRemaining} restante(s) neste ciclo)`
            : `Cobrada: R$ ${price.toLocaleString("pt-BR")}`}
        </p>
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-gold text-brand-dark font-bold px-6 py-3 rounded-xl hover:brightness-110 transition disabled:opacity-40"
        >
          {loading ? "Enviando…" : "Enviar solicitação"}
        </button>
      </div>
    </form>
  );
}
