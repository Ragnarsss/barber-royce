# Plan de Optimización de Performance

## Lighthouse Audit - Baseline (11 Marzo 2026)

### Performance Score: 90/100 ✅ (Bueno, mejorable)

**Core Web Vitals:**

- ✅ **FCP**: 0.5s (Excelente, < 1.8s)
- ⚠️ **LCP**: 2.0s (Naranja, objetivo < 2.5s)
- ✅ **TBT**: 10ms (Excelente, < 200ms)
- ✅ **CLS**: 0 (Perfecto)
- ✅ **Speed Index**: 1.2s (Excelente)

**Veredicto inicial**: TBT de 10ms indica que las animaciones NO están bloqueando el main thread durante carga. El lag percibido en scroll probablemente es por:

1. Repaint/reflow durante scroll (forced reflows: 115ms detectados)
2. Imágenes pesadas causando jank al cargar lazy
3. Exceso de will-change: transform causando memory pressure

---

## PRIORIDAD 1: IMÁGENES (Impacto Crítico - LCP)

### Problema: 2,531 KiB de savings potencial

**Archivos problemáticos:**

| Imagen                      | Peso Actual | Dimensiones Reales | Dimensiones Display | Savings Potencial |
| --------------------------- | ----------- | ------------------ | ------------------- | ----------------- |
| social_proof.png            | 848.5 KiB   | 2106x1240          | 560x330             | 818.4 KiB         |
| barber_background.png       | 760.7 KiB   | 2216x2389          | 859x1174            | 615.9 KiB         |
| hero_model_left_profile.png | 684.8 KiB   | 1672x1836          | 842x925             | 558.0 KiB         |
| cta1_model.png              | 633.3 KiB   | 1982x1888          | 700x925             | 527.9 KiB         |
| royce-barber-logo.png       | 11.5 KiB    | 244x294            | 41x50               | 11.2 KiB          |

**Total payload actual: 3,419 KiB** (96% son imágenes)

### Acciones Requeridas:

1. **Convertir a WebP/AVIF**
   - PNG → WebP: ~70-80% reducción con calidad similar
   - Considerar AVIF para hero/cta (mejor compresión, soporte Safari 16+)

2. **Generar imágenes responsive**

   ```html
   <!-- Antes -->
   <img src="hero_model.png" alt="..." />

   <!-- Después -->
   <img
     srcset="
       hero_model_560w.webp   560w,
       hero_model_842w.webp   842w,
       hero_model_1200w.webp 1200w
     "
     sizes="(max-width: 768px) 560px, 842px"
     src="hero_model_842w.webp"
     alt="..."
     width="842"
     height="925"
   />
   ```

3. **Agregar width/height explícitos al logo**
   - Actualmente causa CLS por no tener dimensiones
   - Agregar `width="41" height="50"` en Navbar.tsx

---

## PRIORIDAD 2: FORCED REFLOWS (Impacto Alto - Scroll Performance)

### Detected: 115ms total reflow time

**Ubicación**: `index-Dt7sOAvM.js:15` y `animation-vendor-Mo1srAnf.js:1`

**Causa probable**: Queries de propiedades geométricas (offsetWidth, getBoundingClientRect) después de cambios DOM durante animaciones.

**Sospechosos:**

1. **useParallaxLayers** - múltiples useTransform subscriptions
2. **useLenisScroll** - tracking de velocidad/dirección
3. **Framer Motion layout animations** - automatic layout measurement

### Solución:

```typescript
// Malo: Causa reflow
const element = ref.current;
element.style.transform = `translateY(${scrollY}px)`;
const height = element.offsetHeight; // ❌ REFLOW!

// Bueno: Batch reads, then writes
const height = element.offsetHeight; // READ
requestAnimationFrame(() => {
  element.style.transform = `translateY(${scrollY}px)`; // WRITE
});
```

**Implementar**:

- Custom hook `useRAFThrottle` para batch style changes
- Separar layout reads de layout writes
- Usar `will-change: transform` SOLO durante animación activa

---

## PRIORIDAD 3: CRITICAL REQUEST CHAINS (Impacto Medio - FCP/LCP)

### Max critical path latency: 405ms

**Fonts waterfall:**

```
CSS load → 64ms
  ↓
Montserrat Regular → 300ms
Montserrat Medium → 312ms
Montserrat SemiBold → 335ms
Montserrat Bold → 405ms
```

