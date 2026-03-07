# 🚀 Plan de Mejoras - Rendimiento y Calidad de Código

**Fecha:** Marzo 7, 2026  
**Estado Actual:** Optimizaciones React 19 + Performance (Opción A + B) ✅ Completadas

---

## 📊 ANÁLISIS DE MEJORAS DISPONIBLES

### Estado Actual ✅

- ✅ React 19 optimizations (memo, useMemo, useCallback eliminados)
- ✅ Lazy loading imágenes off-screen
- ✅ Self-hosted fonts (Montserrat)
- ✅ Preload hero image
- ✅ PNG optimizadas automáticamente (-46%)
- ✅ TypeScript strict mode activado
- ✅ ESLint configurado con React Hooks
- ✅ Code splitting óptimo (Vite)
- ✅ Bundle: 70 KB gzip (main), page weight: 3.13 MB

---

## 🎯 MEJORAS PROPUESTAS POR CATEGORÍA

---

## 🚀 1. RENDIMIENTO WEB AVANZADO

### 🔥 PRIORIDAD ALTA

#### 1.1 Responsive Images (srcset) - **IMPACTO ALTO**

**Problema:**
Actualmente una sola imagen sirve a todos los dispositivos (móvil, tablet, desktop).

- Hero image: 685 KB servidaa móviles con pantalla de 375px
- Social proof: 849 KB para cualquier tamaño

**Solución:**
Generar múltiples tamaños automáticamente:

```typescript
// Con vite-imagetools
import heroImage from '@/assets/hero_model.png?w=400;800;1200&format=webp';

<img
  srcset="hero-400w.webp 400w, hero-800w.webp 800w, hero-1200w.webp 1200w"
  sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
  src="hero-1200w.webp"
/>
```

**Beneficios:**

- Móviles: -60-70% data transfer (685 KB → 200 KB)
- Tablets: -30-40% data transfer
- Desktop: Sin cambios
- **LCP en móviles:** -800ms a -1.2s

**Implementación:**

- Instalar `vite-imagetools`
- Crear componente `<ResponsiveImage />` reutilizable
- Actualizar componentes Hero, SocialProof, CTA
- Testing en diferentes devices

**Esfuerzo:** 1.5-2 horas  
**KPI:** LCP móvil -40%, data transfer móvil -60%

---

#### 1.2 Conversión WebP/AVIF con fallback - **IMPACTO MUY ALTO**

**Problema:**
PNG optimizadas aún son grandes (2.35 MB total).

- WebP: -60-70% vs PNG
- AVIF: -70-80% vs PNG (mejor compresión, menor soporte)

**Solución:**
Elemento `<picture>` con múltiples formatos:

```tsx
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.png" alt="Hero" />
</picture>
```

**Beneficios:**

- **Page weight:** 2.35 MB → **700-900 KB** (-60-65%)
- **LCP:** -500-800ms adicionales
- Navegadores modernos: AVIF
- Navegadores antiguos: PNG fallback

**Implementación:**

- Configurar plugin para generar múltiples formatos
- Crear componente `<Picture />` wrapper
- Actualizar todas las imágenes grandes
- Testing compatibilidad navegadores

**Esfuerzo:** 2-2.5 horas  
**KPI:** Page weight -60%, LCP -30% adicional

---

#### 1.3 Brotli Pre-compression - **IMPACTO MEDIO**

**Problema:**
Assets servidos con gzip (bueno), pero Brotli es 15-20% mejor.

**Solución:**

```bash
npm install -D vite-plugin-compression2

# vite.config.ts
import { compression } from 'vite-plugin-compression2'

plugins: [
  compression({
    algorithm: 'brotliCompress',
    exclude: [/\.(br)$/, /\.(gz)$/],
    threshold: 1024,
  }),
]
```

**Beneficios:**

- Main bundle: 70 KB gzip → **58-60 KB brotli** (-15%)
- Vendor chunks: Similar reducción
- CDN/server debe soportar `.br` files

**Esfuerzo:** 20 minutos  
**KPI:** Bundle -15%, TTI -50-100ms

---

### ⚡ PRIORIDAD MEDIA

#### 1.4 Progressive Web App (PWA) - **IMPACTO MEDIO-ALTO**

