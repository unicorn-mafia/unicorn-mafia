import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathons | Unicorn Mafia",
  description: "Learn about the hackathons that Unicorn Mafia members have won.",
  openGraph: {
    title: "Hackathons | Unicorn Mafia",
    description: "Learn about the hackathons Unicorn Mafia members have won.",
    url: "https://unicrnmafia.com/h",
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
    title: "Hackathons | Unicorn Mafia",
    description: "Learn about the hackathons Unicorn Mafia members have won.",
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