### Solución:

```html
<!-- Preload critical fonts en index.html -->
<link
  rel="preload"
  href="/fonts/montserrat-v25-latin-700.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/montserrat-v25-latin-regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

---

## PRIORIDAD 4: RENDER-BLOCKING CSS (Impacto Bajo - FCP)

### index-Bgx7UwkY.css blocking 0ms (ya está bien!)

Actualmente el CSS no está bloqueando significativamente. No requiere acción inmediata.

---

## PRIORIDAD 5: UNUSED JAVASCRIPT (Impacto Bajo - Bundle Size)

### localhost JS:

- index.js: 79.3 KiB (29.5 KiB unused = 37%)
- animation-vendor.js: 45.7 KiB (24.6 KiB unused = 54%)

**Causa**: Framer Motion import completo. Considerar:

1. Tree shaking verification
2. Import específico: `import { motion, useTransform } from 'framer-motion'` vs `import * as FM from 'framer-motion'`
3. Lazy load animation-vendor solo cuando elemento entra en viewport

---

## ANÁLISIS DE ANIMACIONES (Del código)

### Problemas Críticos Identificados

#### 1. Exceso de elementos motion.div con parallax (Alto Impacto)

**Ubicación**: Hero.tsx, SocialProof1.tsx, SocialProof2.tsx, CTA1.tsx, CTA2.tsx

**Problema**:

- Hero: 6 capas parallax simultáneas
- SocialProof1: 5 lasers diagonales + 10+ hexágonos
- SocialProof2: 12+ hexágonos con parallax
- Total: ~35+ elementos animados por scroll simultáneamente

**Impacto**:

- Cada motion.div subscribirse a scrollYProgress trigger re-renders
- 35+ recalculaciones por frame durante scroll
- GPU overload con múltiples compositing layers

#### 2. will-change: transform en exceso (Medio Impacto)

**Ubicación**: Todos los module.css con elementos animados

**Problema**:

```css
/* 20+ elementos con will-change permanente */
.hexagon {
  will-change: transform;
}
.laser {
  will-change: transform;
}
.triangle {
  will-change: transform;
}
```

**Impacto**:

- Crea compositing layers prematuramente
- Consumo de memoria GPU aumentado
- En PC gama media: puede causar swapping de VRAM

**Best Practice 2026**:

- Solo usar will-change durante animación activa
- Aplicar/remover dinámicamente con JS
- Máximo 3-5 elementos con will-change simultáneos

#### 3. useTransform excesivo y no optimizado (Alto Impacto)

**Ubicación**: SocialProof1.tsx

**Problema actual**:

```tsx
// 10 useTransform calls creando 10 MotionValues
const diagonal1 = {
  x: useTransform(layers.scrollYProgress, [0, 1], ["-100%", "100%"]),
  y: useTransform(layers.scrollYProgress, [0, 1], ["100%", "-100%"]),
};
const diagonal2 = {
  x: useTransform(layers.scrollYProgress, [0, 1], ["-80%", "120%"]),
  y: useTransform(layers.scrollYProgress, [0, 1], ["-80%", "120%"]),
};
// ... x5 diagonales = 10 transforms
```

**Impacto**:

- Cada useTransform es un subscriber independiente
- 10 cálculos separados por scroll tick
- Puede causar batching delays

**Solución 2026**:

- Usar single useTransform con mapping function
- SharedValue pattern con Reanimated-style optimization
- Lazy evaluation con useMemo + throttle

#### 4. useMemo innecesarios con overhead (Bajo-Medio Impacto)

**Problema**:

```tsx
// Hero.tsx - Memoización innecesaria
const bgTriangleStyle = useMemo(
  () =>
    isReady ? { y: layers.background.y, scale: layers.background.scale } : {},
  [isReady, layers.background.y, layers.background.scale],
);
```

**Por qué es problemático**:

- layers.background.y es un MotionValue (ya optimizado)
- Crear objeto {} cada render es más barato que comparar 3 deps
- useMemo tiene overhead de comparación

#### 5. Animaciones condicionales binarias (Medio Impacto)

**Problema**:

```tsx
const hexMiddle2Style = useMemo(
  () => ({ opacity: direction === 1 ? 0.6 : 0.5 }),
  [direction],
);
```

**Impacto**:

- Saltos visuales en cambio de dirección
- No aprovecha hardware acceleration para interpolación
- Re-render en cada cambio de dirección

---

## Técnicas Modernas de Optimización (2026)

### 1. Passive Event Listeners + Throttled Updates

```typescript
// Custom hook optimizado
export const useThrottledScroll = (fps: number = 30) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const delay = 1000 / fps;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Passive listener para mejor performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fps]);

  return scrollY;
};
```

### 2. CSS Containment (Layout + Paint isolation)

```css
/* Aísla cálculos de layout/paint a contenedores específicos */
.hero {
  contain: layout style paint;
  content-visibility: auto; /* Lazy rendering fuera de viewport */
}

