# 🎯 TODO - Sprint Performance Optimization

**Fecha Inicio:** 11 Marzo 2026  
**Baseline:** Score 90/100, LCP 2.0s, FPS 30-45 (lag visible)  
**Objetivo:** Score 95+, LCP <1.5s, FPS 55-60 (smooth scroll)

---

## 📋 FASE 1: Imágenes + Fonts (MÁXIMO IMPACTO) - 2-3 horas

> **Quick Wins con impacto inmediato: Score 90→95, LCP 2.0s→1.2s**

### ✅ Tareas Listadas en Orden de Ejecución

#### 1. Instalar Sharp para conversión de imágenes (5 min)

```bash
npm install -D sharp
```

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P001

---

#### 2. Crear script de conversión PNG → WebP (30 min)

**Archivo a crear:** `scripts/optimize-images.js`

**Imágenes a convertir:**

- social_proof.png (848 KB) → sizes: 560w, 1120w, 1680w
- barber_background.png (760 KB) → sizes: 859w, 1718w
- hero_model_left_profile.png (684 KB) → sizes: 842w, 1684w
- cta1_model.png (633 KB) → sizes: 700w, 1400w
- royce-barber-logo.png (11 KB) → size: 41w

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P001

**Script template disponible en:** ANIMATION_OPTIMIZATION_PLAN.md líneas 95-130

---

#### 3. Ejecutar conversión de imágenes (5 min)

```bash
node scripts/optimize-images.js
```

**Resultado esperado:**

- Carpeta `src/assets/img/optimized/` creada
- 15+ archivos WebP generados
- Savings: ~2.5 MB

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P001

---

#### 4. Actualizar componentes con srcset responsive (1 hora)

**Archivos a modificar:**

- [ ] `src/components/sections/Hero/Hero.tsx`
- [ ] `src/components/sections/SocialProof1/SocialProof1.tsx`
- [ ] `src/components/sections/SocialProof2/SocialProof2.tsx`
- [ ] `src/components/sections/CTA1/CTA1.tsx`

**Template de código:** ANIMATION_OPTIMIZATION_PLAN.md líneas 132-150

**Checklist por componente:**

- [ ] Reemplazar `<img src={...}` por versión srcset
- [ ] Agregar `width` y `height` explícitos
- [ ] Configurar `sizes` attribute correctamente
- [ ] `loading="eager"` para hero, `loading="lazy"` para resto
- [ ] Agregar `fetchpriority="high"` en hero image

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P001

---

#### 5. Agregar dimensions a logo en Navbar (5 min)

**Archivo:** `src/components/layout/Navbar/Navbar.tsx`

**Cambio:**

```tsx
// ANTES
<img src={logo} className={styles.logoImage} alt="Royce Barber" />

// DESPUÉS
<img
  src={logo}
  width="41"
  height="50"
  className={styles.logoImage}
  alt="Royce Barber"
/>
```

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P003  
**Impacto:** Previene CLS (Cumulative Layout Shift)

---

#### 6. Preload fonts críticas en index.html (15 min)

**Archivo:** `index.html`

**Código a agregar en `<head>`:**

```html
<!-- Preload critical fonts -->
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
```

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P002  
**Impacto:** Font loading 405ms→150ms

---

#### 7. Build + Lighthouse re-audit (10 min)

```bash
npm run build
npm run dev
# Abrir Chrome DevTools → Lighthouse → Run audit
```

**Métricas objetivo:**

- Performance Score: **> 95** (antes: 90)
- LCP: **< 1.5s** (antes: 2.0s)
- Payload: **< 1 MB** (antes: 2.35 MB)

**Estado:** ⬜ Pendiente

---

## 🔥 FASE 2: Forced Reflows + will-change (CRÍTICO SCROLL) - 3-4 horas

> **Elimina lag durante scroll: FPS 30-45→55-60**

### ✅ Tareas Listadas

#### 8. Crear hook useRAFThrottle (1 hora)

**Archivo a crear:** `src/hooks/useRAFThrottle.ts`

