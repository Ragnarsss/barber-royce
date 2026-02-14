# Análisis de Separación de Responsabilidades

**Última Actualización:** Febrero 13, 2026

## Resumen Ejecutivo

Este documento identifica violaciones al principio de Separación de Responsabilidades (Separation of Concerns - SoC) en el codebase actual, proporciona análisis detallado de cada caso, y propone estrategias de refactorización priorizadas por impacto y complejidad.

### Hallazgos Clave

- **4 componentes principales** con responsabilidades mezcladas
- **3 patrones de violación** recurrentes en múltiples archivos
- **2 abstracciones existentes** no utilizadas consistentemente
- **5 refactorizaciones de alto impacto** identificadas

---

## 1. Componentes con Violaciones Identificadas

### 1.1 Navbar.tsx

**Ubicación:** `src/components/layout/Navbar/Navbar.tsx`  
**Líneas Críticas:** 45-58, 74-102

#### Responsabilidades Mezcladas

1. **Gestión de Estado de Scroll**
   - `handleScroll()` con listeners de window.scroll
   - State `isScrolled` para tracking de posición
   - Lógica de threshold (80px)

2. **Gestión de Navegación**
   - `useNavigate()` para redirección programática
   - `handleLogoClick()` con lógica condicional compleja
   - Integración directa con Lenis para scroll suave

3. **Detección de Ruta**
   - `useLocation()` para determinar página actual
   - Condicionales basadas en `location.pathname`

4. **Gestión de Menú Móvil**
   - State `isMobileMenuOpen`
   - Lógica de toggle

5. **Configuración de Datos**
   - Array `navLinks` hardcodeado (líneas 45-58)
   - Debería estar en archivo de configuración

#### Impacto

- **Complejidad Ciclomática:** Alta (múltiples ramas condicionales)
- **Testabilidad:** Baja (acoplamiento fuerte con router y Lenis)
- **Reutilizabilidad:** Nula (lógica específica no extraída)

#### Propuesta de Refactorización

**1. Extraer configuración de navegación**

```typescript
// src/config/navigation.ts
export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/servicios", label: "Servicios" },
  { to: "/contacto", label: "Contacto" },
] as const;

export const SCROLL_THRESHOLD = 80;
```

**2. Crear custom hook para scroll tracking**

```typescript
// src/hooks/useScrollTracking.ts
export const useScrollTracking = (threshold: number = 80) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
};
```

**3. Extraer lógica de logo navigation**

```typescript
// src/utils/navigation.ts
export const handleLogoNavigation = (
  currentPath: string,
  navigate: NavigateFunction,
) => {
  if (currentPath === "/") {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else {
    navigate("/");
    setTimeout(() => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  }
};
```

**4. Navbar refactorizado**

```typescript
// src/components/layout/Navbar/Navbar.tsx
import { NAV_LINKS } from "@/config/navigation";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import { handleLogoNavigation } from "@/utils/navigation";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollTracking(80);

  const handleLogoClick = () => {
    handleLogoNavigation(location.pathname, navigate);
  };

  // Resto del componente simplificado...
};
```

---

### 1.2 Services.tsx

**Ubicación:** `src/components/sections/Services/Services.tsx`  
**Líneas Críticas:** 18-88

#### Responsabilidades Mezcladas

1. **SVG Icons Inline** (líneas 18-88)
   - Tres iconos distintos (calendar, clock, checkmark) con 20+ líneas cada uno
   - Repetición de estructura `<svg>` con configuración similar
   - Mezcla de definición visual con lógica de rendering

2. **Importación Directa de Datos**
   - `servicesList` importado de `servicesData`
   - No hay transformación o procesamiento de datos

3. **Lógica de Animación Mezclada**
   - `motion.div` con variantes en el mismo componente
   - Configuración de `useAnimation` y `useInView`

#### Impacto

- **Mantenibilidad:** Baja (cambiar iconos requiere tocar componente principal)
- **Legibilidad:** Baja (140 líneas con 60+ líneas de SVG)
- **Reutilizabilidad:** Nula (iconos no pueden usarse en otros componentes)

#### Propuesta de Refactorización

