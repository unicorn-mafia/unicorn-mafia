import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team | Unicorn Mafia",
  description: "Unicorn Mafia team.",
  openGraph: {
    title: "Team | Unicorn Mafia",
    description: "Unicorn Mafia team.",
    url: "https://unicrnmafia.com/t",
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
    title: "Team | Unicorn Mafia",
    description: "Unicorn Mafia team.",
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
