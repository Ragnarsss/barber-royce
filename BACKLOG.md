# BACKLOG DEL PROYECTO

**Última Actualización:** Marzo 11, 2026  
**Baseline Performance:** Score 90/100 (Lighthouse Desktop) - Ver ANIMATION_OPTIMIZATION_PLAN.md

---

## Matriz de Eisenhower

```
                    URGENTE                         NO URGENTE
            ┌─────────────────────────┬─────────────────────────┐
            │                         │                         │
IMPORTANTE  │    Q1: HACER AHORA      │   Q2: PLANIFICAR        │
            │    (Crítico)            │   (Estratégico)         │
            │                         │                         │
            ├─────────────────────────┼─────────────────────────┤
            │                         │                         │
NO          │    Q3: DELEGAR          │   Q4: ELIMINAR          │
IMPORTANTE  │    (Distracciones)      │   (Desperdicio)         │
            │                         │                         │
            └─────────────────────────┴─────────────────────────┘
```

## Criterios de Priorización

- **Q1 (Crítico)**: Urgente + Importante - Performance crítica, UX blockers
- **Q2 (Estratégico)**: No Urgente + Importante - Desarrollo de features, mejoras técnicas
- **Q3 (Distracciones)**: Urgente + No Importante - Interrupciones, solicitudes menores
- **Q4 (Desperdicio)**: No Urgente + No Importante - Tareas de bajo valor, postergar indefinidamente

---

## Q1: HACER AHORA (Crítico)

> **PRIORIDAD MÁXIMA - Performance Optimization Sprint**  
> Baseline: Score 90/100, LCP 2.0s, FPS 30-45 (lag visible), Payload 3.4 MB

| ID   | Tarea                                              | Cuadrante | Estado      | Estimación | Asignado | Sprint  | Notas                                                        |
| ---- | -------------------------------------------------- | --------- | ----------- | ---------- | -------- | ------- | ------------------------------------------------------------ |
| P001 | Optimizar imágenes PNG → WebP con srcset           | Q1        | TODO        | M (2-3h)   | -        | Current | Hero: 685KB→200KB, Total: 2.35MB→900KB. LCP -800ms           |
| P002 | Preload fonts críticas (Montserrat Regular + Bold) | Q1        | TODO        | XS (15min) | -        | Current | Font loading 405ms→150ms. Quick win                          |
| P003 | Agregar width/height a logo (Navbar.tsx)           | Q1        | TODO        | XS (5min)  | -        | Current | Prevenir CLS. Dimensiones: 41x50                             |
| P004 | Eliminar forced reflows (crear useRAFThrottle)     | Q1        | TODO        | S (1-2h)   | -        | Current | 115ms reflows→0ms. Batching reads/writes                     |
| P005 | Optimizar will-change dinámicamente                | Q1        | TODO        | S (1-2h)   | -        | Current | 20+ permanentes→3-5 activos. GPU memory reduction            |
| P006 | Consolidar useTransform en SocialProof1            | Q1        | TODO        | S (1h)     | -        | Current | 10 transforms→2. Reducir overhead                            |
| B002 | Optimización de animaciones parallax overflow      | Q1        | IN_PROGRESS | S          | -        | Current | Ajustar overflow y posicionamiento elementos decorativos     |
| B003 | Mejorar estilos Features y Reviews sections        | Q1        | IN_PROGRESS | M          | -        | Current | Agregar elementos geométricos, mejorar backgrounds (casi ✅) |

---

## Q2: PLANIFICAR (Estratégico)

> **Performance Avanzado + Arquitectura + SEO**

### 🚀 Performance Web (Fase 2-3)

| ID   | Tarea                                                   | Cuadrante | Estado  | Estimación | Asignado | Sprint | Notas                                                                    |
| ---- | ------------------------------------------------------- | --------- | ------- | ---------- | -------- | ------ | ------------------------------------------------------------------------ |
| P007 | Crear hook useOptimizedParallax reutilizable            | Q2        | BACKLOG | M (2-3h)   | -        | Next   | IntersectionObserver + speeds presets. Código más limpio                 |
| P008 | Extraer constantes de performance                       | Q2        | BACKLOG | XS (30min) | -        | Next   | src/config/performance.constants.ts (FPS, thresholds, speeds)            |
| P009 | Agregar CSS containment a secciones                     | Q2        | BACKLOG | S (1h)     | -        | Next   | contain: layout style paint + content-visibility: auto                   |
| P010 | Setup Lighthouse CI para monitoring                     | Q2        | BACKLOG | S (1h)     | -        | Next   | lighthouserc.json + npm scripts. Target: score > 95                      |
| P011 | Crear performance monitor para development              | Q2        | BACKLOG | S (1h)     | -        | Next   | Real-time FPS, Long Tasks, CLS tracking en consola                       |
| P012 | Conversión WebP/AVIF con fallback (<picture>)           | Q2        | BACKLOG | M (2-3h)   | -        | -      | 2.35MB→700-900KB (-60%). Requiere P001 completado primero                |
| P013 | Brotli pre-compression (vite-plugin-compression2)       | Q2        | BACKLOG | XS (20min) | -        | -      | 70KB gzip→58KB brotli (-15%). Simple plugin config                       |
| P014 | Responsive images con múltiples sizes (vite-imagetools) | Q2        | BACKLOG | M (2h)     | -        | -      | Móviles: 685KB→200KB. Genera @1x, @2x, @3x automáticamente               |
| P015 | Critical CSS inline en <head>                           | Q2        | BACKLOG | S (1h)     | -        | -      | FCP -100-200ms. Extraer CSS above-the-fold                               |
| P016 | Eliminar React.memo innecesarios (React 19)             | Q2        | BACKLOG | S (1-2h)   | -        | -      | 20+ ocurrencias. React 19 tiene bailout automático. -2-3KB bundle        |
| P017 | Eliminar useMemo con deps vacías                        | Q2        | BACKLOG | XS (30min) | -        | -      | 5 ocurrencias. Mover a constantes fuera del componente                   |
| P018 | Eliminar useCallback innecesarios                       | Q2        | BACKLOG | XS (30min) | -        | -      | 3 ocurrencias en hooks. React 19 optimiza event handlers automáticamente |
| P019 | Activar React Compiler (Forget) [EXPERIMENTAL]          | Q2        | BACKLOG | M (2-3h)   | -        | -      | babel-plugin-react-compiler. Auto-memoización sin manual optimization    |

---

### 🌐 SEO & Accesibilidad

