/**
 * Resend email template functions.
 * All in pt-BR.
 */

export function intakeLinkEmail(params: {
  clientName: string;
  businessName: string;
  intakeUrl: string;
  previewBusinessDays: number;
}) {
  const { clientName, businessName, intakeUrl, previewBusinessDays } = params;

  return {
    subject: `Vitrine72 — Seu link de briefing está pronto`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Briefing Vitrine72</title></head>
<body style="font-family: system-ui, sans-serif; background: #111; color: #fff; padding: 32px;">
  <div style="max-width: 520px; margin: 0 auto;">
    <h1 style="color: #c5a368; font-size: 24px;">Pagamento confirmado! 🎉</h1>
    <p>Olá, <strong>${clientName}</strong>!</p>
    <p>Recebemos o pagamento para o site de <strong>${businessName}</strong>. Agora é só preencher o formulário de briefing abaixo:</p>
    <p style="margin: 32px 0;">
      <a href="${intakeUrl}" style="background: #c5a368; color: #111; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">
        Preencher formulário de briefing
      </a>
    </p>
    <p style="color: #aaa; font-size: 14px;">
      Depois que você enviar o formulário completo, sua prévia fica pronta em até <strong>${previewBusinessDays} dias úteis</strong>.
    </p>
    <p style="color: #666; font-size: 13px;">
      Se tiver dúvidas, responda este e-mail ou entre em contato pelo WhatsApp.
    </p>
    <hr style="border-color: #333; margin: 24px 0;">
    <p style="color: #555; font-size: 12px;">Vitrine72</p>
  </div>
</body>
</html>`,
    text: `Olá, ${clientName}! Pagamento confirmado. Preencha o briefing em: ${intakeUrl}`,
  };
}

export function intakeReminderEmail(params: {
  clientName: string;
  intakeUrl: string;
  reminderNumber: 1 | 2;
}) {
  const { clientName, intakeUrl, reminderNumber } = params;
  const urgency = reminderNumber === 2 ? " (urgente)" : "";

  return {
    subject: `Vitrine72 — Lembrete: seu briefing está aguardando${urgency}`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Lembrete Vitrine72</title></head>
<body style="font-family: system-ui, sans-serif; background: #111; color: #fff; padding: 32px;">
  <div style="max-width: 520px; margin: 0 auto;">
    <h1 style="color: #c5a368; font-size: 22px;">Seu briefing está esperando por você</h1>
    <p>Olá, <strong>${clientName}</strong>!</p>
    <p>Ainda não recebemos seu formulário de briefing. O prazo de 72 horas úteis começa apenas quando você enviar tudo.</p>
    <p style="margin: 32px 0;">
      <a href="${intakeUrl}" style="background: #c5a368; color: #111; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">
        Preencher agora
      </a>
    </p>
    <p style="color: #666; font-size: 13px;">Se precisar de ajuda, responda este e-mail.</p>
    <hr style="border-color: #333; margin: 24px 0;">
    <p style="color: #555; font-size: 12px;">Vitrine72</p>
  </div>
</body>
</html>`,
    text: `Olá, ${clientName}! Seu briefing ainda está aguardando: ${intakeUrl}`,
  };
}
