import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import styles from "./Loading.module.css";

// ✅ React 19: memo() eliminado - componente simple sin props
export function Loading() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 200);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className={styles.loadingContainer}>
            <div className={styles.logoContainer}>
                <div className={styles.spinner}>
                    <div className={styles.spinnerRing}></div>
                    <div className={styles.spinnerRing}></div>
                    <div className={styles.spinnerRing}></div>
                </div>
            </div>
            <div className={styles.progressContainer}>
                <Progress value={progress} className={styles.progressBar} />
                <p className={styles.loadingText}>Cargando...</p>
            </div>
        </div>
    );
}

Loading.displayName = "Loading";