| ID   | Tarea                                    | Cuadrante | Estado  | Estimación | Asignado | Sprint | Notas                                                         |
| ---- | ---------------------------------------- | --------- | ------- | ---------- | -------- | ------ | ------------------------------------------------------------- |
| S001 | Meta tags SEO completos (OG, Twitter)    | Q2        | BACKLOG | S (1h)     | -        | -      | description, og:image, twitter:card. Ver IMAGEN_SPECS.md      |
| S002 | Crear OG Image (1200x630) para compartir | Q2        | BACKLOG | M (2h)     | Design   | -      | Canva export. Especificaciones en IMAGEN_SPECS.md             |
| S003 | Favicon package completo                 | Q2        | BACKLOG | XS (30min) | Design   | -      | 16x16, 32x32, 180x180, 192x192, 512x512. RealFaviconGenerator |
| S004 | Structured Data (JSON-LD)                | Q2        | BACKLOG | S (1-2h)   | -        | -      | LocalBusiness schema para SEO                                 |
| S005 | XML Sitemap generation                   | Q2        | BACKLOG | XS (30min) | -        | -      | Vite plugin o manual. Prioridades de páginas                  |
| S006 | robots.txt optimization                  | Q2        | BACKLOG | XS (10min) | -        | -      | Ajustar crawling rules                                        |
| S007 | ARIA labels completos                    | Q2        | BACKLOG | M (2-3h)   | -        | -      | Audit con axe DevTools. Navegación keyboard                   |
| S008 | Skip Links para accesibilidad            | Q2        | DONE    | -          | -        | -      | ✅ Implementado en SkipLink component                         |
| S009 | Page titles dinámicos por ruta           | Q2        | BACKLOG | XS (20min) | -        | -      | React Helmet o meta tag updates en router                     |

---

### 🏗️ Arquitectura & Separation of Concerns

| ID   | Tarea                                                       | Cuadrante | Estado  | Estimación | Asignado | Sprint | Notas                                                                               |
| ---- | ----------------------------------------------------------- | --------- | ------- | ---------- | -------- | ------ | ----------------------------------------------------------------------------------- |
| B001 | Implementar galería de Instagram en SocialProof2            | Q2        | BACKLOG | M          | -        | -      | Evaluar opciones: API oficial, Instafeed.js, o imágenes estáticas con links         |
| B004 | Eliminar animaciones condicionales binarias                 | Q2        | BACKLOG | S          | -        | -      | Reemplazar direction === 1 ? x : y por transiciones suaves con Spring o useSpring   |
| B005 | Crear sistema de variants para animaciones parallax         | Q2        | BACKLOG | M          | -        | -      | Definir variants predefinidas para efectos parallax comunes en animations.config.ts |
| B006 | Estandarizar enfoque de animaciones                         | Q2        | BACKLOG | S          | -        | -      | Documentar cuándo usar variants vs style props, crear guía de decisión              |
| B007 | Migrar animaciones hover/tap de CSS a Framer Motion         | Q2        | BACKLOG | M          | -        | -      | Usar whileHover, whileTap, whileFocus en lugar de CSS transitions                   |
| B008 | Implementar sistema de orchestration de animaciones         | Q2        | BACKLOG | L          | -        | -      | Crear hooks para coordinar animaciones complejas entre múltiples elementos          |
| B009 | Optimizar useMemo en animaciones                            | Q2        | BACKLOG | XS         | -        | -      | Revisar y eliminar useMemo innecesarios para valores simples                        |
| B010 | Implementar shared layout transitions                       | Q2        | BACKLOG | M          | -        | -      | Usar layoutId para transiciones entre páginas/estados                               |
| B011 | Crear documentación técnica de sistema de animaciones       | Q2        | BACKLOG | S          | -        | -      | Guía completa con ejemplos, patrones y anti-patrones                                |
| B012 | Extraer SVGs inline a componentes de iconos                 | Q2        | BACKLOG | S          | -        | -      | Services.tsx contiene SVGs inline → src/components/icons                            |
| B013 | Separar interfaces de tipos en archivos dedicados           | Q2        | BACKLOG | M          | -        | -      | Crear src/types para interfaces, mantener solo types locales en componentes         |
| B014 | Centralizar constantes de configuración                     | Q2        | BACKLOG | M          | -        | -      | Crear src/config/constants.ts para magic numbers, delays, thresholds, URLs          |
| B015 | Implementar composición para evitar prop drilling           | Q2        | BACKLOG | L          | -        | -      | Identificar cadenas de props, crear contexts o compound components                  |
| B016 | Aplicar principio DRY en lógica repetida                    | Q2        | BACKLOG | M          | -        | -      | Extraer patrones comunes de map/filter, lógica de scroll, animaciones               |
| B017 | Separar lógica de presentación en hooks personalizados      | Q2        | BACKLOG | L          | -        | -      | Crear hooks para lógica de negocio, mantener componentes puros de presentación      |
| B018 | Refactorizar componentes grandes en subcomponentes          | Q2        | BACKLOG | M          | -        | -      | Dividir Hero, Services, SocialProof en componentes más pequeños y cohesivos         |
| B019 | Crear sistema de compound components para layouts           | Q2        | BACKLOG | M          | -        | -      | Implementar pattern compound para Card, Section, InfoItem con composición           |
| B020 | Extraer lógica de navegación a helper utilities             | Q2        | BACKLOG | S          | -        | -      | Navbar contiene lógica de scroll que debe estar en src/utils/navigation.ts          |
| B021 | Implementar barrel exports organizados                      | Q2        | BACKLOG | S          | -        | -      | Crear index.ts para re-exportar componentes, hooks, utils por categoría             |
| B022 | Separar data fetching logic de componentes                  | Q2        | BACKLOG | M          | -        | -      | Crear capa de services/api para manejo de datos externos                            |
| A001 | Extraer configuración de navegación (NAV_LINKS, thresholds) | Q2        | BACKLOG | XS (30min) | -        | -      | src/config/navigation.ts. Remove hardcoded array from Navbar.tsx                    |
| A002 | Crear useScrollTracking hook reutilizable                   | Q2        | BACKLOG | S (1h)     | -        | -      | Generalizar useNavbarScroll para cualquier threshold tracking                       |
| A003 | Extraer lógica handleLogoNavigation                         | Q2        | BACKLOG | XS (20min) | -        | -      | src/utils/navigation.ts. Lógica de scroll to top + navigate                         |

---

### 📱 Progressive Web App (PWA)

| ID   | Tarea                            | Cuadrante | Estado  | Estimación | Asignado | Sprint | Notas                                                |
| ---- | -------------------------------- | --------- | ------- | ---------- | -------- | ------ | ---------------------------------------------------- |
| W001 | Setup vite-plugin-pwa            | Q2        | BACKLOG | S (1h)     | -        | -      | Service Worker, manifest.json, cache strategies      |
| W002 | Crear manifest.json completo     | Q2        | BACKLOG | XS (30min) | -        | -      | Iconos 192x192, 512x512. Theme colors                |
| W003 | Implementar offline support      | Q2        | BACKLOG | M (3-4h)   | -        | -      | Cache static assets, fallback UI                     |
| W004 | Add to Home Screen prompt        | Q2        | BACKLOG | S (1h)     | -        | -      | Install prompt UI, beforeinstallprompt event handler |
| W005 | Testing PWA en múltiples devices | Q2        | BACKLOG | M (2h)     | QA       | -      | iOS Safari, Android Chrome, Desktop                  |

---

## Q3: DELEGAR (Distracciones)

| ID  | Tarea | Cuadrante | Estado | Estimación | Asignado | Sprint | Notas |
| --- | ----- | --------- | ------ | ---------- | -------- | ------ | ----- |
| -   | -     | Q3        | -      | -          | -        | -      | -     |

---

## Q4: ELIMINAR (Desperdicio)

| ID  | Tarea | Cuadrante | Estado | Estimación | Asignado | Sprint | Notas |
| --- | ----- | --------- | ------ | ---------- | -------- | ------ | ----- |
| -   | -     | Q4        | -      | -          | -        | -      | -     |

