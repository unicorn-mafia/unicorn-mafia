import yaml from 'js-yaml';
import type { HackathonsData } from '../_types/hackathons';

export async function loadHackathonsData(): Promise<HackathonsData> {
  try {
    const response = await fetch('/hackathons-data.yaml');
    if (!response.ok) {
      throw new Error(`Failed to fetch hackathons data: ${response.statusText}`);
    }

    const yamlText = await response.text();
    const data = yaml.load(yamlText) as HackathonsData;

    if (!data || !data.categories || !Array.isArray(data.categories)) {
      throw new Error('Invalid hackathons data structure');
    }

    return data;
  } catch (error) {
    console.error('Error loading hackathons data:', error);
    throw error;
  }
}