.parallaxLayer {
  /* Solo transform y opacity para hardware acceleration */
  will-change: auto; /* Dejar que browser decida */
}
```

### 3. Intersection Observer basado en performance

```typescript
export const useInViewOptimized = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Solo update cuando cambio es significativo
        if (Math.abs(entry.intersectionRatio - threshold) > 0.05) {
          setIsInView(entry.isIntersecting);
        }
      },
      {
        threshold,
        rootMargin: "50px", // Preload antes de entrar
      },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};
```

### 4. SharedLayout con Framer Motion 11+ (2026)

```typescript
// Reducir motion.div count con shared animations
import { LayoutGroup, motion } from 'framer-motion';

export const OptimizedParallaxGroup = ({ children }) => (
  <LayoutGroup>
    {children}
  </LayoutGroup>
);
```

### 5. Web Animations API (WAAPI) para animaciones críticas

```typescript
// Alternativa a Framer Motion para parallax simple
export const useWAAPIParallax = (elementRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const animation = elementRef.current.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(100px)" }],
      {
        timeline: new ViewTimeline({
          subject: elementRef.current,
          axis: "block",
        }),
        rangeStart: "entry 0%",
        rangeEnd: "exit 100%",
      },
    );

    return () => animation.cancel();
  }, [elementRef]);
};
```

### 6. GPU Compositing hints en CSS

```css
/* Force GPU acceleration solo cuando necesario */
.parallaxActive {
  transform: translateZ(0); /* Force GPU layer */
  backface-visibility: hidden;
  perspective: 1000px;
}
```

---

## Plan de Implementación

> **Orden basado en datos de Lighthouse Audit**  
> Prioridades ordenadas por impacto real en Performance Score y experiencia de usuario.

---

### Fase 1: Imágenes y Fonts (MÁXIMO IMPACTO) - 2-3 horas

> **Impacto esperado**: Score 90 → 95+, LCP 2.0s → 1.2s, payload 3.4 MB → 0.9 MB

#### 1.1 Optimizar imágenes (PRIORIDAD 1 - Lighthouse)

**Problema**: 2,531 KiB de savings potenciales, imágenes son 96% del payload total.

**Paso 1**: Instalar herramientas de conversión

```bash
npm install -D sharp
```

**Paso 2**: Crear script de optimización

**Archivo**: `scripts/optimize-images.js` (nuevo)

```javascript
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const images = [
  { input: "social_proof.png", sizes: [560, 1120, 1680] }, // 2106x1240 → 560w base
  { input: "barber_background.png", sizes: [859, 1718] }, // 2216x2389 → 859w base
  { input: "hero_model_left_profile.png", sizes: [842, 1684] }, // 1672x1836 → 842w base
  { input: "cta1_model.png", sizes: [700, 1400] }, // 1982x1888 → 700w base
  { input: "royce-barber-logo.png", sizes: [41] }, // 244x294 → 41w base (solo 1x)
];

const sourceDir = "./src/assets/img";
const outputDir = "./src/assets/img/optimized";

async function optimizeImages() {
  await fs.mkdir(outputDir, { recursive: true });

  for (const img of images) {
    const inputPath = path.join(sourceDir, img.input);
    const baseName = img.input.replace(".png", "");

    for (const size of img.sizes) {
      // WebP (mejor compresión, soportado en 2026 por 98%+ browsers)
      await sharp(inputPath)
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality: 85, effort: 6 })
        .toFile(path.join(outputDir, `${baseName}_${size}w.webp`));

      console.log(`✅ Generated ${baseName}_${size}w.webp`);
    }

    // AVIF fallback (mejor compresión, no critical)
    const baseSize = img.sizes[0];
    await sharp(inputPath)
      .resize(baseSize, null, { withoutEnlargement: true })
      .avif({ quality: 80 })
      .toFile(path.join(outputDir, `${baseName}_${baseSize}w.avif`));

    console.log(`✅ Generated ${baseName}_${baseSize}w.avif (fallback)`);
  }

  console.log("\n🎉 Image optimization complete!");
  console.log("📊 Estimated savings: ~2.5 MB");
}