---

## Estados de Tareas

- **BACKLOG**: Tarea identificada, pendiente de iniciar
- **TODO**: Planificada para el sprint actual
- **IN_PROGRESS**: En desarrollo activo
- **REVIEW**: En revisión de código o pruebas
- **BLOCKED**: Bloqueada por dependencias externas
- **DONE**: Completada y desplegada
- **CANCELLED**: Descartada o no procede

---

## Estimaciones

- **XS**: < 1h
- **S**: 1-3h
- **M**: 3-8h
- **L**: 1-3 días
- **XL**: 3-5 días
- **XXL**: > 5 días (dividir en subtareas)

---

## Historial de Completados

### Sprint: Performance Baseline Setup (2026-03-11)

| ID   | Tarea                                           | Completado | Tiempo Real | Notas                                      |
| ---- | ----------------------------------------------- | ---------- | ----------- | ------------------------------------------ |
| T001 | Lighthouse audit baseline (Score 90/100)        | 2026-03-11 | 30min       | LCP 2.0s, FCP 0.5s, TBT 10ms, CLS 0        |
| T002 | Instalar tools (lighthouse, @lhci/cli, bundler) | 2026-03-11 | 10min       | npm install completado exitosamente        |
| T003 | Identificar bottlenecks críticos                | 2026-03-11 | 1h          | Imágenes 96% payload, 115ms forced reflows |
| T004 | Crear ANIMATION_OPTIMIZATION_PLAN.md            | 2026-03-11 | 2h          | Plan basado en datos reales de Lighthouse  |

### Sprint: Performance Quick Wins (2026-03-06)

| ID   | Tarea                                    | Completado | Tiempo Real | Notas                                                    |
| ---- | ---------------------------------------- | ---------- | ----------- | -------------------------------------------------------- |
| OPT1 | Lazy loading imágenes off-screen         | 2026-03-06 | 30min       | SocialProof1, CTA1 con loading="lazy"                    |
| OPT2 | Self-host Google Fonts (Montserrat)      | 2026-03-06 | 45min       | @fontsource/montserrat. FCP -200-400ms                   |
| OPT3 | Preload hero image critical asset        | 2026-03-06 | 15min       | <link rel="preload"> en index.html. LCP -200-400ms       |
| OPT4 | PNG compression automática (vite plugin) | 2026-03-06 | 1h          | vite-plugin-image-optimizer. -46% size (1.98 MB savings) |
| OPT5 | Page weight reduction                    | 2026-03-06 | -           | 4.87 MB → 3.13 MB (-36% total)                           |

### Sprint: React 19 Optimizations (2026-03-05)

| ID   | Tarea                                  | Completado | Tiempo Real | Notas                                       |
| ---- | -------------------------------------- | ---------- | ----------- | ------------------------------------------- |
| R001 | Eliminar React.memo en 20+ componentes | 2026-03-05 | 2h          | React 19 bailout automático. -2-3KB bundle  |
| R002 | Eliminar useMemo con deps vacías       | 2026-03-05 | 30min       | 5 ocurrencias movidas a constantes externas |
| R003 | Eliminar useCallback innecesarios      | 2026-03-05 | 30min       | 3 ocurrencias en hooks                      |
| R004 | TypeScript strict mode activado        | 2026-03-05 | 1h          | Type safety mejorado                        |
| R005 | ESLint config con React Hooks rules    | 2026-03-05 | 30min       | Detección de deps incorrectas               |
| R006 | Bundle optimization validado           | 2026-03-05 | -           | Main: 70KB gzip, code splitting óptimo      |

### Sprint: Feature Improvements (2026-03-10)

| ID   | Tarea                                        | Completado | Tiempo Real | Notas                            |
| ---- | -------------------------------------------- | ---------- | ----------- | -------------------------------- |
| S001 | Implementación de sistema de tipos separados | 2026-03-10 | 4h          | 7 archivos de tipos creados      |
| S002 | Centralización de animaciones config         | 2026-03-10 | 3h          | Eliminados 70+ inline animations |
| S003 | Creación de PageHero y SEOHelmet components  | 2026-03-10 | 2h          | Componentes reutilizables        |
| S004 | Mejoras CSS con design tokens                | 2026-03-10 | 3h          | Tokens organizados por categoría |
| S005 | Optimización de Lenis context y hooks        | 2026-03-10 | 2h          | Performance improvements         |
| S006 | Refactoring de common components             | 2026-03-10 | 2h          | useMemo y useCallback aplicados  |
| S007 | Mejoras en layout components                 | 2026-03-10 | 2h          | Footer, Navbar optimizados       |
| S008 | Mejoras en app routing                       | 2026-03-10 | 1h          | Estructura mejorada              |

### Sprint: Architecture & State Management (2026-03-08)

| ID   | Tarea                                           | Completado | Tiempo Real | Notas                                 |
| ---- | ----------------------------------------------- | ---------- | ----------- | ------------------------------------- |
| H001 | Context API para Lenis (LenisContext)           | 2026-03-08 | 2h          | Tipado fuerte, mejor testabilidad     |
| H002 | Custom hook useNavbarScroll                     | 2026-03-08 | 1h          | Listener optimizado passive: true     |
| H003 | Custom hook useScrollContainer                  | 2026-03-08 | 2h          | ServicesPage -50 líneas               |
| H004 | Separación de datos (products, locations, team) | 2026-03-08 | 3h          | src/data/\* con interfaces TypeScript |
| H005 | useMemo para arrays computados                  | 2026-03-08 | 1h          | Benefits, Features, Hero optimizados  |
| H006 | TypeScript interfaces para window.lenis         | 2026-03-08 | 30min       | src/types/index.ts con LenisInstance  |

---

## Estados de Tareas

- **TODO**: Planificada para el sprint actual (listo para empezar)
- **BACKLOG**: Tarea identificada, pendiente de priorizar
- **IN_PROGRESS**: En desarrollo activo
- **REVIEW**: En revisión de código o pruebas
- **BLOCKED**: Bloqueada por dependencias externas
- **DONE**: Completada y validada (movida a Historial)
- **CANCELLED**: Descartada o no procede

---

## Notas Técnicas

### Decisiones de Arquitectura

- Sistema de tipos separado por entidad (benefitsData.tsx, featuresData.tsx, etc.)
- Animaciones centralizadas en animations.config.ts
- Design tokens organizados por categoría en src/styles/tokens/
- Contextos optimizados con memoization

#### Sistema de Animaciones (Estado Actual)

**Estructura**

- Configuración: src/config/animations.config.ts
- Hooks personalizados: src/hooks/useScrollAnimation.ts, useParallaxLayers.ts, useLenisScroll.ts
- Librería: Framer Motion + Lenis (smooth scroll)

**Enfoques actuales**

1. Variants + whileInView: Para animaciones de entrada en scroll (fadeInUp, scaleIn, etc.)
2. useTransform + style props: Para efectos parallax (useParallaxLayers)
3. CSS transitions: Para hover, focus en algunos componentes
4. Condicionales directos: Para animaciones basadas en dirección/velocidad (problemático)

**Variants definidas**

