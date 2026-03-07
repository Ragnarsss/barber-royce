import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import styles from "./TeamPage.module.css";
import { teamMembersList } from "@/data/teamData";

export const TeamPage = () => {
  const team = teamMembersList;

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Nuestro Equipo de Barberos Profesionales | Royce Barbería</title>
        <meta name="description" content="Conoce a nuestro equipo de barberos expertos. Profesionales apasionados con años de experiencia en cortes clásicos y modernos, dedicados a tu mejor estilo." />
        <link rel="canonical" href="https://roycebarber.com/equipo" />
        <meta property="og:title" content="Equipo de Barberos Profesionales | Royce Barbería" />
        <meta property="og:description" content="Conoce a nuestros barberos expertos, apasionados por su oficio." />
        <meta property="og:url" content="https://roycebarber.com/equipo" />
      </Helmet>
      <div className={styles.hero}>
        <div className={styles.container}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Nuestro Equipo
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Profesionales apasionados por su oficio
          </motion.p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.hexGrid}>
            {team.map((member, index) => (
              <motion.div
                key={index}
                className={`${styles.hexWrapper} ${member.isLead ? styles.leadHex : ""}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={styles.hexCard}>
                  <div className={styles.hexShape}>
                    <div className={styles.hexImageContainer}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className={styles.hexImage}
                      />
                    </div>
                    <div className={styles.hexOverlay}>
                      <h3 className={styles.name}>{member.name}</h3>
                      <p className={styles.role}>{member.role}</p>
                      <p className={styles.experience}>{member.experience}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
