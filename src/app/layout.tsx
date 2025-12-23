import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
      <body className="antialiased bg-white min-h-screen">
        {/* Fixed border frame */}
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-0 right-0 h-4 md:h-6 lg:h-8 bg-neutral-900" />
          <div className="absolute bottom-0 left-0 right-0 h-4 md:h-6 lg:h-8 bg-neutral-900" />
          <div className="absolute top-0 left-0 bottom-0 w-8 md:w-20 lg:w-32 bg-neutral-900" />
          <div className="absolute top-0 right-0 bottom-0 w-8 md:w-20 lg:w-32 bg-neutral-900" />
        </div>
        {/* Content with matching padding */}
        <div className="relative mx-8 md:mx-20 lg:mx-32 my-4 md:my-6 lg:my-8 bg-white rounded-lg overflow-hidden min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </body>
    </html>
  );
}
