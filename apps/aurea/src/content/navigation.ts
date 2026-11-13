export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: "Tratamentos", href: "/tratamentos" },
  { label: "A clínica", href: "/clinica" },
  { label: "Profissionais", href: "/profissionais" },
  { label: "Contato", href: "/contato" },
];

export const legalNav: NavItem[] = [{ label: "Política de privacidade", href: "/privacidade" }];

export const ctaLabels = {
  primary: "Agende sua avaliação",
  secondary: "Conheça a clínica",
  whatsapp: "Conversar pelo WhatsApp",
} as const;
