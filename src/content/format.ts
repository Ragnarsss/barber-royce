/** Pesos chilenos como los muestra el sitio: `4000` → `$4.000` (RN-01 de HU-CNT-001). */
export function formatClp(amount: number): string {
  return `$${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** Inversa de `formatClp`: `$15.000` → `15000`. Devuelve `NaN` si no es un monto. */
export function parseClp(text: string): number {
  const digits = text.replace(/[$.\s]/g, "");
  return /^\d+$/.test(digits) ? Number(digits) : Number.NaN;
}
