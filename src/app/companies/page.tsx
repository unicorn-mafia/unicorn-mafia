import Navbar from "../_components/navbar/navbar";
import Image from "next/image";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";

export const metadata = {
  title: "Member Companies - Unicorn Mafia",
};

type Tool = {
  name: string;
  icon_url: string;
  website_url: string;
};

type Category = {
  name: string;
  tools: Tool[];
};

type Domain = {
  name: string;
  categories: Category[];
};

async function getData(): Promise<{ domains: Domain[] }> {
  const file = await fs.readFile(
    path.join(process.cwd(), "public", "companies.yaml"),
    "utf8"
  );
  return JSON.parse(file) as { domains: Domain[] };
}

export default async function CompaniesPage() {
  const data = await getData();
  const allTools = data.domains.flatMap((domain) =>
    domain.categories.flatMap((category) =>
      category.tools.map((tool) => ({
        ...tool,
        domainName: domain.name,
        categoryName: category.name,
      }))
    )
  );

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="w-full px-6 md:px-12 lg:px-20 py-16">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">Logo</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Domain</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Website</th>
            </tr>
          </thead>
          <tbody>
            {allTools.map((tool) => (
              <tr key={`${tool.domainName}-${tool.categoryName}-${tool.name}`} className="border-b">
                <td className="py-2 px-4">
                  {tool.icon_url && (
                    <div className="relative w-10 h-10">
                      <Image src={tool.icon_url} alt={tool.name} fill className="object-contain" />
                    </div>
                  )}
                </td>
                <td className="py-2 px-4">{tool.name}</td>
                <td className="py-2 px-4">{tool.domainName}</td>
                <td className="py-2 px-4">{tool.categoryName}</td>
                <td className="py-2 px-4">
                  <Link href={tool.website_url} target="_blank" rel="noopener noreferrer">
                    {tool.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
