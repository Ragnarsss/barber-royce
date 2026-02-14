export interface Service {
  name: string;
  description: string;
  price: string;
  duration: string;
  includes: string;
  image: string;
}

export const servicesList: Service[] = [
  {
    name: "CORTE DE CABELLO",
    description:
      "El clásico corte a nuestro estilo. Incluye asesoramiento completo, perfilado de cejas y diseños simples, finalizado con lavado de cabello y aplicación de productos.",
    price: "$4.000",
    duration: "45 min",
    includes: "Cortesia",
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
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
  },
];
