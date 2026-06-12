import { notFound } from "next/navigation";
import ToolPageClient from "./ToolPageClient";

const supportedToolSlugs = [
  "gratuity-calculator",
  "epf-calculator",
  "tds-calculator",
  "salary-calculator",
  "ppf-calculator",
  "fd-calculator",
  "home-loan-emi-calculator",
  "mutual-fund-returns-calculator",
  "retirement-planning-calculator",
  "nps-calculator",
  "simple-compound-interest-calculator",
  "lumpsum-calculator",
  "rd-calculator",
  "business-setup-calculator",
  "business-name-generator",
];

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = titleFromSlug(slug);
  return {
    title: `${title} | Demo CA Tools`,
    description: `Free ${title} tool by Valuexpert.`,
  };
}

export function generateStaticParams() {
  return supportedToolSlugs.map((slug) => ({ slug }));
}

export default async function ToolDynamicPage({ params }) {
  const { slug } = await params;
  if (!supportedToolSlugs.includes(slug)) notFound();

  return <ToolPageClient slug={slug} />;
}

