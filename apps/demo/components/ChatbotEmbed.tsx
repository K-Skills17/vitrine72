"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  niche: string;
  botEmbedUrl?: string;
}

/**
 * Lazy-loads the Railway chatbot widget after 3s idle or first user interaction.
 * Stub mode: shows a placeholder icon when NEXT_PUBLIC_BOT_EMBED_URL is not set.
 * See NEEDS_FROM_KOMANDO.md item B1 for what Railway must provide.
 */
export default function ChatbotEmbed({ niche, botEmbedUrl }: Props) {
  const [loaded, setLoaded] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    function load() {
      if (triggered.current) return;
      triggered.current = true;
      setLoaded(true);
    }

    const timer = setTimeout(load, 3000);
    const events = ["mousedown", "touchstart", "keydown", "scroll"] as const;
    events.forEach((e) =>
      window.addEventListener(e, load, { once: true, passive: true })
    );

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, load));
    };
  }, []);

  useEffect(() => {
    if (!loaded || !botEmbedUrl) return;

    const script = document.createElement("script");
    script.src = botEmbedUrl;
    script.async = true;
    script.dataset.niche = niche;
    script.dataset.clientConfig = `/bot-config/${niche}.json`;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [loaded, botEmbedUrl, niche]);

  // Stub placeholder
  if (!botEmbedUrl && loaded) {
    return (
      <div
        title="Chatbot (stub — aguardando Railway embed snippet, NEEDS item B1)"
        aria-label="Chatbot em breve"
        style={{
          position: "fixed",
          bottom: "5.5rem",
          right: "1.25rem",
          zIndex: 39,
          width: "3rem",
          height: "3rem",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-primary)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          cursor: "pointer",
          fontSize: "1.25rem",
        }}
      >
        🤖
      </div>
    );
  }

  return null;
}
