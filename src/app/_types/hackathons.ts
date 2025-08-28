export interface HackathonWin {
  linkedin_url: string;
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

