export type LocationCategory =
  | "coworking"
  | "vc"
  | "startup"
  | "bigtech"
  | "events";

export interface LondonLocation {
  id: string;
  name: string;
  category: LocationCategory;
  lat: number;
  lng: number;
  area: string;
  url: string;
  tagline?: string;
  logo?: string;
  // VC-specific
  stages?: string;
  twitter?: string[];
  // Events only
  eventDate?: string;
}

export const CATEGORY_META: Record<
  LocationCategory,
  { label: string; color: string; icon: string; cta: string }
> = {
  coworking: {
    label: "CO-WORKING",
    color: "#4EF9BD",
    icon: "laptop",
    cta: "BOOK A DESK",
  },
  vc: { label: "VCs", color: "#B307EB", icon: "bank", cta: "PORTFOLIO" },
  startup: {
    label: "STARTUPS",
    color: "#3198F1",
    icon: "rocket",
    cta: "CAREERS",
  },
  bigtech: {
    label: "BIG TECH",
    color: "#EE1701",
    icon: "building",
    cta: "CAREERS",
  },
  events: {
    label: "EVENTS",
    color: "#F59E0B",
    icon: "calendar",
    cta: "RSVP",
  },
};
