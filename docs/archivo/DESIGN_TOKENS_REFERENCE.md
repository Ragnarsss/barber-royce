# Design System - Quick Reference

## Guía rápida de uso de tokens

### Colores

```css
/* Primarios */
var(--color-primary-500)        /* Color principal */
var(--color-primary-700)        /* Hover */

/* Texto */
var(--color-text-primary)       /* Texto principal negro/oscuro */
var(--color-text-secondary)     /* Texto secundario gris */
var(--color-text-inverse)       /* Texto sobre fondos oscuros */

/* Backgrounds */
var(--color-background-primary)     /* Blanco */
var(--color-background-secondary)   /* Gris muy claro */

/* Bordes */
var(--color-border-light)       /* Bordes sutiles */
var(--color-border-medium)      /* Bordes visibles */
```

### Espaciado

```css
/* Espacios pequeños (4-12px) */
var(--spacing-1)    /* 4px - gap mínimo */
var(--spacing-2)    /* 8px - gap entre íconos */
var(--spacing-3)    /* 12px - padding de botones */

/* Espacios medianos (16-32px) */
var(--spacing-4)    /* 16px - padding general */
var(--spacing-6)    /* 24px - gap entre elementos */
var(--spacing-8)    /* 32px - separación de secciones */

/* Espacios grandes (48-96px) */
var(--spacing-12)   /* 48px - secciones mobile */
var(--spacing-16)   /* 64px - secciones tablet */
var(--spacing-20)   /* 80px - secciones desktop */
```

### Tipografía

```css
/* Tamaños */
var(--font-size-sm)     /* 14px - texto pequeño */
var(--font-size-base)   /* 16px - texto normal */
var(--font-size-lg)     /* 18px - texto destacado */
var(--font-size-2xl)    /* 24px - subtítulos */
var(--font-size-4xl)    /* 36px - títulos */
var(--font-size-5xl)    /* 48px - hero títulos */

/* Pesos */
var(--font-weight-regular)   /* 400 - texto normal */
var(--font-weight-medium)    /* 500 - énfasis sutil */
var(--font-weight-semibold)  /* 600 - botones, labels */
var(--font-weight-bold)      /* 700 - headings */

/* Line heights */
var(--line-height-tight)     /* 1.1 - headings */
var(--line-height-normal)    /* 1.5 - UI */
var(--line-height-relaxed)   /* 1.6 - párrafos */
```

### Sombras

```css
var(--shadow-sm)    /* Sombra sutil - cards */
var(--shadow-md)    /* Sombra media - hover */
var(--shadow-lg)    /* Sombra grande - modales */
var(--shadow-xl)    /* Sombra extra - destacados */
```

### Border Radius

```css
var(--radius-sm)    /* 4px - elementos pequeños */
var(--radius-md)    /* 8px - botones, inputs */
var(--radius-lg)    /* 12px - cards */
var(--radius-xl)    /* 16px - secciones */
var(--radius-full)  /* Circular - avatares */
```

### Transiciones

```css
var(--transition-fast)   /* 150ms - hover rápido */
var(--transition-base)   /* 250ms - animaciones generales */
var(--transition-slow)   /* 350ms - transiciones complejas */

/* Transiciones específicas */
var(--transition-colors)     /* Para color, background, border */
var(--transition-transform)  /* Para transforms */
```

### Z-index

```css
var(--z-index-sticky)    /* 1100 - navbar sticky */
var(--z-index-modal)     /* 1400 - modales */
var(--z-index-tooltip)   /* 1700 - tooltips */
```

## Patrones de uso comunes

### Card básico

```css
.card {
  background-color: var(--color-background-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Botón custom

```css
.customButton {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary-500);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  transition: var(--transition-colors);
}

.customButton:hover {
  background-color: var(--color-primary-700);
}
```

### Input

```css
.input {
  padding: var(--spacing-3) var(--spacing-4);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: var(--transition-colors);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-focus-primary);
}
```

### Section layout

```css
.section {
  padding: var(--spacing-section-mobile) 0;
}

@media (min-width: 768px) {
  .section {
    padding: var(--spacing-section-tablet) 0;
  }
}

@media (min-width: 1024px) {
  .section {
    padding: var(--spacing-section-desktop) 0;
  }
}
```

## Utility Classes disponibles

```html
<!-- Container -->
<div class="container">...</div>

<!-- Flexbox -->
<div class="flex-center">...</div>
<div class="flex-between">...</div>

<!-- Grid -->
<div class="grid-auto-fit">...</div>

<!-- Truncate text -->
<p class="truncate">...</p>
<p class="line-clamp-2">...</p>

<!-- Hide en responsive -->
<div class="hidden-mobile">...</div>
<div class="hidden-tablet">...</div>

<!-- Aspect ratios -->
<div class="aspect-square">...</div>
<div class="aspect-video">...</div>

<!-- Loading skeleton -->
<div class="skeleton" style="width: 100%; height: 20px;"></div>
```

## Media Queries

```css
/* Mobile first approach - escribe estilos base para móvil */

.element {
  /* Estilos móvil (< 768px) */
  padding: var(--spacing-4);
}

/* Tablet y mayor */
@media (min-width: 768px) {
  .element {
    padding: var(--spacing-6);
  }
}

/* Desktop y mayor */
@media (min-width: 1024px) {
  .element {
    padding: var(--spacing-8);
  }
}
```

## Breakpoints de referencia

- **320px**: Móviles pequeños (iPhone SE)
- **640px**: Móviles grandes (iPhone Plus)
- **768px**: Tablets (iPad)
- **1024px**: Laptops pequeñas
- **1280px**: Desktops estándar
- **1536px**: Pantallas grandes

## Checklist antes de crear un componente

1. ¿Usa tokens en lugar de valores hardcoded?
2. ¿Tiene estados hover, focus, active, disabled?
3. ¿Es accesible (ARIA labels, keyboard navigation)?
4. ¿Es responsive (funciona en móvil)?
5. ¿Usa transiciones para feedback visual?
6. ¿Tiene documentación/comentarios?
7. ¿Sigue la convención de naming?

## Recursos

- [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md) - Guía completa
- [WEB_REQUIREMENTS_CHECKLIST.md](./WEB_REQUIREMENTS_CHECKLIST.md) - Requerimientos técnicos
