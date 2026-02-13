/**
 * GUÍA DE USO: Técnicas implementadas
 *
 * Este archivo muestra cómo usar las 4 técnicas implementadas en tu proyecto
 */

import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar/ScrollProgressBar";
import {
  DirectionAwareElement,
  ScrollDirectionBadge,
} from "@/components/animations/DirectionAwareElement";
import {
  SmoothParallax,
  SmoothParallaxSection,
} from "@/components/animations/SmoothParallax";

/* ================================================================
   TÉCNICA 1: SCROLL PROGRESS BAR ✅ IMPLEMENTADA
   ================================================================ */

// YA ESTÁ ACTIVA EN TU LAYOUT
// Ver: src/components/layout/Layout/Layout.tsx
//
// La barra roja aparece en la parte superior de todas las páginas
// y se llena mientras haces scroll

/* ================================================================
   TÉCNICA 3: DIRECTION-AWARE ANIMATIONS ✅ IMPLEMENTADA
   ================================================================ */

// USO BÁSICO:
export const DirectionAwareExample = () => {
  return (
    <section>
      <h2>Elementos que reaccionan a la dirección</h2>

      {/* Elemento que se mueve a la derecha al scrollear abajo */}
      <DirectionAwareElement downOffset={100} upOffset={-100}>
        <div style={{ padding: "20px", background: "#d52323", color: "white" }}>
          Me muevo según la dirección del scroll
        </div>
      </DirectionAwareElement>

      {/* Badge de debug (muestra dirección actual) */}
      <ScrollDirectionBadge />
    </section>
  );
};

// EJEMPLO AVANZADO - Navbar que se oculta al scrollear abajo:
export const DirectionAwareNavbar = () => {
  return (
    <DirectionAwareElement
      downOffset={0} // Sin movimiento horizontal
      upOffset={0}
      duration={0.3}
    >
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          // Agregar transform en CSS para ocultar/mostrar
        }}
      >
        {/* Contenido del navbar */}
      </nav>
    </DirectionAwareElement>
  );
};

/* ================================================================
   TÉCNICA 4: SMOOTH PARALLAX CON SPRING ✅ IMPLEMENTADA
   ================================================================ */

// USO BÁSICO - Imagen con parallax:
export const ParallaxImageExample = () => {
  return (
    <div style={{ height: "100vh", position: "relative", overflow: "hidden" }}>
      <SmoothParallax
        speed={-50} // Velocidad del parallax (negativo = sube)
        stiffness={100} // Rigidez del spring
        damping={30} // Amortiguamiento
        scale={[1, 1.2]} // Escala de 1 a 1.2
      >
        <img
          src="/hero-image.jpg"
          alt="Hero"
          style={{ width: "100%", height: "120vh", objectFit: "cover" }}
        />
      </SmoothParallax>
    </div>
  );
};

// USO AVANZADO - Múltiples capas con diferentes velocidades:
export const MultiLayerParallaxExample = () => {
  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Capa de fondo (lenta) */}
      <SmoothParallax speed={-10} stiffness={50} damping={40}>
        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            background: "rgba(213, 35, 35, 0.1)",
            borderRadius: "50%",
            top: "20%",
            left: "10%",
          }}
        />
      </SmoothParallax>

      {/* Capa media (normal) */}
      <SmoothParallax speed={-30} stiffness={100} damping={30}>
        <div
          style={{
            position: "absolute",
            width: "150px",
            height: "150px",
            background: "rgba(254, 0, 0, 0.2)",
            borderRadius: "50%",
            top: "50%",
            right: "20%",
          }}
        />
      </SmoothParallax>

      {/* Capa frontal (rápida) */}
      <SmoothParallax speed={-60} stiffness={150} damping={25}>
        <div
          style={{
            position: "absolute",
            width: "100px",
            height: "100px",
            background: "rgba(213, 35, 35, 0.3)",
            borderRadius: "50%",
            bottom: "20%",
            left: "30%",
          }}
        />
      </SmoothParallax>
    </div>
  );
};

// SECCIÓN COMPLETA con parallax:
export const ParallaxSectionExample = () => {
  return (
    <SmoothParallaxSection
      backgroundSpeed={-40} // Velocidad del fondo
      contentSpeed={-15} // Velocidad del contenido
    >
      <div style={{ padding: "100px 20px", textAlign: "center" }}>
        <h2>Sección con Parallax Suave</h2>
        <p>Todo el contenido se mueve con física realista</p>
      </div>
    </SmoothParallaxSection>
  );
};

/* ================================================================
   TÉCNICA 7: HORIZONTAL SCROLL ✅ IMPLEMENTADA
   ================================================================ */

// YA ESTÁ IMPLEMENTADA EN: src/components/sections/Services/Services.tsx
//
// Las tarjetas de servicios ahora se mueven horizontalmente mientras
// haces scroll vertical. El movimiento es suave gracias a Lenis.

/* ================================================================
   TÉCNICA 8: STAGGER CARDS ✅ IMPLEMENTADA
   ================================================================ */

// YA ESTÁ IMPLEMENTADA EN: src/components/sections/Services/Services.tsx
//
// Cada tarjeta de servicio aparece con un delay incremental,
// creando un efecto de cascada mientras scrolleas.

/* ================================================================
   DÓNDE USAR CADA TÉCNICA
   ================================================================ */

/*
  1. SCROLL PROGRESS BAR:
     ✅ Ya activo en todo el sitio
     - Útil para: páginas largas, artículos, documentación
  
  2. DIRECTION-AWARE:
     📍 Sugerencias de uso:
     - Navbar que se oculta al scrollear abajo
     - Sidebar que aparece/desaparece
     - Floating buttons
     - Badges o notificaciones
  
  3. SMOOTH PARALLAX:
     📍 Sugerencias de uso:
     - Hero sections con imágenes
     - Fondos decorativos
     - Elementos geométricos flotantes
     - Testimonials
     - Features sections
  
  4. HORIZONTAL SCROLL + STAGGER:
     ✅ Ya activo en Services
     📍 También útil para:
     - Galerías de imágenes
     - Timeline horizontal
     - Product showcase
     - Team members
     - Portfolio items
*/

/* ================================================================
   PRÓXIMOS PASOS
   ================================================================ */

/*
  Para agregar estas técnicas a otras secciones:
  
  1. Importa los componentes:
     import { SmoothParallax } from "@/components/animations/SmoothParallax";
     import { DirectionAwareElement } from "@/components/animations/DirectionAwareElement";
  
  2. Envuelve tus elementos:
     <SmoothParallax speed={-30}>
       <TuContenido />
     </SmoothParallax>
  
  3. Experimenta con los valores:
     - speed: -10 (lento) a -60 (rápido)
     - stiffness: 50 (suave) a 200 (rígido)
     - damping: 20 (rebota) a 50 (firme)
*/
