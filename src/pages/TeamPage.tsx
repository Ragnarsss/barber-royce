import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import styles from "./TeamPage.module.css";

export const TeamPage = () => {
  const team = [
    {
      name: "Carlos Mendoza",
      role: "Master Barber",
      experience: "15 años de experiencia",
      image: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&h=400&fit=crop",
      isLead: true,
    },
    {
      name: "Miguel Torres",
      role: "Senior Barber",
      experience: "10 años de experiencia",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop",
      isLead: false,
    },
    {
      name: "Juan Ramirez",
      role: "Barber Specialist",
      experience: "8 años de experiencia",
      image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop",
      isLead: false,
    },
    {
      name: "Roberto Silva",
      role: "Barber",
      experience: "5 años de experiencia",
      image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=400&fit=crop",
      isLead: false,
    },
    {
      name: "David Morales",
      role: "Barber",
      experience: "4 años de experiencia",
      image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop",
      isLead: false,
    },
  ];

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
