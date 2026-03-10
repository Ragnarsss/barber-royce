/**
 * Constantes de configuración de la aplicación
 * Centralizadas para facilitar mantenimiento y evitar duplicación
 */

// Información de contacto
export const CONTACT = {
    phone: {
        display: "(123) 456-7890",
        link: "tel:+1234567890",
    },
    whatsapp: {
        display: "+56 9 1234 5678",
        link: "https://api.whatsapp.com/send/?phone=56931094222&text=%C2%A1Hola%21+vi+tu+p%C3%A1gina+de+AgendaPro+y+me+gustar%C3%ADa+resolver+algunas+dudas&type=phone_number&app_absent=0",
    },
    email: {
        display: "info@barberroyce.com",
        link: "mailto:info@barberroyce.com",
    },
} as const;

// Horarios
export const SCHEDULE = {
    weekdays: "Lun - Vie: 10:00 - 20:00",
    saturday: "Sáb: 10:00 - 18:00",
    sunday: "Dom: Cerrado",
    display: "Lun - Sáb: 9:00 - 20:00",
} as const;

// Redes sociales
export const SOCIAL_MEDIA = {
    instagram: {
        url: "https://www.instagram.com/barberia.royce/",
        label: "Instagram",
    },
    facebook: {
        url: "https://facebook.com/barberroyce",
        label: "Facebook",
    },
    tiktok: {
        url: "https://www.tiktok.com/@barber.roycee",
        label: "TikTok",
    },
} as const;

// URLs y SEO
export const SITE = {
    name: "Royce Barbería",
    domain: "https://roycebarber.com",
    description: "Barbería premium en Coquimbo. Cortes clásicos y modernos, afeitado tradicional, tratamientos capilares de calidad.",
    tagline: "Estilo y elegancia para el hombre moderno",
} as const;

// Colores principales (para uso en JS si es necesario)
export const COLORS = {
    primary: "#d52323",
    primaryHover: "#fe0000",
    background: "#1a1a1a",
    sectionBg: "#332b2b",
    white: "#ffffff",
} as const;

// Dimensiones y breakpoints
export const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
} as const;

// Animaciones
export const ANIMATION = {
    duration: {
        fast: 0.2,
        normal: 0.3,
        slow: 0.6,
    },
    easing: {
        smooth: [0.4, 0, 0.2, 1],
        bounce: [0.68, -0.55, 0.265, 1.55],
    },
} as const;