**Template disponible en:** ANIMATION_OPTIMIZATION_PLAN.md líneas 199-220

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P004

---

#### 9. Refactor useParallaxLayers con batching (1 hora)

**Archivo a modificar:** `src/hooks/useParallaxLayers.ts`

**Objetivo:** Eliminar 115ms de forced reflows

**Pasos:**

1. Importar useRAFThrottle creado
2. Throttle scrollYProgress con 30fps
3. Batch reads antes de writes
4. Consolidar múltiples useTransform

**Template disponible en:** ANIMATION_OPTIMIZATION_PLAN.md líneas 222-245

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P004

---

#### 10. Remover will-change de CSS (30 min)

**Archivos a modificar:**

- [ ] `src/components/sections/Hero/Hero.module.css`
- [ ] `src/components/sections/SocialProof1/SocialProof1.module.css`
- [ ] `src/components/sections/SocialProof2/SocialProof2.module.css`

**Patrón:**

```css
/* REMOVER will-change estático */
.hexagon {
  /* will-change: transform; */ /* ❌ BORRAR */
}

/* AGREGAR clase dinámica */
.parallaxLayer {
  will-change: auto;
}

.parallaxLayer.isAnimating {
  will-change: transform; /* Solo cuando scrolling */
}
```

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P005

---

#### 11. Aplicar will-change dinámicamente via JS (1 hora)

**Archivos a modificar:**

- [ ] `src/components/sections/Hero/Hero.tsx`
- [ ] `src/components/sections/SocialProof1/SocialProof1.tsx`
- [ ] `src/components/sections/SocialProof2/SocialProof2.tsx`

**Patrón con IntersectionObserver:**

```tsx
const [isInView, setIsInView] = useState(false);
const ref = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsInView(entry.isIntersecting),
    { rootMargin: "100px" },
  );

  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);

<motion.div
  ref={ref}
  className={cn(styles.layer, isInView && styles.isAnimating)}
/>;
```

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P005

---

#### 12. Validar con DevTools Performance (30 min)

```bash
# 1. npm run dev
# 2. Abrir DevTools → Performance
# 3. Click Record
# 4. Scroll toda la página
# 5. Stop recording
# 6. Buscar "Recalculate Style" warnings (debe ser 0)
```

**Métricas objetivo:**

- Forced reflows: **0ms** (antes: 115ms)
- will-change activos: **< 5** (antes: 20+)
- FPS durante scroll: **> 55fps** (antes: 30-45)

**Estado:** ⬜ Pendiente

---

## 🔧 FASE 3: Refactor Arquitectura (CÓDIGO LIMPIO) - 2-3 horas

> **Código más mantenible para futuras features**

### ✅ Tareas Recomendadas (Opcional pero valioso)

#### 13. Consolidar useTransform en SocialProof1 (1 hora)

**Archivo:** `src/components/sections/SocialProof1/SocialProof1.tsx`

**Problema:** 10 useTransform calls para 5 lasers

**Solución:** Factory function con parámetros

**Template disponible en:** ANIMATION_OPTIMIZATION_PLAN.md líneas 283-305

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P006

---

#### 14. Remover useMemo innecesarios en Hero (20 min)

**Archivo:** `src/components/sections/Hero/Hero.tsx`

**Problema:** useMemo overhead > benefit para object creation

**Template disponible en:** ANIMATION_OPTIMIZATION_PLAN.md líneas 307-320

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P016, P017

---

#### 15. Crear hook useOptimizedParallax (1 hora)

**Archivo a crear:** `src/hooks/useOptimizedParallax.ts`

**Beneficios:**

- Reutilizable
- IntersectionObserver built-in
- Reduced motion support
- Speed presets

**Template completo en:** ANIMATION_OPTIMIZATION_PLAN.md líneas 322-365

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P007

---

#### 16. Extraer constantes de performance (30 min)

**Archivo a crear:** `src/config/performance.constants.ts`

**Contenido:**

- SCROLL_FPS = 30
- MAX_PARALLAX_ELEMENTS = 8
- INTERSECTION_THRESHOLDS = { EAGER, NORMAL, LAZY }
- PARALLAX_SPEEDS = { SLOW, MEDIUM, FAST }

