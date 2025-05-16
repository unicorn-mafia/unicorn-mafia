import Hero from "./_components/hero/hero";
import Navbar from "./_components/navbar/navbar";
import Affiliations from "./_components/affiliations/affiliations";
import About from "./_components/about/about";
import Contact from "./_components/contact/contact";
export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full h-screen">
        <Navbar />
        <Hero />
      </div>
      <Affiliations />
      <About />
      <Contact />
    </div>
  );
}
