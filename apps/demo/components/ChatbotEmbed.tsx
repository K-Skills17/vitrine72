"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  niche: string;
  botEmbedUrl?: string;
  whatsappNumber?: string;
}

export default function ChatbotEmbed({ niche, botEmbedUrl, whatsappNumber }: Props) {
  const [widgetReady, setWidgetReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [stubOpen, setStubOpen] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Load Railway widget ────────────────────────────────────
  useEffect(() => {
    if (!botEmbedUrl) return;

    const script = document.createElement("script");
    script.src = botEmbedUrl;
    script.async = true;
    script.dataset.niche = niche;
    document.body.appendChild(script);

    script.onload = () => {
      const poll = setInterval(() => {
        if (document.getElementById("lk-chat-bubble")) {
          clearInterval(poll);
          setWidgetReady(true);
        }
      }, 200);
      setTimeout(() => { clearInterval(poll); setLoadFailed(true); }, 25000);
    };

    script.onerror = () => setLoadFailed(true);

    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-open Railway widget once per session ──────────────
  useEffect(() => {
    if (!widgetReady) return;
    if (sessionStorage.getItem("lk_chat_auto_opened")) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem("lk_chat_auto_opened", "1");
      (document.getElementById("lk-chat-bubble") as HTMLButtonElement | null)?.click();
    }, 5000);
    return () => clearTimeout(timer);
  }, [widgetReady]);

  // ── Auto-open stub once per session ───────────────────────
  useEffect(() => {
    if (!(!botEmbedUrl || loadFailed)) return;
    if (sessionStorage.getItem("lk_chat_auto_opened")) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem("lk_chat_auto_opened", "1");
      setStubOpen(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [botEmbedUrl, loadFailed]);

  // Focus input when stub opens
  useEffect(() => {
    if (stubOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [stubOpen]);

  if (widgetReady) return null;

  const isLoading = !!botEmbedUrl && !loadFailed;
  const isStub = !botEmbedUrl || loadFailed;

  function sendToWhatsApp() {
    if (!message.trim()) return;
    const num = whatsappNumber ?? "5511953542831";
    const url = `https://wa.me/${num}?text=${encodeURIComponent(message.trim())}`;
    window.open(url, "_blank", "noopener");
    setMessage("");
    setStubOpen(false);
  }

  return (
    <>
      {/* Bubble */}
      <button
        aria-label={stubOpen ? "Fechar chat" : "Abrir chat"}
        onClick={() => { if (isStub) setStubOpen((v) => !v); }}
        style={{
          position: "fixed",
          bottom: "5.25rem",
          right: "1.25rem",
          zIndex: 39,
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-primary)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          border: "none",
          cursor: isLoading ? "wait" : "pointer",
          transition: "transform 0.15s",
          opacity: isLoading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => { if (isStub) (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
      >
        {isLoading ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2a10 10 0 0 1 10 10" style={{ opacity: 0.3 }} />
            <path d="M12 2a10 10 0 0 1 10 10">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.9s" repeatCount="indefinite" />
            </path>
          </svg>
        ) : stubOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Stub chat panel — functional WhatsApp relay */}
      {isStub && stubOpen && (
        <div
          role="dialog"
          aria-label="Chat assistente"
          style={{
            position: "fixed",
            bottom: "10rem",
            right: "1.25rem",
            zIndex: 38,
            width: "320px",
            maxWidth: "calc(100vw - 2.5rem)",
            borderRadius: "1rem",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            fontFamily: "system-ui, sans-serif",
            animation: "slide-up 0.25s ease-out",
          }}
        >
          {/* Header */}
          <div style={{ padding: "1rem 1.25rem", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "2rem", height: "2rem", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>Assistente Virtual</p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "rgba(255,255,255,0.75)" }}>Responde pelo WhatsApp</p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "1.25rem", backgroundColor: "#fff", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ alignSelf: "flex-start", backgroundColor: "#f1f5f9", borderRadius: "0 12px 12px 12px", padding: "0.75rem 1rem", fontSize: "0.875rem", lineHeight: 1.5, color: "#1e293b", maxWidth: "85%" }}>
              Olá! Como posso te ajudar? Digite sua dúvida e te respondo no WhatsApp 😊
            </div>

            {/* Real input + send */}
            <div style={{ marginTop: "0.25rem", display: "flex", gap: "0.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "0.75rem" }}>
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendToWhatsApp(); }}
                placeholder="Digite sua mensagem..."
                style={{
                  flex: 1,
                  borderRadius: "0.5rem",
                  border: "1px solid #e2e8f0",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.8rem",
                  color: "#1e293b",
                  backgroundColor: "#f8fafc",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={sendToWhatsApp}
                disabled={!message.trim()}
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "0.5rem",
                  backgroundColor: message.trim() ? "var(--color-primary)" : "#e2e8f0",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  cursor: message.trim() ? "pointer" : "default",
                  transition: "background-color 0.15s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
