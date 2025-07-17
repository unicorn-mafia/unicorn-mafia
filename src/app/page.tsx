import Hero from "./_components/hero/hero";
import Navbar from "./_components/navbar/navbar";
import TrustBy from "./_components/trustby/trustby";
import About from "./_components/about/about";
import Contact from "./_components/contact/contact";
export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <Hero />
      <TrustBy />
      <About />
      <Contact />
    </div>
  );
}
