export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://truehand.app";
export const SITE_NAME = "Truehand";

/**
 * Who runs the site. Payment providers and privacy law require these to be
 * real; set them in the environment before launch.
 */
export const BUSINESS = {
  legalName: process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Truehand",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "hello@truehand.app",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "",
  country: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY ?? "India",
};

export const SUPPORT_EMAIL = BUSINESS.email;
export const LEGAL_UPDATED = "25 September 2026";
