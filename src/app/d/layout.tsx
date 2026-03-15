import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Nights & Demo Days | Unicorn Mafia",
  description:
    "Curated demo events for developers from our community in London and SF. Bi-monthly events showcasing the latest trends and hacks in tech from real builders.",
  keywords: [
    "demo night London",
    "demo day",
    "tech demos",
    "developer events",
    "startup demos",
    "tech showcase London",
  ],
  openGraph: {
    title: "Demo Nights & Demo Days | Unicorn Mafia",
    description:
      "Curated demo events for developers from our community in London and SF. Cool shit, real builders, no fluff.",
    url: "https://unicrnmafia.com/d",
    siteName: "Unicorn Mafia",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Unicorn Mafia Demo Events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Demo Nights & Demo Days | Unicorn Mafia",
    description:
      "Curated demo events for developers in London and SF. Cool shit, real builders, no fluff.",
    creator: "@unicornmafia",
    images: ["/social-preview.png"],
  },
  alternates: {
    canonical: "https://unicrnmafia.com/d",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
