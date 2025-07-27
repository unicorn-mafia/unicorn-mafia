import yaml from 'js-yaml';
import type { CompaniesData } from '../_types/companies';

export async function loadCompaniesData(): Promise<CompaniesData> {
  try {
    // Fetch the YAML file from the public directory
    const response = await fetch('/companies-data.yaml');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch companies data: ${response.statusText}`);
    }
    
    const yamlText = await response.text();
    const data = yaml.load(yamlText) as CompaniesData;
    
    // Validate the data structure
    if (!data || !data.categories || !Array.isArray(data.categories)) {
      throw new Error('Invalid companies data structure');
    }
    
    return data;
  } catch (error) {
    console.error('Error loading companies data:', error);
    throw error;
  }
}