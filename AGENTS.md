# AGENTS.md — Catálogo de skills y agentes de barber-royce

Índice de la automatización disponible para trabajar en este repo con
Claude Code, y cuándo usar cada pieza. No repite convenciones: esas viven
en [`CLAUDE.md`](./CLAUDE.md) y en
[`docs/engineering-guidelines.md`](./docs/engineering-guidelines.md).

## Skills (`.claude/skills/`)

Procedimientos que disparas tú (`/nombre-skill` o pidiéndolo en lenguaje
natural). Trabajan contigo en el loop: cada paso irreversible (commit,
marcar `Hecho`, tocar el backlog) queda bajo tu OK.

| Skill | Cuándo usarla | Qué hace |
|---|---|---|
| [`analisis-requerimientos`](.claude/skills/analisis-requerimientos/SKILL.md) | Describes una necesidad o un pedido del dueño, todavía sin forma de ticket. | Redacta o amplía HU, CU y RF/RNF, y genera los tickets vía `nuevo-ticket`. |
| [`nuevo-ticket`](.claude/skills/nuevo-ticket/SKILL.md) | "Agrega un ticket para X", "anota este bug". | Crea la ficha `BR-NNN` con el formato estándar; si falta la HU o el requisito, los escribe primero. |
| [`iniciar-ticket`](.claude/skills/iniciar-ticket/SKILL.md) | "Empecemos BR-011". | Lee ficha, HU y requisitos; crea la rama; decide test antes/después o medición; arma el esqueleto de tests y anota la línea base. |
| [`cerrar-ticket`](.claude/skills/cerrar-ticket/SKILL.md) | "Cerrar BR-003", "¿ya está Hecho?". | Checklist de la DoD: lint, build, tests, criterios en el preview, Lighthouse si aplica, trazabilidad, backlog, registro, commits y PR. |
| [`verificar-despliegue`](.claude/skills/verificar-despliegue/SKILL.md) | "¿Podemos desplegar?", antes de integrar un PR grande o revisar producción. | Bloqueantes P0, rutas, 404, cabeceras, datos del negocio, SEO, Lighthouse y plan de rollback. Termina con un veredicto. |
| [`diseno-visual`](.claude/skills/diseno-visual/SKILL.md) | "Mejoremos la sección X", "hazlo más llamativo", micro-interacciones, fondos, loaders. | Rol de diseñador de marketing: diagnóstico, tres direcciones con recomendación, ticket, línea base, implementación con las reglas del proyecto (tokens, `MotionValue`, reduced motion, destellos) y verificación. |
| [`svg-workflow`](.claude/skills/svg-workflow/SKILL.md) | Agregar, animar o revisar un SVG (trazo que se dibuja, neón, scroll). | Origen y limpieza, en línea o imagen estática, técnicas de animación, accesibilidad y test de validación. |

## Agentes de solo lectura (`.claude/agents/`)

Auditorías que no modifican nada: pueden correr en paralelo, en
segundo plano o con `/loop`, sin supervisión paso a paso. Reportan; el
arreglo lo decides tú (normalmente con `nuevo-ticket`).

| Agente | Qué audita | Cuándo |
|---|---|---|
| [`calidad-codigo-auditor`](.claude/agents/calidad-codigo-auditor.md) | Revisión senior en 4 dimensiones (diseño, robustez, prácticas del stack instalado, tests y arquitectura), acotada a lo que cambió. | Al cerrar un ticket o un lote. |
| [`datos-negocio-auditor`](.claude/agents/datos-negocio-auditor.md) | Teléfonos, WhatsApp, email, horarios, redes, sucursales y URL de reserva: fuente única y coincidencia con `index.html`, JSON-LD, sitemap y manifest. Datos de ejemplo. | Antes de cada despliegue; tras tocar contacto o SEO. |
| [`seo-performance-auditor`](.claude/agents/seo-performance-auditor.md) | Ruta crítica del LCP, imágenes, re-renders por scroll, parallax, CSS diferido, metadatos, sitemap. | Al cerrar tickets de las épicas E, F, G; antes de desplegar. |
| [`accesibilidad-auditor`](.claude/agents/accesibilidad-auditor.md) | WCAG 2.1 AA en el código: semántica, `alt`, nombres accesibles, menú móvil, acordeón, pestañas, foco, reduced motion, texto de la UI. | Al tocar componentes interactivos; antes de desplegar. |
| [`design-tokens-auditor`](.claude/agents/design-tokens-auditor.md) | ADR-002: hex fuera de tokens, tokens duplicados, restos de Tailwind, breakpoints, CSS Modules cruzados. | Al cerrar tickets de la épica D; tras cambios visuales. |
| [`deuda-tecnica-auditor`](.claude/agents/deuda-tecnica-auditor.md) | TODO sin ticket, diferidos vencidos, código muerto, dependencias sin uso o fantasma, `any`, deprecaciones. | Periódico; al cerrar una épica. |
| [`backlog-governance`](.claude/agents/backlog-governance.md) | Fichas sin HU o RF/RNF reales, IDs y tablero desincronizados, `Hecho` sin registro, este catálogo desincronizado de `.claude/`. | Periódico; antes de cerrar una épica. |

## Por qué esta división

- **Skill** cuando el resultado necesita tu OK explícito en cada paso: un
  commit, marcar un ticket `Hecho`, editar el backlog, decidir si se
  despliega.
- **Agente de solo lectura** cuando es una auditoría: no hay nada
  irreversible que confirmar, así que puede correr solo y en paralelo.
- **Agentes con `model: sonnet`** para auditorías mecánicas y acotadas;
  `calidad-codigo-auditor` usa el modelo de la sesión porque requiere
  criterio.

## Origen

Adaptado de *Segunda Opinión de Build* (2026-10-12). Se tomaron
`nuevo-ticket`, `analisis-requerimientos`, `cerrar-ticket`,
`iniciar-ticket-tdd` (aquí `iniciar-ticket`, que suma mediciones y rama),
`calidad-codigo-auditor`, `deuda-tecnica-auditor` y `backlog-governance`.
`diseno-visual` (2026-10-14, `BR-053`) nace del pedido recurrente del dueño
de mejorar la estética sección por sección; `svg-workflow` es una adaptación
de la skill del mismo nombre de alienskilez-web, sin Tailwind y con los
tokens y las reglas de este repo.
Son nuevos de este repo: `verificar-despliegue`, `datos-negocio-auditor`,
`seo-performance-auditor`, `accesibilidad-auditor` y
`design-tokens-auditor`, que salen de los problemas encontrados en la
auditoría previa al despliegue. No se trajeron los auditores de dominio,
hexagonal, multiusuario, prompts ni observabilidad de backend: no aplican
a un sitio estático.

## Documentos que cada skill y agente da por leídos

- [`CLAUDE.md`](./CLAUDE.md): reglas duras e idioma.
- [`docs/engineering-guidelines.md`](./docs/engineering-guidelines.md):
  principios y Definition of Done.
- [`docs/architecture.md`](./docs/architecture.md): estructura y ADRs.
- [`docs/backlog.md`](./docs/backlog.md): estado real de los tickets.
- [`docs/historias-usuario.md`](./docs/historias-usuario.md),
  [`docs/casos-uso.md`](./docs/casos-uso.md) y
  [`docs/rf-rnf-catalogo.md`](./docs/rf-rnf-catalogo.md).

**Mantenimiento:** al agregar, renombrar o borrar una skill o un agente,
se actualiza esta tabla en el mismo commit. `backlog-governance` lo
verifica.