**1. Extraer iconos a componentes**

```typescript
// src/components/ui/Icons/CalendarIcon.tsx
export const CalendarIcon = ({
  className,
  size = 20
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// src/components/ui/Icons/ClockIcon.tsx
export const ClockIcon = ({ className, size = 20 }: IconProps) => (
  // Similar estructura...
);

// src/components/ui/Icons/CheckIcon.tsx
export const CheckIcon = ({ className, size = 20 }: IconProps) => (
  // Similar estructura...
);

// src/components/ui/Icons/index.ts
export { CalendarIcon } from "./CalendarIcon";
export { ClockIcon } from "./ClockIcon";
export { CheckIcon } from "./CheckIcon";
```

**2. Crear componente InfoItem reutilizable**

```typescript
// src/components/ui/InfoItem/InfoItem.tsx
interface InfoItemProps {
  icon: React.ComponentType<IconProps>;
  label: string;
  value: string;
  className?: string;
}

export const InfoItem = ({
  icon: Icon,
  label,
  value,
  className
}: InfoItemProps) => (
  <div className={className}>
    <Icon size={20} />
    <span>{label}:</span>
    <span>{value}</span>
  </div>
);
```

**3. Services.tsx refactorizado**

```typescript
// src/components/sections/Services/Services.tsx
import { CalendarIcon, ClockIcon, CheckIcon } from "@/components/ui/Icons";
import { InfoItem } from "@/components/ui/InfoItem";

export const Services = () => {
  // ...código de animación

  return (
    <section className={styles.services}>
      {servicesList.map((service) => (
        <div key={service.id} className={styles.card}>
          {/* ...imagen y título */}

          <div className={styles.metadata}>
            <InfoItem
              icon={CalendarIcon}
              label="Precio"
              value={service.price}
            />
            <InfoItem
              icon={ClockIcon}
              label="Duración"
              value={service.duration}
            />
          </div>

          <div className={styles.includes}>
            <h4>Incluye:</h4>
            {service.includes.map((item, idx) => (
              <InfoItem
                key={idx}
                icon={CheckIcon}
                label=""
                value={item}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
```

---

### 1.3 Hero.tsx

**Ubicación:** `src/components/sections/Hero/Hero.tsx`  
**Líneas Críticas:** 44-70

#### Responsabilidades Mezcladas

1. **Configuración de Parallax Inline** (6+ llamadas a `useTransform`)

   ```typescript
   const bgLayerY = useTransform(
     scrollYProgress,
     [0, 1],
     parallaxLayers.slow.y,
   );
   const bgLayerX = useTransform(
     scrollYProgress,
     [0, 1],
     parallaxLayers.slow.x,
   );
   const bgScale = useTransform(
     scrollYProgress,
     [0, 1],
     parallaxLayers.slow.scale,
   );
   // ...3 más
   ```

2. **Importación de Assets**
   - `backgroundImage` importado directamente
   - Podría estar en configuración

3. **Transformación de Datos**
   - `heroBenefits.map()` con creación de componentes inline
   - Mezcla lógica de datos con presentación

#### Impacto

- **Complejidad:** Alta (múltiples cálculos de transformación)
- **Reutilizabilidad:** Baja (patrón parallax repetido en SocialProof1 y CTA1)
- **Performance:** Media (re-cálculos en cada render)

#### Propuesta de Refactorización

**1. Crear hook useParallaxLayers**

```typescript
// src/hooks/useParallaxLayers.ts
interface ParallaxLayer {
  y?: [string, string];
  x?: [string, string];
  scale?: [number, number];
  rotate?: [number, number];
}

interface ParallaxConfig {
  slow?: ParallaxLayer;
  medium?: ParallaxLayer;
  fast?: ParallaxLayer;
  [key: string]: ParallaxLayer | undefined;
}

export const useParallaxLayers = (
  scrollYProgress: MotionValue<number>,
  config: ParallaxConfig,
) => {
  const layers: Record<string, Record<string, MotionValue<any>>> = {};

  Object.entries(config).forEach(([layerName, layer]) => {
    if (!layer) return;

    layers[layerName] = {};

    if (layer.y) {
      layers[layerName].y = useTransform(scrollYProgress, [0, 1], layer.y);
    }
    if (layer.x) {
      layers[layerName].x = useTransform(scrollYProgress, [0, 1], layer.x);
    }
    if (layer.scale) {
      layers[layerName].scale = useTransform(
        scrollYProgress,
        [0, 1],
        layer.scale,
      );
    }
    if (layer.rotate) {
      layers[layerName].rotate = useTransform(
        scrollYProgress,
        [0, 1],
        layer.rotate,
      );
    }
  });

  return layers;
};
```

