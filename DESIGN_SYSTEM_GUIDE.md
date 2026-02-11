# Design System Guide - Barber Royce

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Fundamentos del Design System](#fundamentos-del-design-system)
3. [Design Tokens](#design-tokens)
4. [Sistema de Tipografía](#sistema-de-tipografía)
5. [Sistema de Color](#sistema-de-color)
6. [Espaciado y Layout](#espaciado-y-layout)
7. [Componentes Base](#componentes-base)
8. [Mejores Prácticas](#mejores-prácticas)

---

## Introducción

### Qué es un Design System

Un Design System es un conjunto de patrones, componentes y guías reutilizables que aseguran consistencia visual y de experiencia en toda la aplicación. Piénsalo como una biblioteca de piezas LEGO: cada pieza tiene dimensiones específicas, colores definidos, y se combinan de manera predecible.

### Por qué necesitas uno

**Consistencia**: Todos los botones se ven iguales, los espaciados son uniformes, los colores siguen una paleta definida.

**Escalabilidad**: Cuando necesites agregar una nueva página, ya tienes todos los componentes listos.

**Mantenibilidad**: Si decides cambiar el color primario, lo cambias en un solo lugar y se actualiza en toda la app.

**Velocidad de desarrollo**: No pierdes tiempo decidiendo "¿qué tamaño de padding uso aquí?", ya está definido.

---

## Fundamentos del Design System

### Estructura de archivos

```
src/
├── styles/
│   ├── tokens/              # Design tokens (valores base)
│   │   ├── colors.css
│   │   ├── typography.css
│   │   ├── spacing.css
│   │   ├── shadows.css
│   │   └── index.css
│   ├── mixins.css           # Utilities reutilizables
│   ├── reset.css            # CSS reset
│   └── global.css           # Estilos globales
│
├── components/
│   ├── common/              # Componentes atómicos
│   └── ...
```

### Jerarquía conceptual (Atomic Design)

1. **Tokens**: Variables CSS (colores, spacing, fuentes)
2. **Atoms**: Componentes más pequeños (Button, Input, Icon)
3. **Molecules**: Combinaciones de atoms (SearchBar = Input + Button)
4. **Organisms**: Secciones complejas (Navbar = Logo + Menu + Button)
5. **Templates**: Layouts de páginas
6. **Pages**: Instancias específicas con contenido real

---

## Design Tokens

### Qué son los tokens

Los tokens son **valores nombrados** que representan decisiones de diseño. En lugar de usar `#1a1a1a` directamente en tu código, defines `--color-primary: #1a1a1a` y usas `var(--color-primary)`.

### Ventajas

1. **Single Source of Truth**: Cambias el valor en un lugar, se actualiza en todos lados.
2. **Semántica**: `--color-primary` es más descriptivo que `#1a1a1a`.
3. **Temas**: Puedes crear variantes (tema oscuro) cambiando solo los tokens.
4. **Consistencia**: El equipo usa los mismos valores siempre.

### Naming Convention

Usa nombres **semánticos**, no descriptivos:

**Mal:**

```css
--black: #000000;
--dark-gray: #333333;
```

**Bien:**

```css
--color-primary: #000000;
--color-text-secondary: #333333;
```

**Por qué**: Si mañana decides que tu "primary" sea azul en vez de negro, el nombre sigue teniendo sentido. "black" ya no sería apropiado.

---

## Sistema de Tipografía

### Scale (Escala Tipográfica)

Una escala tipográfica es una progresión matemática de tamaños de texto. Usar una escala te asegura que tus tamaños sean armoniosos.

**Escala común**: 1.25 (Major Third)

```
Base: 16px
16 × 1.25 = 20px
20 × 1.25 = 25px
25 × 1.25 = 31px (redondeado a 32px)
32 × 1.25 = 40px
40 × 1.25 = 50px
50 × 1.25 = 62px (redondeado a 64px)
```

### Pesos (Font Weights)

Define pesos específicos y nómbralos semánticamente:

```css
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Line Height

El line-height afecta la legibilidad. Reglas generales:

- **Títulos (H1-H3)**: 1.1 - 1.3 (más apretado)
- **Cuerpo (párrafos)**: 1.5 - 1.7 (más espacioso para lectura)
- **UI elements**: 1.5 (balance)

---

## Sistema de Color

### Anatomía de una paleta

Una paleta completa para una aplicación incluye:

1. **Primary**: Color principal de marca (CTAs, links importantes)
2. **Secondary**: Color complementario (elementos de apoyo)
3. **Neutral**: Grises (texto, fondos, bordes)
4. **Semantic**: Colores con significado (success, error, warning, info)

### Escala de colores

Para cada color, define variantes:

```css
/* Primary Scale */
--color-primary-50: #f0f0f0; /* Muy claro */
--color-primary-100: #e0e0e0;
--color-primary-200: #c0c0c0;
--color-primary-300: #a0a0a0;
--color-primary-400: #808080;
--color-primary-500: #1a1a1a; /* Base */
--color-primary-600: #151515;
--color-primary-700: #101010;
--color-primary-800: #0a0a0a;
--color-primary-900: #000000; /* Muy oscuro */
```

**Uso típico**:

- 50-200: Fondos sutiles, hovers ligeros
- 300-500: Textos secundarios, bordes
- 500-700: Elementos principales, CTAs
- 800-900: Textos de alto contraste

### Contraste y accesibilidad

**WCAG 2.1 Level AA** requiere:

- Texto normal: Ratio de contraste mínimo 4.5:1
- Texto grande (18px+ o 14px+ bold): Ratio mínimo 3:1

Usa herramientas como [Contrast Checker](https://webaim.org/resources/contrastchecker/) para validar.

---

## Espaciado y Layout

### Sistema de Espaciado (Spacing Scale)

Usa una escala basada en múltiplos de un valor base (típicamente 4px u 8px).

**Base: 4px**

```css
--spacing-0: 0;
--spacing-1: 4px; /* 1 × 4 */
--spacing-2: 8px; /* 2 × 4 */
--spacing-3: 12px; /* 3 × 4 */
--spacing-4: 16px; /* 4 × 4 */
--spacing-5: 20px; /* 5 × 4 */
--spacing-6: 24px; /* 6 × 4 */
--spacing-8: 32px; /* 8 × 4 */
--spacing-10: 40px; /* 10 × 4 */
--spacing-12: 48px; /* 12 × 4 */
--spacing-16: 64px; /* 16 × 4 */
--spacing-20: 80px; /* 20 × 4 */
--spacing-24: 96px; /* 24 × 4 */
```

### Cuándo usar cada spacing

- **0-4px**: Espacios muy apretados (entre íconos y texto en un botón)
- **8-12px**: Espacios entre elementos relacionados (padding de botones)
- **16-24px**: Espacios entre secciones de un componente
- **32-48px**: Espacios entre componentes diferentes
- **64-96px**: Espacios entre secciones de página

### Breakpoints (Responsive)

Define breakpoints consistentes:

```css
--breakpoint-xs: 320px; /* Móviles pequeños */
--breakpoint-sm: 640px; /* Móviles grandes */
--breakpoint-md: 768px; /* Tablets */
--breakpoint-lg: 1024px; /* Laptops */
--breakpoint-xl: 1280px; /* Desktops */
--breakpoint-2xl: 1536px; /* Pantallas grandes */
```

---

## Componentes Base

### Anatomía de un Componente Reutilizable

Un componente bien diseñado tiene:

1. **Props con valores por defecto**: Configurable pero funciona out-of-the-box
2. **Variantes**: Diferentes estilos para diferentes contextos
3. **Estados**: Normal, hover, active, disabled, focus
4. **Accesibilidad**: ARIA labels, keyboard navigation
5. **Documentación**: Ejemplos de uso

### Ejemplo: Sistema de Button

**Variantes**:

- `primary`: Acción principal (alta visibilidad)
- `secondary`: Acciones secundarias (menos énfasis)
- `outline`: Acciones terciarias (mínimo énfasis)
- `ghost`: Acciones sutiles (casi invisible)

**Tamaños**:

- `small`: Uso en espacios reducidos
- `medium`: Default, uso general
- `large`: CTAs importantes, heros

**Estados**:

- Normal: Estado por defecto
- Hover: Feedback visual al pasar mouse
- Active: Feedback al hacer click
- Disabled: No interactuable
- Loading: Indica operación en progreso

### Composición vs Props

**Props approach**: Pasar todo como props

```tsx
<Button loading={true} icon="check" text="Guardar" />
```

**Composition approach**: Componentes anidados

```tsx
<Button>
  <Icon name="check" />
  Guardar
</Button>
```

**Cuándo usar cada uno**:

- Props: Componentes simples, configuración limitada
- Composition: Componentes complejos, mayor flexibilidad

---

## Mejores Prácticas

### 1. Usa CSS Variables para todo lo configurable

**Mal**:

```css
.button {
  background-color: #1a1a1a;
  padding: 12px 24px;
  border-radius: 8px;
}
```

**Bien**:

```css
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
}
```

### 2. No uses valores mágicos

**Mal**:

```css
.card {
  margin-bottom: 23px; /* ¿Por qué 23? */
}
```

**Bien**:

```css
.card {
  margin-bottom: var(--spacing-6); /* 24px de tu escala */
}
```

### 3. Mantén especificidad baja

**Mal**:

```css
.page .section .container .card .button {
  /* Muy específico, difícil de sobrescribir */
}
```

**Bien**:

```css
.button {
  /* Simple y reutilizable */
}
```

### 4. Usa BEM o CSS Modules para namespacing

**BEM**:

```css
.button {
}
.button--primary {
}
.button__icon {
}
```

**CSS Modules** (lo que estás usando):

```css
.button {
}
.primary {
}
.icon {
}
```

### 5. Mobile-first

Escribe estilos base para móvil, luego agrega media queries para pantallas más grandes:

```css
.container {
  padding: var(--spacing-4);
}

@media (min-width: 768px) {
  .container {
    padding: var(--spacing-6);
  }
}
```

### 6. Agrupa propiedades lógicamente

```css
.button {
  /* Posicionamiento */
  position: relative;
  display: inline-flex;

  /* Box model */
  padding: var(--spacing-3) var(--spacing-6);
  margin: 0;

  /* Tipografía */
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);

  /* Visual */
  background-color: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);

  /* Interactividad */
  cursor: pointer;
  transition: var(--transition-base);
}
```

### 7. Documenta decisiones importantes

```css
/* 
 * Se usa box-shadow en lugar de border para evitar layout shift
 * al cambiar entre estados
 */
.button:focus {
  box-shadow: 0 0 0 3px var(--color-primary-200);
}
```

---

## Herramientas Recomendadas

### Para crear paletas de colores

- **Coolors.co**: Generador de paletas
- **Adobe Color**: Explorador de combinaciones
- **Paletton**: Creador de esquemas de color

### Para verificar contraste

- **WebAIM Contrast Checker**: Validación WCAG
- **Colorable**: Test rápido de contraste

### Para tipografía

- **Type Scale**: Generador de escalas tipográficas
- **Modular Scale**: Calculadora de escalas

### Para espaciado

- **Spacing Calculator**: Genera sistemas de espaciado

### Para inspección

- **Browser DevTools**: Fundamental para debugging
- **VisBug**: Chrome extension para diseño visual

---

## Checklist de Implementación

### Fase 1: Fundamentos

- [ ] Definir paleta de colores base
- [ ] Crear escala tipográfica
- [ ] Establecer sistema de espaciado
- [ ] Configurar breakpoints responsive
- [ ] Definir shadows y radius

### Fase 2: Componentes Base

- [ ] Button con todas las variantes
- [ ] Input y formularios
- [ ] Card y contenedores
- [ ] Typography components (H1-H6, Text)
- [ ] Icons system

### Fase 3: Componentes Compuestos

- [ ] Navbar
- [ ] Footer
- [ ] Modal/Dialog
- [ ] Forms complejos
- [ ] Loading states

### Fase 4: Documentación

- [ ] Storybook o página de componentes
- [ ] Guía de uso para cada componente
- [ ] Ejemplos de código
- [ ] Do's and Don'ts

### Fase 5: Testing y Refinamiento

- [ ] Test de accesibilidad
- [ ] Test de responsive
- [ ] Validación de contraste
- [ ] Performance audit

---

## Recursos para seguir aprendiendo

### Documentación de Design Systems profesionales

- **Material Design** (Google): Documentación exhaustiva
- **Ant Design**: Componentes empresariales
- **Chakra UI**: Accesibilidad first
- **Tailwind CSS**: Utility-first approach

### Conceptos clave a profundizar

1. **CSS Custom Properties**: MDN Web Docs
2. **Atomic Design**: Artículo de Brad Frost
3. **Design Tokens**: W3C Design Tokens Community Group
4. **Accessibility**: WCAG Guidelines
5. **CSS Architecture**: SMACSS, BEM, ITCSS

### Libros recomendados

- "Refactoring UI" - Steve Schoger & Adam Wathan
- "Design Systems" - Alla Kholmatova
- "Atomic Design" - Brad Frost

---

## Próximos pasos para tu proyecto

1. **Auditar estilos actuales**: Identifica inconsistencias (diferentes tamaños de padding, colores hardcoded)
2. **Extraer tokens**: Convierte valores hardcoded a CSS variables
3. **Crear sistema de spacing**: Reemplaza valores arbitrarios con escala definida
4. **Documentar componentes**: Crea ejemplos de uso para cada componente
5. **Iterar**: El design system evoluciona con el producto

Recuerda: Un design system no se crea de una vez. Empieza con lo básico y ve agregando conforme surjan necesidades.
