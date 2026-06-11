import { notFound } from "next/navigation";
import { getAllServiceRoutes } from "../../lib/navigation-data";
import { relatedPagesList, statesList, serviceData } from "../../data/services";
import ServicePageClient from "./ServicePageClient";

const reservedSlugs = [
  "about", "contact", "services", "pricing", "faq", "resources",
  "privacy-policy", "terms-and-conditions", "about-us", "careers",
  "reviews", "all-offers", "refer-and-earn", "tools", "sitemap-page",
  "talk-to-expert", "refund-policy", "chartered-accountant-services",
  "partner-with-us", "talk-to-a-lawyer",
  "events", "media", "products", "nextstep-registration", "payment-step",
  "admin", "login", "register"
];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    title: `${title} | Demo CA`,
    description: `Expert guidance for ${title}. End-to-end support from Demo CA.`,
  };
}

export function generateStaticParams() {
  const navRoutes = getAllServiceRoutes().map((r) => r.replace(/^\//, ""));
  
  const relatedRoutes = relatedPagesList.map(page => page.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  
  const stateRoutes = [];
  Object.values(serviceData).forEach(service => {
    statesList.forEach(state => {
      stateRoutes.push(`${service.shortTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-in-${state.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
    });
  });

  const allRoutes = Array.from(new Set([...navRoutes, ...relatedRoutes, ...stateRoutes]));

  return allRoutes
    .filter((r) => r && !r.includes("/") && !reservedSlugs.includes(r))
    .map((slug) => ({ slug }));
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  if (reservedSlugs.includes(slug)) notFound();

  const navRoutes = getAllServiceRoutes().map((r) => r.replace(/^\//, ""));
  const relatedRoutes = relatedPagesList.map(page => page.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  
  const stateRoutes = [];
  Object.values(serviceData).forEach(service => {
    statesList.forEach(state => {
      stateRoutes.push(`${service.shortTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-in-${state.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
    });
  });

  const allRoutes = new Set([...navRoutes, ...relatedRoutes, ...stateRoutes]);

  if (!allRoutes.has(slug)) notFound();

  return <ServicePageClient slug={slug} />;
}