optimizeImages().catch(console.error);
```

**Paso 3**: Ejecutar optimización

```bash
node scripts/optimize-images.js
```

**Paso 4**: Actualizar componentes con responsive images

**Hero.tsx** - Ejemplo de implementación:

```tsx
// ANTES
<img
  src={heroModelLeftProfile}
  alt="Cliente satisfecho"
  className={styles.modelImage}
/>

// DESPUÉS
<img
  srcSet="
    /src/assets/img/optimized/hero_model_left_profile_842w.webp 842w,
    /src/assets/img/optimized/hero_model_left_profile_1684w.webp 1684w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  src="/src/assets/img/optimized/hero_model_left_profile_842w.webp"
  width="842"
  height="925"
  alt="Cliente satisfecho después del corte"
  loading="eager"
  fetchpriority="high"
  className={styles.modelImage}
/>
```

**Archivos a modificar**:

- `src/components/sections/Hero/Hero.tsx`
- `src/components/sections/SocialProof1/SocialProof1.tsx`
- `src/components/sections/SocialProof2/SocialProof2.tsx`
- `src/components/sections/CTA1/CTA1.tsx`
- `src/components/layout/Navbar/Navbar.tsx` (logo con width/height)

**Acceptance criteria**:

- ✅ Todas las imágenes convertidas a WebP con formatos @1x, @2x, @3x
- ✅ `srcset` implementado con `sizes` attribute
- ✅ `width` y `height` explícitos en todos los `<img>` tags
- ✅ `loading="eager"` en hero image, `loading="lazy"` en below-the-fold
- ✅ Payload total < 1 MB

---

#### 1.2 Preload critical fonts (PRIORIDAD 3 - Lighthouse)

**Problema**: Font waterfall de 405ms delayando LCP.

**Archivo**: `index.html`

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- AGREGAR: Preload critical fonts -->
    <link
      rel="preload"
      href="/fonts/Montserrat-Regular.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="/fonts/Montserrat-Bold.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <title>Royce Barber - Barbería Premium</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Acceptance criteria**:

- ✅ Fonts Montserrat Regular y Bold preloaded
- ✅ Font loading time reducido de 405ms → <150ms
- ✅ No FOUT (Flash of Unstyled Text)

---

### Fase 2: Forced Reflows y will-change (ALTO IMPACTO) - 3-4 horas

> **Impacto esperado**: Eliminar 115ms de reflows, scroll butter-smooth 60fps

#### 2.1 Crear useRAFThrottle hook (evitar forced reflows)

**Problema**: 115ms de forced reflows en `index-Dt7sOAvM.js:15` por queries geométricas después de cambios de estilo.

**Archivo**: `src/hooks/useRAFThrottle.ts` (nuevo)

```typescript
import { useEffect, useState, useCallback } from "react";

/**
 * Throttle updates usando requestAnimationFrame
 * Previene forced reflows batching reads y writes
 */
export const useRAFThrottle = <T>(value: T, fps = 30): T => {
  const [throttledValue, setThrottledValue] = useState(value);
  const frameInterval = 1000 / fps; // 30fps = 33ms entre frames

  useEffect(() => {
    let rafId: number;
    let lastFrameTime = performance.now();

    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;

      if (elapsed >= frameInterval) {
        setThrottledValue(value);
        lastFrameTime = currentTime - (elapsed % frameInterval);
      }

      rafId = requestAnimationFrame(updateValue);
    };

    rafId = requestAnimationFrame(updateValue);
    return () => cancelAnimationFrame(rafId);
  }, [value, frameInterval]);

  return throttledValue;
};
```

#### 2.2 Refactor useParallaxLayers con batching

**Archivo**: `src/hooks/useParallaxLayers.ts`

```typescript
// ANTES: Múltiples suscripciones individuales causan reflows
const useParallaxLayers = () => {
  const { scrollY } = useScroll();

  // Cada useTransform dispara una lectura del DOM
  const bg = useTransform(scrollY, [0, 1000], [0, 300]);
  const fg = useTransform(scrollY, [0, 1000], [0, -300]);
  // ... 6+ transforms más
};

