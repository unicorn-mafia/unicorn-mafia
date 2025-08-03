import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://unicrnmafia.com"),
  title: "Unicorn Mafia",
  description: "The highest signal community of developers in London",
  openGraph: {
    title: "Unicorn Mafia",
    description: "The highest signal community of developers in London",
    url: "https://unicrnmafia.com",
    siteName: "Unicorn Mafia",
    images: [
      {
        url: "/hero.avif",
        width: 841,
        height: 686,
        alt: "Unicorn Mafia hero image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unicorn Mafia",
    description: "The highest signal community of developers in London",
    images: ["/hero.avif"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceCodePro.variable}`}>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
