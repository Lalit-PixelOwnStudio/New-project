import { SITE_NAME, SITE_URL } from "./site";

/**
 * schema.org structured data, so search engines know what each page is: the
 * site and who runs it, the web app itself, articles and where a page sits.
 */
type Ld = Record<string, unknown>;

const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

export const ORGANIZATION: Ld = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo-512.png`, width: 512, height: 512 },
};

export function websiteLd(description: string): Ld {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function webAppLd(description: string): Ld {
  return {
    "@type": "WebApplication",
    name: `${SITE_NAME}: text to handwriting converter`,
    url: SITE_URL,
    description,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any (runs in the web browser)",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Where a page sits, from the home page down. The last item is the page itself. */
export function breadcrumbLd(items: { name: string; path: string }[]): Ld {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: url(item.path),
    })),
  };
}

export function articleLd(a: {
  type?: "Article" | "BlogPosting";
  path: string;
  headline: string;
  description: string;
  published?: string;
  modified: string;
  image?: string;
}): Ld {
  return {
    "@type": a.type ?? "Article",
    headline: a.headline,
    description: a.description,
    ...(a.published ? { datePublished: a.published } : {}),
    dateModified: a.modified,
    ...(a.image ? { image: url(a.image) } : {}),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: ORGANIZATION,
    mainEntityOfPage: url(a.path),
    inLanguage: "en",
  };
}
