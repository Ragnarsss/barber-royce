import type { Location } from "@/types/location.types";

export const locationsList: Location[] = [
    {
        name: "Barbería Royce La Serena",
        address: "Larrain Alcalde 3108",
        city: "Pampa Baja, La Serena",
        phone: "+56 9 2087 2985",
        email: "centro@barberroyce.com",
        whatsapp: "+56 9 2087 2985",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d260.28748127856596!2d-71.25439871893751!3d-29.92929095044256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9691ca4f834edc25%3A0xfaf18cbab9f18e93!2sLarrain%20Alcalde%203108%2C%201700000%20La%20Serena%2C%20Coquimbo!5e1!3m2!1ses!2scl!4v1772945276663!5m2!1ses!2scl",
        schedule: [
            { day: "Lunes - Viernes", hours: "09:00 - 20:00" },
            { day: "Sábado", hours: "09:00 - 20:00" },
            { day: "Domingo", hours: "Cerrado" },
        ],
    },

    {
        name: "Barbería Royce Coquimbo",
        address: "Pdte. Alessandri 1871",
        city: "San Ramón, Coquimbo",
        phone: "+56 9 3109 4222",
        email: "norte@barberroyce.com",
        whatsapp: "+56 9 3109 4222",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.512!2d-74.0719!3d4.6789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDAnNDQuMCJOIDc0wrAwNCcxOC44Ilc!5e0!3m2!1sen!2sco!4v1234567891",
        schedule: [
            { day: "Lunes - Viernes", hours: "09:00 - 20:00" },
            { day: "Sábado", hours: "09:00 - 20:00" },
            { day: "Domingo", hours: "Cerrado" },
        ],
    },
];