// DESPUÉS: Batch reads, single RAF, sin forced reflows
const useParallaxLayers = () => {
  const { scrollY } = useScroll();
  const throttledScrollY = useRAFThrottle(scrollY.get(), 30); // 30fps suficiente

  const layers = useMemo(
    () => ({
      background: useTransform(() => throttledScrollY * 0.3),
      foreground: useTransform(() => throttledScrollY * -0.3),
      // ... calculadas en single pass
    }),
    [throttledScrollY],
  );

  return layers;
};
```

#### 2.3 Optimizar will-change dinámicamente (PRIORIDAD 2 Animation)

**Problema**: 20+ elementos con `will-change: transform` permanente → GPU memory waste.

**Solución**: Aplicar solo cuando animating.

**Paso 1**: Remover will-change de CSS

**Hero.module.css** - Aplicar a todos los module.css:

```css
/* REMOVER will-change estático */
.leftTriangleBackground {
  /* will-change: transform; */ /* ❌ REMOVER */
}

.hexagonLayer {
  /* will-change: transform; */ /* ❌ REMOVER */
}

/* AGREGAR clase dinámica */
.parallaxLayer {
  will-change: auto; /* Browser decide */
}

.parallaxLayer.isAnimating {
  will-change: transform; /* Solo cuando scrolling */
}
```

**Paso 2**: Aplicar dinámicamente via IntersectionObserver

```tsx
const [isInView, setIsInView] = useState(false);
const ref = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsInView(entry.isIntersecting),
    { rootMargin: "100px" }, // Preload antes de entrar
  );

  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);

<motion.div
  ref={ref}
  className={cn(styles.layer, isInView && styles.isAnimating)}
/>;
```

**Acceptance criteria**:

- ✅ Forced reflows: 115ms → 0ms
- ✅ will-change activos: 20+ → 3-5 (solo visible elements)
- ✅ FPS durante scroll: 30-45 → 55-60fps

---

### Fase 3: Refactor Arquitectura (OPTIMIZACIÓN CODE) - 4-6 horas

> **Impacto esperado**: Código más mantenible, nuevos patterns para futuros features

#### 3.1 Consolidar useTransform calls (SocialProof1)

**Problema**: 10 useTransform calls para 5 lasers → overhead innecesario.

**SocialProof1.tsx - ANTES**:

```tsx
const diagonal1 = {
  x: useTransform(layers.scrollYProgress, [0, 1], ["-100%", "100%"]),
  y: useTransform(layers.scrollYProgress, [0, 1], ["100%", "-100%"]),
};
const diagonal2 = {
  x: useTransform(layers.scrollYProgress, [0, 1], ["-80%", "80%"]),
  y: useTransform(layers.scrollYProgress, [0, 1], ["-80%", "80%"]),
};
// ... 3 lasers more = 10 useTransform total
```

**SocialProof1.tsx - DESPUÉS**:

```tsx
// Single transform factory
const createDiagonalTransform = useCallback(
  (xRange: string[], yRange: string[]) => ({
    x: useTransform(layers.scrollYProgress, [0, 1], xRange),
    y: useTransform(layers.scrollYProgress, [0, 1], yRange),
  }),
  [layers.scrollYProgress],
);

// 2 transforms en vez de 10
const diagonals = useMemo(
  () => [
    createDiagonalTransform(["-100%", "100%"], ["100%", "-100%"]),
    createDiagonalTransform(["-80%", "80%"], ["-80%", "80%"]),
    createDiagonalTransform(["120%", "-120%"], ["120%", "-120%"]),
    createDiagonalTransform(["-60%", "60%"], ["-60%", "60%"]),
    createDiagonalTransform(["100%", "-100%"], ["150%", "-150%"]),
  ],
  [createDiagonalTransform],
);
```

#### 3.2 Remover useMemo innecesarios (Hero)

**Problema**: useMemo overhead > benefit para simple object creation.

**Hero.tsx - ANTES**:

```tsx
const bgTriangleStyle = useMemo(
  () => (isReady ? { y: layers.background.y } : {}),
  [isReady, layers.background.y],
);
```

**Hero.tsx - DESPUÉS**:

```tsx
// Direct object creation (más rápido sin useMemo)
const bgTriangleStyle = isReady ? { y: layers.background.y } : {};
```

#### 3.3 Crear hook useOptimizedParallax reutilizable

**Archivo**: `src/hooks/useOptimizedParallax.ts` (nuevo)

```typescript
import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ParallaxConfig {
  speed: "slow" | "medium" | "fast";
  direction: "up" | "down";
  disabled?: boolean;
}

