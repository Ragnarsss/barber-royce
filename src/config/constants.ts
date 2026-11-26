/**
 * Constantes de configuración de la aplicación
 * Centralizadas para facilitar mantenimiento y evitar duplicación
 */
import type { Branch } from "./branches";

// Información de contacto
export const CONTACT = {
    phone: {
        display: "(123) 456-7890",
        link: "tel:1234567890",
    },
    whatsapp: {
        display: "+56 9 3109 4222",
        link: "https://api.whatsapp.com/send/?phone=56931094222&text=%C2%A1Hola%21+vi+tu+p%C3%A1gina+de+agenda+y+me+gustar%C3%ADa+resolver+algunas+dudas&type=phone_number&app_absent=0",
    },
    email: {
        display: "info@barberroyce.com",
        link: "mailto:info@barberroyce.com",
    },
} as const;

// WhatsApp: número y mensaje con que se arma el enlace de `CONTACT.whatsapp.link` (BR-048). La hoja puede
// cambiar uno u otro; lo que no cambie usa estos valores.
export const WHATSAPP_DEFAULTS = {
    number: "56931094222",
    message: "¡Hola! vi tu página de agenda y me gustaría resolver algunas dudas",
} as const;

// Reserva (AgendaPro, ADR-001). Fuente única: BR-005 migra los demás CTAs aquí.
export const BOOKING = {
    url: "https://roycespa.site.agendapro.com/cl/sucursal/400965",
    label: "Reservar hora",
} as const;

// Reserva de cada sucursal (BR-103, ADR-010). Coquimbo es el enlace de siempre; La Serena tiene el suyo. Son los valores
// de respaldo de la columna `reserva` de la pestaña `sucursales`; el sitio los lee con `useBookingUrl()`.
export const BOOKING_URL_BY_BRANCH = {
    coquimbo: BOOKING.url,
    "la-serena": "https://roycespa.site.agendapro.com/cl/sucursal/98243",
} as const satisfies Record<Branch, string>;

// Horarios: los mismos en Coquimbo y La Serena, confirmados por el dueño (BR-005, 2026-11-26). `display` es el que
// muestra el pie y cabe en los 40 caracteres que admite la hoja.
export const SCHEDULE = {
    weekdays: "Lun - Vie: 10:00 - 20:00",
    saturday: "Sáb: 09:00 - 20:00",
    sunday: "Dom: Cerrado",
    display: "Lun-Vie 10:00-20:00 · Sáb 09:00-20:00",
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
    // El hero dibuja la marca en dos partes (BR-050); no se edita desde la hoja.
    brand: { prefix: "Barbería", name: "Royce" },
    domain: "https://roycebarber.com",
    // Idioma y país de `og:locale` (BR-006): el sitio es de Chile, no de España (`es_ES`).
    locale: "es_CL",
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
