export type ActivityType = "mental" | "physical" | "social";

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: ActivityType[];
  date: string;
  duration_minutes?: number;
  intensity?: "low" | "medium" | "high";
  notes?: string;
}

export interface ActivityWithCategory extends Activity {
  categoryName: string;
}

export interface ActivityCategory {
  name: string;
  description: string;
  activities: Activity[];
}

export interface ActivitiesData {
  categories: ActivityCategory[];
}