**2. Hero.tsx refactorizado**

```typescript
// src/components/sections/Hero/Hero.tsx
import { useParallaxLayers } from "@/hooks/useParallaxLayers";

const PARALLAX_CONFIG = {
  background: {
    y: ["0%", "30%"],
    x: ["0%", "-5%"],
    scale: [1, 1.1],
  },
  middleground: {
    y: ["0%", "50%"],
    x: ["0%", "-10%"],
  },
  foreground: {
    y: ["0%", "80%"],
    x: ["0%", "-15%"],
  },
};

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const layers = useParallaxLayers(scrollYProgress, PARALLAX_CONFIG);

  return (
    <section ref={heroRef} className={styles.hero}>
      <motion.div
        className={styles.bgLayer}
        style={layers.background}
      >
        {/* contenido */}
      </motion.div>
      {/* más capas usando layers.middleground, layers.foreground */}
    </section>
  );
};
```

---

### 1.4 SocialProof1.tsx

**Ubicación:** `src/components/sections/SocialProof1/SocialProof1.tsx`  
**Líneas Críticas:** 44-76

#### Responsabilidades Mezcladas

1. **7 Cálculos de useTransform Inline**
   - `bgHexY`, `bgHexScale`, `middleHexY`, `middleHexRotate`, `fgHexY`, `smallHexY`, `smallHexX`, `imageY`, `testimonialY`
   - Patrón repetitivo similar a Hero.tsx

2. **Elementos Decorativos No Componentizados**
   - Hexágonos con SVG inline
   - Podría usar componente `ParallaxLayer` existente

#### Impacto

- **Duplicación:** Alta (mismo patrón que Hero.tsx)
- **Mantenibilidad:** Baja (cambiar comportamiento parallax requiere tocar múltiples archivos)

#### Propuesta de Refactorización

Aplicar el mismo patrón de `useParallaxLayers` propuesto para Hero.tsx:

```typescript
// src/components/sections/SocialProof1/SocialProof1.tsx
const HEXAGON_PARALLAX_CONFIG = {
  background: {
    y: ["0%", "-20%"],
    scale: [1, 0.9],
  },
  middle: {
    y: ["0%", "30%"],
    rotate: [0, 15],
  },
  foreground: {
    y: ["0%", "50%"],
  },
  small: {
    y: ["0%", "60%"],
    x: ["0%", "10%"],
  },
  image: {
    y: ["0%", "20%"],
  },
  testimonial: {
    y: ["0%", "8%"],
  },
};

export const SocialProof1 = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const layers = useParallaxLayers(scrollYProgress, HEXAGON_PARALLAX_CONFIG);

  // Uso simplificado: layers.background, layers.middle, etc.
};
```

---

## 2. Componentes con Datos Hardcodeados

### 2.1 ServicesPage.tsx

**Ubicación:** `src/pages/ServicesPage.tsx`  
**Líneas:** 6-31

#### Problema

Array `services` con 3 categorías y 9 items hardcodeado dentro del componente.

#### Impacto

- **Mantenibilidad:** Baja (cambios de contenido requieren modificar componente)
- **Separación de Concerns:** Violada (datos mezclados con lógica de presentación)
- **Internacionalización:** Imposible sin refactorización

#### Propuesta de Refactorización

**1. Crear archivo de datos**

