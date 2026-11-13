"use client";

import { useState } from "react";

export default function OpsLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/ops/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      window.location.href = "/ops";
    } else {
      const data = await res.json();
      setError(data.error ?? "Erro ao autenticar");
    }
  }

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-6">
        <h1 className="text-2xl font-display font-bold text-white text-center">
          Vitrini<span className="text-brand-gold">72</span> Ops
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            autoFocus
            className="input-field w-full"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold text-brand-dark font-bold py-3 rounded-xl hover:brightness-110 transition disabled:opacity-40"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
