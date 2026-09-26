import type { Metadata, Viewport } from "next";
import { SiteAds } from "@/components/SiteAds";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { EntitlementsProvider } from "@/lib/entitlements-client";
import { SITE_URL } from "@/lib/site";
import { host, martian } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Text to Handwriting Converter, Free & Realistic | Truehand",
    template: "%s · Truehand",
  },
  description:
    "Convert typed text into realistic handwriting on ruled notebook paper. 41 handwriting styles, every letter different. Free PDF download, no sign-up.",
  applicationName: "Truehand",
  // No canonical here: each page sets its own, so none of them points at the home page by mistake.
  openGraph: { type: "website", siteName: "Truehand", locale: "en_IN", images: ["/og.png"] },
  twitter: { card: "summary_large_image" },
  icons: { apple: "/brand/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${host.variable} ${martian.variable}`}>
      <body>
        <EntitlementsProvider>
          <SiteHeader />
          {children}
          <SiteAds />
          <SiteFooter />
        </EntitlementsProvider>
      </body>
    </html>
  );
}
