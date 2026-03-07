import type { ReactElement } from "react";
import { benefitsList } from "./benefitsData";


export const BENEFITS_VIEW_DATA: Array<{
  icon: ReactElement;
  title: string;
  description: string;
}> = benefitsList.map((benefit) => ({
  icon: <benefit.icon size={32} />,
  title: benefit.title,
  description: benefit.description,
}));
