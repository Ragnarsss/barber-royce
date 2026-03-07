export interface Location {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    whatsapp: string;
    mapUrl: string;
    schedule: Array<{
        day: string;
        hours: string;
    }>;
}

export const locationsList: Location[] = [
    {
        name: "Barber Royce Centro",
        address: "Av. Principal #123",
        city: "Centro, Ciudad",
        phone: "(123) 456-7890",
        email: "centro@barberroyce.com",
        whatsapp: "(123) 456-7890",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.955!2d-74.0817!3d4.6097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzYnMzUuMCJOIDc0wrAwNCc1NC4xIlc!5e0!3m2!1sen!2sco!4v1234567890",
        schedule: [
            { day: "Lunes - Viernes", hours: "9:00 AM - 8:00 PM" },
            { day: "Sábado", hours: "9:00 AM - 6:00 PM" },
            { day: "Domingo", hours: "10:00 AM - 4:00 PM" },
        ],
    },
    {
        name: "Barber Royce Norte",
        address: "Calle 123 #45-67",
        city: "Zona Norte, Ciudad",
        phone: "(123) 456-7891",
        email: "norte@barberroyce.com",
        whatsapp: "(123) 456-7891",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.512!2d-74.0719!3d4.6789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDAnNDQuMCJOIDc0wrAwNCcxOC44Ilc!5e0!3m2!1sen!2sco!4v1234567891",
        schedule: [
            { day: "Lunes - Viernes", hours: "10:00 AM - 9:00 PM" },
            { day: "Sábado", hours: "9:00 AM - 7:00 PM" },
            { day: "Domingo", hours: "10:00 AM - 5:00 PM" },
        ],
    },
    {
        name: "Barber Royce Sur",
        address: "Carrera 50 #10-20",
        city: "Zona Sur, Ciudad",
        phone: "(123) 456-7892",
        email: "sur@barberroyce.com",
        whatsapp: "(123) 456-7892",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.123!2d-74.0654!3d4.5234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzEnMjQuMiJOIDc0wrAwMyczOS40Ilc!5e0!3m2!1sen!2sco!4v1234567892",
        schedule: [
            { day: "Lunes - Viernes", hours: "9:00 AM - 8:00 PM" },
            { day: "Sábado", hours: "9:00 AM - 6:00 PM" },
            { day: "Domingo", hours: "Cerrado" },
        ],
    },
];
