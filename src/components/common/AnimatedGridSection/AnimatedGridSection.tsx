import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallaxLayers } from "@/hooks/useParallaxLayers";
import {
    fadeInUp,
    scaleIn,
    staggerContainer,
} from "@/lib/animations";

interface AnimatedGridSectionProps<T> {
    id: string;
    className?: string;
    containerClassName?: string;
    headerClassName?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    gridClassName?: string;
    title: string;
    subtitle?: string;
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    enableParallax?: boolean;
}

// ✅ React 19: memo() eliminado - componente genérico ya optimizado
export function AnimatedGridSection<T>({
    id,
    className,
    containerClassName,
    headerClassName,
    titleClassName,
    subtitleClassName,
    gridClassName,
    title,
    subtitle,
    items,
    renderItem,
    enableParallax = true,
}: AnimatedGridSectionProps<T>) {
    const { ref, controls } = useScrollAnimation();
    const { ref: sectionRef, layers } = useParallaxLayers();

    return (
        <section id={id} className={className} ref={sectionRef}>
            <motion.div
                className={containerClassName}
                style={enableParallax ? { y: layers.slow.y } : undefined}
                ref={ref}
            >
                <motion.div
                    className={headerClassName}
                    initial="hidden"
                    animate={controls}
                    variants={fadeInUp}
                >
                    <h2 className={titleClassName}>{title}</h2>
                    {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
                </motion.div>

                <motion.div
                    className={gridClassName}
                    initial="hidden"
                    animate={controls}
                    variants={staggerContainer}
                >
                    {items.map((item, index) => (
                        <motion.div key={index} variants={scaleIn}>
                            {renderItem(item, index)}
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
