import type { ErrorInfo } from "react";

/**
 * Único punto donde se registran los errores de render (BR-019).
 * Hoy solo deja el error en la consola; si se agrega monitoreo
 * (backlog §4, "Monitoreo de errores"), se conecta aquí y en ningún otro lugar.
 */
export function reportError(error: unknown, info: ErrorInfo): void {
  console.error("Error de render capturado:", error);
  if (info.componentStack) {
    console.error("Pila de componentes:", info.componentStack);
  }
}
