/**
 * Datos de Preguntas Frecuentes
 * DRY: Separación de contenido y presentación
 */

import type { FAQ, FAQCategory } from "@/types/faq.types";
import { FAQ_CATEGORIES as FAQ_CATS } from "@/types/faq.types";

export const FAQ_CATEGORIES = FAQ_CATS;

export const FAQ_LIST: FAQ[] = [
    // Reservas y Horarios
    {
        category: "Reservas y Horarios",
        question: "¿Cómo puedo agendar una cita?",
        answer: "Puedes agendar tu cita llamando al teléfono de la barbería, por WhatsApp, o directamente en nuestras redes sociales. También aceptamos citas presenciales según disponibilidad."
    },
    {
        category: "Reservas y Horarios",
        question: "¿Cuál es el horario de atención?",
        answer: "Estamos abiertos de lunes a viernes de 10:00 a 20:00 horas, y los sábados de 10:00 a 18:00 horas. Los domingos permanecemos cerrados."
    },
    {
        category: "Reservas y Horarios",
        question: "¿Puedo cancelar o reprogramar mi cita?",
        answer: "Sí, puedes cancelar o reprogramar tu cita con al menos 24 horas de anticipación. Te pedimos que nos notifiques lo antes posible para poder ofrecer ese horario a otros clientes."
    },

    // Servicios
    {
        category: "Servicios",
        question: "¿Qué servicios ofrecen?",
        answer: "Ofrecemos una amplia gama de servicios: cortes clásicos y modernos, afeitado tradicional con toalla caliente, peinados, arreglo de barba, tratamientos capilares, y más. Consulta nuestra sección de servicios para ver el listado completo."
    },
    {
        category: "Servicios",
        question: "¿Utilizan productos de calidad?",
        answer: "Absolutamente. Trabajamos solo con productos premium de marcas reconocidas internacionalmente, garantizando los mejores resultados y cuidado para tu cabello y piel."
    },
    {
        category: "Servicios",
        question: "¿Cuánto tiempo dura cada servicio?",
        answer: "Un corte de cabello toma entre 30-45 minutos, mientras que el afeitado tradicional requiere unos 20-30 minutos. Los servicios combinados pueden tomar hasta una hora."
    },

    // Precios y Pagos
    {
        category: "Precios y Pagos",
        question: "¿Cuáles son los precios de los servicios?",
        answer: "Los precios varían según el servicio. Un corte de cabello comienza desde $10.000, el afeitado tradicional desde $8.000, y ofrecemos paquetes combinados con descuentos especiales. Contáctanos para más detalles."
    },
    {
        category: "Precios y Pagos",
        question: "¿Qué métodos de pago aceptan?",
        answer: "Aceptamos efectivo, tarjetas de débito y crédito, y transferencias electrónicas. También contamos con pago por aplicaciones móviles."
    },
    {
        category: "Precios y Pagos",
        question: "¿Ofrecen descuentos o promociones?",
        answer: "Sí, regularmente tenemos promociones especiales para clientes frecuentes y paquetes promocionales. Síguenos en redes sociales para estar al tanto de nuestras ofertas."
    },

    // Otros
    {
        category: "Otros",
        question: "¿Necesito llevar algo a mi primera visita?",
        answer: "No es necesario llevar nada especial. Solo asegúrate de llegar con el cabello limpio para obtener los mejores resultados. Si tienes alguna alergia o condición especial, por favor infórmanos con anticipación."
    },
    {
        category: "Otros",
        question: "¿Atienden a niños?",
        answer: "Sí, ofrecemos cortes para niños de todas las edades. Nuestros barberos tienen experiencia trabajando con los más pequeños en un ambiente amigable y paciente."
    },
    {
        category: "Otros",
        question: "¿Tienen estacionamiento?",
        answer: "Contamos con estacionamiento disponible cerca de nuestras instalaciones. También estamos bien ubicados con fácil acceso al transporte público."
    }
];

// Helper para obtener FAQs por categoría
export const getFAQsByCategory = (category: FAQCategory) =>
    FAQ_LIST.filter(faq => faq.category === category);

// Helper para buscar FAQs
export const searchFAQs = (query: string) =>
    FAQ_LIST.filter(faq =>
        faq.question.toLowerCase().includes(query.toLowerCase()) ||
        faq.answer.toLowerCase().includes(query.toLowerCase())
    );