export const useOptimizedParallax = (config: ParallaxConfig) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  // IntersectionObserver solo anima cuando visible
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "100px" }, // Preload 100px antes
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const shouldAnimate = isInView && !prefersReducedMotion && !config.disabled;

  const speedMap = {
    slow: [0, 50],
    medium: [0, 100],
    fast: [0, 200],
  };

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    config.direction === "up"
      ? speedMap[config.speed]
      : speedMap[config.speed].reverse(),
  );

  return {
    ref,
    style: shouldAnimate ? { y } : {},
    isActive: shouldAnimate,
  };
};
```

**Uso en Hero.tsx**:

```tsx
export function Hero() {
  const bg = useOptimizedParallax({ speed: "slow", direction: "down" });
  const fg = useOptimizedParallax({ speed: "fast", direction: "up" });

  return (
    <section className={styles.hero}>
      <motion.div ref={bg.ref} style={bg.style} className={styles.bg} />
      <motion.div ref={fg.ref} style={fg.style} className={styles.fg} />
    </section>
  );
}
```

#### 3.4 Extraer constantes de performance

**Archivo**: `src/config/performance.constants.ts` (nuevo)

```typescript
/**
 * Constantes de performance para animaciones
 * Basado en benchmarks y mejores prácticas 2026
 */

// FPS target para throttling de scroll
export const SCROLL_FPS = 30; // 30fps suficiente para parallax smooth

// Máximo de elementos con parallax simultáneos
export const MAX_PARALLAX_ELEMENTS = 8; // Budget de GPU

// Thresholds para Intersection Observer
export const INTERSECTION_THRESHOLDS = {
  EAGER: 0.1, // Activar temprano (crítico above-the-fold)
  NORMAL: 0.3, // Balance
  LAZY: 0.5, // Solo cuando mayoría visible
};

// Root margins para preload
export const INTERSECTION_MARGINS = {
  PRELOAD: "100px", // Preparar 100px antes de entrar
  STANDARD: "50px", // Balance
  MINIMAL: "0px", // Sin preload
};

// Parallax speed presets (en px por scroll)
export const PARALLAX_SPEEDS = {
  SLOW: 50,
  MEDIUM: 100,
  FAST: 200,
  EXTREME: 400,
};

// Durations optimizadas (evitar valores intermedios raros)
export const OPTIMIZED_DURATIONS = {
  INSTANT: 0,
  FAST: 0.15,
  NORMAL: 0.3,
  SLOW: 0.6,
};

// Springs optimizados (balance visual vs performance)
export const OPTIMIZED_SPRINGS = {
  SNAPPY: { stiffness: 300, damping: 30 },
  SMOOTH: { stiffness: 100, damping: 20 },
  GENTLE: { stiffness: 50, damping: 15 },
};
```

#### 3.5 CSS Optimization con containment

**Archivo**: `src/styles/performance.css` (nuevo)

```css
/**
 * Optimizaciones de rendering performance
 * Aplicar a secciones grandes e independientes
 */

/* CSS Containment - aislar layout/paint de cada sección */
.hero,
.socialProof,
.features,
.reviews,
.benefits {
  contain: layout style paint;
  content-visibility: auto; /* Lazy render offscreen content */
}

/* Para elementos decorativos que no afectan layout */
.decorativeElement {
  isolation: isolate; /* Crear stacking context sin z-index */
  will-change: auto; /* Browser decide */
}

