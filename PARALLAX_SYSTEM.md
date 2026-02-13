# 🎭 Sistema de Parallax Multicapa

## 📐 Arquitectura de Capas

El sistema implementa **efecto de profundidad 3D** usando múltiples capas geométricas que se mueven a diferentes velocidades al hacer scroll.

### Principio de Parallax

```
Velocidad por Capa (más cerca = más rápido):
┌─────────────────────────────────────────┐
│ Capa 3 (Foreground)    ████████████████ │ 45% movimiento
│ Capa 2 (Middle)        ██████████       │ 25% movimiento
│ Capa 1 (Background)    ████             │ 15% movimiento
└─────────────────────────────────────────┘
                User Scroll ↓↓↓
```

## 🎨 Configuración de Velocidades

**Archivo:** `src/lib/animations.ts`

### Capas Disponibles

| Capa           | Y Movement | Scale    | Rotate   | Uso Recomendado               |
| -------------- | ---------- | -------- | -------- | ----------------------------- |
| **background** | 0% → 15%   | 1 → 1.05 | -        | Elementos de fondo lejanos    |
| **middle**     | 0% → 25%   | 1 → 1.08 | 0° → -2° | Formas principales            |
| **foreground** | 0% → 35%   | 1 → 1.12 | 0° → 3°  | Elementos cercanos (imágenes) |
| **slow**       | 0% → 10%   | -        | -        | Decoración sutil              |
| **fast**       | 0% → 45%   | -        | -        | Elementos destacados          |

```typescript
export const parallaxLayers = {
  background: { y: ["0%", "15%"], scale: [1, 1.05] },
  middle: { y: ["0%", "25%"], scale: [1, 1.08], rotate: [0, -2] },
  foreground: { y: ["0%", "35%"], scale: [1, 1.12], rotate: [0, 3] },
  slow: { y: ["0%", "10%"], x: ["0%", "5%"] },
  fast: { y: ["0%", "45%"], x: ["0%", "-3%"] },
};
```

## 🏛️ Implementación Hero Section

### Estructura de Capas

```
Hero Section (100vh)
├── Background Layer (z-index: 0)
│   ├── leftTriangleBackground (rgba 0.3, +10% más grande)
│   └── rightTriangleBackground (rgba 0.35, +10% más grande)
│
├── Main Layer (z-index: 1)
│   ├── leftTriangle (#d52323, forma principal)
│   ├── rightTriangle (#d52323, forma principal)
│   └── heroImage (modelo, más rápido)
│
└── Foreground Layer (z-index: 1)
    ├── leftTriangleForeground (rgba 0.6, -30% más pequeño)
    └── rightTriangleForeground (rgba 0.4, -30% más pequeño)
```

### Velocidades Aplicadas

```tsx
// Imagen principal - FOREGROUND (35% movement)
const imageY = useTransform(
  scrollYProgress,
  [0, 1],
  parallaxLayers.foreground.y,
);
const imageScale = useTransform(
  scrollYProgress,
  [0, 1],
  parallaxLayers.foreground.scale,
);

// Triángulos principales - MIDDLE (25% movement)
const trianglesY = useTransform(
  scrollYProgress,
  [0, 1],
  parallaxLayers.middle.y,
);
const trianglesRotate = useTransform(
  scrollYProgress,
  [0, 1],
  parallaxLayers.middle.rotate,
);

// Capas decorativas - BACKGROUND (15% movement)
const bgLayerY = useTransform(
  scrollYProgress,
  [0, 1],
  parallaxLayers.background.y,
);
const bgLayerScale = useTransform(
  scrollYProgress,
  [0, 1],
  parallaxLayers.background.scale,
);

// Decoración superior - FAST (45% movement)
const fgLayerY = useTransform(scrollYProgress, [0, 1], parallaxLayers.fast.y);
const fgLayerX = useTransform(scrollYProgress, [0, 1], parallaxLayers.fast.x);
```

### Características Visuales

- **6 capas totales**: 2 background + 2 main + 2 foreground
- **Opacidades variadas**: 0.3, 0.35, 0.4, 0.6, 1.0
- **Tamaños diferenciados**: Background +10%, Foreground -30%
- **Colores de la paleta**: #d52323, #AA3939, #FE0000
- **pointer-events: none** en capas decorativas

## 🏗️ Implementación CTA1 Section

### Estructura de Capas

```
CTA1 Section (100vh)
├── Background Layer (z-index: 0)
│   ├── textHexagonBackground (rgba 0.25, rotado 20°)
│   └── imageHexagonBackground (rgba 0.15, +10% más grande)
│
├── Main Layer (z-index: 1)
│   ├── textHexagon (#d52323, rotado 15°)
│   ├── imageHexagon (#ffffff, clip-path pentagonal)
│   └── ctaImage (modelo)
│
└── Foreground Layer (z-index: 1)
    ├── textHexagonForeground (rgba 0.5, rotado 10°)
    └── imageHexagonForeground (rgba 0.3, diferente clip-path)
```

### Velocidades Aplicadas

```tsx
// Hexágonos principales - MIDDLE (25% movement + rotate)
const hexagonsY = useTransform(
  scrollYProgress,
  [0, 1],
  parallaxLayers.middle.y,
);
const hexagonsRotate = useTransform(
  scrollYProgress,
  [0, 1],
  parallaxLayers.middle.rotate,
);

// Capas decorativas - SLOW (10% movement + X axis)
const bgLayerY = useTransform(scrollYProgress, [0, 1], parallaxLayers.slow.y);
const bgLayerX = useTransform(scrollYProgress, [0, 1], parallaxLayers.slow.x);

// Decoración superior - FAST (45% movement + X axis)
const fgLayerY = useTransform(scrollYProgress, [0, 1], parallaxLayers.fast.y);
const fgLayerX = useTransform(scrollYProgress, [0, 1], parallaxLayers.fast.x);

// Imagen - FOREGROUND (35% movement + scale)
const imageY = useTransform(
  scrollYProgress,
  [0, 1],
  parallaxLayers.foreground.y,
);
const imageScale = useTransform(
  scrollYProgress,
  [0, 1],
  parallaxLayers.foreground.scale,
);
```

