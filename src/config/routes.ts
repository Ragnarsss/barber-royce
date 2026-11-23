/**
 * Configuración centralizada de rutas de la aplicación
 * DRY: Única fuente de verdad para navegación y SEO
 */

import { analyticsEnabled } from "@/analytics/enabled";

export interface RouteConfig {
    path: string;
    label: string;
    title: string; // Para <title> tag
    description: string; // Para meta description
    showInNav: boolean;
    showInFooter: boolean;
    /** false = la página lleva noindex y no va en el sitemap (por defecto, true) */
    indexable?: boolean;
    /** true = la página solo existe (y se enlaza) si hay alguna analítica configurada (BR-044) */
    requiresAnalytics?: boolean;
}

export const ROUTES: Record<string, RouteConfig> = {
    home: {
        path: "/",
        label: "INICIO",
        title: "Royce Barbería - Sucursales en Coquimbo y La Serena",
        description: "Elige tu sucursal de Royce Barbería, en Coquimbo o en La Serena. Cortes clásicos y modernos, afeitado tradicional y reserva de hora en línea.",
        showInNav: false,
        showInFooter: true,
    },
    // Una portada por sucursal (ADR-010, BR-106). El footer ya enlaza a `/`, desde donde se elige.
    coquimbo: {
        path: "/coquimbo",
        label: "COQUIMBO",
        title: "Royce Barbería Coquimbo - Cortes Premium y Estilo Clásico",
        description: "Barbería premium en Coquimbo. Cortes clásicos y modernos, afeitado tradicional con toalla caliente. Experiencia y calidad garantizada.",
        showInNav: false,
        showInFooter: false,
    },
    laSerena: {
        path: "/la-serena",
        label: "LA SERENA",
        title: "Royce Barbería La Serena - Cortes y Afeitado en un Espacio Sereno",
        description: "Barbería en La Serena: cortes clásicos y modernos, afeitado tradicional y una sala de madera, luz y plantas. Reserva tu hora en línea.",
        showInNav: false,
        showInFooter: false,
    },
    about: {
        path: "/nosotros",
        label: "NOSOTROS",
        title: "Sobre Nosotros - Nuestra Historia y Valores | Royce Barbería",
        description: "Conoce la historia de Royce Barbería, nuestros valores y compromiso con la excelencia. Barbería premium en Coquimbo con tradición y calidad.",
        showInNav: true,
        showInFooter: true,
    },
    team: {
        path: "/equipo",
        label: "TEAM",
        title: "Nuestro Equipo de Barberos Profesionales | Royce Barbería",
        description: "Conoce a nuestro equipo de barberos expertos. Profesionales apasionados con años de experiencia en cortes clásicos y modernos.",
        showInNav: true,
        showInFooter: true,
    },
    products: {
        path: "/productos",
        label: "PRODUCTOS",
        title: "Productos Premium para el Cuidado Masculino | Royce Barbería",
        description: "Descubre nuestra selección de productos premium: pomadas, ceras, aceites para barba y más. Calidad profesional para tu cuidado personal.",
        showInNav: true,
        showInFooter: true,
    },
    services: {
        path: "/servicios",
        label: "SERVICIOS",
        title: "Servicios Premium - Cortes, Afeitados y Tratamientos | Royce Barbería",
        description: "Descubre nuestros servicios de barbería premium: cortes clásicos y modernos, afeitado tradicional con toalla caliente, tratamientos capilares.",
        showInNav: true,
        showInFooter: true,
    },
    location: {
        path: "/ubicacion",
        label: "SUCURSALES",
        title: "Ubicación, Horarios y Contacto | Royce Barbería Coquimbo",
        description: "Visítanos en Coquimbo. Horarios, ubicación, mapa y datos de contacto. Agenda tu cita en la mejor barbería de la región.",
        showInNav: true,
        showInFooter: true,
    },
    privacy: {
        path: "/privacidad",
        label: "PRIVACIDAD",
        title: "Política de Privacidad y Cookies | Royce Barbería",
        description: "Qué datos recoge este sitio, para qué se usan y cómo puedes aceptar o rechazar la medición de visitas.",
        showInNav: false,
        showInFooter: true,
        indexable: false,
        requiresAnalytics: true,
    },
    faq: {
        path: "/preguntas-frecuentes",
        label: "FAQ",
        title: "Preguntas Frecuentes - Dudas sobre Servicios y Reservas | Royce Barbería",
        description: "Encuentra respuestas a las preguntas más frecuentes sobre nuestros servicios, reservas, horarios y precios.",
        showInNav: true,
        showInFooter: true,
    },
} as const;

// Helpers para obtener rutas filtradas
export const getNavRoutes = () =>
    Object.values(ROUTES).filter(route => route.showInNav);

export const getFooterRoutes = () =>
    Object.values(ROUTES).filter(route => route.showInFooter && (!route.requiresAnalytics || analyticsEnabled()));

export const getRouteByPath = (path: string) =>
    Object.values(ROUTES).find(route => route.path === path);
