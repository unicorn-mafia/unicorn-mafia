import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Companies | Unicorn Mafia",
  description:
    "Companies founded, co-founded, or where Unicorn Mafia members hold key positions. Explore the ventures built by London's elite developer community.",
  keywords: [
    "startup companies London",
    "tech startups",
    "developer companies",
    "AI startups",
    "London tech companies",
    "Unicorn Mafia companies",
  ],
  openGraph: {
    title: "Member Companies | Unicorn Mafia",
    description:
      "Companies founded, co-founded, or where Unicorn Mafia members hold key positions.",
    url: "https://unicrnmafia.com/c",
    siteName: "Unicorn Mafia",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Unicorn Mafia Member Companies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Member Companies | Unicorn Mafia",
    description:
      "Companies founded, co-founded, or where Unicorn Mafia members hold key positions.",
    creator: "@unicornmafia",
    images: ["/social-preview.png"],
  },
  alternates: {
    canonical: "https://unicrnmafia.com/c",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
