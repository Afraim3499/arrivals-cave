import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Arrivals Cave – Premium Panjabi Collection",
    template: "%s | Arrivals Cave",
  },
  description:
    "Shop premium panjabi collection in Bangladesh. Order via WhatsApp. Nationwide delivery.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://arrivalscavebd.com"
  ),
  icons: {
    icon: [
      { url: "https://arrivalscavebd.com/favicon.ico", sizes: "any" },
      { url: "https://arrivalscavebd.com/icon.png", type: "image/png", sizes: "32x32" },
      { url: "https://arrivalscavebd.com/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
    apple: [
      { url: "https://arrivalscavebd.com/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: `${process.env.NEXT_PUBLIC_SITE_URL || "https://arrivalscavebd.com"}/manifest.webmanifest`,
  openGraph: {
    title: "Arrivals Cave – Premium Panjabi Collection",
    description: "Shop premium panjabi collection in Bangladesh. Order via WhatsApp. Nationwide delivery.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://arrivalscavebd.com",
    siteName: "Arrivals Cave",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://arrivalscavebd.com"}/images/hero/eid_collection_from_arrivals_cave.webp`,
        width: 1200,
        height: 630,
        alt: "Arrivals Cave Eid Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
