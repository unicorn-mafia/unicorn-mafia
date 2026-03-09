import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";
import type { LondonLocation } from "../../_types/london";

interface LocationYaml {
  name: string;
  category: string;
  lat: number;
  lng: number;
  area: string;
  url: string;
  tagline?: string;
  logo?: string;
  stages?: string;
  twitter?: string[];
}

export async function GET() {
  try {
    const filePath = join(process.cwd(), "public", "london-locations.yaml");
    const content = readFileSync(filePath, "utf-8");
    const raw = yaml.load(content) as LocationYaml[];
    if (!Array.isArray(raw)) {
      return NextResponse.json({ locations: [] });
    }

    const locations: LondonLocation[] = raw.map((loc, i) => ({
      id: `loc-${i}`,
      name: loc.name,
      category: loc.category as LondonLocation["category"],
      lat: loc.lat,
      lng: loc.lng,
      area: loc.area,
      url: loc.url,
      tagline: loc.tagline,
      logo: loc.logo,
      stages: loc.stages,
      twitter: loc.twitter,
    }));

    return NextResponse.json(
      { locations },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("London locations API error:", error);
    return NextResponse.json(
      { error: "Failed to load locations" },
      { status: 500 },
    );
  }
}
