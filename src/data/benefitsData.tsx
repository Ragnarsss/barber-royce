import type { ReactElement } from "react";
import { Scissors, Armchair, User } from "lucide-react";

export const benefitsList = [
  {
    icon: Scissors,
    title: "Cortes Expertos",
    description:
      "Nuestros barberos dominan cada técnica, tu oficio, garantizando un corte perfecto cada vez.",
  },
  {
    icon: Armchair,
    title: "Ambiente Exclusivo",
    description:
      "Disfruta de un espacio donde la comodidad y el buen gusto se encuentran.",
  },
  {
    icon: User,
    title: "Atención Personalizada",
    description:
      "Te escuchamos y adaptamos cada servicio a tu corte refleje tu personalidad.",
  },
];

// ✅ React 19 Optimization: Datos pre-transformados fuera del componente
// Elimina useMemo innecesario y overhead de hooks
export const BENEFITS_VIEW_DATA: Array<{
  icon: ReactElement;
  title: string;
  description: string;
}> = benefitsList.map((benefit) => ({
  icon: <benefit.icon size={32} />,
  title: benefit.title,
  description: benefit.description,
}));
