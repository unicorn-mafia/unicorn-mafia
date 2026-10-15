import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathon Wins | Unicorn Mafia",
  description:
    "Awarded projects and wins by Unicorn Mafia members across hackathons. Discover the innovative projects built by London's elite developer community.",
  keywords: [
    "hackathon wins",
    "tech hackathons",
    "developer hackathons London",
    "startup hackathons",
    "AI hackathons",
    "Unicorn Mafia hackathons",
  ],
  openGraph: {
    title: "Hackathon Wins | Unicorn Mafia",
    description:
      "Awarded projects and wins by Unicorn Mafia members across hackathons.",
    url: "https://unicrnmafia.com/h",
    siteName: "Unicorn Mafia",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Unicorn Mafia Hackathon Wins",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackathon Wins | Unicorn Mafia",
    description:
      "Awarded projects and wins by Unicorn Mafia members across hackathons.",
    creator: "@unicornmafia",
    images: ["/social-preview.png"],
  },
  alternates: {
    canonical: "https://unicrnmafia.com/h",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
