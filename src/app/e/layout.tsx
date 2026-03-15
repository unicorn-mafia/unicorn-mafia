import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Unicorn Mafia",
  description:
    "Tech events calendar for the Unicorn Mafia community in London. Browse upcoming and past events including hackathons, meetups, and community gatherings.",
  keywords: [
    "tech events London",
    "developer events",
    "tech meetups London",
    "startup events",
    "AI events London",
    "community events",
  ],
  openGraph: {
    title: "Events | Unicorn Mafia",
    description:
      "Tech events calendar for the Unicorn Mafia community in London. Browse upcoming and past events.",
    url: "https://unicrnmafia.com/e",
    siteName: "Unicorn Mafia",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Unicorn Mafia Events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events | Unicorn Mafia",
    description:
      "Tech events calendar for the Unicorn Mafia community in London.",
    creator: "@unicornmafia",
    images: ["/social-preview.png"],
  },
  alternates: {
    canonical: "https://unicrnmafia.com/e",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
