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
