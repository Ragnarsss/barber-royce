---
name: verificar-despliegue
description: Checklist previo y posterior a un despliegue a producción en Vercel - build limpio, rutas profundas, 404, cabeceras de seguridad, datos del negocio, SEO, Lighthouse móvil y plan de rollback. Úsala antes del primer despliegue, antes de integrar un PR grande o con "¿podemos desplegar?", "revisa producción".
---

# Verificar despliegue

Trabaja contra una URL concreta: el **preview** del PR (antes de integrar)
o la **producción** (después). Pide la URL si no la tienes.

## Antes de integrar (preview)

1. **Bloqueantes:** lista los tickets P0 de `docs/backlog.md` que no están
   `Hecho`. Si hay alguno, la respuesta a "¿podemos desplegar?" es no, y
   di cuáles.
2. **Build:** `npm run lint -- --max-warnings=0`, `npm run build` y
   `npm audit --omit=dev --audit-level=high` sin errores.
3. **Rutas (CP-CONF-001):** abre y recarga las 7 rutas de
   `src/config/routes.ts` y una inexistente; todas responden la app y la
   inexistente muestra la 404.
4. **Cabeceras (CP-SEG-001):** `curl -sI <url>` muestra CSP, HSTS,
   `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y
   `frame-ancestors`; `curl -sI <url>/assets/<algún archivo>` muestra
   `immutable`. La consola del navegador no reporta violaciones de CSP.
5. **Datos del negocio (CP-DATOS-001):** corre el agente
   `datos-negocio-auditor`, o compara a mano teléfono, WhatsApp, email,
   horario, redes y URL de reserva entre el footer, `/ubicacion` y el
   JSON-LD del HTML servido.
6. **Reserva (CP-RES-001):** el botón "Reservar" del navbar abre AgendaPro
   en pestaña nueva, en escritorio y en el menú móvil.
7. **SEO (CP-SEO-001..003):** título y descripción propios en cada ruta;
   `sitemap.xml` con las 7 rutas y el dominio de producción; `robots.txt`
   apunta al sitemap.
8. **Lighthouse móvil** en la home y en `/servicios` (mediana de 3): LCP
   ≤ 2,5 s, CLS ≤ 0,1, TBT ≤ 200 ms, accesibilidad y SEO ≥ 95.

## Después de integrar (producción)

9. La home y las rutas tocadas cargan en el dominio de producción, con
   HTTPS.
10. La prueba de resultados enriquecidos de Google sobre la home no da
    errores (CP-SEO-002-N).
11. **Rollback listo:** identifica en Vercel el despliegue anterior al que
    se haría "Promote" si algo falla.

## Reporte

Tabla punto → ✔/✘ → evidencia (comando, URL o captura descrita). Termina
con un veredicto en una línea: "listo para desplegar", "listo con
observaciones (cuáles)" o "no desplegar (por qué)". No despliegues ni
promuevas nada tú: eso lo decide el usuario.
