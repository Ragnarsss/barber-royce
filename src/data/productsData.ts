export interface Product {
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
}

export const productCategories = ["Todos", "Styling", "Barba", "Cuidado", "Kits"];

export const productsList: Product[] = [
    {
        name: "Pomada Premium",
        description: "Hold fuerte, acabado mate. Perfecta para estilos estructurados que duran todo el día.",
        price: "$25",
        image: "https://images.unsplash.com/photo-1598661516337-0c6f02e93d4b?w=400&h=400&fit=crop",
        category: "Styling",
    },
    {
        name: "Cera Modeladora",
        description: "Control y flexibilidad. Ideal para estilos naturales con movimiento y textura.",
        price: "$22",
        image: "https://images.unsplash.com/photo-1621607512025-2ae6f13f30a3?w=400&h=400&fit=crop",
        category: "Styling",
    },
    {
        name: "Aceite para Barba",
        description: "Hidratación y brillo natural. Mantén tu barba suave, saludable y con aroma excepcional.",
        price: "$18",
        image: "https://images.unsplash.com/photo-1602900639260-e53828c1f5c6?w=400&h=400&fit=crop",
        category: "Barba",
    },
    {
        name: "Shampoo Fortificante",
        description: "Limpieza profunda y fortalecimiento. Fórmula especial para cabello y cuero cabelludo.",
        price: "$20",
        image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop",
        category: "Cuidado",
    },
    {
        name: "Bálsamo para Barba",
        description: "Suavidad y acondicionamiento. Control ligero con nutrición profunda para tu barba.",
        price: "$16",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
        category: "Barba",
    },
    {
        name: "Kit Completo",
        description: "Todos los esenciales para tu cuidado. El regalo perfecto o tu arsenal completo.",
        price: "$75",
        image: "https://images.unsplash.com/photo-1585155967594-63d48b6b0f39?w=400&h=400&fit=crop",
        category: "Kits",
    },
];
