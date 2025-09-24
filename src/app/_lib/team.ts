import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { TeamData } from '../_types/team';

export async function getTeamData(): Promise<TeamData> {
  const filePath = path.join(process.cwd(), 'src/app/_data/team.yaml');
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents) as TeamData;
    return data;
  } catch (error) {
    console.error('Error reading team data:', error);
    // Return empty data as fallback
    return { team: [] };
  }
}