/* Forzar GPU layer solo cuando animating (via JS) */
.parallaxActive {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Reducir repaints en scroll */
.smoothScrollContainer {
  overflow-anchor: none; /* Prevenir scroll anchoring */
}
```

**Importar en** `src/styles/global.css`:

```css
@import "./performance.css";
```

**Acceptance criteria**:

- ✅ useTransform calls reducidos: 35+ → 10-15
- ✅ useMemo removidos donde no aportan
- ✅ Hook reutilizable useOptimizedParallax creado
- ✅ Constantes centralizadas en performance.constants.ts
- ✅ CSS containment aplicado a secciones principales

---

### Fase 4: Monitoring y Validación (1 hora)

> **Impacto**: Visibilidad continua de performance en development

#### 4.1 Setup Lighthouse CI

**Archivo**: `lighthouserc.json` (crear en raíz)

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4173/"],
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "throttling": {
          "rttMs": 40,
          "throughputKbps": 10240,
          "cpuSlowdownMultiplier": 1
        }
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 150 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 1500 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

#### 4.2 Scripts de performance en package.json

```json
{
  "scripts": {
    "perf:lighthouse": "lighthouse http://localhost:4173 --view --preset=desktop --output=html --output-path=./lighthouse-report.html",
    "perf:lighthouse-ci": "lhci autorun",
    "perf:profile": "npm run build && vite preview --port 4173",
    "perf:bundle": "vite-bundle-visualizer",
    "perf:dev-monitor": "echo 'Open DevTools Performance tab and record scroll'"
  }
}
```

#### 4.3 Performance monitor en development

**Archivo**: `src/utils/performanceMonitor.ts` (nuevo)

```typescript
/**
 * Real-time performance monitor
 * Solo activo en development + feature flag
 */

export const initPerformanceMonitor = () => {
  if (import.meta.env.MODE !== "development") return;

  console.log("🔍 Performance Monitor activo");

  // Monitor Long Tasks (> 50ms blocking main thread)
  const longTaskObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) {
        console.warn("⚠️ Long Task:", {
          duration: `${entry.duration.toFixed(2)}ms`,
          name: entry.name,
        });
      }
    }
  });

  longTaskObserver.observe({ entryTypes: ["longtask", "measure"] });

  // Monitor Layout Shifts
  let cls = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        cls += (entry as any).value;
      }
    }
    if (cls > 0.1) {
      console.warn("⚠️ High CLS:", cls.toFixed(4));
    }
  });

  clsObserver.observe({ entryTypes: ["layout-shift"] });

  // Monitor FPS durante scroll
  let lastFrameTime = performance.now();
  let frameCount = 0;

  const measureFPS = () => {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime >= lastFrameTime + 1000) {
      const fps = Math.round(
        (frameCount * 1000) / (currentTime - lastFrameTime),
      );

      if (fps < 50) {
        console.warn("⚠️ Low FPS during scroll:", fps);
      } else if (fps >= 55) {
        console.log("✅ Smooth FPS:", fps);
      }

      frameCount = 0;
      lastFrameTime = currentTime;
    }

    requestAnimationFrame(measureFPS);
  };

  requestAnimationFrame(measureFPS);
};
```

**Activar en** `src/main.tsx`:

```tsx
import { initPerformanceMonitor } from "@/utils/performanceMonitor";