### Características Visuales

- **6 capas totales**: 2 background + 2 main + 2 foreground
- **Hexágonos únicos**: Cada uno con clip-path diferente
- **Rotaciones variadas**: 10°, 15°, 20° base + parallax rotation
- **Movimiento bidimensional**: Ejes Y y X combinados
- **Colores contrastantes**: Rojo (#d52323) vs Blanco (#ffffff)

## 🎯 Optimizaciones de Performance

### will-change Property

```css
.layer {
  will-change: transform; /* Pre-optimiza para GPU */
}
```

- Indica al navegador que prepone la GPU para transformaciones
- Reduce repaints y mejora fluidez a 60fps
- Aplicado a todas las capas parallax

### Responsive Design

```css
@media (max-width: 768px) {
  /* Ocultar capas decorativas en mobile */
  .leftTriangleBackground,
  .rightTriangleBackground,
  .leftTriangleForeground,
  .rightTriangleForeground {
    display: none;
  }
}
```

**Razón:** Reducir complejidad en dispositivos móviles donde:

- El efecto parallax es menos notorio
- La performance es crítica
- Las pantallas pequeñas no muestran bien múltiples capas

### pointer-events: none

```css
.decorativeLayer {
  pointer-events: none; /* No interfiere con clicks */
}
```

Aplicado a capas foreground para que no bloqueen interacción con elementos debajo.

## 🎨 Teoría de Color y Opacidad

### Gradiente de Profundidad

```
Lejos (Background)    → Opacidad baja (0.15 - 0.35)
────────────────────────────────────────────────────
Medio (Main)          → Opacidad total (1.0)
────────────────────────────────────────────────────
Cerca (Foreground)    → Opacidad media (0.4 - 0.6)
```

**Principio:** Simula "niebla atmosférica" - objetos lejanos se ven más desvanecidos.

### Paleta por Capa

| Capa       | Color Principal                                              | Variaciones       |
| ---------- | ------------------------------------------------------------ | ----------------- |
| Background | `rgba(213, 35, 35, 0.25-0.35)`                               | Muy transparente  |
| Main       | `#d52323`                                                    | Sólido            |
| Foreground | `rgba(170, 57, 57, 0.4-0.6)` <br> `rgba(254, 0, 0, 0.3-0.4)` | Semi-transparente |

## 🔧 Cómo Usar en Nuevas Secciones

### 1. Importar utilidades

```tsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { parallaxLayers } from "@/lib/animations";
```

### 2. Setup scroll tracking

```tsx
const sectionRef = useRef<HTMLElement>(null);

const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start end", "end start"], // Cuándo empieza/termina
});
```

### 3. Crear transforms

```tsx
// Escoger la capa apropiada según profundidad deseada
const layerY = useTransform(
  scrollYProgress,
  [0, 1],
  parallaxLayers.background.y, // o .middle, .foreground, etc.
);
```

### 4. Aplicar a elementos

```tsx
<motion.div className={styles.decorativeLayer} style={{ y: layerY }}>
  {/* Contenido */}
</motion.div>
```

## 📊 Comparativa Visual

### Antes (Sin Parallax Multicapa)

```
┌────────────┐
│ ░░░░░░░░░░ │  Imagen
│ ████████   │  Triángulo 1
│ ████████   │  Triángulo 2
└────────────┘
     ↓ Todo se mueve igual
```

### Después (Con Parallax Multicapa)

```
┌────────────┐
│ ░░░░░░░░░░ │ ────→ Imagen (rápido)
│ ▓▓▓▓▓▓▓    │ ───→  Triángulo Main (medio)
│ ▒▒▒▒▒▒     │ ──→   Triángulo Background (lento)
│ ████████   │ ─────→ Decoración Foreground (muy rápido)
└────────────┘
     ↓ Velocidades diferentes = Profundidad
```

## 🎬 Effecto Final

Al hacer scroll:

1. **Capas Background** se mueven lentamente (15%) → Sensación de lejanía
2. **Capas Main** siguen el ritmo medio (25%) → Elementos principales
3. **Imagen/Foreground** se mueven rápido (35-45%) → Sensación de cercanía
4. **Rotaciones sutiles** (-2° a +3°) → Dinamismo adicional
5. **Escalas progresivas** (1.05 a 1.12) → "Acercamiento" visual

## 💡 Mejores Prácticas

### ✅ DO

- Usar 3-6 capas máximo (más = performance issues)
- Opacidades < 0.7 para capas decorativas
- `will-change: transform` en capas animadas
- Ocultar capas decorativas en mobile
- Usar `pointer-events: none` en overlays

### ❌ DON'T

- Más de 8 capas simultáneas
- Animaciones en scroll sin `will-change`
- Figuras complejas (muchos vértices) en cada capa
- Mostrar todas las capas en mobile
- Olvidar z-index (causan sobreposición incorrecta)

## 🚀 Extensiones Futuras

Ideas para mejorar:

1. **Parallax horizontal** en elementos laterales
2. **Blur progresivo** en capas background (CSS filter)
3. **Opacidad dinámica** basada en scroll position
4. **Parallax en mouse move** (mousemove event)
5. **Partículas flotantes** con velocidades aleatorias

---

**Autor:** Barber Royce Development Team  
**Versión:** 1.0.0  
**Última actualización:** Febrero 2026