**Beneficios:**

- Offline support (Service Worker)
- Install prompt (Add to Home Screen)
- Splash screen
- App-like experience
- Cache strategies

**Implementación:**

```bash
npm install -D vite-plugin-pwa

# manifest.json
{
  "name": "Royce Barbería",
  "short_name": "Royce",
  "description": "Barbería premium con estilo único",
  "theme_color": "#B8860B",
  "icons": [...],
  "start_url": "/",
  "display": "standalone"
}
```

**Esfuerzo:** 2-3 horas (manifest + service worker + testing)  
**KPI:** Lighthouse PWA score 100, repeat visits -80% data

---

#### 1.5 Critical CSS Inline - **IMPACTO MEDIO**

**Problema:**
CSS principal (50 KB) bloquea first paint.

**Solución:**
Extraer CSS above-the-fold e inline en `<head>`:

```html
<style>
  /* Critical CSS for Hero section */
</style>
<link
  rel="stylesheet"
  href="styles.css"
  media="print"
  onload="this.media='all'"
/>
```

**Esfuerzo:** 45-60 minutos  
**KPI:** FCP -100-200ms

---

## 🌐 2. SEO & ACCESIBILIDAD

### 🔥 PRIORIDAD ALTA

#### 2.1 Meta Tags SEO Completos - **IMPACTO ALTO**

**Problema Actual:**

```html
<!-- Solo esto en index.html -->
<title>Royce Barbería</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Faltan:**

- Meta description
- Open Graph tags (Facebook/LinkedIn)
- Twitter Card tags
- Canonical URL
- Language/locale

**Solución Completa:**

```html
<!-- Primary Meta Tags -->
<meta name="title" content="Royce Barbería - Tu Estilo, Nuestra Pasión" />
<meta
  name="description"
  content="Barbería premium en Santiago. Cortes expertos, ambiente exclusivo y atención personalizada. Agenda tu cita hoy."
/>
<meta
  name="keywords"
  content="barbería, cortes de cabello, barbería Santiago, corte hombre"
/>
<link rel="canonical" href="https://roycebarber.com/" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://roycebarber.com/" />
<meta property="og:title" content="Royce Barbería - Cortes Premium" />
<meta
  property="og:description"
  content="Tu barbería de confianza para un estilo impecable."
/>
<meta property="og:image" content="https://roycebarber.com/og-image.png" />
<meta property="og:locale" content="es_CL" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://roycebarber.com/" />
<meta
  name="twitter:title"
  content="Royce Barbería - Tu Estilo, Nuestra Pasión"
/>
<meta
  name="twitter:description"
  content="Barbería premium con cortes expertos."
/>
<meta name="twitter:image" content="https://roycebarber.com/twitter-card.png" />

<!-- Favicon completo -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

**Esfuerzo:** 30 minutos + generar imágenes OG  
**KPI:** SEO score +10-15, CTR social media +30%

---

#### 2.2 Structured Data (JSON-LD) - **IMPACTO ALTO SEO**

**Beneficio:**
Rich snippets en Google (horarios, ubicación, reviews, rating).

**Implementación:**

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "name": "Royce Barbería",
    "image": "https://roycebarber.com/logo.png",
    "telephone": "+56912345678",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Providencia 123",
      "addressLocality": "Santiago",
      "postalCode": "7500000",
      "addressCountry": "CL"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "10:00",
        "closes": "20:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "priceRange": "$$"
  }
</script>
```

**Esfuerzo:** 45 minutos  
**KPI:** Rich snippets en Google, CTR +15-25%

---

#### 2.3 Mejoras de Accesibilidad - **IMPACTO MEDIO-ALTO**

**Faltantes Detectados:**

1. **Skip to main content link**

```tsx
<a href="#main-content" className="skip-link">
  Saltar al contenido principal
