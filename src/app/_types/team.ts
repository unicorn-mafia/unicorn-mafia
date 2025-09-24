export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface TeamData {
  team: TeamMember[];
}