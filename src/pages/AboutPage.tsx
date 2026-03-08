import { motion } from "framer-motion";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Sparkles } from "lucide-react";
import { PageHero } from "@/components/common/PageHero/PageHero";
import { ABOUT_STORY, MISSION_VISION, VALUES, WHY_US } from "@/data/aboutData";
import { ROUTES } from "@/config/routes";
import styles from "./AboutPage.module.css";
import { sectionAnimation, fadeInLeft, fadeInRight, fadeInUpShort, defaultViewport } from "@/config/animations.config";

export const AboutPage = () => {
    const route = ROUTES.about;

    return (
        <div className={styles.page}>
            <SEOHelmet route={route} />

            <PageHero
                title="Nosotros"
                subtitle="Tradición, calidad y pasión por la barbería"
            />

            <div className={styles.content}>
                <div className={styles.container}>
                    {/* Nuestra Historia */}
                    <motion.section
                        className={styles.section}
                        variants={sectionAnimation}
                        initial="hidden"
                        whileInView="visible"
                        viewport={defaultViewport}
                    >
                        <h2 className={styles.sectionTitle}>Nuestra Historia</h2>
                        <div className={styles.storyContent}>
                            {ABOUT_STORY.paragraphs.map((paragraph, index) => (
                                <p key={index} className={styles.paragraph}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </motion.section>

                    {/* Misión y Visión */}
                    <div className={styles.missionVisionGrid}>
                        <motion.div
                            variants={fadeInLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={defaultViewport}
                        >
                            <Card className={styles.card}>
                                <CardContent className={styles.cardContent}>
                                    <div className={styles.cardIcon}><Target size={48} /></div>
                                    <h3 className={styles.cardTitle}>{MISSION_VISION.mission.title}</h3>
                                    <p className={styles.cardText}>
                                        {MISSION_VISION.mission.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            variants={fadeInRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={defaultViewport}
                        >
                            <Card className={styles.card}>
                                <CardContent className={styles.cardContent}>
                                    <div className={styles.cardIcon}><Sparkles size={48} /></div>
                                    <h3 className={styles.cardTitle}>{MISSION_VISION.vision.title}</h3>
                                    <p className={styles.cardText}>
                                        {MISSION_VISION.vision.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Nuestros Valores */}
                    <motion.section
                        className={styles.section}
                        variants={sectionAnimation}
                        initial="hidden"
                        whileInView="visible"
                        viewport={defaultViewport}
                    >
                        <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
                        <div className={styles.valuesGrid}>
                            {VALUES.map((value, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUpShort}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={defaultViewport}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className={styles.valueCard}>
                                        <CardContent className={styles.valueCardContent}>
                                            <div className={styles.valueIcon}><value.icon size={40} /></div>
                                            <h3 className={styles.valueTitle}>{value.title}</h3>
                                            <p className={styles.valueDescription}>{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Por qué Elegirnos */}
                    <motion.section
                        className={styles.section}
                        variants={sectionAnimation}
                        initial="hidden"
                        whileInView="visible"
                        viewport={defaultViewport}
                    >
                        <h2 className={styles.sectionTitle}>¿Por Qué Elegirnos?</h2>
                        <div className={styles.whyUsGrid}>
                            {WHY_US.map((item, index) => (
                                <div key={index} className={styles.whyUsItem}>
                                    <div className={styles.whyUsNumber}>{item.number}</div>
                                    <h3 className={styles.whyUsTitle}>{item.title}</h3>
                                    <p className={styles.whyUsText}>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </div>
        </div>
    );
};
