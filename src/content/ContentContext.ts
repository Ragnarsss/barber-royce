import { createContext } from "react";
import { bakedContent } from "./siteContent";
import type { SiteContent } from "./types";

/** El contenido vigente. Sin proveedor (por ejemplo en un test) vale el del build. */
export const ContentContext = createContext<SiteContent>(bakedContent);
