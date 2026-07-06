import { Inter } from "next/font/google";
import "../styles/globals.css";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import MainContentWrapper from "../components/layout/MainContentWrapper";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Veagle Space Technology | Online Company Registration, GST & Legal Services",
    template: "%s | Veagle Space Technology",
  },
  description:
    "Veagle Space Technology is India's premier platform for online company registration, GST filing, trademark registration, income tax returns, and top-tier legal and CA consultations. Trusted by 15,000+ growing businesses.",
  keywords: [
    "Veagle Space Technology",
    "Veagle Space",
    "company registration India",
    "online company registration",
    "startup India registration",
    "GST registration online",
    "GST return filing India",
    "trademark registration online",
    "trademark search India",
    "income tax return filing",
    "ITR e-filing",
    "legal services India",
    "business registration services",
    "private limited company registration",
    "Limited Liability Partnership (LLP) online",
    "Section 8 Company (NGO) registration",
    "CA services online",
    "FSSAI food license online",
    "ISO certification India",
    "legal consulting for SMEs",
    "compliance services India"
  ],
  authors: [{ name: "Veagle Space Technology Pvt. Ltd.", url: "https://br.veaglespace.com" }],
  creator: "Veagle Space Technology Pvt. Ltd.",
  publisher: "Veagle Space Technology",
  metadataBase: new URL("https://br.veaglespace.com"),
  alternates: {
    canonical: "https://br.veaglespace.com",
    languages: {
      "en-IN": "https://br.veaglespace.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://br.veaglespace.com",
    siteName: "Veagle Space Technology",
    title: "Veagle Space Technology | Online Business Registration & Legal Services",
    description:
      "Incorporate your company, file GST returns, register trademarks, and consult legal experts—all on one modern platform. Trusted by 15,000+ founders.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veagle Space Technology | Expert CA & Legal Services in India",
    description:
      "Start, manage, and protect your business seamlessly with Veagle Space Technology. Online company registration, GST, trademark, & more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable}`}
      data-theme="light"
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Veagle Space Technology",
              url: "https://br.veaglespace.com",
              logo: "https://br.veaglespace.com/veaglespace-logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                email: "info@veaglespace.com",
                contactType: "customer service",
                areaServed: "IN",
                availableLanguage: "en",
              },
              sameAs: [
                "https://veaglespace.com",
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <Toaster 
          position="top-right"
          toastOptions={{
            className: '!bg-white/80 !backdrop-blur-xl !border !border-white/50 !shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] !text-slate-800 !font-bold !rounded-none',
            duration: 4000,
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#f43f5e',
                secondary: '#fff',
              },
            },
          }}
        />
        <Providers>
          <SiteHeader />
          <MainContentWrapper>{children}</MainContentWrapper>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
