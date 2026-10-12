---
name: cerrar-ticket
description: Corre el checklist de Definition of Done sobre un ticket BR-NNN antes de marcarlo Hecho - lint, tipos, tests, build, criterios de aceptación verificados en el preview de Vercel, Lighthouse si toca rendimiento/SEO/accesibilidad, trazabilidad HU y RF/RNF, backlog y registro de construcción actualizados, commits y PR. Úsala con "cerrar BR-003", "¿ya se puede marcar Hecho?".
---

# Cerrar ticket

Aplica `docs/engineering-guidelines.md` §6. Si algo falla, **no marques el
ticket como Hecho**: reporta qué falta.

## Checklist

1. **Tests** en verde para lo que el ticket tocó (`npm run test:run`
   cuando exista, `BR-030`). Si la ficha dice que no aplica test, confirma
   el motivo.
2. **Lint:** `npm run lint -- --max-warnings=0`.
3. **Build:** `npm run build`.

   Con CI (`BR-029`), 1–3 son el check del PR en verde. Mientras no
   exista, córrelos tú y pega el resultado.
4. **Criterios de aceptación en el sistema real.** Cada criterio de la
   ficha y cada `CP-*` citado, verificado en el **preview de Vercel** del
   PR (o `npm run preview` mientras no haya Vercel), en escritorio y en
   móvil. Di cómo se verificó cada uno. Lo que no puedas verificar tú
   (un celular real, un clic en AgendaPro) pídeselo al usuario.
5. **Mediciones.** Si el ticket cita un `RNF-PERF-*`, `RNF-A11Y-*` o
   `RNF-SEO-*`: Lighthouse móvil contra el preview (mediana de 3) frente a
   la línea base anotada en `iniciar-ticket`, con los umbrales del
   catálogo.
6. **Trazabilidad.** La `HU-*` citada existe de verdad en
   `historias-usuario.md`; el `RF/RNF` existe en `rf-rnf-catalogo.md`. Si
   el ticket dejó un requisito verificado, cambia su `Estado` en el
   catálogo a `Verificado` (o `Implementado` si quedó algo pendiente, con
   el motivo).
7. **Backlog.** Ficha en `Estado: Hecho (AAAA-MM-DD, rama <rama> → master)`
   y fila del tablero (§6) actualizada. La ficha conserva alcance y
   criterios; nada de notas de implementación en ella.
8. **Registro.** Entrada en `docs/registro-construccion.md` con
   `<a id="br-nnn"></a>`: qué se implementó, archivos, decisiones,
   test-first o no, y resultado de la verificación. En la ficha, solo el
   puntero.
9. **Commits** atómicos `tipo(alcance): descripción (BR-NNN)` en la rama
   del ticket. Muestra los mensajes al usuario antes de commitear.
10. **PR** contra `master` con `.github/pull_request_template.md` completo.
    El ticket está `Hecho` cuando el PR se integra (`--no-ff`), la rama se
    borra y la producción que despliega Vercel carga la home y la ruta
    tocada.

## Al terminar

Reporta el checklist con ✔/✘ por punto y, si quedó algo fuera, propone el
ticket nuevo (skill `nuevo-ticket`) en vez de dejarlo implícito.
