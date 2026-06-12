import Link from "next/link";
import { footerLinks, siteMeta, democaAssets } from "../../lib/navigation-data";
import { Mail, Phone, MapPin } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

/* -- Brand SVG Icons --------------------------------------- */
const FacebookIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-slate-50/50 pt-16 pb-4 font-sans text-slate-600 border-t border-slate-200/60 relative overflow-hidden">
      {/* Subtle top glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
      
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Top Section: Brand & Newsletter ── */}
        <div className="mb-8 flex flex-col items-center justify-between gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-start">
          
          {/* Brand logo + info */}
          <div className="flex flex-col items-start text-left lg:max-w-md w-full">
            <Link href="/" className="mb-5 inline-flex rounded-2xl bg-white p-2.5 shadow-sm border border-slate-200 transition-transform hover:scale-[1.03] duration-300" aria-label="Valuexpert home">
              <span className="text-base font-semibold text-slate-700">
                Your Website Logo
              </span>
            </Link>
            <p className="mb-4 text-sm font-medium leading-relaxed text-slate-500">
              {siteMeta.tagline}
            </p>
            <div className="flex gap-2.5">
              <a href={siteMeta.social?.facebook} target="_blank" rel="noopener noreferrer"
                 className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-600/30 hover:bg-indigo-600/10 hover:text-indigo-500 hover:shadow-lg hover:shadow-indigo-600/5" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href={siteMeta.social?.instagram} target="_blank" rel="noopener noreferrer"
                 className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-500 hover:shadow-lg hover:shadow-pink-500/5" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href={siteMeta.social?.linkedin} target="_blank" rel="noopener noreferrer"
                 className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-indigo-400/10 hover:text-indigo-400 hover:shadow-lg hover:shadow-indigo-400/5" aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
              <a href={siteMeta.social?.twitter} target="_blank" rel="noopener noreferrer"
                 className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:-translate-y-1 hover:border-slate-800/30 hover:bg-slate-800/10 hover:text-slate-900 hover:shadow-lg hover:shadow-slate-800/5" aria-label="Twitter">
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Newsletter Form wrapper */}
          <NewsletterForm />
        </div>

        {/* ── Mid Section: Links Grid ── */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 pb-6 text-left sm:grid-cols-2 lg:grid-cols-5">
          {[
            { title: "TRADEMARK", links: footerLinks.trademark },
            { title: "GST & ITR", links: footerLinks.gst },
            { title: "COMPANY REGISTRATION", links: footerLinks.company },
            { title: "TALK TO EXPERTS", links: footerLinks.talkToExperts }
          ].map((col, idx) => (
            <div key={idx} className="flex flex-col items-start">
              <h4 className="text-[0.72rem] font-bold tracking-[0.18em] text-slate-900 uppercase mb-4">
                {col.title}
              </h4>
              <div className="flex flex-col items-start gap-2.5">
                {col.links.map((l) => (
                  <Link 
                    key={l.href} 
                    href={l.href} 
                    className="text-[0.82rem] font-medium text-slate-600 transition-colors duration-200 hover:text-indigo-600"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Column */}
          <div className="flex flex-col items-start col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-[0.72rem] font-bold tracking-[0.18em] text-slate-900 uppercase mb-4">
              CONTACT US
            </h4>
            <div className="flex flex-col items-start gap-3 text-[0.82rem] font-medium">
              <a href={`tel:${siteMeta.phone.replace(/[^0-9+]/g, '')}`} className="flex items-start gap-2.5 group">
                <Phone size={15} className="mt-0.5 shrink-0 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                <span className="text-slate-600 transition-colors group-hover:text-slate-900">{siteMeta.phone}</span>
              </a>
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${siteMeta.email}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 group">
                <Mail size={15} className="mt-0.5 shrink-0 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                <span className="text-slate-600 transition-colors group-hover:text-slate-900">{siteMeta.email}</span>
              </a>
              <a 
                href="https://www.google.com/maps/place/Valuexpert+Consulting+LLP/@18.6101637,73.8176721,17z/data=!3m1!4b1!4m6!3m5!1s0x3bdd170bbb3afd21:0x36357b73a2636f91!8m2!3d18.6101586!4d73.820247!16s%2Fg%2F11pc9jtm0x?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 group"
              >
                <MapPin size={15} className="mt-0.5 shrink-0 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                <span className="text-slate-600 leading-relaxed transition-colors group-hover:text-slate-900">{siteMeta.address}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom Section: Horizontal Layout ── */}
        <div className="border-t border-slate-200 pt-5 pb-1">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            {/* Copyright block */}
            <p className="text-[0.75rem] font-normal text-slate-500 order-2 sm:order-1">
              All rights reserved &copy; {new Date().getFullYear()}{" "}
              <Link href="/" className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                Valuexpert
              </Link>
            </p>

            {/* Legal policy links */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 order-1 sm:order-2">
              <Link href="/terms-and-conditions" className="text-[0.72rem] font-medium text-slate-500 transition-colors hover:text-slate-900">Terms of Service</Link>
              <Link href="/privacy-policy"        className="text-[0.72rem] font-medium text-slate-500 transition-colors hover:text-slate-900">Privacy Policy</Link>
              <Link href="/refund-policy"         className="text-[0.72rem] font-medium text-slate-500 transition-colors hover:text-slate-900">Refund Policy</Link>
              <Link href="/about-us"              className="text-[0.72rem] font-medium text-slate-500 transition-colors hover:text-slate-900">About Us</Link>
            </div>

            {/* Developer credit line */}
            <p className="text-[0.72rem] font-normal text-slate-500 order-3 sm:order-3">
              Designed & Developed by{" "}
              <a
                href="https://veaglespace.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-900 transition-colors hover:text-indigo-600"
              >
                Veagle Space Technology Pvt. Ltd
              </a>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
