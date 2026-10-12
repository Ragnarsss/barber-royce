# Documentación Técnica Frontend - Barber Royce

**Versión**: 1.0.0  
**Fecha**: Febrero 2026  
**Estado**: Desarrollo Activo

---

## Tabla de Contenidos

1. [Overview del Proyecto](#overview-del-proyecto)
2. [Arquitectura](#arquitectura)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura de Directorios](#estructura-de-directorios)
5. [Sistema de Diseño](#sistema-de-diseño)
6. [Componentes Principales](#componentes-principales)
7. [Sistema de Animaciones](#sistema-de-animaciones)
8. [Hooks Personalizados](#hooks-personalizados)
9. [Capa de Datos](#capa-de-datos)
10. [Patrones y Convenciones](#patrones-y-convenciones)
11. [Análisis de Mejoras](#análisis-de-mejoras)

---

## Overview del Proyecto

### Descripción

Aplicación web para Barber Royce, establecimiento de barbería premium. La aplicación implementa una interfaz moderna con énfasis en animaciones fluidas, scroll optimizado y diseño responsive.

### Objetivos Técnicos

- Experiencia de usuario optimizada mediante animaciones declarativas
- Performance de carga y renderizado optimizado
- Diseño adaptable para múltiples dispositivos y resoluciones
- Cumplimiento de estándares de accesibilidad WCAG 2.1 AA
- Estructura SEO-friendly con meta tags y semantic HTML

### Características Implementadas

- Smooth scroll con interpolación física (Lenis 1.3.17)
- Sistema de animaciones basado en scroll (Framer Motion 12.34.0)
- Scroll horizontal con snap points en secciones de servicios
- Parallax multicapa con diferentes velocidades de desplazamiento
- Progress indicator vinculado al scroll global (homepage únicamente)
- Arquitectura modular de componentes
- Sistema de design tokens CSS
- Client-side routing con React Router 7.13.0

---

## Arquitectura

### Patrón Arquitectónico

El proyecto implementa una arquitectura de componentes dividida en capas:

```
├── Presentation Layer (UI Components)
├── Business Logic (Hooks & Utils)
├── Data Layer (Static Data & Types)
└── Styling Layer (CSS Modules & Design Tokens)
```

### Principios de Diseño

1. **Separation of Concerns**: Componentes, lógica y estilos separados
2. **Component Composition**: Componentes reutilizables y componibles
3. **Single Responsibility**: Cada módulo tiene una responsabilidad clara
4. **DRY (Don't Repeat Yourself)**: Reutilización de código mediante hooks y utilidades
5. **Mobile First**: Diseño responsive desde la base

### Flujo de Datos

```
User Interaction → Component → Hook (si aplica) → Data Layer → Re-render
```

---

## Stack Tecnológico

### Core Technologies

| Tecnología       | Versión | Propósito       |
| ---------------- | ------- | --------------- |
| **React**        | 19.2.0  | Framework de UI |
| **TypeScript**   | 5.9.3   | Type safety     |
| **Vite**         | 7.3.1   | Build tool      |
| **React Router** | 7.13.0  | Routing         |

### Animation & Scroll

| Librería          | Versión | Propósito                |
| ----------------- | ------- | ------------------------ |
| **Framer Motion** | 12.34.0 | Animaciones declarativas |
| **Lenis**         | 1.3.17  | Smooth scroll con física |

### Styling

| Herramienta              | Versión | Propósito         |
| ------------------------ | ------- | ----------------- |
| **Tailwind CSS**         | 4.1.18  | Utility-first CSS |
| **CSS Modules**          | -       | Scoped styles     |
| **Custom Design Tokens** | -       | Sistema de diseño |

### UI Components

| Librería         | Versión | Propósito             |
| ---------------- | ------- | --------------------- |
| **Lucide React** | 0.563.0 | Iconos                |
| **Radix UI**     | 1.4.3   | Primitivas accesibles |
| **CVA**          | 0.7.1   | Variant management    |
| **clsx**         | 2.1.1   | Conditional classes   |

### Development Tools

- **ESLint**: Linting
- **Commitizen**: Conventional commits
- **SWC**: Fast compilation

---

## Estructura de Directorios

```
barber-royce/
├── public/                          # Assets estáticos
├── src/
│   ├── assets/                      # Imágenes y recursos
│   │   ├── hero_model_left_profile.png
│   │   ├── cta1_model.png
│   │   ├── cta2_crew.png
│   │   ├── barber_back.png
│   │   ├── social_proof_1.png
│   │   └── royce-barber-logo.png
│   │
│   ├── components/                  # Componentes React
│   │   ├── animations/              # Componentes de animación
│   │   │   ├── DirectionAwareElement.tsx
│   │   │   └── SmoothParallax.tsx
│   │   │
│   │   ├── common/                  # Componentes compartidos
│   │   │   └── Button/
│   │   │       ├── Button.tsx
│   │   │       └── Button.module.css
│   │   │
│   │   ├── layout/                  # Componentes de layout
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── Layout.module.css
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Navbar.module.css
│   │   │   └── Footer/
│   │   │       ├── Footer.tsx
│   │   │       └── Footer.module.css
│   │   │
│   │   ├── sections/                # Secciones de páginas
│   │   │   ├── Hero/
│   │   │   ├── Benefits/
│   │   │   ├── Features/
│   │   │   ├── Services/
│   │   │   ├── SocialProof1/
│   │   │   ├── SocialProof2/
│   │   │   ├── Reviews/
│   │   │   ├── CTA1/
│   │   │   └── CTA2/
│   │   │
│   │   └── ui/                      # Componentes UI base
│   │       ├── button.tsx
│   │       └── ScrollProgressBar/
│   │           └── ScrollProgressBar.tsx
│   │
│   ├── data/                        # Datos estáticos
│   │   ├── servicesData.ts
│   │   ├── benefitsData.ts
│   │   ├── featuresData.ts
│   │   ├── reviewsData.ts
│   │   └── heroData.ts
│   │
│   ├── hooks/                       # Custom hooks
│   │   ├── useLenis.ts
│   │   ├── useLenisScroll.ts
│   │   └── useScrollAnimation.ts
│   │
│   ├── lib/                         # Utilidades y configuración
│   │   ├── animations.ts            # Variantes de animación
│   │   └── utils.ts                 # Funciones auxiliares
│   │
│   ├── pages/                       # Páginas completas
│   │   ├── HomePage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── TeamPage.tsx
│   │   └── LocationPage.tsx
│   │
│   ├── styles/                      # Estilos globales
│   │   ├── tokens/                  # Design tokens
│   │   │   ├── colors.css
│   │   │   ├── typography.css
│   │   │   ├── spacing.css
│   │   │   ├── breakpoints.css
│   │   │   ├── shadows.css
│   │   │   ├── radius.css
│   │   │   ├── transitions.css
│   │   │   ├── z-index.css
│   │   │   └── index.css
│   │   ├── global.css
│   │   ├── reset.css
│   │   ├── variables.css
│   │   └── mixins.css
│   │
│   ├── App.tsx                      # Componente raíz
│   └── main.tsx                     # Entry point
│
├── ANIMATION_TECHNIQUES.tsx         # Guía de técnicas de animación
├── IMPLEMENTED_TECHNIQUES_GUIDE.tsx # Guía de implementación
├── LENIS_CONFIG_GUIDE.tsx          # Guía de configuración Lenis
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Sistema de Diseño

### Design Tokens

#### Colores

```css
/* Colores primarios */
--color-primary: #d52323; /* Rojo característico */
--color-primary-dark: #b51d1d;
--color-primary-light: #fe0000;

/* Colores neutrales */
--color-dark: #1a1a1a; /* Negro principal */
--color-dark-secondary: #2a2a2a;
--color-gray: #332b2b; /* Gris cálido */
--color-white: #ffffff;

/* Colores de texto */
--color-text: #1a1a1a;
--color-text-secondary: #666666;
--color-text-light: rgba(255, 255, 255, 0.85);
```

#### Tipografía

```css
/* Familias */
--font-primary: system-ui, -apple-system, sans-serif;
--font-serif: Georgia, "Times New Roman", serif;

/* Tamaños (Desktop) */
--text-hero: 72px;
--text-h1: 56px;
--text-h2: 40-42px;
--text-h3: 22-28px;
--text-body: 16-18px;
--text-small: 14px;

/* Pesos */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### Espaciado

```css
--spacing-xs: 8px;
--spacing-sm: 16px;
--spacing-md: 24px;
--spacing-lg: 32px;
--spacing-xl: 48px;
--spacing-2xl: 64px;
--spacing-3xl: 100px;
```

#### Breakpoints

```css
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1400px;
```

#### Sombras

```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
--shadow-xl: 0 15px 50px rgba(0, 0, 0, 0.3);
--shadow-glow-red: 0 0 15px rgba(213, 35, 35, 0.6);
```

#### Transiciones

```css
--transition-fast: 0.15s ease;
--transition-base: 0.3s ease;
--transition-slow: 0.6s ease;
```

### Componentes de UI

#### Button

**Variantes disponibles**:

- `default`: Estilo primario con background color primario
- `secondary`: Estilo outline con borde primario
- `ghost`: Estilo transparente sin borde

**Tamaños definidos**:

- `sm`: Altura 36px
- `md`: Altura 42px (default)
- `lg`: Altura 48px

**Implementación**:

```tsx
<Button size="lg" variant="default">
  Agendar Sesión
</Button>
```

---

## Componentes Principales

### Layout Components

#### `Layout`

**Propósito**: Estructura base de todas las páginas  
**Características**:

- Navbar fijo
- ScrollProgressBar (solo homepage)
- Footer
- Outlet para rutas hijas

**Ubicación**: `src/components/layout/Layout/Layout.tsx`

#### `Navbar`

**Responsabilidades**: Navegación principal de la aplicación  
**Funcionalidades implementadas**:

- Logo con navegación programatica al home
- Scroll to top con integración Lenis
- Links de navegación con estado activo via React Router
- CTA persistente "Agendar Sesión"
- Menú responsive para viewports móviles
- Estado scroll detectado: background blur + box-shadow al desplazar

**Ubicación**: `src/components/layout/Navbar/Navbar.tsx`

**Lógica de navegación del logo**:

```tsx
// Detección de ruta actual y aplicación de scroll behavior
const handleLogoClick = (e: React.MouseEvent) => {
  e.preventDefault();
  if (location.pathname === "/") {
    // En homepage: scroll programatico a top
    window.lenis?.scrollTo(0, { duration: 1.5 });
  } else {
    // En otras rutas: navigate + scroll diferido
    navigate("/");
    setTimeout(() => window.lenis?.scrollTo(0), 100);
  }
};
```

#### `Footer`

**Propósito**: Pie de página con información  
**Secciones**:

- Información de contacto
- Horarios
- Redes sociales
- Copyright

**Ubicación**: `src/components/layout/Footer/Footer.tsx`

### Section Components

#### `Hero`

**Responsabilidades**: Sección principal de entrada (above-the-fold)  
**Implementaciones técnicas**:

- Sistema de parallax multicapa con 6 niveles de profundidad
- Imagen principal con transformación parallax independiente
- Contenido textual con CTAs
- Animaciones de entrada orchestradas con Framer Motion

**Configuración de capas parallax**:

```typescript
- Background layer: 15% velocidad
- Layer 2: 20% velocidad
- Layer 3: 25% velocidad (imagen)
- Layer 4: 30% velocidad (texto)
- Layer 5: 35% velocidad
- Foreground: 40% velocidad
```

**Ubicación**: `src/components/sections/Hero/Hero.tsx`

#### `Services`

**Responsabilidades**: Presentación de servicios disponibles  
**Implementaciones técnicas**:

- Scroll horizontal nativo con `overflow-x: auto`
- Cards con estructura: imagen, metadata (precio, duración, incluye), descripción
- Efecto "peek": siguiente card parcialmente visible para indicar continuidad
- Scroll snap points (`scroll-snap-type: x mandatory`) para UX optimizada
- Transformaciones CSS en hover state

**Estructura de datos de Card**:

```tsx
<Card>
  <Image />              // Imagen del servicio
  <Content>
    <Title />            // Nombre del servicio
    <InfoGrid>
      <Icon + Valor />   // Precio
      <Icon + Duración />
      <Icon + Incluye /> // Cortesía
    </InfoGrid>
    <Description />      // Descripción detallada
  </Content>
</Card>
```

**Ubicación**: `src/components/sections/Services/Services.tsx`

#### `SocialProof1`

**Responsabilidades**: Testimonial destacado de cliente  
**Implementaciones técnicas**:

- Sistema de parallax multicapa con 7 elementos decorativos hexagonales
- Imagen principal con marco rotado usando transform CSS
- Card de testimonial con forma hexagonal aplicada via `clip-path`
- Efectos visuales: glassmorphism (`backdrop-filter: blur`), glow (`box-shadow`)

**Distribución de capas decorativas**:

1. Background (2 hexágonos grandes): opacidad 0.45-0.5
2. Middle (2 hexágonos medianos): opacidad 0.55-0.6, glow
3. Small (2 hexágonos pequeños): opacidad 0.35-0.4
4. Foreground (1 hexágono): opacidad 0.7, glow fuerte

**Ubicación**: `src/components/sections/SocialProof1/SocialProof1.tsx`

#### `Benefits`

**Propósito**: Grid de beneficios  
**Características**:

- Grid responsive (3 columnas → 1 en móvil)
- Animaciones de entrada staggered
- Iconos con gradiente rojo

**Ubicación**: `src/components/sections/Benefits/Benefits.tsx`

#### `Features`

**Propósito**: Características destacadas  
**Características**:

- Layout alternado (imagen izq/der)
- Hover effects en cards
- Animaciones desde los lados

**Ubicación**: `src/components/sections/Features/Features.tsx`

#### `Reviews`

**Propósito**: Testimonios de clientes  
**Características**:

- Cards de reviews con rating
- Grid responsive
- Avatar placeholders

**Ubicación**: `src/components/sections/Reviews/Reviews.tsx`

#### `CTA1` y `CTA2`

**Propósito**: Call-to-actions intermitentes  
**Características**:

- Parallax en imágenes
- Copia persuasiva
- Botones de acción
- Fondos con gradientes

**Ubicaciones**:

- `src/components/sections/CTA1/CTA1.tsx`
- `src/components/sections/CTA2/CTA2.tsx`

### UI Components

#### `ScrollProgressBar`

**Responsabilidades**: Indicador visual de progreso de scroll  
**Restricciones**: Renderizado condicional - homepage únicamente  
**Implementaciones técnicas**:

- Posicionamiento fijo (top: 0, z-index: 9999)
- Consume datos de scroll via hook `useLenisScroll`
- Doble capa: background estático gris + barra animada roja
- Animación: `scaleX` vinculado a scroll progress (0-1)
- Visual enhancement: glow effect con `box-shadow`

**Implementación core**:

```tsx
const { progress } = useLenisScroll();

// Renderizado condicional basado en ruta
if (location.pathname !== "/") return null;

// Transformación scaleX animada
<motion.div style={{ scaleX: progress }} />;
```

**Ubicación**: `src/components/ui/ScrollProgressBar/ScrollProgressBar.tsx`

### Animation Components

#### `DirectionAwareElement`

**Responsabilidades**: Wrapper para animaciones dependientes de dirección de scroll  
**Implementaciones técnicas**:

- Detección de dirección de scroll (up/down) via `useLenisScroll`
- Aplicación de transformaciones diferenciadas según dirección
- Badge de debug opcional para desarrollo

**Patrón de uso**:

```tsx
<DirectionAwareElement>
  <YourContent />
</DirectionAwareElement>
```

**Ubicación**: `src/components/animations/DirectionAwareElement.tsx`

#### `SmoothParallax`

**Responsabilidades**: Componente parallax con interpolación de resorte  
**Implementaciones técnicas**:

- Movimiento suavizado mediante `useSpring` de Framer Motion
- Parámetros configurables: velocidad, stiffness, damping
- Wrapper `SmoothParallaxSection` para encapsulación de contexto de scroll

**Patrón de uso**:

```tsx
<SmoothParallaxSection>
  <SmoothParallax speed={0.5} stiffness={100} damping={30}>
    <img />
  </SmoothParallax>
</SmoothParallaxSection>
```

**Ubicación**: `src/components/animations/SmoothParallax.tsx`

---

## Sistema de Animaciones

### Librería Base: Framer Motion

#### Variantes Predefinidas

**Ubicación**: `src/lib/animations.ts`

```typescript
// Fade in desde abajo
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// Fade in desde izquierda
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, ... }
};

// Fade in desde derecha
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, ... }
};

// Scale + fade in
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, ... }
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};
```

#### Configuraciones de Parallax

```typescript
export const parallaxLayers = {
  background: { y: ["0%", "15%"], scale: [1, 1.1], rotate: [0, 5] },
  middle: { y: ["0%", "25%"], scale: [1, 1.05], rotate: [0, -3] },
  foreground: { y: ["0%", "35%"], scale: [1, 1.02] },
  slow: { y: ["0%", "10%"] },
  fast: { y: ["0%", "45%"], x: ["0%", "5%"] },
};
```

### Técnicas Implementadas

#### 1. Scroll Progress Bar

**Descripción**: Barra fija que se llena con el progreso de scroll  
**Uso**: Homepage únicamente  
**Código**:

```tsx
const { progress } = useLenisScroll();
<motion.div style={{ scaleX: progress }} />;
```

#### 2. Parallax Multicapa

**Descripción**: Elementos se mueven a diferentes velocidades creando profundidad  
**Uso**: Hero, CTA1, CTA2, SocialProof1  
**Código**:

```tsx
const { scrollYProgress } = useScroll({ target: ref });
const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
<motion.div style={{ y }} />;
```

#### 3. Direction-Aware Animations

**Descripción**: Animaciones que cambian según dirección de scroll  
**Estado**: Componente listo, no implementado en homepage  
**Código**: Ver `DirectionAwareElement.tsx`

#### 4. Smooth Parallax con Spring

**Descripción**: Parallax con física de resorte para movimiento más natural  
**Estado**: Componente listo, no implementado en homepage  
**Código**: Ver `SmoothParallax.tsx`

#### 5. Horizontal Scroll + Stagger

**Descripción**: Scroll horizontal con animaciones escalonadas  
**Uso**: Services (homepage), ServicesPage  
**Código**:

```tsx
const x = useTransform(scrollYProgress, [0, 1], ["5%", "-75%"]);
const cardProgress = useTransform(
  scrollYProgress,
  [i * 0.08, (i + 1) * 0.1],
  [0, 1],
);
```

#### 6. Scroll-triggered Animations

**Descripción**: Animaciones que se activan al entrar en viewport  
**Uso**: Todas las secciones  
**Código**: Vía `useScrollAnimation` hook

### Easings Personalizados

```typescript
// Easing suave (easeOutCubic)
ease: [0.25, 0.46, 0.45, 0.94];

// Easing con bounce
ease: [0.34, 1.56, 0.64, 1];

// Lenis smooth scroll easing (easeOutExpo)
easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
```

---

## Hooks Personalizados

### `useLenis`

**Responsabilidades**: Inicialización y gestión del lifecycle de Lenis smooth scroll  
**Ubicación**: `src/hooks/useLenis.ts`

**Parámetros de configuración**:

```typescript
const lenis = new Lenis({
  duration: 1.2,              // Duración de interpolación en segundos
  easing: (t) => ...,         // Función easing: easeOutExpo
  orientation: 'vertical',    // Eje de scroll
  smoothWheel: true,          // Aplicar smoothing a scroll de rueda
  smoothTouch: false,         // Deshabilitar smoothing en touch (performance móvil)
  touchMultiplier: 2,         // Multiplicador de velocidad touch
  infinite: false             // Scroll infinito deshabilitado
});

// Exposición global para acceso programatico
window.lenis = lenis;

// Loop de animación integrado con RAF
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
```

**Integración en aplicación**:

```tsx
// App.tsx - nivel raíz de aplicación
useLenis();
```

**API programática disponible**:

```javascript
// Scroll a posición
window.lenis.scrollTo(0, { duration: 1.5 });

// Scroll a elemento
window.lenis.scrollTo("#section-id");

// Detener scroll
window.lenis.stop();

// Reanudar scroll
window.lenis.start();
```

### `useLenisScroll`

**Responsabilidades**: Hook para acceso en tiempo real a métricas de scroll  
**Ubicación**: `src/hooks/useLenisScroll.ts`

**Interface de retorno**:

```typescript
interface ScrollData {
  scroll: number; // Posición actual del scroll (px)
  limit: number; // Altura máxima scrollable (px)
  velocity: number; // Velocidad instantánea
  direction: number; // Dirección: 1 (down) | -1 (up)
  progress: number; // Progreso normalizado: 0-1
}
```

**Lógica de implementación**:

```typescript
const [scrollData, setScrollData] = useState<ScrollData>({...});

useEffect(() => {
  // Polling para esperar inicialización de Lenis
  const checkLenis = () => {
    const lenis = window.lenis;
    if (!lenis) {
      requestAnimationFrame(checkLenis);
      return;
    }

    // Handler de actualización de datos
    const handleScroll = (e: Lenis) => {
      setScrollData({
        scroll: e.scroll,
        limit: e.limit,
        velocity: e.velocity,
        direction: e.direction,
        progress: e.progress
      });
    };

    // Suscripción a evento de scroll
    lenis.on('scroll', handleScroll);
    return () => lenis.off('scroll', handleScroll);
  };

  checkLenis();
}, []);
```

**Patrones de uso**:

```tsx
const { progress, direction, velocity } = useLenisScroll();

// Binding de progress a transformación
<motion.div style={{ scaleX: progress }} />;

// Implementación de lógica condicional
{
  direction === 1 ? "Scrolling down" : "Scrolling up";
}
```

### `useScrollAnimation`

**Responsabilidades**: Hook para trigger automático de animaciones al entrar en viewport  
**Ubicación**: `src/hooks/useScrollAnimation.ts`

**Interface de retorno**:

```typescript
{
  ref: RefObject<HTMLElement>,           // Ref para elemento observado
  controls: AnimationControls,           // Controles de Framer Motion
  isInView: boolean                      // Estado de visibilidad
}
```

**Patrón de uso**:

```tsx
const { ref, controls } = useScrollAnimation();

<div ref={ref}>
  <motion.h1 initial="hidden" animate={controls} variants={fadeInUp}>
    Título Animado
  </motion.h1>
</div>;
```

**Parámetros de configuración**:

```typescript
const isInView = useInView(ref, {
  once: true, // Single trigger (no re-animate on re-entry)
  margin: "-100px", // Offset de activación antes de viewport entry
});

useEffect(() => {
  if (isInView) {
    controls.start("visible");
  }
}, [isInView, controls]);
```

---

## Capa de Datos

### Estructura de Datos

#### `servicesData.ts`

**Interface**:

```typescript
interface Service {
  name: string; // "CORTE DE CABELLO"
  description: string; // Descripción detallada
  price: string; // "$4.000"
  duration: string; // "45 min"
  includes: string; // "Cortesia"
  image: string; // URL de imagen
}
```

**Datos**:

- Corte de Cabello: $4.000, 45 min
- Corte + Barba: $6.000, 60 min
- Afeitado Premium: $5.000, 40 min
- Diseño de Barba: $3.500, 30 min

#### `benefitsData.ts`

**Interface**:

```typescript
interface Benefit {
  icon: React.ReactNode; // Lucide icon component
  title: string;
  description: string;
}
```

**Datos**:

- Profesionales Expertos
- Productos Premium
- Ambiente Exclusivo
- Atención Personalizada

#### `featuresData.ts`

**Interface**:

```typescript
interface Feature {
  title: string;
  description: string;
  image: string; // Asset path
  reverse: boolean; // Para layout alternado
}
```

#### `reviewsData.ts`

**Interface**:

```typescript
interface Review {
  name: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  avatar?: string;
}
```

#### `heroData.ts`

**Interface**:

```typescript
interface HeroData {
  title: string;
  subtitle: string;
  cta: {
    primary: string;
    secondary: string;
  };
  image: string;
}
```

### Patrón de Consumo

**Paso 1**: Definir interface en `src/data/`

```typescript
export interface Service { ... }
```

**Paso 2**: Exportar array de datos

```typescript
export const servicesList: Service[] = [...];
```

**Paso 3**: Importar en componente

```typescript
import { servicesList } from "@/data/servicesData";
```

**Paso 4**: Mapear en JSX

```tsx
{
  servicesList.map((service) => (
    <ServiceCard key={service.name} {...service} />
  ));
}
```

---

## Patrones y Convenciones

### Naming Conventions

#### Archivos

- Componentes: `PascalCase.tsx` (ej: `Navbar.tsx`)
- Estilos: `PascalCase.module.css` (ej: `Navbar.module.css`)
- Hooks: `camelCase.ts` con prefijo `use` (ej: `useLenis.ts`)
- Utils: `camelCase.ts` (ej: `animations.ts`)
- Data: `camelCase.ts` con sufijo `Data` (ej: `servicesData.ts`)

#### Variables y Funciones

```typescript
// Componentes: PascalCase
const Navbar = () => { ... }

// Hooks: camelCase con prefijo use
const useScrollAnimation = () => { ... }

// Funciones: camelCase
const handleClick = () => { ... }

// Constantes: camelCase o UPPER_SNAKE_CASE
const servicesList = [...]
const MAX_ITEMS = 10
```

#### CSS Classes

```css
/* BEM-like con CSS Modules */
.navbar { ... }
.navbar__logo { ... }
.navbar__link { ... }
.navbar__link--active { ... }

/* O kebab-case simple */
.scroll-container { ... }
.service-card { ... }
```

### File Organization

#### Colocation

Agrupar archivos relacionados:

```
components/
  layout/
    Navbar/
      Navbar.tsx
      Navbar.module.css
      Navbar.test.tsx (futuro)
```

#### Index Exports

Para exportaciones limpias:

```typescript
// components/sections/index.ts
export { Hero } from "./Hero/Hero";
export { Services } from "./Services/Services";
export { Benefits } from "./Benefits/Benefits";
```

### Component Patterns

#### Composición sobre Herencia

```tsx
// ✅ Bueno: Composición
<Layout>
  <Navbar />
  <Outlet />
  <Footer />
</Layout>

// ❌ Malo: Herencia
class HomePage extends BasePageWithNavbarAndFooter { ... }
```

#### Props Destructuring

```tsx
// ✅ Bueno: Destructure en parámetros
const Button = ({ size, variant, children }: ButtonProps) => { ... }

// ❌ Malo: Usar props directamente
const Button = (props: ButtonProps) => {
  return <button>{props.children}</button>
}
```

#### Early Returns

```tsx
// ✅ Bueno: Early return para condicionales
const ScrollProgressBar = () => {
  const location = useLocation();

  if (location.pathname !== "/") {
    return null;
  }

  return <ProgressBar />;
};
```

### CSS Patterns

#### CSS Modules

```tsx
import styles from "./Component.module.css";

<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>;
```

#### Conditional Classes con clsx

```tsx
import clsx from "clsx";

<button
  className={clsx(
    styles.button,
    isActive && styles.active,
    size === "lg" && styles.large,
  )}
/>;
```

#### Mobile-First Responsive

```css
/* Base: móvil */
.card {
  width: 100%;
  padding: 16px;
}

/* Tablet y superior */
@media (min-width: 768px) {
  .card {
    width: 50%;
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card {
    width: 33.333%;
    padding: 32px;
  }
}
```

### TypeScript Patterns

#### Type Definitions

```typescript
// Props con children
interface ComponentProps {
  title: string;
  children: React.ReactNode;
}

// Props con eventos
interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

// Data interfaces
interface Service {
  name: string;
  price: string;
  // ...
}
```

#### Utility Types

```typescript
// Pick
type ServicePreview = Pick<Service, "name" | "price">;

// Omit
type ServiceWithoutImage = Omit<Service, "image">;

// Partial
type PartialService = Partial<Service>;

// Required
type RequiredService = Required<Service>;
```

---

## Análisis de Mejoras

### Prioridad Alta (1-2 sprints)

#### 1. Optimización de Imágenes

**Issue actual**: Imágenes sin optimización ni lazy loading  
**Propuesta técnica**:

- Implementar `react-lazy-load-image-component` o native `loading="lazy"`
- Conversión a formatos modernos (WebP, AVIF) con fallback
- Blur placeholders mediante LQIP (Low Quality Image Placeholder)
- Implementar `srcset` para responsive images

**Código de referencia**:

```tsx
<LazyLoadImage
  src={image}
  placeholderSrc={imagePlaceholder}
  effect="blur"
  srcSet={`${image} 1x, ${image2x} 2x`}
/>
```

#### 2. Assets de Servicios

**Issue actual**: Uso de placeholders externos (Unsplash)  
**Propuesta técnica**:

- Captura profesional de servicios reales
- Almacenamiento en `src/assets/services/`
- Actualización de referencias en `servicesData.ts`
- Aplicar pipeline de optimización (compresión, formatos modernos)

#### 3. Implementación de Direction-Aware Animations

**Estado actual**: Componente desarrollado, no integrado  
**Propuesta técnica**:

```tsx
// Integración sugerida en Benefits o Features sections
<DirectionAwareElement>
  <BenefitCard />
</DirectionAwareElement>
```

#### 4. Suite de Tests

**Issue actual**: Ausencia de cobertura de testing  
**Propuesta técnica**:

- Configuración de Vitest + React Testing Library
- Tests unitarios para hooks personalizados
- Tests de integración para componentes críticos
- Coverage target: 70% mínimo

**Ejemplo de implementación**:

```tsx
// useLenisScroll.test.ts
describe("useLenisScroll", () => {
  it("should return scroll data", () => {
    const { result } = renderHook(() => useLenisScroll());
    expect(result.current).toHaveProperty("progress");
  });
});
```

#### 5. Audit de Accesibilidad

**Issue actual**: Sin verificación formal de cumplimiento WCAG 2.1 AA  
**Propuesta técnica**:

- Instalación de `eslint-plugin-jsx-a11y`
- Agregación de ARIA labels faltantes
- Verificación de ratios de contraste (min 4.5:1 para texto normal)
- Implementación de estados `:focus-visible`
- Testing de navegación por teclado

**Correcciones comunes requeridas**:

```tsx
// Agregar alt text
<img src={logo} alt="Barber Royce Logo" />

// Agregar aria-label a iconos
<button aria-label="Abrir menú">
  <MenuIcon />
</button>

// Focus visible
.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Prioridad Media (3-4 sprints)

#### 6. Módulo de Reservas

**Descripción técnica**: Sistema de booking end-to-end  
**Stack propuesto**:

- Backend: Firebase Functions / Supabase
- Calendar UI: `react-big-calendar`
- Form management: `react-hook-form` + `zod` validation
- State management: Context API / Zustand

**Features requeridas**:

- Selección de servicio con pricing
- Date/time picker con disponibilidad en tiempo real
- Selección de profesional
- Confirmación vía email (SendGrid/Resend)
- Panel de administración para gestión CRUD

#### 7. Headless CMS Integration

**Issue actual**: Contenido hardcodeado en archivos TypeScript  
**Propuesta técnica**:

- Integración con Sanity.io o Contentful
- Migración de directorio `data/` a esquemas CMS
- Implementación de live preview
- Interface de administración para edición de contenido

#### 8. Internacionalización (i18n)

**Descripción técnica**: Soporte multi-idioma  
**Propuesta técnica**:

- Instalación de `react-i18next` + `i18next`
- Estructura de archivos de traducción (`locales/es.json`, `locales/en.json`)
- Selector de idioma en Navbar con persistencia en localStorage
- ICU Message Format para pluralización y variables

**Implementación ejemplo**:

```tsx
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  return <h1>{t("hero.title")}</h1>;
};
```

#### 9. Analytics & Event Tracking

**Descripción técnica**: Sistema de métricas de usuario  
**Propuesta técnica**:

- Integración de Google Analytics 4 / Plausible Analytics
- Tracking de eventos críticos:
  - CTA interactions
  - Scroll depth milestones (25%, 50%, 75%, 100%)
  - Tiempo de permanencia por página
  - Flujos de navegación
- Compliance con GDPR/CCPA (cookie consent)

**Abstraction layer sugerida**:

```tsx
// utils/analytics.ts
export const trackEvent = (eventName: string, params: Record<string, any>) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", eventName, params);
  }
};

// Implementación
trackEvent("cta_click", { location: "hero", timestamp: Date.now() });
```

#### 10. Módulo de Blog/Content Marketing

**Descripción técnica**: Sección de contenido editorial  
**Features requeridas**:

- Posts con soporte Markdown/MDX
- Sistema de taxonomía (categorías, tags)
- Full-text search (Algolia/MeiliSearch)
- Metadata SEO por post
- RSS feed generation

### Prioridad Baja (5+ sprints)

#### 11. Progressive Web App (PWA)

**Descripción técnica**: Capacidades offline y funcionamiento app-like  
**Propuesta técnica**:

- Vite PWA Plugin con Workbox
- Service Worker con estrategias de caching (Network First, Cache First, Stale While Revalidate)
- Manifest.json con iconos y theme colors
- Offline fallback page
- App install prompt

#### 12. Programa de Fidelización

**Descripción técnica**: Sistema de puntos y recompensas  
**Features requeridas**:

- Sistema de autenticación de usuarios
- Acumulación y tracking de puntos
- Catálogo de recompensas canjeables
- Push notifications (Web Push API/Firebase Cloud Messaging)

#### 13. Módulo E-commerce

**Descripción técnica**: Venta digital de productos  
**Stack propuesto**:

- Payment gateway: Stripe/PayPal
- State management: Zustand/Redux Toolkit
- Carrito persistente (localStorage/IndexedDB)
- Checkout flow multi-step
- Gestión de inventario con Supabase/Firebase

#### 14. Live Chat Support

**Descripción técnica**: Soporte en tiempo real  
**Opciones de implementación**:

- SaaS: Intercom/Tawk.to/Crisp
- Custom: Socket.io + React
- Real-time notifications
- Agent dashboard para respuestas

#### 15. Admin Dashboard

**Descripción técnica**: Panel de control administrativo  
**Módulos requeridos**:

- Gestión de citas (CRUD, calendario, estados)
- CRM básico (clientes, historial, notas)
- Analytics dashboard (métricas de negocio)
- Gestión de barberos (schedules, availability)
- Configuración del sitio (content, settings)

---

## Optimizaciones de Performance

### Code Splitting con React.lazy

```tsx
// Lazy loading de rutas para bundle splitting
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));

<Suspense fallback={<Loader />}>
  <Routes>
    <Route path="/servicios" element={<ServicesPage />} />
  </Routes>
</Suspense>;
```

### Optimización de Imágenes

```tsx
// Preload de recursos críticos
<link rel="preload" as="image" href={heroImage} />

// Native lazy loading
<img loading="lazy" src={image} alt="" />
```

### Análisis de Bundle Size

- Tree shaking automático mediante Vite
- Analizar bundle con `vite-bundle-visualizer`
- Dynamic imports para librerías de gran tamaño

### Estrategia de Caching

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          router: ["react-router-dom"],
          animation: ["framer-motion", "lenis"],
        },
      },
    },
  },
});
```

---

## Convenciones de Commits

### Formato (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Cambios en documentación
- `style`: Formateo, espacios, etc. (no código)
- `refactor`: Refactorización de código
- `perf`: Mejoras de performance
- `test`: Agregar/modificar tests
- `chore`: Tareas de mantenimiento

### Ejemplos de Commits

```bash
feat(services): implement horizontal scroll in service cards

- Native horizontal scroll con overflow-x
- Peek effect para indicar continuidad
- Actualización de estilos para nuevo layout
- Snap points para mejor UX

Closes #42

---

fix(navbar): correct logo scroll behavior on homepage

- Agregado handleLogoClick con integración Lenis
- Detección de ruta actual con useLocation
- Smooth scroll a top en home, navigate + scroll en otras rutas

Fixes #38

---

docs: add comprehensive frontend technical documentation

- Overview de arquitectura
- Documentación de componentes y hooks
- Guía de sistema de animaciones
- Roadmap de mejoras

---

refactor(animations): extract parallax config to constants

- Migración de configuración parallax a animations.ts
- Actualización de componentes Hero y CTA
- Mejora de reusabilidad de código
```

---

## Seguridad y Best Practices

### Variables de Entorno

```bash
# .env.local (excluir de control de versiones)
VITE_API_URL=https://api.example.com
VITE_GA_ID=G-XXXXXXXXXX
```

```typescript
// Acceso en runtime
const apiUrl = import.meta.env.VITE_API_URL;
```

### Política CORS

Configuración requerida para integración con backend:

```typescript
// Configuración backend
app.use(
  cors({
    origin: ["https://barber-royce.com"],
    credentials: true,
  }),
);
```

### Content Security Policy

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src 'self' https:; script-src 'self' 'unsafe-inline'"
/>
```

### Sanitización de Input de Usuario

Implementación requerida para formularios de usuario:

```typescript
import DOMPurify from "dompurify";

const sanitizedInput = DOMPurify.sanitize(userInput);
```

---

## Recursos Adicionales

### Documentación Oficial

- [React 19](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [Lenis Smooth Scroll](https://github.com/studio-freight/lenis)
- [React Router v7](https://reactrouter.com)
- [Vite](https://vite.dev)

### Guías del Proyecto

- `ANIMATION_TECHNIQUES.tsx`: 10 técnicas de animación con ejemplos
- `LENIS_CONFIG_GUIDE.tsx`: Configuraciones y opciones de Lenis
- `IMPLEMENTED_TECHNIQUES_GUIDE.tsx`: Guía de uso de features implementadas

### Design Inspiration

- [Awwwards](https://www.awwwards.com)
- [Dribbble - Barbershop](https://dribbble.com/search/barber)
- [Behance - Hairdresser](https://www.behance.net/search/projects?search=barbershop)

---

## Guía de Contribución

### Estrategia de Branching (Git Flow)

```
master (main)          ← Rama de producción
  ↑
develop               ← Rama de desarrollo
  ↑
feature/feature-name  ← Features en desarrollo
bugfix/bug-name       ← Corrección de bugs
hotfix/hotfix-name    ← Hotfixes críticos para producción
```

### Template para Pull Requests

```markdown
## Descripción

Resumen técnico de los cambios implementados

## Tipo de cambio

- [ ] Bug fix (cambio no breaking que corrige un issue)
- [ ] Nueva funcionalidad (cambio no breaking que agrega features)
- [ ] Breaking change (fix o feature que afectaría funcionalidad existente)
- [ ] Documentación

## Checklist

- [ ] Código cumple con convenciones del proyecto
- [ ] Auto-review completado
- [ ] Tests agregados/actualizados (si aplica)
- [ ] Documentación actualizada
- [ ] Console limpia (sin warnings)
- [ ] Build exitoso sin errores

## Screenshots/Evidence (si aplica)
```

### Code Review Checklist

- Funcionalidad correcta
- Code quality (legibilidad, mantenibilidad)
- Performance (optimizaciones necesarias)
- Tests (cobertura adecuada)
- Accesibilidad
- Responsive design
- Sin console.log o debugger
- Documentación actualizada

---

## Contacto y Soporte

### Equipo Técnico

- **Frontend Lead**: [Nombre/Contacto]
- **UI/UX Designer**: [Nombre/Contacto]
- **Backend Lead**: [Nombre/Contacto]

### Proceso de Reporte de Issues

```markdown
**Título**: [Componente/Módulo] Descripción concisa del problema

**Descripción detallada**:
Explicación técnica del issue y contexto

**Pasos para reproducir**:

1. Navegar a '[ruta]'
2. Ejecutar acción '[acción]'
3. Observar comportamiento

**Comportamiento esperado**:
Descripción del comportamiento correcto

**Comportamiento actual**:
Descripción del comportamiento erróneo

**Evidence**:

- Screenshots/videos
- Console logs
- Network traces (si aplica)

**Ambiente**:

- Browser: [Chrome 120.0.6099.129]
- OS: [Windows 11 / macOS 14.2]
- Device: [Desktop / iPhone 15 Pro]
- Screen resolution: [1920x1080]
```

---

## Métricas de Performance Actuales

### Lighthouse Scores (Estimados)

- **Performance**: 85-90
- **Accessibility**: 80-85
- **Best Practices**: 90-95
- **SEO**: 85-90

### Oportunidades de Mejora

1. Optimizar imágenes: incremento estimado +10 puntos Performance
2. Implementar lazy loading: incremento estimado +5 puntos Performance
3. Agregar ARIA labels: incremento estimado +10 puntos Accessibility
4. Meta tags completos: incremento estimado +5 puntos SEO

---

## Roadmap de Desarrollo

### Q1 2026

- [COMPLETADO] Lenis smooth scroll
- [COMPLETADO] Animaciones avanzadas
- [COMPLETADO] Scroll horizontal en servicios
- [COMPLETADO] Progress bar
- [EN PROGRESO] Imágenes optimizadas

### Q2 2026

- [PLANEADO] Sistema de reservas
- [PLANEADO] Tests unitarios
- [PLANEADO] CMS integration
- [PLANEADO] Analytics

### Q3 2026

- [PLANEADO] PWA
- [PLANEADO] i18n
- [PLANEADO] Blog section
- [PLANEADO] Dashboard admin

### Q4 2026

- [PLANEADO] E-commerce
- [PLANEADO] Programa fidelidad
- [PLANEADO] Chat en vivo

---

## Conclusión

Este documento proporciona una visión completa de la arquitectura, diseño e implementación del frontend de Barber Royce. El stack tecnológico seleccionado prioriza performance, mantenibilidad y experiencia de usuario.

### Próximos Pasos Técnicos

1. Implementar suite de tests unitarios (Vitest + React Testing Library)
2. Optimizar pipeline de imágenes (WebP/AVIF, lazy loading, responsive images)
3. Ejecutar audit de accesibilidad (WAVE, axe DevTools)
4. Iniciar desarrollo del módulo de reservas

### Mantenimiento del Documento

Actualizar este documento ante cambios significativos en:

- Arquitectura de componentes
- Stack tecnológico
- Sistema de diseño
- Patrones de implementación

**Última actualización**: Febrero 13, 2026  
**Versión del documento**: 1.0.0
