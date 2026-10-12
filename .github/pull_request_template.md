## Ticket

BR-NNN — <título> ([ficha](../blob/master/docs/backlog.md))

- Historia de usuario: HU-XXX (CA-NN) / no aplica — motivo
- RF/RNF: RF-XXX, RNF-XXX / no aplica — motivo

## Qué cambia

<!-- 2 a 5 viñetas. El detalle va en docs/registro-construccion.md. -->

## Cómo se verificó

<!-- Cada criterio de aceptación o CP-*, con dónde y cómo se comprobó. -->

| Criterio | Verificado en | Resultado |
|---|---|---|
| CA-01 / CP-XXX | Preview (escritorio / móvil) | ✔ |

## Definition of Done (`docs/engineering-guidelines.md` §6)

- [ ] Tests en verde (o la ficha explica por qué no aplica)
- [ ] `npm run lint -- --max-warnings=0` sin errores
- [ ] `npm run build` limpio
- [ ] Criterios verificados en el preview de Vercel, escritorio y móvil
- [ ] Lighthouse móvil contra el preview, si toca rendimiento, SEO o accesibilidad (antes → después)
- [ ] `docs/backlog.md` en `Hecho` y entrada en `docs/registro-construccion.md`
- [ ] Commits `tipo(alcance): descripción (BR-NNN)`
- [ ] Sin datos del negocio fuera de `src/config/` ni colores fuera de los tokens