- Entrada: fadeInUp, fadeInLeft, fadeInRight, scaleIn, fadeIn, fadeInUpShort, slideInUp
- Containers: staggerContainer, staggerFast, staggerSlow
- Específicas: cardAnimation, sectionAnimation, titleAnimation

**Configuración parallax**

- 5 capas: background (lento), middle, foreground, slow, fast
- Configuración en parallaxLayers object
- Transformaciones: y, x, scale, rotate

**Hooks disponibles**

- useScrollAnimation: Combina useInView + useAnimation para animaciones scroll-triggered
- useParallaxLayers: Genera transformaciones parallax basadas en scroll progress
- useLenisScroll: Tracking de dirección y velocidad de scroll

#### Arquitectura de Componentes (Propuesta)

**Principios a implementar**

1. Single Responsibility Principle: Un componente, una responsabilidad
2. Separation of Concerns: Lógica separada de presentación
3. DRY (Don't Repeat Yourself): Extraer código duplicado
4. Composition over Inheritance: Compound components en lugar de props drilling
5. Co-location: Types, styles y componente juntos cuando son específicos

**Organización propuesta**

```
src/
├── components/
│   ├── ui/              # Componentes reutilizables con composición
│   │   ├── Button/
│   │   ├── Card/       # Compound component (Card.Header, Card.Content)
│   │   └── index.ts    # Barrel exports
│   ├── icons/          # SVG components centralizados
│   ├── sections/       # Componentes de página descompuestos
│   │   └── Hero/
│   │       ├── Hero.tsx
│   │       ├── HeroContent.tsx
│   │       ├── HeroBenefitCard.tsx
│   │       ├── Hero.types.ts
│   │       └── index.ts
│   └── animations/     # Wrappers de animación reutilizables
├── hooks/              # Custom hooks con lógica de negocio
│   ├── useScrollAnimation.ts
│   ├── useMobileMenu.ts
│   ├── useLogoNavigation.ts
│   └── index.ts
├── services/           # Capa de acceso a datos (futuro)
│   └── api/
│       ├── services.api.ts
│       └── index.ts
├── utils/              # Funciones helper puras
│   ├── navigation.ts
│   ├── formatting.ts
│   └── index.ts
├── config/             # Configuración y constantes
│   ├── animations.config.ts
│   ├── constants.ts
│   └── routes.ts
└── types/              # Types compartidos
    ├── components.ts
    ├── animations.ts
    └── api.ts
```

**Patrones de diseño aplicados**

- Compound Components: Card, Section (B019)
- Custom Hooks: Separación lógica/presentación (B017)
- Barrel Exports: Imports limpios (B021)
- Service Layer: Abstracción de datos (B022)
- Factory Pattern: AnimatedList genérico (B016)

### Deuda Técnica Identificada

#### Sistema de Animaciones

**Problema 1: Animaciones condicionales binarias**

- Ubicación: SocialProof1.tsx, SocialProof2.tsx, CTA2.tsx
- Descripción: Uso de condicionales binarios (direction === 1 ? valor1 : valor2) causa saltos visuales en lugar de transiciones suaves
- Impacto: Experiencia de usuario degradada, animaciones no fluidas
- Solución propuesta: Migrar a useSpring o useTransform de Framer Motion para interpolación continua
- Prioridad: Media
- Tareas relacionadas: B004

**Problema 2: Mezcla de enfoques de animación**

- Ubicación: Todos los componentes de section
- Descripción: Coexisten 3 enfoques diferentes: variants + whileInView, inline style props + useTransform, CSS transitions
- Impacto: Inconsistencia, dificultad de mantenimiento, curva de aprendizaje para nuevos desarrolladores
- Solución propuesta: Estandarizar en variants para animaciones de entrada y useTransform para parallax
- Prioridad: Media
- Tareas relacionadas: B006, B011

**Problema 3: Animaciones hover en CSS**

- Ubicación: Múltiples module.css (Features, Services, Reviews, etc.)
- Descripción: Animaciones interactivas implementadas con CSS transitions en lugar de Framer Motion
- Impacto: Falta de control granular, dificultad para crear animaciones complejas, inconsistencia con resto del sistema
- Solución propuesta: Migrar a whileHover, whileTap de Framer Motion
- Prioridad: Baja
- Tareas relacionadas: B007

**Problema 4: useMemo innecesarios**

- Ubicación: Hero.tsx, SocialProof1.tsx, SocialProof2.tsx
- Descripción: useMemo usado para valores simples que no requieren memoización (scale: velocity > 2 ? 1.1 : 1)
- Impacto: Overhead innecesario, código verbose
- Solución propuesta: Revisar y eliminar useMemo donde el costo de memoización supera el beneficio
- Prioridad: Baja
- Tareas relacionadas: B009

**Problema 5: Falta de orchestration**

- Ubicación: Sistema general
- Descripción: No existe sistema para coordinar animaciones complejas entre múltiples elementos (secuencias, sincronización)
- Impacto: Animaciones avanzadas requieren código custom repetitivo
- Solución propuesta: Crear hooks reutilizables tipo useSequencedAnimation, useChainedAnimation
- Prioridad: Baja
- Tareas relacionadas: B008

#### Sistema de Arquitectura y Separación de Concerns

**Problema 6: SVGs inline en componentes**

- Ubicación: Services.tsx (líneas 53-92)
- Descripción: Iconos SVG hardcoded dentro de JSX reducen reusabilidad y aumentan complejidad del componente
- Impacto: Violación DRY, dificulta mantenimiento de iconografía, código verbose
- Solución propuesta: Extraer a src/components/icons/CalendarIcon.tsx, ClockIcon.tsx, usar componentes
- Prioridad: Media
- Tareas relacionadas: B012

**Problema 7: Interfaces mezcladas con implementación**

- Ubicación: PageHero.tsx, SEOHelmet.tsx, DirectionAwareElement.tsx
- Descripción: Interfaces TypeScript definidas en mismo archivo que componente, dificulta reutilización
- Impacto: Duplicación de types, dificultad para compartir interfaces entre componentes
- Solución propuesta: Mover a src/types/components.ts o crear archivo .types.ts por componente
- Prioridad: Baja
- Tareas relacionadas: B013

**Problema 8: Constantes hardcoded sin centralización**

- Ubicación: Navbar.tsx (threshold: 80), useScrollAnimation (amount: 0.2), múltiples delays
- Descripción: Valores mágicos dispersos en código sin configuración centralizada
- Impacto: Dificultad para ajustar comportamiento global, inconsistencias
- Solución propuesta: Crear src/config/constants.ts con SCROLL_THRESHOLD, ANIMATION_DELAYS, etc.
- Prioridad: Media
- Tareas relacionadas: B014

**Problema 9: Lógica de navegación acoplada a componentes**

- Ubicación: Navbar.tsx (handleLogoClick con lógica compleja de scroll)
- Descripción: Lógica de negocio de navegación embebida en componente UI
- Impacto: Dificulta testing, no reutilizable, viola Single Responsibility
- Solución propuesta: Extraer a src/utils/navigation.ts como handleLogoNavigation function
- Prioridad: Media
- Tareas relacionadas: B020

**Problema 10: Componentes grandes sin descomposición**

- Ubicación: Hero.tsx (200+ líneas), Services.tsx (150+ líneas), SocialProof1.tsx (250+ líneas)
- Descripción: Componentes monolíticos con múltiples responsabilidades
- Impacto: Difícil mantenimiento, testing complejo, viola SRP
- Solución propuesta: Extraer subcomponentes: HeroBenefit, ServiceCard, TestimonialCard
- Prioridad: Media
- Tareas relacionadas: B018

**Problema 11: Patrón de repetición en map/filter**

- Ubicación: Múltiples componentes repiten mismo pattern de map con motion.div
- Descripción: Código duplicado para renderizar listas con animaciones
- Impacto: Violación DRY, mantenimiento tedioso
- Solución propuesta: Crear AnimatedList component o AnimateChildren wrapper
- Prioridad: Baja
- Tareas relacionadas: B016

**Problema 12: Falta de compound components**

- Ubicación: Card usage requires props drilling, no composition pattern
- Descripción: Componentes no diseñados para composición, dependencia de props
- Impacto: API menos flexible, prop drilling, acoplamiento
- Solución propuesta: Implementar Card.Header, Card.Content, Card.Footer pattern
- Prioridad: Baja
- Tareas relacionadas: B019

**Problema 13: Ausencia de capa de servicios**

- Ubicación: Datos importados directamente en componentes desde /data
- Descripción: No existe capa de abstracción para data fetching futuro
- Impacto: Acoplamiento a estructura de datos, dificulta transición a APIs
- Solución propuesta: Crear src/services/api.ts con funciones getServices, getProducts
- Prioridad: Baja
- Tareas relacionadas: B022

### Mejoras Futuras Propuestas

- Implementar lazy loading para imágenes en galería
- Considerar Service Worker para caching de assets
- Evaluar implementación de PWA features

---

## Plantilla para Nuevas Tareas

```markdown
| BXXX | [Título descriptivo de la tarea] | [Q1/Q2/Q3/Q4] | BACKLOG | [XS/S/M/L/XL/XXL] | [Nombre] | [Sprint] | [Notas adicionales, contexto, dependencias] |
```

### Ejemplo:

```markdown
| B004 | Implementar sistema de autenticación OAuth | Q2 | BACKLOG | L | Backend Team | Sprint-5 | Requiere configuración en Firebase, definir roles de usuario |
```

---

## Anexo: Especificaciones Técnicas de Mejoras

### A1. Sistema de Animaciones - Propuestas Detalladas

#### B004: Eliminar animaciones condicionales binarias

**Estado actual**

```tsx
// Problemático: Saltos visuales
const hexFast1Style = useMemo(
  () => ({ scale: velocity > 2 ? 1.1 : 1 }),
  [velocity],
);
```

**Solución propuesta**

```tsx
// Opción 1: useSpring con interpolación
const scale = useSpring(velocity, {
  stiffness: 100,
  damping: 20,
  transform: (v) => Math.min(1 + v * 0.05, 1.1),
});

// Opción 2: useTransform para mapeo continuo
const scale = useTransform(velocity, [0, 4], [1, 1.1]);
```

**Archivos a modificar**

- src/components/sections/SocialProof1/SocialProof1.tsx
- src/components/sections/SocialProof2/SocialProof2.tsx
- src/components/sections/CTA2/CTA2.tsx

**Criterios de aceptación**

- Transiciones suaves sin saltos visuales
- Performance mantenida o mejorada
- Código más declarativo y legible

---

#### B005: Sistema de variants para animaciones parallax

**Propuesta**
Agregar a animations.config.ts:

```typescript
// Variants para elementos parallax decorativos
export const parallaxBackground: Variants = {
  initial: { y: "0%", scale: 1 },
  animate: {
    y: "15%",
    scale: 1.05,
    transition: { ease: "linear" },
  },
};

export const parallaxForeground: Variants = {
  initial: { y: "0%", scale: 1, rotate: 0 },
  animate: {
    y: "40%",
    scale: 1.15,
    rotate: -5,
    transition: { ease: "linear" },
  },
};

// Helper para aplicar parallax con variants
export const getParallaxProps = (
  depth: "background" | "middle" | "foreground" = "middle",
) => ({
  initial: "initial",
  animate: "animate",
  variants: parallaxVariants[depth],
});
```

**Beneficios**

- Consistencia en efectos parallax
- Reutilización sin crear transforms manuales
- Más fácil ajustar globalmente

---

#### B006: Estandarización de enfoques

**Guía de decisión propuesta**

```
Animación de entrada en scroll
├─ Fade simple → variants fadeIn + whileInView
├─ Movimiento direccional → variants fadeInUp/Left/Right + whileInView
└─ Con children stagger → staggerContainer parent + variants children

Animación parallax
└─ Usar useParallaxLayers hook + style props (y, scale, rotate)

Animación interactiva
├─ Hover → whileHover prop
├─ Tap/Click → whileTap prop
└─ Drag → drag props + dragConstraints

Animación continua/loop
└─ animate prop con transition.repeat: Infinity

Animación basada en estado
├─ Simple → variants con animate prop (controlled)
└─ Complejo → AnimatePresence + variants con exit
```

**Documentación requerida**

- Crear ANIMATION_GUIDE.md con ejemplos
- Agregar JSDoc comments a animations.config.ts
- Ejemplos en Storybook (futuro)

---

#### B007: Migrar hover/tap a Framer Motion

**Ejemplo de migración**

Antes (CSS):

```css
.card {
  transition: transform 0.3s ease;
}
.card:hover {
  transform: translateY(-8px) scale(1.02);
}
```

Después (Framer Motion):

```tsx
<motion.div
  className={styles.card}
  whileHover={{
    y: -8,
    scale: 1.02,
    transition: easeTransition
  }}
  whileTap={{ scale: 0.98 }}
>
```

**Beneficios**

- Control programático de animaciones
- Mejor performance (FLIP animations)
- Animaciones más complejas posibles (sequences, gestures)
- Consistencia con resto del sistema

**Componentes prioritarios**

1. Features cards
2. Services cards
3. Reviews cards
4. CTA buttons
5. Navigation items

---

#### B008: Sistema de orchestration

**Hooks propuestos**

```typescript
// Hook para secuencias de animaciones
export const useSequencedAnimation = (
  steps: AnimationStep[],
  trigger: boolean,
) => {
  // Implementación con useAnimation + async/await
};

// Hook para animaciones en cadena (chain)
export const useChainedAnimation = (
  elements: RefObject[],
  variant: Variants,
  delay: number = 0.1,
) => {
  // Implementación con stagger manual o useAnimation
};

// Hook para animaciones sincronizadas
export const useSyncedAnimation = (
  elements: RefObject[],
  variant: Variants,
) => {
  // Implementación con controls compartidos
};
```

**Casos de uso**

- Secuencia de entrada compleja (logo → texto → buttons)
- Animación de lista con control manual
- Sincronización de múltiples elementos decorativos

---

#### B009: Optimización de useMemo

**Criterios para evaluar**

NO usar useMemo si:

- Valor es primitivo simple (número, string, boolean)
- Cálculo es trivial (comparación, aritmética básica)
- Dependencias cambian frecuentemente (cada render)

SÍ usar useMemo si:

- Cálculo complejo o costoso
- Creación de objeto/array que causa re-renders
- Pasa como prop a componentes memoizados

**Ejemplo de refactor**

```tsx
// Innecesario
const hexFast1Style = useMemo(
  () => ({ scale: velocity > 2 ? 1.1 : 1 }),
  [velocity],
);

// Mejor (si se mantiene condicional)
const scale = velocity > 2 ? 1.1 : 1;
<motion.div style={{ scale }} />;

// Óptimo (con interpolación)
const scale = useTransform(velocity, [0, 4], [1, 1.1]);
<motion.div style={{ scale }} />;
```

---

#### B010: Shared layout transitions

**Implementación propuesta**

```tsx
// En App.tsx o Router
<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    <Route path="/" element={<HomePage />} />
    <Route path="/services" element={<ServicesPage />} />
  </Routes>
</AnimatePresence>

// En componentes con elementos compartidos
<motion.img
  layoutId="hero-image"
  src={image}
  style={{ borderRadius: 8 }}
/>

// Transición entre estados del mismo componente
<motion.div layout>
  {isExpanded && <ExpandedContent />}
</motion.div>
```

**Casos de uso prioritarios**

- Transición entre páginas con elementos comunes
- Expansión/colapso de cards
- Cambio de layout responsive (grid → list)

---

#### B011: Documentación técnica

**Estructura propuesta: ANIMATION_GUIDE.md**

```markdown
# Guía de Animaciones

## Índice

1. Filosofía y principios
2. Arquitectura del sistema
3. Guía de implementación
4. Patrones y ejemplos
5. Performance y optimización
6. Solución de problemas
7. API Reference

## Contenido por sección

- Principios: Consistencia, performance, accesibilidad
- Arquitectura: Diagrama, flujo de datos, hooks
- Implementación: Casos de uso con código
- Patrones: Do's y Don'ts con ejemplos
- Performance: Benchmarks, optimizaciones
- Troubleshooting: Errores comunes y soluciones
- API: Documentación completa de exports
```

**Deliverables**

- ANIMATION_GUIDE.md en raíz del proyecto
- JSDoc comments en animations.config.ts
- Comentarios inline en hooks personalizados
- Examples folder con casos de uso comunes

---

### A2. Arquitectura y Separación de Concerns - Propuestas Detalladas

#### B012: Extraer SVGs inline a componentes de iconos

**Estado actual**

```tsx
// Services.tsx - SVGs hardcoded inline
<div className={styles.icon}>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="6"
      width="20"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M8 2v4M16 2v4M2 10h20" stroke="currentColor" strokeWidth="2" />
  </svg>
</div>
```

**Solución propuesta**

```tsx
// src/components/icons/CalendarIcon.tsx
import { IconProps } from "./types";

export const CalendarIcon = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <rect
      x="2"
      y="6"
      width="20"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M8 2v4M16 2v4M2 10h20" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Services.tsx - Uso simplificado
import { CalendarIcon, ClockIcon } from "@/components/icons";

<div className={styles.icon}>
  <CalendarIcon size={24} />
</div>;
```

**Archivos a crear**

- src/components/icons/CalendarIcon.tsx
- src/components/icons/ClockIcon.tsx
- src/components/icons/types.ts (si no existe)

**Beneficios**

- Reutilización de iconos en múltiples componentes
- Centralización de diseño iconográfico
- Facilita cambios globales de estilo
- Testing independiente de iconos

---

#### B013: Separar interfaces de tipos en archivos dedicados

**Estructura actual**

```tsx
// PageHero.tsx
interface PageHeroProps {
  title: string;
  subtitle?: string;
  animated?: boolean;
}

export const PageHero = ({ ... }: PageHeroProps) => { ... }
```

**Propuesta de organización**

```
src/types/
├── components.ts          # Interfaces de componentes comunes
├── animations.ts          # Tipos relacionados con animaciones
├── navigation.ts          # Tipos de routing y navegación
└── api.ts                 # Tipos para respuestas de API

// O enfoque Co-located:
src/components/common/PageHero/
├── PageHero.tsx
├── PageHero.types.ts     # Export interface PageHeroProps
└── PageHero.module.css
```

**Implementación**

```typescript
// src/types/components.ts
export interface PageHeroProps {
  title: string;
  subtitle?: string;
  animated?: boolean;
}

export interface SEOHelmetProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
}

// PageHero.tsx
import type { PageHeroProps } from '@/types/components';
// O si es co-located:
import type { PageHeroProps } from './PageHero.types';

export const PageHero = ({ ... }: PageHeroProps) => { ... }
```

**Criterios de decisión**

- Types compartidos entre múltiples componentes → src/types/[categoria].ts
- Types específicos de un componente → Co-located .types.ts
- Types de dominio (entities) → src/types/[entity].types.ts (ya existe)

---

#### B014: Centralizar constantes de configuración

**Constantes dispersas actualmente**

```tsx
// Navbar.tsx
const threshold = 80;

// useScrollAnimation.ts
const amount = 0.2;

// animations.config.ts
delayChildren: 0.1;

// Múltiples componentes
duration: 1.5;
```

**Estructura propuesta**

```typescript
// src/config/constants.ts

export const SCROLL_CONFIG = {
  NAVBAR_THRESHOLD: 80,
  ANIMATION_VIEWPORT_AMOUNT: 0.2,
  SMOOTH_SCROLL_DURATION: 1.5,
  LOGO_SCROLL_DELAY: 100,
} as const;

export const ANIMATION_TIMING = {
  STAGGER_DELAY: 0.1,
  SLOW_STAGGER: 0.2,
  FAST_STAGGER: 0.05,
  DEFAULT_DURATION: 0.6,
  FAST_DURATION: 0.3,
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  WIDE: 1600,
} as const;

export const URLS = {
  BOOKING: "https://barberiaroyc.site.agendapro.com/cl/sucursal/400965",
  INSTAGRAM: "https://instagram.com/roycebarber",
  WHATSAPP: "https://wa.me/56912345678",
} as const;

export const Z_INDEX = {
  NAVBAR: 1000,
  MODAL: 2000,
  TOOLTIP: 3000,
  PROGRESS_BAR: 9998,
} as const;
```

**Uso en componentes**

```tsx
// Navbar.tsx
import { SCROLL_CONFIG, URLS } from "@/config/constants";

const { isScrolled } = useNavbarScroll(SCROLL_CONFIG.NAVBAR_THRESHOLD);

<Link to={URLS.BOOKING}>Agendar</Link>;
```

**Beneficios**

- Single source of truth para configuración
- Facilita ajustes globales
- Type safety con `as const`
- Documentación implícita de valores importantes

---

#### B015: Implementar composición para evitar prop drilling

**Problema identificado**

```tsx
// Potencial prop drilling en futuro con temas, auth, etc.
<App theme={theme}>
  <Layout theme={theme}>
    <Navbar theme={theme} user={user} />
    <Content theme={theme} user={user}>
      <Component theme={theme} user={user} />
    </Content>
  </Layout>
</App>
```

**Solución con Context API**

```typescript
// src/contexts/ThemeContext.tsx
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

**Uso simplificado**

```tsx
// Cualquier componente hijo
const Component = () => {
  const { theme, toggleTheme } = useTheme();
  // Sin prop drilling
};
```

**Casos de uso identificados**

- Theme/modo oscuro (futuro)
- User authentication (futuro)
- Shopping cart state (si se implementa tienda)
- Notification system

---

#### B016: Aplicar principio DRY en lógica repetida

**Patrón repetido: Listas animadas**

Estado actual:

```tsx
// Hero.tsx
{
  HERO_BENEFITS.map((benefit, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ delay: index * 0.1 }}
    >
      {/* contenido */}
    </motion.div>
  ));
}

