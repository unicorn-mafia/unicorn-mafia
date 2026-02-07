import Hero from "./_components/hero/hero";
import TrustBy from "./_components/trustby/trustby";
import About from "./_components/about/about";
import Contact from "./_components/contact/contact";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <Hero />
      <TrustBy />
      <About />
      <Contact />
    </div>
  );
}
