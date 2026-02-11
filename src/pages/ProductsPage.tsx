import styles from "./ProductsPage.module.css";

export const ProductsPage = () => {
  const products = [
    {
      name: "Pomada Premium",
      description: "Hold fuerte, acabado mate",
      price: "$25",
    },
    {
      name: "Cera Modeladora",
      description: "Control y flexibilidad",
      price: "$22",
    },
    {
      name: "Aceite para Barba",
      description: "Hidratación y brillo natural",
      price: "$18",
    },
    {
      name: "Shampoo Fortificante",
      description: "Limpieza profunda y fortalecimiento",
      price: "$20",
    },
    {
      name: "Bálsamo para Barba",
      description: "Suavidad y acondicionamiento",
      price: "$16",
    },
    {
      name: "Kit Completo",
      description: "Todos los esenciales para tu cuidado",
      price: "$75",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Productos Premium</h1>
          <p className={styles.subtitle}>
            Las mejores marcas para tu cuidado diario
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {products.map((product, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.imagePlaceholder}>Imagen</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.description}>{product.description}</p>
                  <div className={styles.footer}>
                    <span className={styles.price}>{product.price}</span>
                    <button className={styles.button}>Comprar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
