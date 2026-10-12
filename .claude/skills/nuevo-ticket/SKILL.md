---
name: nuevo-ticket
description: Crea una ficha de ticket BR-NNN en docs/backlog.md con el formato estándar (Prioridad/Esfuerzo/Depende de/Estado/Historia de usuario/RF-RNF + Origen + Alcance + criterios de aceptación). Si la historia de usuario o el requisito no existen, los escribe primero. Úsala cuando el usuario dice "agrega un ticket para X", "anota este bug", o cuando se descubre trabajo nuevo durante otro ticket.
---

# Nuevo ticket

1. **¿Ya existe?** Busca en `docs/backlog.md` un ticket que cubra lo mismo
   (incluida la §4 "Diferido" y la §8 de migración). Si existe, propón
   ampliarlo con un bloque `> **Alcance ajustado (AAAA-MM-DD):**` en vez de
   duplicarlo.
2. **Historia de usuario.** Busca en `docs/historias-usuario.md` la `HU-*`
   que explica el para qué. Si no existe y el ticket tiene superficie de
   usuario, escríbela primero con el formato del archivo (historia, Epic,
   Actor, Prioridad, Estimación, Fuente, Dependencias, Riesgo, RF/RNF, CU,
   criterios Given/When/Then) y actualiza las tablas de resumen y épicas.
   Si es deuda técnica o proceso, la ficha dice
   `Historia de usuario: no aplica — <motivo>`.
3. **Requisito.** Busca el `RF-*`/`RNF-*` en `docs/rf-rnf-catalogo.md`. Si
   el ticket implementa o verifica algo que no está, agrégalo a la tabla
   (con su `CP-*`, métrica y umbral si es RNF) y a la matriz de la §4.
4. **ID.** Toma el siguiente `BR-NNN` correlativo: el mayor ID que aparezca
   en todo el archivo + 1. Nunca reutilices ni renumeres.
5. **Ficha.** Escríbela en su épica con la plantilla de la §2 del backlog:
   - `Prioridad` según la escala P0–P3 de la §2 (P0 solo si bloquea el
     despliegue).
   - `Esfuerzo` XS/S/M/L. Si es L, propón partirlo.
   - `Estado: Propuesta`, o `Bloqueada (motivo)` si depende de algo
     externo (datos o fotos del dueño, una decisión).
   - `Depende de:` explícito.
   - `**Origen (fecha):**` con el hecho concreto que lo disparó
     (archivo:línea si es un bug).
   - Si es bug: secciones **Causa:** y **Arreglo:**.
   - Criterios de aceptación verificables, citando `(HU-XXX CA-NN)` o el
     `CP-*`.
6. **Tablero.** Agrega la fila en la §6 del backlog.
7. **Reporta** el ID, la ficha y cualquier HU o RF/RNF nuevo, y pregunta si
   la prioridad es la correcta antes de dar por terminado.

No escribas código del ticket en esta skill.