**Template disponible en:** ANIMATION_OPTIMIZATION_PLAN.md líneas 367-405

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P008

---

#### 17. Agregar CSS containment (30 min)

**Archivo a crear:** `src/styles/performance.css`

**Importar en:** `src/styles/global.css`

**Template disponible en:** ANIMATION_OPTIMIZATION_PLAN.md líneas 407-435

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P009

---

## 📊 FASE 4: Monitoring (VISIBILIDAD CONTINUA) - 1 hora

> **Tracking automático de performance**

### ✅ Tareas Setup

#### 18. Setup Lighthouse CI (30 min)

**Archivo a crear:** `lighthouserc.json`

**Agregar scripts en package.json:**

```json
{
  "scripts": {
    "perf:lighthouse": "lighthouse http://localhost:4173 --view --preset=desktop --output=html --output-path=./lighthouse-report.html",
    "perf:lighthouse-ci": "lhci autorun"
  }
}
```

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P010

---

#### 19. Crear performance monitor para dev (30 min)

**Archivo a crear:** `src/utils/performanceMonitor.ts`

**Activar en:** `src/main.tsx`

**Features:**

- FPS tracking real-time
- Long Tasks detection (>50ms)
- CLS monitoring
- Console warnings

**Template disponible en:** ANIMATION_OPTIMIZATION_PLAN.md líneas 475-540

**Estado:** ⬜ Pendiente  
**ID BACKLOG:** P011

---

## 🎯 RESUMEN DE IMPACTO ESPERADO

### Después Fase 1 (Imágenes + Fonts)

| Métrica | Antes  | Después | Mejora |
| ------- | ------ | ------- | ------ |
| Score   | 90/100 | 95/100  | +5     |
| LCP     | 2.0s   | 1.2s    | -40%   |
| Payload | 3.4 MB | 0.9 MB  | -73%   |
| Fonts   | 405ms  | 150ms   | -63%   |

### Después Fase 2 (Reflows + will-change)

| Métrica         | Antes | Después | Mejora |
| --------------- | ----- | ------- | ------ |
| FPS scroll      | 30-45 | 55-60   | +40%   |
| Forced reflows  | 115ms | 0ms     | -100%  |
| will-change act | 20+   | 3-5     | -75%   |

### Después Fase 3+4 (Refactor + Monitoring)

| Métrica           | Antes   | Después | Mejora              |
| ----------------- | ------- | ------- | ------------------- |
| useTransform call | 35+     | 10-15   | -60%                |
| Bundle size       | 70KB gz | 68KB gz | -2KB (tree-shaking) |
| Mantenibilidad    | Media   | Alta    | Hooks reutilizables |

---

## ⚠️ IMPORTANTE - Orden de Prioridad

**RECOMENDACIÓN:** Completar fases en orden secuencial

1. **FASE 1** → Quick win, mayor impacto visible inmediato
2. **FASE 2** → Arregla el lag durante scroll (prioridad del usuario)
3. **FASE 3** → Código limpio para futuros desarrollos
4. **FASE 4** → Monitoring continuo

**ALTERNATIVA:** Si prefieres atacar el lag primero:

1. FASE 2 (forced reflows)
2. FASE 1 (imágenes)
3. FASE 3 (refactor)
4. FASE 4 (monitoring)

---

## 📝 Notas Técnicas

- **Branch actual:** feature/improve-sections-styling
- **Archivos de referencia:**
  - ANIMATION_OPTIMIZATION_PLAN.md (templates completos)
  - BACKLOG.md (tracking de tareas)
  - PARALLAX_SYSTEM.md (documentación sistema actual)
- **Testing:** Lighthouse Desktop mode, CPU throttling 4x para simular PC medio
- **Git:** Commit después de cada fase completada

---

**🚀 ¿Por dónde empezamos? Tu decides:**

1. **Imágenes primero** (máximo impacto, quick win)
2. **Animaciones primero** (arregla el lag directamente)
3. **Todo en secuencia** (orden recomendado)
