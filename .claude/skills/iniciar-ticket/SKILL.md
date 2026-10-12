---
name: iniciar-ticket
description: Arranca un ticket BR-NNN - lee su ficha, HU y requisitos, crea la rama, decide si los tests van antes o después según lo que toca y arma el esqueleto de tests desde los criterios de aceptación. Úsala con "empecemos BR-011", "arranca el ticket X", "¿cómo testeo esto?".
---

# Iniciar ticket

## 1. Ubicar el ticket

Lee la ficha completa en `docs/backlog.md`: prioridad, `Depende de`,
alcance y criterios de aceptación. Lee también la `HU-*` citada en
`docs/historias-usuario.md` (sus reglas de negocio no se repiten en la
ficha) y los `RF/RNF` en `docs/rf-rnf-catalogo.md` (su `CP-*` es el
criterio de verificación).

- Si una dependencia no está `Hecho`, avisa antes de seguir.
- Si el estado es `Bloqueada`, no arranques: reporta qué falta.

## 2. Rama

Desde `master` actualizado: `git checkout -b <tipo>/br-nnn-<descripcion>`
(`feat`, `fix`, `perf`, `refactor`, `docs`, `chore`, `ci`). Cambia la ficha
a `Estado: En curso`.

## 3. ¿Test antes o después?

Según `docs/engineering-guidelines.md` §1:

- **Lógica pura** (armar rutas desde `ROUTES`, generar el JSON-LD desde
  `src/config/`, un filtro, el cálculo de capas de parallax) → **test
  primero**, en rojo.
- **Bug** → test primero que lo reproduzca.
- **Componente de presentación** → test de render después, antes de
  cerrar.
- **Configuración** (`vercel.json`, CI, cabeceras) → sin test unitario; se
  verifica con su `CP-*` contra el preview. Dilo en el plan.
- **Rendimiento o accesibilidad** → la verificación es una medición
  (Lighthouse, Profiler, axe). Anota la medición **antes** del cambio como
  línea base.

## 4. ¿Triangulación?

Si un solo ejemplo no fuerza la regla real (la implementación podría
devolver una constante), lista al menos dos casos con entradas y
resultados distintos, sacados de los criterios Given/When/Then.

## 5. Esqueleto

Si aplica test primero: un caso por criterio de aceptación, con el
`CA-NN` o el `CP-*` en el nombre del test, todos en rojo. No escribas la
implementación en este paso.

## 6. Reportar el plan y esperar

Resume: dependencias, rama creada, clasificación (test antes/después o
medición), casos a cubrir y línea base medida si aplica. Espera la
confirmación del usuario antes de implementar, salvo que haya dicho
"arranca directo".
