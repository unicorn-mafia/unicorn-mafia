import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "London Map | Unicorn Mafia",
  description:
    "Discover tech venues, coworking spaces, VCs, and startups across London. Interactive map of London's tech ecosystem curated by the Unicorn Mafia community.",
  keywords: [
    "London tech map",
    "coworking spaces London",
    "VCs London",
    "London startups",
    "tech venues London",
    "London tech scene",
  ],
  openGraph: {
    title: "London Map | Unicorn Mafia",
    description:
      "Discover tech venues, coworking spaces, VCs, and startups across London. Interactive map of London's tech ecosystem.",
    url: "https://unicrnmafia.com/l",
    siteName: "Unicorn Mafia",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Unicorn Mafia London Map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "London Map | Unicorn Mafia",
    description:
      "Discover tech venues, coworking spaces, VCs, and startups across London.",
    creator: "@unicornmafia",
    images: ["/social-preview.png"],
  },
  alternates: {
    canonical: "https://unicrnmafia.com/l",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
