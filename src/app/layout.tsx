import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./_components/navbar/navbar";
import GallopingHorseFrame from "./_components/horse/galloping-horse-frame";
import PreloaderWrapper from "./_components/preloader/preloader-wrapper";

const ppNeueBit = localFont({
  src: "../../public/fonts/PPNeueBit-Bold.otf",
  display: "swap",
  variable: "--font-title",
});

const ppNeueMontrealMono = localFont({
  src: [
    {
      path: "../../public/fonts/PPNeueMontrealMono-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMontrealMono-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMontrealMono-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMontrealMono-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMontrealMono-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/PPNeueMontrealMono-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-mono",
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
    <html lang="en" className={`${ppNeueBit.variable} ${ppNeueMontrealMono.variable}`}>
      <body className="antialiased bg-gray-300 min-h-screen">
        <PreloaderWrapper>
          {/* Animated horse background */}
          <GallopingHorseFrame />

          {/* Header box */}
          <header className="relative z-10 mx-8 md:mx-20 lg:mx-32 mt-4 md:mt-6 lg:mt-8 bg-white">
            <Navbar />
          </header>

          {/* Main content box - gap created by mt-2 md:mt-3 lg:mt-4 */}
          <main className="relative z-10 mx-8 md:mx-20 lg:mx-32 mt-2 md:mt-3 lg:mt-4 mb-4 md:mb-6 lg:mb-8 bg-white min-h-[calc(100vh-10rem)] border border-black">
            {children}
          </main>
        </PreloaderWrapper>
      </body>
    </html>
  );
}