// Services.tsx
{
  servicesList.map((service, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      transition={{ delay: index * 0.1 }}
    >
      {/* contenido */}
    </motion.div>
  ));
}
```

**Solución con componente reutilizable**

```tsx
// src/components/animations/AnimatedList.tsx
interface AnimatedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  staggerDelay?: number;
  initialY?: number;
  className?: string;
  controls?: AnimationControls;
}

export function AnimatedList<T>({
  items,
  renderItem,
  staggerDelay = 0.1,
  initialY = 20,
  className,
  controls,
}: AnimatedListProps<T>) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: initialY }}
          animate={controls}
          transition={{ delay: index * staggerDelay }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </div>
  );
}
```

**Uso simplificado**

```tsx
// Hero.tsx
<AnimatedList
  items={HERO_BENEFITS}
  renderItem={(benefit) => <BenefitCard {...benefit} />}
  staggerDelay={0.1}
  controls={controls}
/>
```

**Otros patrones DRY a implementar**

- Hook useScrollTo para lógica de scroll repetida
- Helper formatPrice para formateo de precios
- Utility classNames para merge de clases CSS

---

#### B017: Separar lógica de presentación en hooks personalizados

**Componente con lógica mezclada**

```tsx
// Navbar.tsx - Estado actual
export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const lenis = useLenisInstance();

  // Lógica de scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lógica de resize para cerrar menú
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Lógica de navegación del logo
  function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault();
    if (location.pathname === "/") {
      lenis?.scrollTo(0, { duration: 1.5 });
    } else {
      navigate("/");
      setTimeout(() => lenis?.scrollTo(0, { duration: 1.5 }), 100);
    }
  }

  return (/* JSX */);
};
```

**Refactorización con hooks**

```tsx
// src/hooks/useMobileMenu.ts
export const useMobileMenu = (breakpoint: number = 768) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > breakpoint && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, breakpoint]);

  return { isOpen, setIsOpen };
};

