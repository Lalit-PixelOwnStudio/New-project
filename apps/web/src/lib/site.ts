import { present, toOrigin } from "./env";

/** The public origin: NEXT_PUBLIC_SITE_URL, else the Vercel production domain, else truehand.app. */
export const SITE_URL = toOrigin(process.env.NEXT_PUBLIC_SITE_URL) ?? toOrigin(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) ?? "https://truehand.app";
export const SITE_NAME = "Truehand";

/**
 * Who runs the site. Payment providers and privacy law require these to be
 * real; set them in the environment before launch.
 */
export const BUSINESS = {
  legalName: present(process.env.NEXT_PUBLIC_BUSINESS_NAME) ?? "Truehand",
  address: present(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS) ?? "",
  email: present(process.env.NEXT_PUBLIC_SUPPORT_EMAIL) ?? "hello@truehand.app",
  phone: present(process.env.NEXT_PUBLIC_BUSINESS_PHONE) ?? "",
  country: present(process.env.NEXT_PUBLIC_BUSINESS_COUNTRY) ?? "India",
};

export const SUPPORT_EMAIL = BUSINESS.email;
export const LEGAL_UPDATED = "25 September 2026";
