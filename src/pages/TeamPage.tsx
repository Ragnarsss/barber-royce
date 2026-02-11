import styles from "./TeamPage.module.css";

export const TeamPage = () => {
  const team = [
    {
      name: "Carlos Mendoza",
      role: "Master Barber",
      experience: "15 años de experiencia",
    },
    {
      name: "Miguel Torres",
      role: "Senior Barber",
      experience: "10 años de experiencia",
    },
    {
      name: "Juan Ramirez",
      role: "Barber Specialist",
      experience: "8 años de experiencia",
    },
    {
      name: "Roberto Silva",
      role: "Barber",
      experience: "5 años de experiencia",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Nuestro Equipo</h1>
          <p className={styles.subtitle}>
            Profesionales apasionados por su oficio
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {team.map((member, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.photo}>
                  <span>{member.name.charAt(0)}</span>
                </div>
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
                <p className={styles.experience}>{member.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
