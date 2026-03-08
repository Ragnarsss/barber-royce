/**
 * Componente SEOHelmet reutilizable
 * DRY: Centraliza configuración de meta tags y elimina duplicación
 */

import { Helmet } from "react-helmet-async";
import { SITE } from "@/config/constants";
import type { RouteConfig } from "@/config/routes";

interface SEOHelmetProps {
    /** Configuración de ruta desde ROUTES */
    route?: RouteConfig;

    /** Override manual para casos especiales */
    title?: string;
    description?: string;
    canonicalPath?: string;

    /** Imagen para Open Graph */
    ogImage?: string;

    /** Tipo de contenido Open Graph */
    ogType?: "website" | "article" | "profile";
}

export const SEOHelmet = ({
    route,
    title,
    description,
    canonicalPath,
    ogImage,
    ogType = "website"
}: SEOHelmetProps) => {
    // Usar route si está disponible, sino usar overrides
    const finalTitle = title || route?.title || SITE.name;
    const finalDescription = description || route?.description || SITE.description;
    const finalPath = canonicalPath || route?.path || "/";
    const finalCanonical = `${SITE.domain}${finalPath}`;
    const finalOgImage = ogImage || `${SITE.domain}/og-image.jpg`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <link rel="canonical" href={finalCanonical} />

            {/* Open Graph Meta Tags */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:url" content={finalCanonical} />
            <meta property="og:image" content={finalOgImage} />
            <meta property="og:site_name" content={SITE.name} />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalOgImage} />
        </Helmet>
    );
};
