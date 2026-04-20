import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsors | Unicorn Mafia",
  description:
    "Companies and partners that support the Unicorn Mafia community. Partner with one of London's most active AI and tech communities reaching 500+ builders, founders, and engineers.",
  keywords: [
    "tech community sponsors",
    "developer community partners",
    "London tech sponsors",
    "startup community sponsors",
    "tech partnership opportunities",
  ],
  openGraph: {
    title: "Sponsors | Unicorn Mafia",
    description:
      "Companies and partners that support the Unicorn Mafia community. Partner with London's elite developer community.",
    url: "https://unicrnmafia.com/s",
    siteName: "Unicorn Mafia",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Unicorn Mafia Sponsors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsors | Unicorn Mafia",
    description:
      "Companies and partners that support the Unicorn Mafia community.",
    creator: "@unicornmafia",
    images: ["/social-preview.png"],
  },
  alternates: {
    canonical: "https://unicrnmafia.com/s",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