</a>
```

2. **ARIA landmarks faltantes**

```tsx
<header role="banner">
<nav role="navigation" aria-label="Navegación principal">
<main role="main" id="main-content">
<footer role="contentinfo">
```

3. **Focus management en mobile menu**

```tsx
// Trap focus dentro del menu al abrir
useFocusTrap(menuRef, isOpen);
```

4. **Contraste de colores**

- Verificar ratio 4.5:1 (WCAG AA)
- Usar herramienta: https://webaim.org/resources/contrastchecker/

5. **Screen reader friendly animations**

```tsx
<motion.div aria-hidden="true"> {/* Decorative only */}
```

**Esfuerzo:** 2-3 horas  
**KPI:** Lighthouse Accessibility 95+ → 100

---

### ⚡ PRIORIDAD MEDIA

#### 2.4 Sitemap.xml + robots.txt - **IMPACTO SEO**

**robots.txt:**

```
User-agent: *
Allow: /
Sitemap: https://roycebarber.com/sitemap.xml
```

**sitemap.xml:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://roycebarber.com/</loc>
    <lastmod>2026-03-07</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://roycebarber.com/servicios</loc>
    <priority>0.8</priority>
  </url>
  ...
</urlset>
```

**Esfuerzo:** 30 minutos  
**KPI:** Crawling mejorado, indexación +20%

---

## 💎 3. CALIDAD DE CÓDIGO

### 🔥 PRIORIDAD ALTA

#### 3.1 Error Boundaries - **CRÍTICO PARA PRODUCCIÓN**

**Problema:**
Si un componente crashea, toda la app se cae.

**Solución:**

```tsx
// components/common/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Opcional: Enviar a Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-fallback">
            <h2>Algo salió mal</h2>
            <button onClick={() => window.location.reload()}>
              Recargar página
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// App.tsx
<ErrorBoundary>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route
        path="servicios"
        element={
          <ErrorBoundary fallback={<ErrorPage />}>
            <Suspense fallback={<Loading />}>
              <ServicesPage />
            </Suspense>
          </ErrorBoundary>
        }
      />
    </Route>
  </Routes>
</ErrorBoundary>;
```

**Esfuerzo:** 45 minutos  
**KPI:** Evita crashes totales, mejor UX

---

#### 3.2 ESLint Rules Adicionales - **IMPACTO MEDIO**

**Agregar:**

```bash
npm install -D eslint-plugin-jsx-a11y eslint-plugin-import
```

**eslint.config.js:**

```javascript
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  {
    plugins: {
      "jsx-a11y": jsxA11y,
      import: importPlugin,
    },
    rules: {
      // Accesibilidad
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/click-events-have-key-events": "warn",

      // Import order
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],

      // Code quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
]);
```

**Esfuerzo:** 30 minutos + fix warnings  
**KPI:** Código más consistente, menos bugs

---

#### 3.3 Testing Setup - **IMPACTO ALTO LARGO PLAZO**

**Implementación:**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**vitest.config.ts:**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
  },
});
```

**Ejemplos de tests:**

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

**Esfuerzo:** 3-4 horas setup + escribir tests iniciales  
**KPI:** Coverage >70%, menos regresiones

---

### ⚡ PRIORIDAD MEDIA

#### 3.4 Prettier + Husky Pre-commit Hooks - **DX**

**Prettier:**

```bash
npm install -D prettier eslint-config-prettier

# .prettierrc
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

**Husky:**

```bash
npm install -D husky lint-staged

# package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}

# .husky/pre-commit
npx lint-staged
```

**Esfuerzo:** 45 minutos  
**KPI:** Código consistente, menos debates de estilo

---

#### 3.5 Bundle Analyzer - **DEBUGGING**

**Implementación:**

```bash
npm install -D rollup-plugin-visualizer

# vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  visualizer({
    open: true,
    gzipSize: true,
    brotliSize: true,
  }),
]
```

**Genera:** `stats.html` con treemap del bundle

**Esfuerzo:** 10 minutos  
**KPI:** Identificar bloat, optimizar imports

---

## 📊 4. MONITORING & ANALYTICS

### 🔥 PRIORIDAD ALTA (PRODUCCIÓN)

#### 4.1 Web Vitals Reporting - **CRÍTICO**

**Implementación:**

```bash
npm install web-vitals

// src/reportWebVitals.ts
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

export function reportWebVitals() {
  onCLS(console.log); // O enviar a analytics
  onFCP(console.log);
  onLCP(console.log);
  onTTFB(console.log);
  onINP(console.log);
}

// main.tsx
reportWebVitals();
```

