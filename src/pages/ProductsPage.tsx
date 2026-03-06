import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import styles from "./ProductsPage.module.css";

export const ProductsPage = () => {
  const products = [
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

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Productos Premium
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Las mejores marcas para tu cuidado diario
          </motion.p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Card className={styles.card}>
                  {/* Etiqueta de categoría */}
                  <div className={styles.categoryBadge}>{product.category}</div>

                  {/* Imagen del producto */}
                  <div className={styles.imageContainer}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </div>

                  <CardContent className={styles.cardContent}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.description}>{product.description}</p>
                    <div className={styles.footer}>
                      <span className={styles.price}>{product.price}</span>
                      <button className={styles.button}>
                        <svg className={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Comprar
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
