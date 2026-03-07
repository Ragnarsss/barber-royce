import type { ReactElement } from "react";
import { Scissors, Armchair, User } from "lucide-react";

export const featuresList = [
  {
    icon: Scissors,
    title: "Cortes de Cabello",
    description:
      "Tendencias actuales y técnicas clásicas para un resultado impecable que define tu estilo personal.",
  },
  {
    icon: Armchair,
    title: "Masajes Relajantes",
    description:
      "Momentos de relajación que complementan tu experiencia, con técnicas profesionales de masaje.",
  },
  {
    icon: User,
    title: "Atención de Chef",
    description:
      "Cada servicio es una obra maestra, tratado con la dedicación y precisión de un chef en su cocina.",
  },
];

// ✅ React 19 Optimization: Datos pre-transformados fuera del componente
export const FEATURES_VIEW_DATA: Array<{
  icon: ReactElement;
  title: string;
  description: string;
}> = featuresList.map((feature) => ({
  icon: <feature.icon size={36} />,
  title: feature.title,
  description: feature.description,
}));
