import { motion } from "framer-motion";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/common/PageHero/PageHero";
import { ROUTES } from "@/config/routes";
import styles from "./TeamPage.module.css";
import { teamMembersList } from "@/data/teamData";
import { scaleIn, defaultViewport } from "@/config/animations.config";

export const TeamPage = () => {
  const team = teamMembersList;
  const route = ROUTES.team;

  return (
    <div className={styles.page}>
      <SEOHelmet route={route} />

      <PageHero
        title="Nuestro Equipo"
        subtitle="Profesionales apasionados por su oficio"
      />

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.hexGrid}>
            {team.map((member, index) => (
              <motion.div
                key={index}
                className={`${styles.hexWrapper} ${member.isLead ? styles.leadHex : ""}`}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                transition={{ delay: index * 0.1 }}
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