```typescript
// src/data/servicesPageData.ts
export interface ServicePageItem {
  name: string;
  price: string;
  duration: string;
}

export interface ServiceCategory {
  category: string;
  items: ServicePageItem[];
}

export const servicesPageData: ServiceCategory[] = [
  {
    category: "Cortes",
    items: [
      { name: "Corte Clásico", price: "$25", duration: "30 min" },
      { name: "Corte Moderno", price: "$30", duration: "40 min" },
      { name: "Fade & Taper", price: "$35", duration: "45 min" },
    ],
  },
  {
    category: "Barba",
    items: [
      { name: "Arreglo de Barba", price: "$15", duration: "20 min" },
      { name: "Diseño Completo", price: "$20", duration: "30 min" },
      { name: "Afeitado Premium", price: "$30", duration: "40 min" },
    ],
  },
  {
    category: "Combos",
    items: [
      { name: "Corte + Barba", price: "$35", duration: "50 min" },
      { name: "Paquete Premium", price: "$50", duration: "70 min" },
      { name: "Experiencia Completa", price: "$65", duration: "90 min" },
    ],
  },
];
```

**2. ServicesPage.tsx refactorizado**

```typescript
// src/pages/ServicesPage.tsx
import { servicesPageData } from "@/data/servicesPageData";

export const ServicesPage = () => {
  return (
    <div className={styles.page}>
      {/* ...hero */}
      <div className={styles.content}>
        <div className={styles.container}>
          {servicesPageData.map((category, idx) => (
            <CategorySection key={idx} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 3. Patrones de Violación Recurrentes

### 3.1 Patrón: Configuración Parallax Repetida

**Ocurrencias:**

- Hero.tsx (6 useTransform)
- SocialProof1.tsx (9 useTransform)
- CTA1.tsx (4 useTransform)
- ServicesPage.tsx (CategorySection: 4 useTransform)

**Solución Propuesta:**
Hook `useParallaxLayers` documentado en sección 1.3

**Beneficio:**

- Reducción de 23+ líneas de código por componente
- Configuración declarativa vs imperativa
- Testing simplificado (test del hook vs test de cada componente)

---

### 3.2 Patrón: SVG Icons Inline

**Ocurrencias:**

- Services.tsx (3 iconos)
- Potencialmente en otros componentes no revisados

**Solución Propuesta:**
Librería de iconos centralizada documentada en sección 1.2

**Beneficio:**

- Iconos reutilizables en toda la aplicación
- Fácil actualización de diseño visual
- Props consistentes (size, color, className)
- Posibilidad de tree-shaking (solo importar iconos usados)

---

### 3.3 Patrón: Datos en Componentes

**Ocurrencias:**

- Navbar.tsx (navLinks)
- ServicesPage.tsx (services array)

**Solución Propuesta:**
Mover a archivos de configuración/datos

**Beneficio:**

- Single source of truth para contenido
- Facilita internacionalización futura
- Permite cambios de contenido sin tocar lógica

---

## 4. Abstracciones Existentes No Utilizadas

### 4.1 SmoothParallax Component

**Ubicación:** `src/components/animations/SmoothParallax.tsx`

**Problema:**
Existe un componente `SmoothParallax` con capacidades de parallax configurables, pero Hero.tsx y SocialProof1.tsx no lo utilizan, prefiriendo implementar parallax manualmente con `useTransform`.

**Análisis:**

- SmoothParallax permite configurar `speed`, `scale`, `opacity`
- Tiene lógica de `smoothing` con `useSpring`
- Parece diseñado para casos de uso como los que vemos en Hero/SocialProof1

**Recomendación:**

1. Evaluar si SmoothParallax cubre todos los casos de uso actuales
2. Si sí: Refactorizar Hero/SocialProof1 para usarlo
3. Si no: Extender SmoothParallax o documentar cuándo usar cuál approach

---

### 4.2 useScrollAnimation Hook

**Ubicación:** `src/hooks/useScrollAnimation.ts`

**Problema:**
Varios componentes implementan lógica de `useInView` + `useAnimation` manualmente cuando existe un hook que lo abstrae.

**Componentes que podrían usarlo:**

- Services.tsx (usa useAnimation + useInView directamente)

**Recomendación:**
Utilizar `useScrollAnimation` consistentemente en lugar de `useInView` + `useAnimation` manual.

---

## 5. Priorización de Refactorizaciones

### Criterios de Priorización

1. **Impacto:** Cantidad de código afectado
2. **Complejidad:** Dificultad de implementación
3. **Riesgo:** Probabilidad de introducir bugs
4. **Dependencias:** Bloquea otras refactorizaciones

### Matriz de Priorización

| Refactorización                          | Impacto | Complejidad | Riesgo | Prioridad |
| ---------------------------------------- | ------- | ----------- | ------ | --------- |
| Extraer iconos a componentes             | Alto    | Baja        | Bajo   | **P0**    |
| Mover datos de configuración             | Medio   | Baja        | Bajo   | **P0**    |
| Crear useParallaxLayers hook             | Alto    | Media       | Medio  | **P1**    |
| Extraer lógica de Navbar                 | Medio   | Media       | Medio  | **P1**    |
| Componentizar InfoItem                   | Medio   | Baja        | Bajo   | **P2**    |
| Utilizar SmoothParallax consistentemente | Bajo    | Baja        | Bajo   | **P2**    |

### Plan de Implementación Recomendado

#### Fase 1: Quick Wins (Bajo Riesgo, Alto Impacto)

**Duración Estimada:** 2-3 horas

1. **Extraer SVG Icons**
   - Crear `src/components/ui/Icons/` con CalendarIcon, ClockIcon, CheckIcon
   - Actualizar Services.tsx para usar iconos extraídos
   - Validation: Rendering visual idéntico

2. **Mover Configuración de Datos**
   - Crear `src/config/navigation.ts` con NAV_LINKS y constantes
   - Crear `src/data/servicesPageData.ts` con services array
   - Actualizar Navbar.tsx y ServicesPage.tsx
   - Validation: Funcionalidad sin cambios

#### Fase 2: Abstracción de Parallax (Medio Riesgo, Alto Impacto)

**Duración Estimada:** 4-6 horas

3. **Crear useParallaxLayers Hook**
   - Implementar hook con interface tipada
   - Añadir tests unitarios para transformaciones
   - Documentar casos de uso

4. **Refactorizar Hero.tsx**
   - Aplicar useParallaxLayers
   - Validar comportamiento de scroll
   - Verificar performance (no degradación)

5. **Refactorizar SocialProof1.tsx**
   - Aplicar mismo patrón que Hero
   - Validar animaciones de hexágonos

6. **Refactorizar CTA1.tsx**
   - Aplicar useParallaxLayers
   - Validation final

#### Fase 3: Extracción de Lógica de Navbar (Medio Riesgo, Medio Impacto)

**Duración Estimada:** 3-4 horas

7. **Crear useScrollTracking Hook**
   - Implementar con threshold configurable
   - Añadir debounce si es necesario

8. **Crear handleLogoNavigation Utility**
   - Extraer a `src/utils/navigation.ts`
   - Añadir tests para diferentes casos (home, otras páginas, con/sin Lenis)

9. **Refactorizar Navbar.tsx**
   - Aplicar nuevos hooks y utilities
   - Reducir complejidad ciclomática
   - Validation: Testing manual de navegación

#### Fase 4: Componentes Reutilizables (Bajo Riesgo, Medio Impacto)

**Duración Estimada:** 2-3 horas

10. **Crear InfoItem Component**
    - Implementar con props para icono, label, value
    - Añadir Storybook stories si aplica

11. **Actualizar Services.tsx**
    - Usar InfoItem para metadata
    - Validation: Rendering idéntico

---

## 6. Métricas de Mejora Esperadas

### Reducción de Líneas de Código

| Componente       | Líneas Actuales | Líneas Post-Refactor | Reducción |
| ---------------- | --------------- | -------------------- | --------- |
| Services.tsx     | 140             | ~85                  | -39%      |
| Hero.tsx         | 95              | ~70                  | -26%      |
| SocialProof1.tsx | 110             | ~75                  | -32%      |
| Navbar.tsx       | 120             | ~80                  | -33%      |
| **Total**        | **465**         | **~310**             | **-33%**  |

### Mejora en Testabilidad

| Unidad          | Pre-Refactor           | Post-Refactor                    |
| --------------- | ---------------------- | -------------------------------- |
| Iconos          | No testeable (inline)  | Testeable (componentes aislados) |
| Parallax        | Acoplado a componentes | Testeable (hook aislado)         |
| Logo navigation | Acoplado a Navbar      | Testeable (función pura)         |
| Scroll tracking | Acoplado a Navbar      | Testeable (hook aislado)         |

### Reducción de Complejidad Ciclomática

| Componente   | Complejidad Actual | Complejidad Post-Refactor | Mejora |
| ------------ | ------------------ | ------------------------- | ------ |
| Navbar.tsx   | 8                  | 4                         | -50%   |
| Services.tsx | 5                  | 3                         | -40%   |
| Hero.tsx     | 3                  | 2                         | -33%   |

---

## 7. Consideraciones de Implementación

### 7.1 Estrategia de Testing

**Pre-Refactorización:**

1. Crear snapshot tests de componentes actuales
2. Documentar comportamiento esperado (videos/screenshots)
3. Identificar edge cases críticos

**Durante Refactorización:**

1. TDD para nuevos hooks/utilities (escribir tests primero)
2. Mantener snapshots actualizados
3. Testing manual continuo

**Post-Refactorización:**

1. Regression testing completo
2. Performance testing (Lighthouse, React DevTools Profiler)
3. Validación de accesibilidad (axe, WAVE)

### 7.2 Gestión de Riesgos

**Riesgos Identificados:**

1. **Romper Funcionalidad Existente**
   - Mitigación: Snapshots, testing manual exhaustivo, feature flags

2. **Degradación de Performance**
   - Mitigación: Profiling pre/post, benchmarks de rendering

3. **Introducir Bugs en Parallax**
   - Mitigación: Validación visual frame-by-frame, uso de valores exactos

4. **Afectar UX durante Refactoring**
   - Mitigación: Trabajar en feature branch, deploy incremental

### 7.3 Rollback Plan

Si se detectan problemas críticos post-deploy:

1. **Rollback Git Inmediato**

   ```bash
   git revert <commit-hash>
   git push origin master
   ```

2. **Identificar Scope del Problema**
   - ¿Afecta a qué componentes?
   - ¿Qué funcionalidad está rota?

3. **Fix Forward vs Rollback Complete**
   - Si fix es rápido (<30min): Fix forward
   - Si requiere debugging extenso: Rollback complete

---

## 8. Documentación a Actualizar

Post-refactorización, actualizar:

1. **FRONTEND_DOCUMENTATION.md**
   - Sección de hooks (añadir useParallaxLayers, useScrollTracking)
   - Sección de componentes (añadir Icons, InfoItem)
   - Sección de utilidades (añadir navigation.ts)

2. **README.md**
   - Estructura de carpetas actualizada

3. **Component README** (si aplica)
   - Storybook documentation para nuevos componentes UI

---

## 9. Conclusiones y Recomendaciones

### Conclusiones Clave

1. **Violaciones Sistemáticas:** Las violaciones de SoC no son aisladas, sino patrones que se repiten en múltiples componentes, indicando falta de guidelines/templates claros.

2. **Abstracciones Parciales:** Existen abstracciones bien diseñadas (SmoothParallax, useScrollAnimation) que no se utilizan consistentemente, sugiriendo problemas de documentación o awareness.

3. **Deuda Técnica Manejable:** Con ~12-16 horas de trabajo se puede reducir significativamente la complejidad del codebase sin reescrituras mayores.

4. **Impacto Incremental:** Las refactorizaciones son independientes y pueden implementarse incrementalmente sin bloquear desarrollo de features.

### Recomendaciones Estratégicas

1. **Establecer Component Templates**
   - Crear templates para componentes de sección con parallax
   - Documentar cuándo usar qué abstracción (SmoothParallax vs useTransform directo)

2. **Code Review Guidelines**
   - Checklist: "¿Datos hardcodeados? → Mover a /data o /config"
   - Checklist: "¿SVG inline? → Extraer a componente Icon"
   - Checklist: "¿Más de 3 useTransform? → Considerar useParallaxLayers"

3. **Developer Documentation**
   - Crear guía de "Cómo implementar parallax" con decision tree
   - Documentar hooks custom disponibles con ejemplos de uso

4. **Continuous Improvement**
   - Scheduled refactoring sprints (20% del tiempo)
   - Tech debt tracking en backlog

---

## 10. Apéndices

### A. Checklist de Implementación

```markdown
## Fase 1: Quick Wins

