/**
 * Componente SEOHelmet reutilizable
 * DRY: Centraliza configuración de meta tags y elimina duplicación
 */

import { Helmet } from "react-helmet-async";
import { SITE } from "@/config/constants";
import type { RouteConfig } from "@/config/routes";
import { serializeJsonLd } from "@/seo/structuredData";

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

    /** Evita que los buscadores indexen la página (por ejemplo, la política de privacidad) */
    noindex?: boolean;

    /**
     * Datos estructurados (JSON-LD) de la página, uno o varios objetos (BR-006). Se generan con los mismos datos que
     * muestra la página (`src/seo/structuredData.ts`), nunca copiados a mano.
     */
    jsonLd?: object | readonly object[];
}

export const SEOHelmet = ({
    route,
    title,
    description,
    canonicalPath,
    ogImage,
    ogType = "website",
    noindex = false,
    jsonLd
}: SEOHelmetProps) => {
    // Usar route si está disponible, sino usar overrides
    const finalTitle = title || route?.title || SITE.name;
    const finalDescription = description || route?.description || SITE.description;
    const finalPath = canonicalPath || route?.path || "/";
    const finalCanonical = `${SITE.domain}${finalPath}`;
    const finalOgImage = ogImage || `${SITE.domain}/og-image.jpg`;
    const jsonLdBlocks: readonly object[] = jsonLd === undefined ? [] : Array.isArray(jsonLd) ? jsonLd : [jsonLd];

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <link rel="canonical" href={finalCanonical} />
            {noindex && <meta name="robots" content="noindex, follow" />}

            {/* Open Graph Meta Tags */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:url" content={finalCanonical} />
            <meta property="og:image" content={finalOgImage} />
            <meta property="og:site_name" content={SITE.name} />
            <meta property="og:locale" content={SITE.locale} />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalOgImage} />

            {/* Datos estructurados: un script por objeto (BR-006) */}
            {jsonLdBlocks.map((block, index) => (
                <script key={index} type="application/ld+json">
                    {serializeJsonLd(block)}
                </script>
            ))}
        </Helmet>
    );
};
