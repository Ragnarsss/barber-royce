/**
 * Configuración centralizada de rutas de la aplicación
 * DRY: Única fuente de verdad para navegación y SEO
 */

export interface RouteConfig {
    path: string;
    label: string;
    title: string; // Para <title> tag
    description: string; // Para meta description
    showInNav: boolean;
    showInFooter: boolean;
}

export const ROUTES: Record<string, RouteConfig> = {
    home: {
        path: "/",
        label: "INICIO",
        title: "Royce Barbería - Cortes Premium y Estilo Clásico en Coquimbo",
        description: "Barbería premium en Coquimbo. Cortes clásicos y modernos, afeitado tradicional con toalla caliente. Experiencia y calidad garantizada.",
        showInNav: false,
        showInFooter: true,
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
        label: "UBICACIÓN Y HORARIOS",
        title: "Ubicación, Horarios y Contacto | Royce Barbería Coquimbo",
        description: "Visítanos en Coquimbo. Horarios, ubicación, mapa y datos de contacto. Agenda tu cita en la mejor barbería de la región.",
        showInNav: true,
        showInFooter: true,
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
    Object.values(ROUTES).filter(route => route.showInFooter);

export const getRouteByPath = (path: string) =>
    Object.values(ROUTES).find(route => route.path === path);
