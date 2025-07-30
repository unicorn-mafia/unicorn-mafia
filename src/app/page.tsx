import Hero from "./_components/hero/hero";
import Navbar from "./_components/navbar/navbar";
import TrustBy, { Company } from "./_components/trustby/trustby";
import About from "./_components/about/about";
import Contact from "./_components/contact/contact";
import fs from "fs/promises";
import path from "path";

async function getCompanies(): Promise<Company[]> {
  const file = await fs.readFile(
    path.join(process.cwd(), "public", "companies.yaml"),
    "utf8"
  );
  const data = JSON.parse(file) as {
    domains: { categories: { tools: { name: string; icon_url: string }[] }[] }[];
  };
  return data.domains.flatMap((d) =>
    d.categories.flatMap((c) =>
      c.tools.map((t) => ({ name: t.name, logo: t.icon_url }))
    )
  );
}

export default async function Home() {
  const companies = await getCompanies();
  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <Hero />
      <TrustBy companies={companies} />
      <About />
      <Contact />
    </div>
  );
}
