/**
 * Componente PageHero reutilizable
 * DRY: Elimina duplicación de hero section en todas las páginas
 */

import { motion } from "framer-motion";
import styles from "./PageHero.module.css";

interface PageHeroProps {
    title: string;
    subtitle: string;
    animated?: boolean;
}

export const PageHero = ({ title, subtitle, animated = true }: PageHeroProps) => {
    if (!animated) {
        return (
            <div className={styles.hero}>
                <div className={styles.container}>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.hero}>
            <div className={styles.container}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {title}
                </motion.h1>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {subtitle}
                </motion.p>
            </div>
        </div>
    );
};
