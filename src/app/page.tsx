import Hero from "./_components/hero/hero";
import Navbar from "./_components/navbar/navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen">
      <Navbar />
      <main className="flex flex-col items-center w-full h-full px-20">
        <Hero />
        <section className=""></section>
        <section className=""></section>
      </main>
    </div>
  );
}
