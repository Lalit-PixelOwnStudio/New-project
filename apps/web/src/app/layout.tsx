import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { EntitlementsProvider } from "@/lib/entitlements-client";
import { SITE_URL } from "@/lib/site";
import { anybody, host, martian } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Truehand — Text to handwriting that doesn't look like a font",
    template: "%s · Truehand",
  },
  description:
    "Type or paste text and get pages that look handwritten: real paper, real ink, and a hand that never writes the same letter twice. Free, with PDF and PNG export.",
  applicationName: "Truehand",
  openGraph: { type: "website", siteName: "Truehand" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anybody.variable} ${host.variable} ${martian.variable}`}>
      <body>
        <EntitlementsProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </EntitlementsProvider>
      </body>
    </html>
  );
}