// Solo en development
if (import.meta.env.DEV) {
  initPerformanceMonitor();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

**Acceptance criteria**:

- ✅ Lighthouse CI configurado con targets > 95 score
- ✅ Scripts npm para facilitar testing
- ✅ Performance monitor en consola dev
- ✅ Real-time FPS, Long Tasks, CLS tracking

---

## Benchmarks Esperados

### ❌ ANTES (Baseline - 11 Marzo 2026)

| Métrica             | Valor     | Status          |
| ------------------- | --------- | --------------- |
| Lighthouse Score    | 90/100    | 🟡 Good         |
| FCP                 | 0.5s      | ✅              |
| LCP                 | 2.0s      | ⚠️ Orange       |
| TBT                 | 10ms      | ✅              |
| CLS                 | 0         | ✅              |
| FPS scroll          | 30-45     | ⚠️ Lag visible  |
| Payload total       | 3,419 KiB | ❌ 96% imágenes |
| Forced reflows      | 115ms     | ❌              |
| Font loading        | 405ms     | ⚠️ Waterfall    |
| Parallax elements   | 35+       | ⚠️              |
| will-change activos | 20+       | ⚠️              |

### ✅ DESPUÉS Fase 1 (Imágenes + Fonts)

| Métrica          | Valor   | Mejora        |
| ---------------- | ------- | ------------- |
| Lighthouse Score | 95/100  | +5 puntos     |
| LCP              | 1.2s    | -0.8s (40%)   |
| Payload total    | 900 KiB | -2.5 MB (73%) |
| Font loading     | <150ms  | -255ms (63%)  |

### ✅ DESPUÉS Fase 2 (Reflows + will-change)

| Métrica             | Valor | Mejora          |
| ------------------- | ----- | --------------- |
| FPS scroll          | 55-60 | +20fps (smooth) |
| Forced reflows      | 0ms   | -115ms (100%)   |
| will-change activos | 3-5   | -15+ elementos  |

### ✅ DESPUÉS Fase 3 (Refactor código)

| Métrica            | Valor   | Mejora              |
| ------------------ | ------- | ------------------- |
| useTransform calls | 10-15   | -20+ calls          |
| Bundle size        | -30 KiB | Tree-shaking        |
| Mantenibilidad     | Alta    | Hooks reutilizables |

---

## Checklist de Implementación

### 🎯 Prioridad Máxima (Esta semana)

- [ ] **Fase 1.1**: Optimizar imágenes (2-3 horas)
  - [ ] Instalar sharp: `npm install -D sharp`
  - [ ] Crear scripts/optimize-images.js
  - [ ] Ejecutar conversión a WebP con sizes
  - [ ] Actualizar Hero.tsx con srcset responsive
  - [ ] Actualizar SocialProof1/2 con srcset
  - [ ] Actualizar CTA1.tsx con srcset
  - [ ] Agregar width/height a logo en Navbar.tsx
  - [ ] Validar: Payload < 1 MB

- [ ] **Fase 1.2**: Preload fonts (15 min)
  - [ ] Agregar <link rel="preload"> en index.html
  - [ ] Validar: Font loading < 200ms

- [ ] **Correr Lighthouse post-Fase 1**
  - [ ] Score objetivo: > 95
  - [ ] LCP objetivo: < 1.5s

### 🔥 Alta Prioridad (Próxima semana)

- [ ] **Fase 2.1-2.2**: Eliminar forced reflows
  - [ ] Crear src/hooks/useRAFThrottle.ts
  - [ ] Refactor useParallaxLayers.ts con batching
  - [ ] Validar: DevTools Performance sin reflows warnings

- [ ] **Fase 2.3**: Optimizar will-change
  - [ ] Remover will-change de Hero.module.css
  - [ ] Remover will-change de SocialProof1/2.module.css
  - [ ] Agregar clase .isAnimating dinámica
  - [ ] Implementar IntersectionObserver toggle
  - [ ] Validar: will-change < 5 elementos simultáneos

- [ ] **Correr Lighthouse post-Fase 2**
  - [ ] FPS objetivo: > 55 durante scroll
  - [ ] Forced reflows: 0ms

### 📦 Refactor (Cuando tiempo permita)

- [ ] **Fase 3**: Arquitectura
  - [ ] Crear useOptimizedParallax hook
  - [ ] Crear constants/performance.constants.ts
  - [ ] Refactor SocialProof1 useTransform
  - [ ] Remover useMemo innecesarios Hero.tsx
  - [ ] Crear styles/performance.css con containment
  - [ ] Documentar nuevos patterns

- [ ] **Fase 4**: Monitoring
  - [ ] Setup lighthouserc.json
  - [ ] Crear performanceMonitor.ts
  - [ ] Agregar scripts npm en package.json

### 📊 Métricas de Éxito Final

- [ ] Lighthouse Performance: **> 95/100**
- [ ] LCP: **< 1.5s** (actualmente 2.0s)
- [ ] FPS durante scroll: **> 55fps** (actualmente 30-45)
- [ ] Forced reflows: **0ms** (actualmente 115ms)
- [ ] Payload total: **< 1 MB** (actualmente 3.4 MB)
- [ ] will-change activos: **< 5** (actualmente 20+)
- [ ] No Long Tasks > 50ms
- [ ] CLS mantener en 0

---

## Recursos Adicionales

### Documentación oficial 2026

- Framer Motion Performance: https://www.framer.com/motion/performance/
- Web Animations API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
- CSS Containment: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment

### Tools

- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- Web Vitals Extension: https://chrome.google.com/webstore/detail/web-vitals
- React DevTools Profiler: Built-in en DevTools

### Benchmarking

- WebPageTest.org - Test desde diferentes locaciones
- PageSpeed Insights - Google's official tool
- Chrome UX Report - Real user metrics
