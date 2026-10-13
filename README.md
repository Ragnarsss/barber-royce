# Barber Royce

Sitio web de **Royce Barbería** (La Serena y Coquimbo, Chile). Presenta servicios, equipo, productos, sucursales y preguntas frecuentes, y deriva las reservas a **AgendaPro**. Es una SPA estática, sin backend propio, desplegada en **Vercel**: https://barber-royce.vercel.app

## Stack

React 19 · TypeScript 5.9 (`strict`) · Vite 7 (SWC) · React Router 7 · CSS Modules + tokens CSS · framer-motion 12 · Lenis · react-helmet-async · Vitest + Testing Library. Las decisiones y sus motivos están en [`docs/architecture.md`](docs/architecture.md).

## Levantarlo en local

Necesitas Git y Node.js en la versión de [`.nvmrc`](.nvmrc) (con `nvm use` o `fnm use` queda lista).

```bash
git clone https://github.com/Ragnarsss/barber-royce.git
cd barber-royce
npm install
npm run dev        # http://localhost:8888
```

No hace falta ningún archivo `.env`: sin variables el sitio funciona completo, con el contenido de respaldo y sin analítica.

Si el servidor de desarrollo muestra errores de importación después de cambiar de rama, deténlo (`Ctrl+C`), vuelve a ejecutar `npm run dev` y recarga con `Ctrl+Shift+R`.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en el puerto 8888 |
| `npm run build` | Revisa los tipos y genera `dist/` (`tsc -b && vite build`) |
| `npm run preview` | Sirve `dist/` en http://localhost:4173 |
| `npm run lint` | ESLint, sin avisos permitidos |
| `npm test` | Vitest en modo watch |
| `npm run test:run` | Vitest una vez |
| `npm run test:coverage` | Vitest con cobertura y umbrales (lo mismo que corre el CI) |
| `npm run commit` | Commit guiado (Conventional Commits) |
| `npm run perf:lighthouse` | Lighthouse CI local |
| `npm run perf:bundle` | Visualizador del tamaño del bundle |

Los tests viven junto al archivo que prueban (`*.test.ts(x)`). Los de `src/test/` construyen el sitio de verdad; el de contraste (`contrast.e2e.test.ts`) usa Google Chrome y se omite solo si no lo encuentra.

## Variables de entorno

Todas son opcionales y están documentadas en [`.env.example`](.env.example). Para probar alguna en local, ponla en un archivo `.env.local` (no se sube al repositorio) y reinicia `npm run dev`. En producción se definen en Vercel (Settings → Environment Variables) y hay que volver a desplegar.

| Variable | Para qué | Llega al navegador |
|---|---|---|
| `CONTENT_SHEET_ID` | Identificador de publicación de la hoja de Google con el catálogo | No (solo build) |
| `CONTENT_SHEET_GIDS` | `pestaña:gid` de cada pestaña publicada como CSV | No (solo build) |
| `CONTENT_FETCH_TIMEOUT_MS` | Tiempo máximo por pestaña (10 s por defecto) | No (solo build) |
| `VITE_VERCEL_ANALYTICS` | `true` activa Vercel Analytics | Sí (pública) |
| `VITE_GA_MEASUREMENT_ID` | ID de GA4; activa el aviso de consentimiento | Sí (pública) |

Las variables `VITE_*` terminan dentro del JavaScript del sitio, así que nunca llevan secretos.

## De dónde sale el contenido

- **Datos del negocio** (teléfonos, WhatsApp, email, horarios, redes, URL de AgendaPro, sucursales): solo en `src/config/` y `src/data/locationsData.ts`.
- **Catálogo** (servicios, productos, equipo, preguntas) y **textos de la portada**: se editan en una hoja de Google y se leen **al construir** el sitio. Sin `CONTENT_SHEET_ID` se usa el respaldo versionado de `src/content/snapshot/`, que son datos de muestra. Si la hoja falla o una pestaña tiene un error, el build no se rompe: usa el respaldo para esa pestaña y lo avisa en el registro (líneas `[contenido]`).
- Estructura de la hoja, plantillas (`docs/contenido/*.csv`), publicación y errores frecuentes: [`docs/contenido-hoja.md`](docs/contenido-hoja.md).
- Decisión de fondo: ADR-008 en [`docs/architecture.md`](docs/architecture.md).

## Analítica

Apagada por defecto. Con `VITE_VERCEL_ANALYTICS=true` mide visitas sin cookies. Con `VITE_GA_MEASUREMENT_ID` muestra un aviso de consentimiento y solo carga Google Analytics si la persona acepta. Detalle en ADR-007.

## Estructura

```
src/
├── analytics/     # consentimiento, GA4, Vercel Analytics, eventos de conversión
├── components/    # common, layout y sections
├── config/        # datos del negocio y rutas
├── content/       # lectura de la hoja, validación y respaldo (snapshot/)
├── data/          # sucursales
├── hooks/         # scroll, parallax, Lenis
├── pages/         # una por ruta
├── styles/        # tokens CSS y estilos globales
└── test/          # utilidades de test y pruebas de build
vite-plugins/      # plugin que lee la hoja al construir
docs/              # backlog, historias, requisitos, arquitectura, guías
.claude/           # skills y agentes para trabajar con Claude Code
```

## Despliegue

- Vercel despliega solo: cada push a una rama genera un preview y `master` va a producción. La configuración (rewrite de la SPA, cabeceras de seguridad, caché) está en [`vercel.json`](vercel.json).
- Los previews están detrás de Vercel Authentication: hay que iniciar sesión para verlos.
- El CI de GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) corre lint, tipos, tests con cobertura, build y `npm audit`. `master` está protegida: se integra por Pull Request con el CI en verde.
- **Volver atrás:** en Vercel → Deployments, elige el despliegue anterior bueno y usa **Promote to Production**.
- **Publicar un cambio de contenido de la hoja:** requiere un nuevo despliegue (Redeploy en Vercel). Ver la sección 5 de [`docs/contenido-hoja.md`](docs/contenido-hoja.md).

## Cómo se trabaja en este repo

Todo trabajo parte de un ticket `BR-NNN` de [`docs/backlog.md`](docs/backlog.md), en una rama `tipo/br-nnn-descripcion`, con commits `tipo(alcance): descripción (BR-NNN)`. Un ticket está «Hecho» cuando cumple la Definition of Done ([`docs/engineering-guidelines.md`](docs/engineering-guidelines.md) §6), verificada en el preview de Vercel.

| Documento | Para qué |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Reglas del proyecto (también valen para personas) |
| [`AGENTS.md`](AGENTS.md) | Skills y agentes de `.claude/` |
| [`docs/historias-usuario.md`](docs/historias-usuario.md) | Para qué se hace cada cosa |
| [`docs/rf-rnf-catalogo.md`](docs/rf-rnf-catalogo.md) | Requisitos verificables |
| [`docs/registro-construccion.md`](docs/registro-construccion.md) | Bitácora de construcción por ticket |

## Licencia

Privado. Todos los derechos reservados.
