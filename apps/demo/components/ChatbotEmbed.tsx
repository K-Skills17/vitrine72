"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  niche: string;
  botEmbedUrl?: string;
}

export default function ChatbotEmbed({ niche, botEmbedUrl }: Props) {
  const [open, setOpen] = useState(false);
  const scriptLoaded = useRef(false);

  // Load the real widget script on first open
  function loadScript() {
    if (!botEmbedUrl || scriptLoaded.current) return;
    scriptLoaded.current = true;
    const script = document.createElement("script");
    script.src = botEmbedUrl;
    script.async = true;
    script.dataset.niche = niche;
    document.body.appendChild(script);
    // Give the script a moment to build the widget, then click its bubble
    script.onload = () => {
      setTimeout(() => {
        const bubble = document.getElementById("lk-chat-bubble") as HTMLButtonElement | null;
        if (bubble) bubble.click();
      }, 300);
    };
  }

  function handleBubbleClick() {
    if (botEmbedUrl) {
      loadScript();
      // If already loaded, click the widget's own bubble
      const bubble = document.getElementById("lk-chat-bubble") as HTMLButtonElement | null;
      if (bubble) bubble.click();
    } else {
      setOpen((v) => !v);
    }
  }

  // Auto-open once per session after 5 s
  useEffect(() => {
    if (sessionStorage.getItem("lk_chat_auto_opened")) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem("lk_chat_auto_opened", "1");
      if (botEmbedUrl) {
        loadScript();
        setTimeout(() => {
          const bubble = document.getElementById("lk-chat-bubble") as HTMLButtonElement | null;
          if (bubble) bubble.click();
        }, 600);
      } else {
        setOpen(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Always-visible chat bubble */}
      <button
        aria-label={open ? "Fechar chat" : "Abrir chat"}
        onClick={handleBubbleClick}
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
          cursor: "pointer",
          transition: "transform 0.15s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.08)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Stub chat panel — only shown when no Railway URL is configured */}
      {!botEmbedUrl && open && (
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
          <div
            style={{
              padding: "1rem 1.25rem",
              backgroundColor: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>
                Assistente Virtual
              </p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "rgba(255,255,255,0.75)" }}>
                Online agora
              </p>
            </div>
          </div>

          {/* Message */}
          <div style={{ padding: "1.25rem", backgroundColor: "#fff", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#f1f5f9",
                borderRadius: "0 12px 12px 12px",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                lineHeight: 1.5,
                color: "#1e293b",
                maxWidth: "85%",
              }}
            >
              Olá! Como posso te ajudar hoje? 😊
            </div>

            {/* Input bar */}
            <div style={{ marginTop: "0.25rem", display: "flex", gap: "0.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "0.75rem" }}>
              <div
                style={{
                  flex: 1,
                  borderRadius: "0.5rem",
                  border: "1px solid #e2e8f0",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  backgroundColor: "#f8fafc",
                }}
              >
                Digite sua mensagem...
              </div>
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
