import yaml from "js-yaml";
import type { SponsorsData } from "../_types/sponsors";

export async function loadSponsorsData(): Promise<SponsorsData> {
  try {
    const response = await fetch("/sponsors-data.yaml");

    if (!response.ok) {
      throw new Error(`Failed to fetch sponsors data: ${response.statusText}`);
    }

    const yamlText = await response.text();
    const data = yaml.load(yamlText) as SponsorsData;

    if (!data || !data.sponsors || !Array.isArray(data.sponsors)) {
      throw new Error("Invalid sponsors data structure");
    }

    return data;
  } catch (error) {
    console.error("Error loading sponsors data:", error);
    throw error;
  }
}
