import { getAllServiceRoutes } from "../../lib/navigation-data";
import ServicePageClient from "../../[slug]/ServicePageClient";

function getServiceMeta(slug) {
  const label = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { slug, label };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const meta = getServiceMeta(slug);
  return {
    title: meta.label,
    description: `Learn about ${meta.label} - expert guidance and end-to-end support from Demo CA.`,
  };
}

export function generateStaticParams() {
  return getAllServiceRoutes()
    .map((r) => r.replace(/^\//, ""))
    .filter((r) => r && !r.includes("/"))
    .map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  return <ServicePageClient slug={slug} />;
}
