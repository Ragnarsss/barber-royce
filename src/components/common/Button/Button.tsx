import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

/**
 * Props del componente Button
 *
 * @param variant - Estilo visual del botón: primary (default), secondary, accent, outline, ghost
 * @param size - Tamaño del botón: small, medium (default), large
 * @param fullWidth - Si el botón ocupa todo el ancho disponible
 * @param loading - Muestra estado de carga con spinner
 * @param leftIcon - Ícono a la izquierda del texto
 * @param rightIcon - Ícono a la derecha del texto
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export const Button = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {leftIcon && !loading && <span className={styles.icon}>{leftIcon}</span>}
      {children}
      {rightIcon && !loading && (
        <span className={styles.icon}>{rightIcon}</span>
      )}
    </button>
  );
};
