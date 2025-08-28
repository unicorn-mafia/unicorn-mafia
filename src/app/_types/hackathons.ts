export interface HackathonWin {
  event_name: string;
  project_name: string;
  prize: string;
  year: number;
  members: string[];
  project_url: string;
  repo_url?: string;
  logo_url: string;
  location?: string;
  date?: string;
  tags?: string[];
}

export interface HackathonWinWithCategory extends HackathonWin {
  categoryName: string;
}

export interface HackathonCategory {
  name: string;
  description: string;
  wins: HackathonWin[];
}

export interface HackathonsData {
  categories: HackathonCategory[];
}

