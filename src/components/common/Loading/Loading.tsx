import styles from "./Loading.module.css";

// ✅ React 19: memo() eliminado - componente simple sin props
export function Loading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}>
                <div className={styles.spinnerRing}></div>
                <div className={styles.spinnerRing}></div>
                <div className={styles.spinnerRing}></div>
            </div>
            <p className={styles.loadingText}>Cargando...</p>
        </div>
    );
}

Loading.displayName = "Loading";
