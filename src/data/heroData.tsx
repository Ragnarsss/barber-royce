import type { ReactElement } from "react";
import { heroBenefits } from "./heroData";


export const HERO_BENEFITS_VIEW_DATA: Array<{
  icon: ReactElement;
  text: string;
}> = heroBenefits.map((benefit) => ({
  icon: <benefit.icon size={24} />,
  text: benefit.text,
}));
