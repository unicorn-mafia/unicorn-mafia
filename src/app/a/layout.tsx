import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activities | Unicorn Mafia",
  description: "Activity logging with mental, physical, and social exertion tracking",
  openGraph: {
    title: "Activities | Unicorn Mafia",
    description: "Activity logging with mental, physical, and social exertion tracking",
    url: "https://unicrnmafia.com/a",
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
    title: "Activities | Unicorn Mafia",
    description: "Activity logging with mental, physical, and social exertion tracking",
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
