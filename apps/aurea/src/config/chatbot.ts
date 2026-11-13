/**
 * Chatbot (lk-chatbot web chat). Each site needs its own tenant: the tenant
 * holds the bot's persona, clinic name and knowledge. Reusing another demo's
 * tenant makes the bot answer under that clinic's name.
 */
export const chatbotConfig = {
  apiBase: "https://lk-chatbot-production.up.railway.app/api/webchat",
  tenantId: process.env.NEXT_PUBLIC_CHATBOT_TENANT_ID?.trim() || null,
  title: "Atendimento ÁUREA",
  /** Delays before the bubble appears and before the one-time auto-open. */
  showAfterMs: 2500,
  autoOpenAfterMs: 5000,
} as const;
