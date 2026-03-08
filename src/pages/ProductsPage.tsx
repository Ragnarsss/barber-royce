import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/common/PageHero/PageHero";
import { ROUTES } from "@/config/routes";
import styles from "./ProductsPage.module.css";
import { productsList, productCategories } from "@/data/productsData";
import { SearchIcon } from "@/components/icons";
import { fadeInUpShort, staggerFast, cardAnimation } from "@/config/animations.config";

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const route = ROUTES.products;

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
        <title>{route.title}</title>
        <meta name="description" content={route.description} />
        <link rel="canonical" href={`https://roycebarber.com${route.path}`} />
        <meta property="og:title" content={route.title} />
        <meta property="og:description" content={route.description} />
        <meta property="og:url" content={`https://roycebarber.com${route.path}`} />
      </Helmet>

      <PageHero
        title="Productos Premium"
        subtitle="Las mejores marcas para tu cuidado diario"
      />

      {/* Sección de filtros y búsqueda */}
      <div className={styles.filtersSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.filtersContainer}
            variants={fadeInUpShort}
            initial="hidden"
            animate="visible"
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
                <motion.button
                  key={category}
                  className={`${styles.filterButton} ${selectedCategory === category ? styles.filterButtonActive : ''}`}
                  onClick={() => handleCategoryChange(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Separador con gradiente */}
            <div className={styles.filterSeparator} />
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
            <motion.div
              className={styles.grid}
              key={`${selectedCategory}-${searchTerm}`}
              variants={staggerFast}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={`${selectedCategory}-${product.name}-${index}`}
                  variants={cardAnimation}
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
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
