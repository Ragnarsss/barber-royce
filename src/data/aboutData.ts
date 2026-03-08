/**
 * Datos de la página "Nosotros"
 * DRY: Separación de contenido y presentación
 */

import { Star, Scissors, User, Heart } from "lucide-react";
import type { Value, WhyUsItem } from "@/types/about.types";

// Historia de la barbería
export const ABOUT_STORY = {
    paragraphs: [
        "Royce Barbería nació de la pasión por el arte clásico de la barbería y el deseo de ofrecer una experiencia premium a nuestros clientes. Desde nuestros inicios, hemos mantenido un compromiso inquebrantable con la excelencia y la atención personalizada.",
        "Ubicados en Coquimbo, nos hemos convertido en un referente de estilo y calidad, combinando técnicas tradicionales con las últimas tendencias en cortes y cuidado personal. Cada detalle está pensado para brindarte una experiencia única."
    ]
} as const;

// Misión y Visión
export const MISSION_VISION = {
    mission: {
        title: "Nuestra Misión",
        description: "Brindar servicios de barbería de excelencia, combinando técnicas tradicionales con innovación moderna, para que cada cliente se sienta único y seguro de su estilo."
    },
    vision: {
        title: "Nuestra Visión",
        description: "Ser la barbería de referencia en la región, reconocida por nuestro profesionalismo, calidad de servicio y por crear experiencias memorables para cada cliente."
    }
} as const;

// Valores corporativos
export const VALUES: Value[] = [
    {
        title: "Excelencia",
        description: "Nos esforzamos por ofrecer servicios de la más alta calidad en cada visita.",
        icon: Star
    },
    {
        title: "Tradición",
        description: "Respetamos las técnicas clásicas de barbería mientras innovamos con tendencias modernas.",
        icon: Scissors
    },
    {
        title: "Atención Personalizada",
        description: "Cada cliente es único y merece un servicio adaptado a sus necesidades.",
        icon: User
    },
    {
        title: "Pasión",
        description: "Amamos lo que hacemos y se refleja en cada corte que realizamos.",
        icon: Heart
    }
];

// Por qué elegirnos
export const WHY_US: WhyUsItem[] = [
    {
        number: "01",
        title: "Profesionales Capacitados",
        description: "Nuestro equipo cuenta con años de experiencia y capacitación constante."
    },
    {
        number: "02",
        title: "Productos Premium",
        description: "Utilizamos solo productos de la más alta calidad para tu cuidado personal."
    },
    {
        number: "03",
        title: "Ambiente Único",
        description: "Un espacio diseñado para tu comodidad y relajación en cada visita."
    }
];
