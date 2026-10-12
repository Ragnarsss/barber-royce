---
name: analisis-requerimientos
description: Convierte una necesidad descrita en lenguaje natural (todavía sin forma de ticket) en historias de usuario, casos de uso, requisitos RF/RNF y tickets del backlog. Úsala cuando el usuario dice "quiero que el sitio haga X", "el dueño pidió Y" o describe un problema; si ya sabe exactamente qué ticket quiere, usa nuevo-ticket.
---

# Análisis de requerimientos

## Pasos

1. **Entender la necesidad.** Si es ambigua o mezcla varias cosas,
   pregunta antes de escribir nada. Si toca una decisión ya tomada en un
   ADR (`docs/architecture.md` §9; por ejemplo, reservas en AgendaPro o
   CSS Modules), dilo explícitamente y pregunta si se reabre: es una
   decisión del usuario, no tuya.
2. **Buscar lo existente** en `docs/historias-usuario.md`,
   `docs/casos-uso.md` y `docs/rf-rnf-catalogo.md`. Decide si se amplía
   una HU (con `> Actualizada (AAAA-MM-DD): …`, nunca reescribiendo en
   silencio) o se crea una nueva.
3. **Historia(s) de usuario** con el formato completo del archivo y las
   tablas de resumen y épicas actualizadas.
4. **Caso de uso** solo si el flujo tiene decisiones o caminos
   alternativos (convención de `casos-uso.md`).
5. **Requisitos.** RF con una sola capacidad y su `CP-*`; RNF con métrica,
   umbral y método. Actualiza la matriz HU → RF/RNF.
6. **Tickets.** Para cada pieza de trabajo, sigue la skill `nuevo-ticket`
   (no dupliques su lógica).
7. **Documentos afectados.** Señala si la necesidad deja desactualizado
   algo ya escrito (`CLAUDE.md`, un ADR, un agente de `.claude/agents/`,
   `AGENTS.md`).
8. **Reportar:** archivos creados o modificados y preguntas abiertas que
   sean decisiones de producto (no las resuelvas tú).

## Regla dura

No hay ticket con superficie de usuario sin su HU escrita antes.
