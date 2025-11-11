import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cowtion!",
  description: "A Real-time Cattle Road Safety Alert System web app that helps people and drivers on road be cautious of cattles on the road with real-time alerts and AI-powered analysis",
  keywords: ["cattle alerts", "road safety", "real-time notifications", "GPS tracking", "AI analysis", "driver safety"],
  authors: [{ name: "Cowtion Team", url: "https://cowtion.vercel.app" }],
  creator: "Cowtion",
  publisher: "Cowtion",
  applicationName: "Cowtion",
  category: "Safety",
  referrer: "origin-when-cross-origin",
  robots: "index, follow",
  
    // Open Graph metadata for social media sharing
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://cowtion.vercel.app",
    title: "Cowtion! - Real-time Cattle Road Safety Alerts",
    description: "Stay safe on Indian roads with real-time cattle alerts. AI-powered detection, community voting, and live map updates.",
    siteName: "Cowtion",
    images: [
      {
        url: "/og-image-1200x630.svg",
        width: 1200,
        height: 630,
        alt: "Cowtion - Cattle Road Safety Alert System",
        type: "image/svg+xml",
      },
      {
        url: "/og-image-800x600.svg",
        width: 800,
        height: 600,
        alt: "Cowtion Dashboard with Real-time Map",
        type: "image/svg+xml",
      },
      {
        url: "/og-image-square.svg",
        width: 1200,
        height: 1200,
        alt: "Cowtion Logo",
        type: "image/svg+xml",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Cowtion! - Real-time Cattle Road Safety Alerts",
    description: "Stay safe on Indian roads with real-time cattle alerts. AI-powered detection, community voting, and live map updates.",
    creator: "@cowtion",
    images: ["/cowtion-log-x.png"],
  },

  // Apple touch icon and app metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cowtion!",
  },

  // Icons metadata
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/cowtion-log-x.png", sizes: "32x32", type: "image/png" },
      { url: "/cowtion-log-x.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // Viewport and other metadata
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  // Additional metadata
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  // Alternate links
  alternates: {
    canonical: "https://cowtion.vercel.app",
    languages: {
      'en': 'https://cowtion.vercel.app',
      'hi': 'https://cowtion.vercel.app',
    },
  },

  // Verification
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff5055" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Cowtion!" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        />
      </head>
      <body
        className={`${exo2.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
