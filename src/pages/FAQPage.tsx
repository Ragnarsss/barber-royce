import { motion } from "framer-motion";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { PageHero } from "@/components/common/PageHero/PageHero";
import { FAQ_CATEGORIES, FAQ_LIST } from "@/data/faqData";
import { ROUTES } from "@/config/routes";
import { CONTACT } from "@/config/constants";
import styles from "./FAQPage.module.css";
import { useState } from "react";
import { sectionAnimation, fadeInUpShort, defaultViewport } from "@/config/animations.config";

export const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const route = ROUTES.faq;

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.page}>
            <SEOHelmet route={route} />

            <PageHero
                title="Preguntas Frecuentes"
                subtitle="Encuentra respuestas a las dudas más comunes"
            />

            <div className={styles.content}>
                <div className={styles.container}>
                    {FAQ_CATEGORIES.map((category) => (
                        <motion.section
                            key={category}
                            className={styles.categorySection}
                            variants={sectionAnimation}
                            initial="hidden"
                            whileInView="visible"
                            viewport={defaultViewport}
                        >
                            <h2 className={styles.categoryTitle}>{category}</h2>
                            <div className={styles.faqList}>
                                {FAQ_LIST
                                    .filter(faq => faq.category === category)
                                    .map((faq) => {
                                        const globalIndex = FAQ_LIST.findIndex(
                                            f => f.question === faq.question
                                        );
                                        const isOpen = openIndex === globalIndex;

                                        return (
                                            <motion.div
                                                key={globalIndex}
                                                variants={fadeInUpShort}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={defaultViewport}
                                            >
                                                <Card className={styles.faqCard}>
                                                    <button
                                                        className={styles.faqButton}
                                                        onClick={() => toggleFAQ(globalIndex)}
                                                        aria-expanded={isOpen}
                                                    >
                                                        <div className={styles.faqQuestion}>
                                                            <span className={styles.questionIcon}>
                                                                {isOpen ? "−" : "+"}
                                                            </span>
                                                            <span className={styles.questionText}>
                                                                {faq.question}
                                                            </span>
                                                        </div>
                                                    </button>
                                                    <motion.div
                                                        initial={false}
                                                        animate={{
                                                            height: isOpen ? "auto" : 0,
                                                            opacity: isOpen ? 1 : 0
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                            ease: "easeInOut"
                                                        }}
                                                        className={styles.faqAnswerWrapper}
                                                    >
                                                        <CardContent className={styles.faqAnswer}>
                                                            <p>{faq.answer}</p>
                                                        </CardContent>
                                                    </motion.div>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                            </div>
                        </motion.section>
                    ))}

                    {/* Contacto adicional */}
                    <motion.section
                        className={styles.contactSection}
                        variants={sectionAnimation}
                        initial="hidden"
                        whileInView="visible"
                        viewport={defaultViewport}
                    >
                        <Card className={styles.contactCard}>
                            <CardContent className={styles.contactContent}>
                                <h3 className={styles.contactTitle}>
                                    ¿No encontraste la respuesta que buscabas?
                                </h3>
                                <p className={styles.contactText}>
                                    Estamos aquí para ayudarte. Contáctanos directamente y resolveremos
                                    tus dudas de inmediato.
                                </p>
                                <div className={styles.contactButtons}>
                                    <a href={CONTACT.whatsapp.link} className={styles.contactButton} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle size={20} />
                                        Hablemos por WhatsApp
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.section>
                </div>
            </div>
        </div>
    );
};
