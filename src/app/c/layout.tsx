import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companies | Unicorn Mafia",
  description: "Learn about the companies Unicorn Mafia members are building",
  openGraph: {
    title: "Companies | Unicorn Mafia",
    description: "Learn about the companies Unicorn Mafia members are building",
    url: "https://unicrnmafia.com/c",
locale: "en_US",
type: "website",
    images: [
      {
        url: "https://unicrnmafia.com/social-preview.png",
        width: 841,
        height: 686,
        alt: "Unicorn Mafia Open Graph",
      },
      
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Companies | Unicorn Mafia",
    description: "Learn about the companies Unicorn Mafia members are building",
    images: [
      {
        url: "https://unicrnmafia.com/social-preview.png",
        width: 841,
        height: 686,
        alt: "Unicorn Mafia",
      },
    ],
  },
  applicationName: "Unicorn Mafia",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}