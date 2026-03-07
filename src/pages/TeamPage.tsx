import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import styles from "./TeamPage.module.css";
import { teamMembersList } from "@/data/teamData";

export const TeamPage = () => {
  const team = teamMembersList;

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
