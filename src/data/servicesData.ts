import type { Service } from "@/types/service.types";
import { SERVICE_CATEGORIES } from "@/types/service.types";

export const serviceCategories = SERVICE_CATEGORIES;

export const servicesList: Service[] = [
  {
    name: "CORTE DE CABELLO",
    description:
      "El clásico corte a nuestro estilo. Incluye asesoramiento completo, perfilado de cejas y diseños simples, finalizado con lavado de cabello y aplicación de productos.",
    price: "$4.000",
    duration: "45 min",
    includes: "Cortesia",
    category: "Corte de Cabello",
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop",
  },
  {
    name: "CORTE + BARBA",
    description:
      "Servicio completo de corte y arreglo de barba profesional. Incluye perfilado, diseño y acabado impecable con productos premium.",
    price: "$6.000",
    duration: "60 min",
    includes: "Cortesia",
    category: "Barba",
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop",
  },
  {
    name: "AFEITADO PREMIUM",
    description:
      "Experiencia de afeitado con toallas calientes, productos de alta calidad y técnicas tradicionales para un acabado perfecto.",
    price: "$5.000",
    duration: "40 min",
    includes: "Cortesia",
    category: "Barba",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop",
  },
  {
    name: "DISEÑO DE BARBA",
    description:
      "Perfilado y diseño personalizado de barba según tu estilo. Incluye recorte, delineado y aplicación de productos.",
    price: "$3.500",
    duration: "30 min",
    includes: "Cortesia",
    category: "Barba",
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
  },
  {
    name: "CORTE FADE",
    description:
      "Degradado profesional con transiciones perfectas. Estilo moderno y fresco que realza tus rasgos con técnicas avanzadas de barbería.",
    price: "$4.500",
    duration: "50 min",
    includes: "Cortesia",
    category: "Corte de Cabello",
    image:
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop",
  },
  {
    name: "TRATAMIENTO CAPILAR",
    description:
      "Revitaliza tu cabello con productos profesionales. Incluye masaje, hidratación profunda y tratamiento personalizado según tu tipo de cabello.",
    price: "$7.000",
    duration: "55 min",
    includes: "Cortesia",
    category: "Otros",
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=300&fit=crop",
  },
  {
    name: "TINTURA & COLOR",
    description:
      "Cambio de look completo con tintes profesionales. Asesoramiento de color personalizado y aplicación experta para un resultado impecable.",
    price: "$8.000",
    duration: "90 min",
    includes: "Cortesia",
    category: "Colorimetría",
    image:
      "https://images.unsplash.com/photo-1534438097545-9c89c82d5f7a?w=400&h=300&fit=crop",
  },
  {
    name: "DEPILACIÓN FACIAL",
    description:
      "Eliminación profesional de vello facial con técnicas suaves. Incluye preparación de la piel y productos calmantes post-tratamiento.",
    price: "$3.000",
    duration: "25 min",
    includes: "Cortesia",
    category: "Otros",
    image:
      "https://images.unsplash.com/photo-1599351431653-4c7ff2f9f8b7?w=400&h=300&fit=crop",
  },
  {
    name: "MASAJE CAPILAR",
    description:
      "Relajación total con masaje especializado del cuero cabelludo. Estimula la circulación y proporciona un momento de bienestar absoluto.",
    price: "$2.500",
    duration: "20 min",
    includes: "Cortesia",
    category: "Otros",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
  },
  {
    name: "PAQUETE VIP",
    description:
      "Experiencia completa de barbería premium. Incluye corte, barba, afeitado, tratamiento capilar y masaje. El servicio definitivo para el caballero moderno.",
    price: "$12.000",
    duration: "120 min",
    includes: "Cortesia",
    category: "Otros",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop",
  },
  {
    name: "CORTE INFANTIL",
    description:
      "Corte especial para los más pequeños en ambiente amigable. Servicio rápido y profesional con paciencia y experiencia en el trato con niños.",
    price: "$3.000",
    duration: "30 min",
    includes: "Cortesia",
    category: "Corte de Cabello",
    image:
      "https://images.unsplash.com/photo-1621605815854-b7e2c0e0b0f8?w=400&h=300&fit=crop",
  },
  {
    name: "PERFILADO CEJAS",
    description:
      "Diseño y perfilado profesional de cejas. Define tu mirada con técnicas precisas que realzan tus facciones de forma natural.",
    price: "$2.000",
    duration: "15 min",
    includes: "Cortesia",
    category: "Otros",
    image:
      "https://images.unsplash.com/photo-1622287162716-f311baa16138?w=400&h=300&fit=crop",
  },
  {
    name: "ALISADO EXPRESS",
    description:
      "Tratamiento alisador temporal para cabello rebelde. Resultados inmediatos con productos profesionales que mantienen el brillo natural.",
    price: "$6.500",
    duration: "70 min",
    includes: "Cortesia",
    category: "Colorimetría",
    image:
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop",
  },
  {
    name: "BARBOTERAPIA",
    description:
      "Tratamiento especializado para barba con aceites nutritivos. Hidratación profunda, suavidad y aroma excepcional para tu barba.",
    price: "$4.500",
    duration: "35 min",
    includes: "Cortesia",
    category: "Barba",
    image:
      "https://images.unsplash.com/photo-1621607510918-6c2e45f0c23f?w=400&h=300&fit=crop",
  },
  {
    name: "RETOQUE EXPRESS",
    description:
      "Servicio rápido de mantenimiento para cuando tienes poco tiempo. Incluye retoque de contornos, patillas y ajustes menores.",
    price: "$2.500",
    duration: "20 min",
    includes: "Cortesia",
    category: "Otros",
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop",
  },
];