// src/hooks/useLogoNavigation.ts
export const useLogoNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lenis = useLenisInstance();

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      lenis?.scrollTo(0, { duration: 1.5 });
    } else {
      navigate("/");
      setTimeout(() => lenis?.scrollTo(0, { duration: 1.5 }), 100);
    }
  }, [location.pathname, navigate, lenis]);

  return { handleLogoClick };
};

// Navbar.tsx - Refactorizado
export const Navbar = () => {
  const { isScrolled } = useNavbarScroll();
  const { isOpen: isMobileMenuOpen, setIsOpen: setIsMobileMenuOpen } = useMobileMenu();
  const { handleLogoClick } = useLogoNavigation();
  const navLinks = getNavRoutes();

  return (/* JSX limpio, solo presentación */);
};
```

**Beneficios**

- Componente enfocado solo en UI
- Hooks reutilizables en otros componentes
- Testing independiente de lógica
- Claridad en responsabilidades

---

#### B018: Refactorizar componentes grandes en subcomponentes

**Componente grande: Hero.tsx (200+ líneas)**

Estructura actual:

```tsx
export const Hero = () => {
  // 30+ líneas de hooks y lógica

  return (
    <section>
      {/* Capas parallax - 50 líneas */}
      {/* Contenido principal - 30 líneas */}
      {/* Benefits list - 40 líneas */}
      {/* Imagen - 20 líneas */}
    </section>
  );
};
```

**Refactorización propuesta**

```tsx
// src/components/sections/Hero/Hero.tsx
export const Hero = () => {
  const { ref, layers } = useParallaxLayers();

  return (
    <section ref={ref} className={styles.hero}>
      <HeroParallaxLayers layers={layers} />
      <HeroContent />
    </section>
  );
};

