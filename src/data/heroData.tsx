import type { ReactElement } from "react";
import { Scissors, Gem, Handshake } from "lucide-react";

export const heroBenefits = [
  {
    icon: Scissors,
    text: "Cortes de cabello que marcan tendencia, con un profesionalismo inigualable.",
  },
  {
    icon: Gem,
    text: "Una experiencia sorprendente y premium, diseñada para que te sientas exclusivo.",
  },
  {
    icon: Handshake,
    text: "Atención personalizada que te asegura un resultado impecable, sin prisas.",
  },
];

// ✅ React 19 Optimization: Datos pre-transformados fuera del componente
export const HERO_BENEFITS_VIEW_DATA: Array<{
  icon: ReactElement;
  text: string;
}> = heroBenefits.map((benefit) => ({
  icon: <benefit.icon size={24} />,
  text: benefit.text,
}));
