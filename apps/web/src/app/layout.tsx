import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { EntitlementsProvider } from "@/lib/entitlements-client";
import { SITE_URL } from "@/lib/site";
import { host, martian } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Truehand: Convert text to realistic handwriting",
    template: "%s · Truehand",
  },
  description:
    "Turn typed text into realistic handwriting on ruled, grid or plain paper. 41 hands, real ink, every letter slightly different. Free PDF and PNG download, no sign-up.",
  applicationName: "Truehand",
  openGraph: { type: "website", siteName: "Truehand", images: ["/og.png"] },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
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
          <SiteFooter />
        </EntitlementsProvider>
      </body>
    </html>
  );
}
