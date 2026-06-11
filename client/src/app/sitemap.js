import { getAllServiceRoutes } from "../lib/navigation-data";

export default function sitemap() {
  const baseUrl = "https://yourdomain.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about-us`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/services`, lastModified: new Date() },
    { url: `${baseUrl}/pricing`, lastModified: new Date() },
    { url: `${baseUrl}/resources`, lastModified: new Date() },
    { url: `${baseUrl}/faq`, lastModified: new Date() },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date() },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: new Date() },
  ];

  const servicePages = getAllServiceRoutes().map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...servicePages];
}
