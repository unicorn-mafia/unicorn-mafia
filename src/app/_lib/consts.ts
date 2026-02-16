// Brand accent colors (subset used for UI accents like event cards)
export const BRAND_COLORS = ["#B307EB", "#3198F1", "#4EF9BD", "#EE1701"] as const;

// Full brand color palette with metadata (used on brand page)
export const BRAND_PALETTE: { name: string; hex: string; rgb: string }[] = [
  { name: 'Purple', hex: '#B307EB', rgb: 'rgb(179, 7, 235)' },
  { name: 'Blue', hex: '#3198F1', rgb: 'rgb(49, 152, 241)' },
  { name: 'Green', hex: '#4EF9BD', rgb: 'rgb(78, 249, 189)' },
  { name: 'Red', hex: '#EE1701', rgb: 'rgb(238, 23, 1)' },
  { name: 'Black', hex: '#000000', rgb: 'rgb(0, 0, 0)' },
  { name: 'White', hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)' },
  { name: 'Dark BG', hex: '#14120B', rgb: 'rgb(20, 18, 11)' },
];

// Known event overrides — matched by substring in summary
export const KNOWN_EVENTS: Record<
  string,
  { externalUrl: string; imageUrl: string; hostedByUM?: boolean }
> = {
  HackEurope: {
    externalUrl: "https://luma.com/london-hackathon?tk=xy9L0p",
    imageUrl:
      "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=500,height=500/event-covers/hh/7b10d668-43f4-45b7-a534-4641c4ac432b.png",
  },
  "START Hack": {
    externalUrl: "https://starthack.eu/#/application?event_id=7",
    imageUrl:
      "https://framerusercontent.com/assets/KAQO6ZUrn6oWZg1A6KQkyx8Hi4.webp",
  },
};

// Keywords that indicate an event is hosted by Unicorn Mafia
export const UM_KEYWORDS = ["unicorn mafia", "unicorn-mafia", "[um]", "hosted by um"];
