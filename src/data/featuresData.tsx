import type { ReactElement } from "react";
import { featuresList } from "./featuresData";

export const FEATURES_VIEW_DATA: Array<{
  icon: ReactElement;
  title: string;
  description: string;
}> = featuresList.map((feature) => ({
  icon: <feature.icon size={36} />,
  title: feature.title,
  description: feature.description,
}));
