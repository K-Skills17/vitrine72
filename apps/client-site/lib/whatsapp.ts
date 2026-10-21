export function buildWhatsAppUrl(phone: string, message?: string): string {
  const clean = phone.replace(/\D/g, "");
  const intl = clean.startsWith("55") ? clean : `55${clean}`;
  const text = encodeURIComponent(
    message ?? "Olá, vi seu site e gostaria de mais informações."
  );
  return `https://wa.me/${intl}?text=${text}`;
}

export function buildWhatsAppServiceUrl(phone: string, serviceName: string): string {
  return buildWhatsAppUrl(
    phone,
    `Olá, vi seu site e gostaria de informações sobre ${serviceName}.`
  );
}
