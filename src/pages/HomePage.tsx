import { Hero } from "../components/sections/Hero";
import { SocialProof } from "../components/sections/SocialProof";
import { CTA } from "../components/sections/CTA";
import { Benefits } from "../components/sections/Benefits";
import { Reviews } from "../components/sections/Reviews";
import { Services } from "../components/sections/Services";

export const HomePage = () => {
  return (
    <>
      <Hero />
      <SocialProof id="social-proof-1" />
      <CTA
        id="cta-1"
        title="Reserva tu Experiencia Premium Hoy."
        subtitle="¿Listo para un cambio que te defina? Agenda tu cita en nuestra barbería de elección para quienes buscan lo mejor."
        buttonText="Agendar Ahora"
      />
      <Benefits />
      <Reviews />
      <Services />
      <SocialProof id="social-proof-2" />
      <CTA
        id="cta-2"
        title="Únete a los Mejores"
        subtitle="Miles de hombres que buscan calidad y estilo confían en nosotros"
        buttonText="Agendar Ahora"
      />
    </>
  );
};
