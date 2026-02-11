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
        title="¿Listo para tu Transformación?"
        subtitle="Agenda tu cita hoy y experimenta el mejor servicio de barbería"
        buttonText="Reservar Ahora"
      />
      <Benefits />
      <Reviews />
      <Services />
      <SocialProof id="social-proof-2" />
      <CTA
        id="cta-2"
        title="Únete a Nuestra Comunidad"
        subtitle="Miles de clientes satisfechos confían en nosotros"
        buttonText="Programa tu Visita"
      />
    </>
  );
};