// src/components/sections/Hero/HeroParallaxLayers.tsx
export const HeroParallaxLayers = ({ layers }: ParallaxLayersProps) => (
  <>
    <motion.div
      className={styles.leftTriangleBackground}
      style={layers.background}
    />
    <motion.div
      className={styles.rightTriangleBackground}
      style={layers.background}
    />
    <motion.div className={styles.leftTriangle} style={layers.middle} />
    <motion.div className={styles.rightTriangle} style={layers.middle} />
    {/* resto de capas */}
  </>
);

// src/components/sections/Hero/HeroContent.tsx
export const HeroContent = () => {
  const { ref, controls } = useScrollAnimation();

  return (
    <div className={styles.container} ref={ref}>
      <motion.div className={styles.content} variants={fadeInUp}>
        <h1 className={styles.title}>Barbería Premium</h1>
        <p className={styles.subtitle}>Estilo y elegancia</p>
        <HeroBenefitsList benefits={HERO_BENEFITS} controls={controls} />
      </motion.div>
      <HeroImage />
    </div>
  );
};

// src/components/sections/Hero/HeroBenefitsList.tsx
export const HeroBenefitsList = ({ benefits, controls }: BenefitsListProps) => (
  <motion.div className={styles.benefits} variants={staggerContainer}>
    {benefits.map((benefit) => (
      <HeroBenefitCard key={benefit.id} {...benefit} />
    ))}
  </motion.div>
);

// src/components/sections/Hero/HeroBenefitCard.tsx
export const HeroBenefitCard = ({
  icon: Icon,
  title,
  description,
}: BenefitCardProps) => (
  <motion.div className={styles.benefit} variants={fadeInUpShort}>
    <Icon className={styles.benefitIcon} />
    <div className={styles.benefitText}>
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  </motion.div>
);
```

**Estructura de carpetas propuesta**

```
src/components/sections/Hero/
├── Hero.tsx                      # Componente principal (50 líneas)
├── Hero.module.css
├── HeroParallaxLayers.tsx        # Capas decorativas (30 líneas)
├── HeroContent.tsx               # Contenido central (40 líneas)
├── HeroBenefitsList.tsx          # Lista de benefits (20 líneas)
├── HeroBenefitCard.tsx           # Card individual (15 líneas)
├── HeroImage.tsx                 # Imagen con parallax (20 líneas)
├── Hero.types.ts                 # Interfaces compartidas
└── index.ts                      # Barrel export
```

**Beneficios**

- Componentes < 50 líneas cada uno
- Testing granular y simple
- Reutilización de subcomponentes
- Single Responsibility por archivo

---

#### B019: Crear sistema de compound components

**Pattern actual con props drilling**

```tsx
<Card
  title="Servicio"
  subtitle="Descripción"
  price="$50"
  duration="30min"
  image="/image.jpg"
  onBook={handleBook}
/>
```

**Compound Components Pattern**

```tsx
// src/components/ui/Card/Card.tsx
const CardContext = createContext<CardContextType | undefined>(undefined);

export const Card = ({ children, className }: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <CardContext.Provider value={{ isHovered, setIsHovered }}>
      <div className={cn(styles.card, className)}>{children}</div>
    </CardContext.Provider>
  );
};