- [ ] Crear src/components/ui/Icons/CalendarIcon.tsx
- [ ] Crear src/components/ui/Icons/ClockIcon.tsx
- [ ] Crear src/components/ui/Icons/CheckIcon.tsx
- [ ] Crear src/components/ui/Icons/index.ts
- [ ] Actualizar Services.tsx para usar iconos
- [ ] Crear src/config/navigation.ts
- [ ] Crear src/data/servicesPageData.ts
- [ ] Actualizar Navbar.tsx para usar NAV_LINKS
- [ ] Actualizar ServicesPage.tsx para usar servicesPageData
- [ ] Testing: Validación visual completa
- [ ] Commit: "refactor: extract icons and data configuration"

## Fase 2: Abstracción Parallax

- [ ] Crear src/hooks/useParallaxLayers.ts
- [ ] Añadir tests para useParallaxLayers
- [ ] Refactorizar Hero.tsx
- [ ] Testing: Validación de scroll parallax en Hero
- [ ] Refactorizar SocialProof1.tsx
- [ ] Testing: Validación de animaciones de hexágonos
- [ ] Refactorizar CTA1.tsx
- [ ] Testing: Full regression test de todas las secciones
- [ ] Commit: "refactor: abstract parallax logic into useParallaxLayers hook"

## Fase 3: Extracción Navbar

