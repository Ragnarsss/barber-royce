import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallaxProgress, useSlowLayer } from "@/hooks/useParallaxLayers";
import { fadeInUp, scaleIn, staggerContainer } from "@/config/animations.config";
import { CardCarousel } from "@/components/common/CardCarousel/CardCarousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA } from "@/config/breakpoints";


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
    /** Con `false`, el parallax del contenedor solo existe en escritorio (en móvil bajaba y cortaba la última tarjeta del carrusel). */
    parallaxOnMobile?: boolean;
    /** Si se indica, en móvil la grilla pasa a ser un carrusel con snap con este nombre (BR-070). */
    carouselLabel?: string;
    /** Con `carouselLabel`, si se indica el carrusel también existe en escritorio con tantas tarjetas visibles (BR-073). */
    carouselDesktopVisible?: number;
}

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
    parallaxOnMobile = true,
    carouselLabel,
    carouselDesktopVisible,
}: AnimatedGridSectionProps<T>) {
    const { ref, controls } = useScrollAnimation();
    const { ref: sectionRef, scrollYProgress } = useParallaxProgress();
    const layers = { slow: useSlowLayer(scrollYProgress) };
    const isDesktop = useMediaQuery(MEDIA.desktop);
    const parallax = enableParallax && (isDesktop || parallaxOnMobile);

    const grid = (
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
    );

    return (
        <section id={id} className={className} ref={sectionRef}>
            <motion.div
                className={containerClassName}
                style={parallax ? { y: layers.slow.y } : undefined}
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

                {carouselLabel ? (
                    <CardCarousel label={carouselLabel} desktopVisible={carouselDesktopVisible}>
                        {grid}
                    </CardCarousel>
                ) : (
                    grid
                )}
            </motion.div>
        </section>
    );
}