Card.Header = ({ children, className }: CardHeaderProps) => (
  <div className={cn(styles.header, className)}>{children}</div>
);

Card.Image = ({ src, alt, className }: CardImageProps) => (
  <div className={cn(styles.imageContainer, className)}>
    <img src={src} alt={alt} className={styles.image} />
  </div>
);

Card.Title = ({ children, className }: CardTitleProps) => (
  <h3 className={cn(styles.title, className)}>{children}</h3>
);

Card.Description = ({ children, className }: CardDescriptionProps) => (
  <p className={cn(styles.description, className)}>{children}</p>
);

Card.Footer = ({ children, className }: CardFooterProps) => (
  <div className={cn(styles.footer, className)}>{children}</div>
);

Card.Action = ({ children, ...props }: CardActionProps) => (
  <button className={styles.action} {...props}>
    {children}
  </button>
);
```

**Uso con composición**

```tsx
<Card>
  <Card.Image src="/service.jpg" alt="Corte clásico" />
  <Card.Header>
    <Card.Title>Corte Clásico</Card.Title>
    <Card.Description>Estilo tradicional con acabado premium</Card.Description>
  </Card.Header>
  <Card.Footer>
    <span>$50 • 30min</span>
    <Card.Action onClick={handleBook}>Agendar</Card.Action>
  </Card.Footer>
</Card>
```

**Beneficios**

- API flexible y expresiva
- Sin prop drilling
- Composición natural
- Árbol de React optimizado
- Fácil de extender con nuevos subcomponentes

---

#### B020: Extraer lógica de navegación a helper utilities

**Implementación**

```typescript
// src/utils/navigation.ts
import type { NavigateFunction } from "react-router-dom";

interface ScrollToTopOptions {
  duration?: number;
  immediate?: boolean;
  delay?: number;
}

/**
 * Navega al home y hace scroll al top
 * Maneja tanto navegación interna como desde otras páginas
 */
export const navigateToHomeTop = (
  currentPath: string,
  navigate: NavigateFunction,
  lenis: Lenis | null,
  options: ScrollToTopOptions = {},
) => {
  const { duration = 1.5, immediate = false, delay = 100 } = options;

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration, immediate });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (currentPath === "/") {
    scrollToTop();
  } else {
    navigate("/");
    setTimeout(scrollToTop, delay);
  }
};

/**
 * Scroll suave a un elemento por ID
 */
export const scrollToElement = (
  elementId: string,
  lenis: Lenis | null,
  offset: number = 0,
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (lenis) {
    lenis.scrollTo(element, { offset });
  } else {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

/**
 * Utility para generar href con hash
 */
export const createHashHref = (path: string, hash?: string) => {
  return hash ? `${path}#${hash}` : path;
};
```

**Uso en Navbar**

```tsx
import { navigateToHomeTop } from '@/utils/navigation';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lenis = useLenisInstance();

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigateToHomeTop(location.pathname, navigate, lenis);
  }, [location.pathname, navigate, lenis]);

  return (/* JSX */);
};
```

---

#### B021: Implementar barrel exports organizados

**Estructura propuesta**

```
src/
├── components/
│   ├── ui/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   └── index.ts          # Barrel export
│   ├── icons/
│   │   ├── CalendarIcon.tsx
│   │   ├── ClockIcon.tsx
│   │   └── index.ts          # Barrel export
│   └── sections/
│       └── index.ts           # Barrel export
├── hooks/
│   └── index.ts               # Barrel export
├── utils/
│   └── index.ts               # Barrel export
└── config/
    └── index.ts               # Barrel export
```

**Implementación de barrels**

```typescript
// src/components/ui/index.ts
export { Button } from "./Button/Button";
export { Card } from "./Card/Card";
export { Input } from "./Input/input";
export { ScrollProgressBar } from "./ScrollProgressBar/ScrollProgressBar";

export type { ButtonProps } from "./Button/Button.types";
export type { CardProps } from "./Card/Card.types";

// src/hooks/index.ts
export { useScrollAnimation } from "./useScrollAnimation";
export { useParallaxLayers } from "./useParallaxLayers";
export { useLenisScroll } from "./useLenisScroll";
export { useLenis } from "./useLenis";
export { useNavbarScroll } from "./useNavbarScroll";

// src/utils/index.ts
export * from "./navigation";
export * from "./formatting";
export * from "./validation";
export { cn } from "./utils"; // classNames utility

// src/config/index.ts
export * from "./animations.config";
export * from "./constants";
export * from "./routes";
```

**Beneficios del uso**

```tsx
// Antes: Multiple imports
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/input";

// Después: Single import
import { Button, Card, Input } from "@/components/ui";

// Hooks
import { useScrollAnimation, useParallaxLayers, useLenisScroll } from "@/hooks";

// Utils
import { navigateToHomeTop, formatPrice, cn } from "@/utils";
```

**Consideraciones**

- No usar barrel exports en carpetas enormes (performance)
- Útil para APIs públicas de módulos
- Facilita refactoring interno sin cambiar imports

---

#### B022: Separar data fetching logic de componentes

**Estado actual**

```tsx
// Services.tsx
import { servicesList } from "@/data/servicesData";

export const Services = () => {
  // Componente directamente usa datos importados
  return (
    <>
      {servicesList.map((service) => (
        <ServiceCard {...service} />
      ))}
    </>
  );
};
```

**Propuesta con capa de servicios**

```typescript
// src/services/api/services.api.ts
import { servicesList } from "@/data/servicesData";
import type { Service } from "@/types";

/**
 * Service layer para datos de servicios
 * Abstrae origen de datos (actualmente local, futuro API)
 */

export const servicesApi = {
  /**
   * Obtiene lista completa de servicios
   */
  async getServices(): Promise<Service[]> {
    // Actualmente retorna datos locales
    // Futuro: return fetch('/api/services').then(r => r.json())
    return Promise.resolve(servicesList);
  },

  /**
   * Obtiene un servicio por ID
   */
  async getServiceById(id: string): Promise<Service | undefined> {
    const services = await this.getServices();
    return services.find((s) => s.id === id);
  },

  /**
   * Filtra servicios por categoría
   */
  async getServicesByCategory(category: string): Promise<Service[]> {
    const services = await this.getServices();
    return services.filter((s) => s.category === category);
  },
};

// src/services/api/index.ts
export { servicesApi } from "./services.api";
export { productsApi } from "./products.api";
export { reviewsApi } from "./reviews.api";
```

**Hook para consumir API**

```typescript
// src/hooks/useServices.ts
import { useState, useEffect } from "react";
import { servicesApi } from "@/services/api";
import type { Service } from "@/types";

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    servicesApi
      .getServices()
      .then(setServices)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { services, loading, error };
};
```

**Uso en componente**

```tsx
// Services.tsx - Con data fetching
export const Services = () => {
  const { services, loading, error } = useServices();

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <>
      {services.map((service) => (
        <ServiceCard key={service.id} {...service} />
      ))}
    </>
  );
};
```

**Beneficios**

- Fácil migración a API real en futuro
- Componentes desacoplados de origen de datos
- Posibilidad de agregar caching, retry logic
- Testing simplificado con mocks
- Consistent data access pattern
