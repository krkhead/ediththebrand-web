import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import SiteChrome from "@/components/layout/SiteChrome";
import { clerkRuntime } from "@/lib/clerk-config";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ediththebrand.com"),
  title: {
    default: "Ediththebrand — Skin First. Self-care Always.",
    template: "%s | Ediththebrand",
  },
  description:
    "Authentic skincare products sourced from the US, GB, KR, and JP. Virtual skincare consultations. Lagos, Nigeria.",
  openGraph: {
    title: "Ediththebrand",
    description: "Skin First. Self-care Always.",
    images: ["/brand/logo.png"],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ediththebrand",
    description: "Skin First. Self-care Always.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const app = clerkRuntime.enabled ? (
    <ClerkProvider>{children}</ClerkProvider>
  ) : (
    children
  );

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#F8F4EE]">
        <SiteChrome>{app}</SiteChrome>
      </body>
    </html>
  );
}
