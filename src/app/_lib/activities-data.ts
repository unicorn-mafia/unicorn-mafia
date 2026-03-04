import yaml from "js-yaml";
import type { ActivitiesData } from "../_types/activities";

export async function loadActivitiesData(): Promise<ActivitiesData> {
  try {
    const response = await fetch("/activities-data.yaml");

    if (!response.ok) {
      throw new Error(`Failed to fetch activities data: ${response.statusText}`);
    }

    const yamlText = await response.text();
    const data = yaml.load(yamlText) as ActivitiesData;

    if (!data || !data.categories || !Array.isArray(data.categories)) {
      throw new Error("Invalid activities data structure");
    }

    return data;
  } catch (error) {
    console.error("Error loading activities data:", error);
    throw error;
  }
}
