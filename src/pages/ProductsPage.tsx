import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./ProductsPage.module.css";
import { productsList, productCategories } from "@/data/productsData";
import { SearchIcon } from "@/components/icons";

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // ✅ React 19: useTransition para filtrado no bloqueante
  // Mantiene input responsive durante filtrado pesado (INP optimization)
  const [isPending, startTransition] = useTransition();

  // Filtrar productos
  const filteredProducts = productsList.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ✅ React 19: Actualización en transición para búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Actualización inmediata del input (no bloqueante)
    startTransition(() => {
      setSearchTerm(value);
    });
  };

  // ✅ React 19: Actualización en transición para categoría
  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  };

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Productos Premium para el Cuidado del Cabello | Royce Barbería</title>
        <meta name="description" content="Descubre nuestra selección de productos premium para el cuidado del cabello y barba. Pomadas, ceras, aceites y más productos profesionales de las mejores marcas." />
        <link rel="canonical" href="https://roycebarber.com/productos" />
        <meta property="og:title" content="Productos Premium de Barbería | Royce Barbería" />
        <meta property="og:description" content="Productos profesionales para el cuidado del cabello y barba." />
        <meta property="og:url" content="https://roycebarber.com/productos" />
      </Helmet>
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

      {/* Sección de filtros y búsqueda */}
      <div className={styles.filtersSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.filtersContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ opacity: isPending ? 0.6 : 1 }}
          >
            {/* Barra de búsqueda */}
            <div className={styles.searchBar}>
              <SearchIcon className={styles.searchIcon} />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
            </div>

            {/* Filtros de categoría */}
            <div className={styles.categoryFilters}>
              {productCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={styles.categoryButton}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container} style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          {filteredProducts.length === 0 ? (
            <motion.div
              className={styles.noResults}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            </motion.div>
          ) : (
            <div className={styles.grid}>
              {filteredProducts.map((product, index) => (
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
                        <Button className={styles.button}>
                          <svg className={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                          Comprar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
