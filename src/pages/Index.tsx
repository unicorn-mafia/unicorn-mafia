import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import HackathonWins from "@/components/HackathonWins";
import Members from "@/components/Members";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <HackathonWins />
      <Members />
      <Contact />
    </div>
  );
};

export default Index;
