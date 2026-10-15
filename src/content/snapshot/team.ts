import type { TeamMember } from "@/types/team.types";

/*
 * Especialidades, descripción, frase y trabajos son textos de ejemplo (BR-063, decisión del usuario del
 * 2026-10-14): el dueño los reemplaza en la hoja. Los trabajos reutilizan fotos de Unsplash del sitio, porque la
 * política de seguridad solo admite imágenes de ese dominio. Sin Instagram de ejemplo: un usuario inventado podría
 * ser la cuenta real de otra persona.
 */
export const teamMembersList: TeamMember[] = [
    {
        name: "Carlos Mendoza",
        role: "Master Barber",
        experience: "15 años de experiencia",
        image: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&h=400&fit=crop",
        isLead: true,
        specialties: ["Fade", "Barba", "Navaja", "Asesoría de estilo"],
        description:
            "Fundó la barbería y forma a cada barbero del equipo. Es el indicado para un cambio de estilo completo: te escucha, propone según tu tipo de cabello y deja el corte listo para que lo peines en dos minutos.",
        bookingUrl: "",
        instagram: "",
        works: [
            "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
        ],
        quote: "Un buen corte se nota cuando te levantas al día siguiente.",
    },
    {
        name: "Miguel Torres",
        role: "Senior Barber",
        experience: "10 años de experiencia",
        image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop",
        isLead: false,
        specialties: ["Corte clásico", "Barba", "Toalla caliente"],
        description:
            "Domina los cortes clásicos con tijera y el arreglo de barba tradicional, con toalla caliente y navaja. Ideal si buscas un look sobrio que dure.",
        bookingUrl: "",
        instagram: "",
        works: [
            "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop",
        ],
        quote: "Los clásicos no pasan de moda.",
    },
    {
        name: "Juan Ramirez",
        role: "Barber Specialist",
        experience: "8 años de experiencia",
        image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop",
        isLead: false,
        specialties: ["Diseños", "Colorimetría", "Fade"],
        description:
            "Se especializa en diseños con máquina y en color: desde un detalle en la nuca hasta un decolorado completo.",
        bookingUrl: "",
        instagram: "",
        works: [
            "https://images.unsplash.com/photo-1534438097545-9c89c82d5f7a?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1599351431653-4c7ff2f9f8b7?w=400&h=300&fit=crop",
        ],
        quote: "Si lo imaginas, lo dibujamos.",
    },
    {
        name: "Roberto Silva",
        role: "Barber",
        experience: "5 años de experiencia",
        image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=400&fit=crop",
        isLead: false,
        specialties: ["Fade", "Corte con tijera"],
        description: "Preciso con los degradados y paciente con los detalles. Recomendado para tu primera visita.",
        bookingUrl: "",
        instagram: "",
        works: [],
        quote: "",
    },
    {
        name: "David Morales",
        role: "Barber",
        experience: "4 años de experiencia",
        image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop",
        isLead: false,
        specialties: ["Corte infantil", "Perfilado de barba"],
        description: "Atiende a los más chicos con calma y deja la barba perfilada en pocos minutos.",
        bookingUrl: "",
        instagram: "",
        works: [],
        quote: "",
    },
];
