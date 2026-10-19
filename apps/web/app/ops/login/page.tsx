"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function OpsLogin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/ops`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-6">
        <h1 className="text-2xl font-display font-bold text-white text-center">
          Vitrine72 Ops
        </h1>

        {sent ? (
          <div className="bg-green-900/30 border border-green-600 rounded-xl p-4 text-green-300 text-center">
            Link enviado para {email}. Verifique seu e-mail.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="input-field w-full"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-brand-dark font-bold py-3 rounded-xl hover:brightness-110 transition disabled:opacity-40"
            >
              {loading ? "Enviando…" : "Entrar com magic link"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
