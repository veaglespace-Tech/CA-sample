import { Lexend } from "next/font/google";
import "../styles/globals.css";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Veagle Space Technology — Online Company Registration, GST & Legal Services in India",
    template: "%s | Veagle Space Technology",
  },
  description:
    "Veagle Space Technology is India's premier platform for online company registration, GST filing, trademark registration, income tax returns, and top-tier legal and CA consultations. Trusted by 15,000+ growing businesses.",
  keywords: [
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
  authors: [{ name: "Veagle Space Technology Pvt. Ltd." }],
  creator: "Veagle Space Technology Pvt. Ltd.",
  metadataBase: new URL("https://veaglespace.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://veaglespace.com",
    siteName: "Veagle Space Technology",
    title: "Veagle Space Technology — Business Registration, GST & Legal Services in India",
    description:
      "Incorporate your company, file GST returns, register trademarks, and consult legal experts—all on one modern platform. Trusted by 15,000+ founders.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Veagle Space Technology — Online Company Registration Dashboard India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Veagle Space Technology — Online Business Registration & Legal Services in India",
    description:
      "Online Company registration, GST, trademark & more. Expert CA & legal services for modern Indian businesses.",
    images: ["/og-image.png"],
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
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${lexend.variable}`}
      data-theme="light"
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
          <main className="pt-[80px] lg:pt-[112px] min-h-screen">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