- [ ] Crear src/hooks/useScrollTracking.ts
- [ ] Crear src/utils/navigation.ts con handleLogoNavigation
- [ ] Añadir tests para navigation.ts
- [ ] Refactorizar Navbar.tsx
- [ ] Testing: Navegación con logo (home y otras páginas)
- [ ] Testing: Scroll tracking (scroll > 80px)
- [ ] Testing: Mobile menu
- [ ] Commit: "refactor: extract Navbar logic into hooks and utilities"

## Fase 4: Componentes Reutilizables

- [ ] Crear src/components/ui/InfoItem/InfoItem.tsx
- [ ] Crear src/components/ui/InfoItem/InfoItem.module.css
- [ ] Actualizar Services.tsx para usar InfoItem
- [ ] Testing: Validación visual de metadata
- [ ] Commit: "refactor: create reusable InfoItem component"

## Post-Implementación

- [ ] Actualizar FRONTEND_DOCUMENTATION.md
- [ ] Actualizar README.md
- [ ] Performance profiling (compare pre/post)
- [ ] Full E2E testing pass
- [ ] Deploy to staging
- [ ] QA validation
- [ ] Deploy to production
- [ ] Monitor error rates post-deploy
```

### B. Comandos Git Recomendados

```bash
# Feature branch para refactoring
git checkout -b refactor/separation-of-concerns

# Commits incrementales por fase
git add src/components/ui/Icons
git commit -m "refactor(icons): extract SVG icons to reusable components"

git add src/config/navigation.ts src/data/servicesPageData.ts
git commit -m "refactor(data): move configuration and data to dedicated files"

git add src/hooks/useParallaxLayers.ts
git commit -m "feat(hooks): create useParallaxLayers hook for parallax abstraction"

# Merge a master cuando todas las fases estén completas y testeadas
git checkout master
git merge refactor/separation-of-concerns
git push origin master
```

### C. Performance Benchmarks Pre-Refactorización

**Para establecer baseline y comparar post-refactorización:**

```bash
# Lighthouse CI
npm run build
npx lighthouse http://localhost:4173 --output json --output-path ./lighthouse-pre.json

# React DevTools Profiler
# Grabar interacción de 10 segundos en homepage con scroll
# Exportar trace y guardar como profiler-pre.json
```

---

**Documento preparado por:** GitHub Copilot  
**Fecha:** Febrero 13, 2026  
**Versión:** 1.0