**Enviar a Google Analytics:**

```typescript
function sendToGA({ name, value, id }) {
  gtag("event", name, {
    value: Math.round(name === "CLS" ? value * 1000 : value),
    metric_id: id,
    metric_value: value,
    metric_delta: delta,
  });
}
```

**Esfuerzo:** 30 minutos  
**KPI:** Datos reales de performance en producción

---

#### 4.2 Error Tracking (Sentry) - **CRÍTICO**

```bash
npm install @sentry/react

// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**Esfuerzo:** 45 minutos  
**KPI:** Detectar errores antes que usuarios

---

### ⚡ PRIORIDAD MEDIA

#### 4.3 Analytics (Plausible/Google) - **BUSINESS INSIGHTS**

**Plausible (privacy-friendly):**

```html
<script
  defer
  data-domain="roycebarber.com"
  src="https://plausible.io/js/script.js"
></script>
```

**Google Analytics 4:**

```html
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

**Esfuerzo:** 20 minutos  
**KPI:** Insights de usuarios, conversiones

---

## 📋 PLAN DE IMPLEMENTACIÓN RECOMENDADO

### 🚀 FASE 1: Quick Wins (2-3 horas)

**Prioridad:** Máximo impacto, bajo esfuerzo

1. ✅ **Brotli compression** (20 min) - Bundle -15%
2. ✅ **Meta tags SEO** (30 min) - SEO score +15
3. ✅ **Error Boundaries** (45 min) - Evita crashes
4. ✅ **Web Vitals reporting** (30 min) - Datos reales
5. ✅ **Structured Data** (45 min) - Rich snippets

**Impacto Total:**

- SEO: +25-30 puntos
- Production-ready
- Monitoring básico

---

### 🔥 FASE 2: Performance Avanzado (3-4 horas)

**Prioridad:** Reducir page weight adicional

1. ✅ **Responsive images (srcset)** (1.5-2h) - Móvil -60%
2. ✅ **WebP/AVIF conversion** (2-2.5h) - Total -60-65%

**Impacto Total:**

- Page weight: 3.13 MB → **1.2-1.5 MB** (-50-60%)
- LCP móvil: -1.5-2s
- Lighthouse: 85 → **92-95**

---

### 💎 FASE 3: Code Quality (4-5 horas)

**Prioridad:** Mantenibilidad largo plazo

1. ✅ **Testing setup** (3-4h) - Vitest + React Testing Library
2. ✅ **ESLint rules adicionales** (30 min + fixes)
3. ✅ **Prettier + Husky** (45 min) - Code formatting
4. ✅ **Accesibilidad mejoras** (2-3h) - A11y score 100

**Impacto Total:**

- Menos regresiones
- Código más mantenible
- Onboarding más fácil

---

### 🌐 FASE 4: PWA (2-3 horas)

**Prioridad:** Opcional, mejora UX

1. ✅ **Manifest.json + Service Worker** (2-3h)
2. ✅ **Offline support**
3. ✅ **Install prompt**

**Impacto Total:**

- PWA score: 100
- Repeat visits: -80% data
- App-like experience

---

## 🎯 RECOMENDACIÓN FINAL

**Si tienes 2-3 horas:** **FASE 1** (Quick Wins)

- Máximo ROI
- Production-ready inmediato
- SEO + Monitoring + Error handling

**Si tienes 5-7 horas:** **FASE 1 + FASE 2**

- Performance óptimo
- Page weight <1.5 MB
- Lighthouse 92-95

**Si tienes 10+ horas:** **TODO (FASE 1-4)**

- App de producción completa
- Testing + Monitoring
- PWA support

---

## ❓ SIGUIENTE PASO

**¿Con qué fase quieres empezar?**

**A)** FASE 1 - Quick Wins (2-3h) - Producción ready  
**B)** FASE 2 - WebP/Responsive (3-4h) - Performance extremo  
**C)** FASE 3 - Code Quality (4-5h) - Testing + A11y  
**D)** FASE 4 - PWA (2-3h) - App experience  
**E)** Combinación personalizada

O si prefieres una implementación específica de la lista.
