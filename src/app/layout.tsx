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
  title: "Unicorn Mafia. London's elite developer community.",
  description: "Where the best developers build together. Join London's most selective community of engineers and founders.",
  keywords: [
    "developer community London",
    "tech community",
    "software engineers",
    "startup founders",
    "London tech",
    "engineering community",
    "unicorn startups"
  ],
  authors: [{ name: "Unicorn Mafia" }],
  creator: "Unicorn Mafia",
  publisher: "Unicorn Mafia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Unicorn Mafia. London's elite developer community.",
    description: "Where the best developers build together. Join London's most selective community of engineers and founders.",
    url: "https://unicrnmafia.com",
    siteName: "Unicorn Mafia",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Unicorn Mafia",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unicorn Mafia",
    description: "Where the best developers build together.",
    creator: "@unicornmafia",
    images: ["/social-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://unicrnmafia.com",
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
