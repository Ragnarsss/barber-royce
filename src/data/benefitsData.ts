/**
 * Beneficios de la sección «Estilo que te acompaña» (BR-064), con los textos del Figma «Beneficios v2».
 * La descripción es texto plano con partes en negrita (`{ strong }`): así no hace falta interpretar HTML.
 */
export type BenefitIconName = "scissors" | "barberChair" | "userStar";
export type RichText = Array<string | { strong: string }>;

export interface Benefit {
  icon: BenefitIconName;
  title: string;
  description: RichText;
}

export const benefitsList: Benefit[] = [
  {
    icon: "scissors",
    title: "Cortes Expertos",
    description: ["Nuestros barberos son ", { strong: "maestros en su oficio" }, ", garantizando un corte perfecto cada vez."],
  },
  {
    icon: "barberChair",
    title: "Ambiente Exclusivo",
    description: ["Disfruta de un espacio donde la ", { strong: "comodidad y el buen gusto" }, " se encuentran."],
  },
  {
    icon: "userStar",
    title: "Atención Personalizada",
    description: ["Te ", { strong: "escuchamos y asesoramos" }, " para que tu corte refleje tu personalidad."],
  },
];
