import { Helmet } from "react-helmet-async";
import { Benefits } from "../components/sections/Benefits/Benefits";
import { CTA1 } from "../components/sections/CTA1/CTA1";
import { CTA2 } from "../components/sections/CTA2/CTA2";
import { Features } from "../components/sections/Features/Features";
import { Hero } from "../components/sections/Hero/Hero";
import { Reviews } from "../components/sections/Reviews/Reviews";
import { SocialProof1 } from "../components/sections/SocialProof1/SocialProof1";
import { SocialProof2 } from "../components/sections/SocialProof2/SocialProof2";

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Royce Barbería - Cortes Premium y Estilo para el Hombre Moderno</title>
        <meta name="description" content="Barbería premium en Coquimbo con más de 10 años de experiencia. Cortes expertos, ambiente exclusivo y atención personalizada. Agenda tu cita hoy y descubre tu mejor estilo." />
        <link rel="canonical" href="https://roycebarber.com/" />
        <meta property="og:title" content="Royce Barbería - Cortes Premium para el Hombre Moderno" />
        <meta property="og:description" content="Más de 10 años creando los mejores looks. Barbería premium con cortes expertos y atención personalizada." />
        <meta property="og:url" content="https://roycebarber.com/" />
      </Helmet>
      <Hero />
      <CTA1 />
      <SocialProof1 />
      <Benefits />
      <Reviews />
      <Features />
      <SocialProof2 />
      <CTA2 />
    </>
  );
}
