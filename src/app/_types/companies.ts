export interface Company {
  name: string;
  description: string;
  website_url: string;
  logo_url: string;
  industry: string;
  founded_year: number;
  location: string;
  stage: string;
  team_size: string;
  verified: boolean;
  date_added: string;
  tags?: string[];
  social_links?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface CompanyWithCategory extends Company {
  categoryName: string;
}

export interface Category {
  name: string;
  description: string;
  companies: Company[];
}

export interface CompaniesData {
  categories: Category[];
}