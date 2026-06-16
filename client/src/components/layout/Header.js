"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  Phone,
  Search,
  X,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import {
  gstIncomeTax,
  legalOtherServices,
  mainNav,
  moreMenu,
  necessaryCompliance,
  registrationsLicenses,
  sectionIcons,
  siteMeta,
  startBusiness,
  updatesMenu,
  democaAssets,
  businessRegistration,
  taxCompliance,
  taxPayroll,
  compliances,
  trademarkIP,
  lawyerServices,
  documentation,
  othersMenu,
  consultExpert,
} from "../../lib/navigation-data";
import BrandLogo from "./BrandLogo";
import { getDashboardPath } from "../../lib/auth";
import { useGetMeQuery, useLogoutMutation } from "../../store/api/authApi";
import { useVerifyDocumentMutation } from "../../store/api/adminApi";
import { useGetUnreadCountQuery, useGetMyMessagesQuery, useMarkMessageAsReadMutation } from "../../store/api/messageApi";
import { useGetUnreadContactsQuery, useMarkContactAsReadMutation, useDeleteContactMutation } from "../../store/api/contactApi";

/* ─── Build PROPERLY DISTRIBUTED sections for each nav item ──────── */
function getMegaData(key) {
  switch (key) {
    case "consult":
      return {
        type: "simple",
        data: consultExpert,
      };

    case "business":
      return {
        type: "two-panel",
        data: businessRegistration,
      };

    case "tax":
      return {
        type: "two-panel",
        data: taxPayroll,
      };

    case "compliances":
      return {
        type: "two-panel",
        data: compliances,
      };

    case "trademark":
      return {
        type: "two-panel",
        data: trademarkIP,
      };

    case "lawyer":
      return {
        type: "two-panel",
        data: {
          sections: lawyerServices.sections.filter(s => s.links && s.links.length > 0),
        },
      };

    case "documentation":
      return {
        type: "two-panel",
        data: {
          sections: documentation.sections.filter(s => s.links && s.links.length > 0),
        },
      };

    case "others":
      return {
        type: "two-panel",
        data: {
          sections: othersMenu.sections.filter(s => s.links && s.links.length > 0),
        },
      };

    case "more":
      return { type: "simple", data: moreMenu };

    default:
      return null;
  }
}

/* ─── Two-panel Mega Menu (Vakilsearch-style) ────────────────────── */
function TwoPanelMenu({ data, onClose }) {
  const [activeSection, setActiveSection] = useState(data.sections[0]);

  return (
    <div className="grid w-full max-w-6xl max-h-[calc(100vh-120px)] overflow-hidden rounded-none border border-gold/20/50 bg-white shadow-[0_45px_90px_-15px_rgba(11,25,44,0.15)] ring-1 ring-white/80 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="flex min-h-[360px] max-h-[calc(100vh-120px)] overflow-y-auto flex-col bg-gold/10/20 p-3.5 scrollbar-hide">
        {data.sections.map((section) => (
          <button
            key={section.title}
            type="button"
            className={`group flex w-full items-center gap-3 rounded-none px-3.5 py-3 text-left text-sm font-extrabold transition-all duration-200 ${
              activeSection?.title === section.title
                ? "bg-white text-gold border-l-4 border-secondary shadow-sm ring-1 ring-indigo-100/10 pl-2.5"
                : "text-slate-600 hover:bg-white/80 hover:text-gold hover:pl-4"
            }`}
            onClick={() => setActiveSection(section)}
            onMouseEnter={() => setActiveSection(section)}
          >
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-none transition-colors ${
              activeSection?.title === section.title ? "bg-gold/10" : "bg-white/80"
            }`}>
              <img src={section.icon || sectionIcons.business} alt="" className="h-6 w-6 object-contain" loading="lazy" decoding="async" />
            </span>
            <span className="min-w-0 flex-1">{section.title}</span>
            <ChevronRight size={16} className={`shrink-0 text-slate-300 transition-transform ${
              activeSection?.title === section.title ? "text-gold translate-x-0.5" : "group-hover:translate-x-0.5 group-hover:text-gold"
            }`} />
          </button>
        ))}

        <div className="mt-auto rounded-none border border-gold/20/40 bg-white p-4 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
          <div className="mb-3 grid h-11 w-11 place-items-center rounded-none bg-secondary/10 text-gold">
            <Phone size={18} />
          </div>
          <div className="text-sm font-bold leading-6 text-slate-600">
            <span>Prefer to talk to a business advisor first?</span>
            <Link href="/talk-to-expert" className="mt-1 inline-flex text-gold transition-colors hover:text-gold-dark font-black underline decoration-secondary decoration-2 underline-offset-4" onClick={onClose}>
              Book a call back
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
        {activeSection && (
          <>
            <div className="mb-5 flex items-center gap-3 border-b border-gold/20/40 pb-5">
              <span className="grid h-12 w-12 place-items-center rounded-none bg-gold/10">
                <img src={activeSection.icon || sectionIcons.business} alt="" className="h-7 w-7 object-contain" loading="lazy" decoding="async" />
              </span>
              <span className="font-serif text-xl font-black text-slate-950">{activeSection.title}</span>
            </div>
            <div className="grid gap-x-8 gap-y-1 sm:grid-cols-1 md:grid-cols-2">
              {activeSection.links.map((item) => (
                <Link
                  key={`${activeSection.title}-${item.label}-${item.href}`}
                  href={item.href}
                  className={`group flex min-h-11 items-center justify-between gap-3 rounded-none px-3 text-sm font-semibold text-slate-600 transition-all hover:bg-gold/5 hover:text-gold hover:translate-x-1.5 duration-200 ${
                    item.isNew ? "text-gold" : ""
                  }`}
                  onClick={onClose}
                >
                  <span className="min-w-0">{item.label}</span>
                  {item.isNew && (
                    <span className="bg-secondary/15 text-gold border border-secondary/20 px-2 py-0.5 text-[0.62rem] font-bold tracking-wider rounded-md">
                      New
                    </span>
                  )}
                </Link>
              ))}
            </div>
            
            {activeSection.title === "Web Development" && (
              <div className="col-span-full mt-6 rounded-none overflow-hidden bg-gradient-to-br from-primary via-indigo-500 to-secondary p-6 shadow-xl border border-gold/30/30 relative isolate group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-none bg-white/20 blur-3xl group-hover:bg-white/30 transition-all duration-700"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-none bg-white/10 ring-1 ring-white/20 backdrop-blur-md overflow-hidden shadow-lg">
                    <img src="/veagle-logo.webp" alt="Veaglespace" className="h-full w-full object-cover scale-110" onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=V&background=0D8ABC&color=fff"; }} />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <div className="inline-flex items-center gap-1.5 rounded-none bg-white/20 px-2.5 py-0.5 text-[0.65rem] font-black tracking-widest text-white uppercase mb-2 ring-1 ring-white/30 shadow-sm">
                      Technology Partner
                    </div>
                    <h4 className="text-lg font-black text-white tracking-tight">Veaglespace Tech</h4>
                    <p className="mt-1 text-sm font-medium text-indigo-50 leading-snug">
                      Elevate your business with state-of-the-art Web & E-Commerce solutions designed for maximum scale and conversion.
                    </p>
                  </div>
                  <a href="https://veaglespace.com" target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-none bg-white px-5 py-2.5 text-sm font-extrabold text-gold shadow-lg shadow-black/5 transition-all hover:scale-105 hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-auto text-center">
                    Visit Website
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main Header ─────────────────────────────────────────────────── */
const Toast = ({ toast, onClose }) => (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      width: "calc(100vw - 40px)",
      maxWidth: "320px",
      background: "white",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      borderRadius: "16px",
      padding: "20px",
      zIndex: 9999,
      borderLeft: `6px solid ${toast.type === "doc" ? "#ef4444" : "#f59e0b"}`,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      animation: "vs-slide-in-right 0.3s ease-out"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase" }}>{toast.title}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ fontSize: "0.95rem", color: "#1e293b", fontWeight: 600, lineHeight: 1.4 }}>{toast.content}</div>
      <div style={{ fontSize: "0.75rem", color: "#4F46E5", fontWeight: 700, cursor: "pointer" }} onClick={() => { window.dispatchEvent(new CustomEvent("vs-open-notifications")); onClose(); }}>View details →</div>
    </div>
  );

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const timeoutRef = useRef(null);
  const headerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBell, setShowBell] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      if (currentScrollY > 70) {
        if (showNotifications) {
          setShowBell(true);
        } else if (currentScrollY > lastScrollY.current) {
          setShowBell(false);
        } else {
          setShowBell(true);
        }
      } else {
        setShowBell(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showNotifications]);

  const token = useSelector((state) => state.auth?.token);
  const { data: meData } = useGetMeQuery(null, { skip: typeof window === "undefined" || !token });
  const { data: unreadData } = useGetUnreadCountQuery(null, {
    skip: !meData?.user || typeof window === "undefined",
    pollingInterval: 30000,
  });
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const user = meData?.user || null;
  const { data: messagesData } = useGetMyMessagesQuery(null, { 
    skip: !user,
    pollingInterval: 30000 // Poll every 30 seconds to keep toasts/counts fresh
  });
  const [markAsRead] = useMarkMessageAsReadMutation();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const { data: contactsData } = useGetUnreadContactsQuery(null, { 
    skip: true,
    pollingInterval: 30000
  });
  const [markContactRead] = useMarkContactAsReadMutation();
  const [deleteContact] = useDeleteContactMutation();
  const [verifyDocument] = useVerifyDocumentMutation();
  
  const messages = useMemo(() => messagesData?.data || [], [messagesData?.data]);
  const contacts = [];
  const unreadCount = unreadData?.count || 0;
  const [activeToast, setActiveToast] = useState(null);
  const prevUnreadRef = useRef(unreadCount);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Monitor for new notifications to show a Toast
  useEffect(() => {
    // Only proceed if data has finished loading at least once
    if (unreadData !== undefined && (isAdmin ? contactsData !== undefined : true)) {
      if (isInitialLoad) {
        prevUnreadRef.current = unreadCount;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsInitialLoad(false);
      } else if (unreadCount > prevUnreadRef.current) {
        const latestMsg = messages.find(m => !m.isRead && m.receiverId === user?.id);
        const latestContact = contacts.find(c => !c.isRead);
        
        if (latestMsg) {
          setActiveToast({
            title: "New Message",
            content: latestMsg.content,
            type: latestMsg.isDocRequest ? "doc" : "msg"
          });
        } else if (latestContact) {
          setActiveToast({
            title: "New Query",
            content: `${latestContact.name} sent a contact inquiry.`,
            type: "contact"
          });
        }

        // Auto-hide toast after 5 seconds
        const timer = setTimeout(() => setActiveToast(null), 5000);
        return () => clearTimeout(timer);
      }
      prevUnreadRef.current = unreadCount;
    }
  }, [unreadCount, unreadData, contactsData, messages, contacts, user?.id, isAdmin, isInitialLoad]);



  const openMenu = (key) => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(key);
    setDesktopMoreOpen(false);
    setShowNotifications(false);
  };

  const delayedClose = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 140);
  };

  const closeAll = () => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(null);
    setDesktopMoreOpen(false);
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        closeAll();
        setShowNotifications(false);
      }
    };
    const handleOpenNotifications = () => {
      setShowNotifications(true);
      setActiveMenu(null);
      setDesktopMoreOpen(false);
    };

    window.addEventListener("vs-open-notifications", handleOpenNotifications);

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("vs-open-notifications", handleOpenNotifications);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const routeCloseTimer = window.setTimeout(() => {
      setMobileOpen(false);
      setMobileExpanded(null);
      setActiveMenu(null);
      setDesktopMoreOpen(false);
    }, 0);

    return () => window.clearTimeout(routeCloseTimer);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const megaContent = activeMenu ? getMegaData(activeMenu) : null;
  const isHome = pathname === "/";
  const dashboardHref = user ? getDashboardPath(user.role) : "/dashboard";

  async function handleLogout() {
    try {
      await logoutMutation().unwrap();
    } catch {}
    closeAll();
    setMobileOpen(false);
    router.replace("/login");
  }

  return (
    <header 
      className={`fixed inset-x-0 top-0 z-[200] transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-200" : "bg-white/90 backdrop-blur-md border-b border-slate-200"}`} 
      ref={headerRef}
      onMouseLeave={delayedClose}
    >
      {activeToast && <Toast toast={activeToast} onClose={() => setActiveToast(null)} />}
      
      {/* Top Strip */}
      <div className="hidden lg:block bg-slate-50 border-b border-slate-100 text-slate-600 py-1.5">
        <div className="mx-auto flex w-full max-w-none items-center justify-between px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-4 text-[0.8rem]">
            <Link href="/about-us" className="hover:text-gold font-semibold transition-colors">About Us</Link>
            <span className="text-slate-300">|</span>
            <Link href="/contact" className="hover:text-gold font-semibold transition-colors">Contact</Link>
            <span className="text-slate-300">|</span>
            <Link href="/resources" className="hover:text-gold font-semibold transition-colors">Blogs</Link>
          </div>
          <div className="flex items-center gap-4 text-[0.8rem]">
            <a href={`tel:${siteMeta.phone}`} className="flex items-center font-bold text-gold hover:text-emerald-600 transition-colors">
              <Phone size={13} className="mr-1.5" />
              {siteMeta.phone}
            </a>
            <span className="text-slate-300">|</span>
            <Link href="/talk-to-expert" className="hover:text-gold font-semibold transition-colors">Talk to an Expert</Link>
          </div>
        </div>
      </div>

      <div className="relative z-[201]">
        <div className="mx-auto flex h-[80px] w-full max-w-none items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
          <BrandLogo 
            href="/" 
            className="group flex shrink-0 items-center rounded-none p-1.5 transition-all duration-200" 
            onClick={closeAll} 
            height={40} 
          />

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex" aria-label="Main navigation">
            {mainNav.map((item) => {
              const isCta = item.key === "consult";
              const isSimple = getMegaData(item.key)?.type === "simple";
              return (
                <div key={item.key} className="relative" onMouseLeave={delayedClose}>
                  <button
                    type="button"
                    className={`group flex h-9 items-center gap-1.5 whitespace-nowrap rounded-none px-4 text-xs font-bold transition-all duration-200 ${
                      isCta
                        ? "bg-gold text-white shadow-sm hover:bg-gold-dark hover:shadow-md active:scale-[0.98]"
                        : `text-slate-700 hover:text-gold hover:bg-gold/10/40 ${activeMenu === item.key ? "bg-gold/10/60 text-gold shadow-sm ring-1 ring-indigo-100/30" : ""}`
                    }`}
                    onClick={() => (activeMenu === item.key ? closeAll() : openMenu(item.key))}
                    onMouseEnter={() => openMenu(item.key)}
                  >
                    <span className="capitalize">{item.label}</span>
                    {!isCta && (
                      <ChevronDown 
                        size={11} 
                        className={`transition-transform duration-300 ${activeMenu === item.key ? "rotate-180" : ""} opacity-40 group-hover:opacity-100 group-hover:text-gold`} 
                      />
                    )}
                  </button>

                  {/* Render Simple Dropdown aligned directly below its respective button */}
                  {activeMenu === item.key && isSimple && (
                    <div 
                      className="absolute left-0 top-full -mt-2 pt-4 z-[250]"
                      onMouseEnter={() => openMenu(item.key)}
                    >
                      <div className="grid min-w-72 gap-1 rounded-none border border-gold/20/30 bg-white/98 backdrop-blur-xl p-3 shadow-[0_20px_48px_-10px_rgba(11,25,44,0.12)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                        {getMegaData(item.key).data.map((itemLink, idx) => (
                          <Link 
                            key={`${itemLink.label}-${itemLink.href}-${idx}`} 
                            href={itemLink.href} 
                            className="group/link flex items-center gap-2 rounded-none px-4 py-2.5 text-xs font-bold text-black transition-all hover:bg-gold/5 hover:text-gold hover:translate-x-1 whitespace-nowrap duration-200" 
                            onClick={closeAll}
                          >
                            <ChevronRight size={14} className="text-slate-400 shrink-0 group-hover/link:text-gold transition-colors" />
                            {itemLink.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <>

                <Link 
                  href={dashboardHref} 
                  className="btn btn-primary btn-sm btn-circle !hidden shadow-lg shadow-indigo-500/15 sm:!inline-flex" 
                  onClick={closeAll}
                  title="Dashboard"
                >
                  <User size={18} />
                </Link>
                <button 
                  type="button" 
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-300 text-slate-700 hover:border-gold hover:bg-gold hover:text-white hover:shadow-md transition-all duration-300 !hidden sm:!inline-flex"
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  title="Logout"
                >
                  {isLoggingOut ? <span className="loading loading-spinner loading-xs"></span> : <LogOut size={16} />}
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-300 text-slate-700 hover:border-gold hover:bg-gold hover:text-white hover:shadow-md transition-all duration-300 !hidden sm:!inline-flex"
                onClick={closeAll}
                title="Login"
              >
                <LogIn size={16} />
              </Link>
            )}

            <div
              className="relative hidden xl:block"
              onMouseEnter={() => {
                setDesktopMoreOpen(true);
                setActiveMenu(null);
                setShowNotifications(false);
              }}
              onMouseLeave={() => setDesktopMoreOpen(false)}
            >
              <button
                id="vs-desktop-more-btn"
                type="button"
                className="btn btn-ghost btn-circle btn-sm relative flex items-center justify-center transition-colors text-slate-700 hover:bg-slate-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setDesktopMoreOpen(!desktopMoreOpen);
                  setActiveMenu(null);
                  setShowNotifications(false);
                }}
                aria-label="Open more menu"
              >
                {desktopMoreOpen ? <X size={20} className="pointer-events-none" /> : <Menu size={22} className="pointer-events-none" />}
              </button>

              {desktopMoreOpen && (
                <div 
                  className="absolute right-0 top-full -mt-2 pt-5 z-[250]"
                  onMouseEnter={() => setDesktopMoreOpen(true)}
                >
                  <div className="w-64 overflow-hidden rounded-none border border-gold/20/30 bg-white/98 backdrop-blur-xl p-2 shadow-[0_20px_48px_-10px_rgba(11,25,44,0.12)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                    {moreMenu.map((item, idx) => (
                      <Link key={`${item.label}-${idx}`} href={item.href} className="block rounded-none px-4 py-2.5 text-xs font-bold text-black hover:bg-gold/5 hover:text-gold hover:translate-x-1.5 transition-all duration-200" onClick={closeAll}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-300 text-slate-700 hover:border-gold hover:bg-gold hover:text-white hover:shadow-md transition-all duration-300 xl:hidden"
              onClick={(e) => {
                e.stopPropagation();
                setMobileOpen(!mobileOpen);
                closeAll();
              }}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {activeMenu && megaContent && megaContent.type === "two-panel" && (
        <div className="absolute left-0 right-0 top-full z-[190] flex justify-center pointer-events-none px-4 sm:px-6 lg:px-8">
          <div 
            className="w-full max-w-6xl flex justify-center pointer-events-auto pt-8 -mt-2"
            onMouseEnter={() => openMenu(activeMenu)}
            onMouseLeave={delayedClose}
          >
            <TwoPanelMenu key={activeMenu} data={megaContent.data} onClose={closeAll} />
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-x-0 top-[76px] z-[180] max-h-[calc(100vh-76px)] overflow-y-auto border-b border-indigo-55 bg-white/98 shadow-2xl backdrop-blur-xl xl:hidden transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
          <div className="mx-auto w-full max-w-[1288px] px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center gap-2 rounded-none bg-gold/5 border border-primary/10 px-4 py-3 text-sm font-extrabold text-gold">
              <Phone size={15} />
              <span>{siteMeta.phone}</span>
            </div>

            {mainNav.map((item) => {
              const data = getMegaData(item.key);
              return (
                <div key={item.key} className="border-b border-slate-100/60 py-1">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-none px-3 py-3 text-left text-sm font-extrabold text-slate-800 transition-colors hover:bg-gold/5 hover:text-gold"
                    onClick={() => setMobileExpanded(mobileExpanded === item.key ? null : item.key)}
                  >
                    <span className="flex items-center gap-3">
                      <img src={item.icon} alt="" className="h-6 w-6 object-contain" loading="lazy" decoding="async" />
                      {item.label}
                    </span>
                    <ChevronDown className={`transition-transform text-slate-400 ${mobileExpanded === item.key ? "rotate-180 text-gold" : ""}`} />
                  </button>
                  {mobileExpanded === item.key && data && (
                    <div className="grid gap-1 px-3 pb-3">
                      {data.type === "simple" &&
                        data.data.map((itemLink) => (
                          <Link key={`${itemLink.label}-${itemLink.href}`} href={itemLink.href} className="rounded-none px-3 py-2 text-sm font-bold text-slate-600 hover:bg-gold/5 hover:text-gold hover:pl-5 transition-all duration-200" onClick={() => setMobileOpen(false)}>
                            {itemLink.label}
                          </Link>
                        ))}
                      {data.type === "two-panel" &&
                        data.data.sections.map((section) => (
                          <div key={section.title}>
                            <p className="px-3 pb-1 pt-3 text-xs font-black uppercase tracking-[0.16em] text-gold border-b border-slate-100/50">{section.title}</p>
                            {section.links.map((itemLink) => (
                              <Link key={`${section.title}-${itemLink.label}-${itemLink.href}`} href={itemLink.href} className="block rounded-none px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-gold/5 hover:text-gold hover:pl-5 transition-all duration-200" onClick={() => setMobileOpen(false)}>
                                {itemLink.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="border-b border-slate-100/60 py-1">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-none px-3 py-3 text-left text-sm font-extrabold text-slate-800 transition-colors hover:bg-gold/5 hover:text-gold"
                onClick={() => setMobileExpanded(mobileExpanded === "more" ? null : "more")}
              >
                <span className="flex items-center gap-3">
                  <Search size={18} />
                  More
                </span>
                <ChevronDown className={`transition-transform text-slate-400 ${mobileExpanded === "more" ? "rotate-180 text-gold" : ""}`} />
              </button>
              {mobileExpanded === "more" && (
                <div className="grid gap-1 px-3 pb-3">
                  {moreMenu.map((item) => (
                    <Link key={item.label} href={item.href} className="rounded-none px-3 py-2 text-sm font-bold text-slate-600 hover:bg-gold/5 hover:text-gold hover:pl-5 transition-all duration-200" onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-3 pt-4">
              {user ? (
                <>
                  <Link href={dashboardHref} className="btn btn-primary bg-gold text-white border-0 rounded-none flex items-center justify-center shadow-md hover:bg-gold-dark" onClick={() => setMobileOpen(false)} title="Dashboard">
                    <User size={20} />
                  </Link>
                  <button type="button" className="btn btn-outline rounded-none border-slate-200 text-black flex items-center justify-center hover:border-primary hover:bg-gold hover:text-white" onClick={handleLogout} disabled={isLoggingOut} title="Logout">
                    {isLoggingOut ? <span className="loading loading-spinner"></span> : <LogOut size={20} />}
                  </button>
                </>
              ) : (
                <Link href="/login" className="btn btn-outline rounded-none border-slate-200 text-black flex items-center justify-center hover:border-primary hover:bg-gold hover:text-white" onClick={() => setMobileOpen(false)} title="Login">
                  <LogIn size={20} />
                </Link>
              )}
              <Link href="/talk-to-expert" className="btn btn-primary bg-gold border-0 rounded-none shadow-lg shadow-indigo-500/15 text-white hover:bg-gold-dark" onClick={() => setMobileOpen(false)}>
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* Floating Notification Bell */}
      {user && (
        <div className={`absolute right-8 bottom-[-70px] z-[210] lg:right-16 transition-all duration-300 ease-in-out ${
          showBell 
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
            : "opacity-0 -translate-y-8 scale-75 pointer-events-none"
        }`}>
          <div style={{ position: "relative" }}>
            <button
              id="vs-notification-bell"
              type="button"
              className="btn btn-circle btn-md border-0 shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
              style={{
                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                color: "white"
              }}
              onClick={(event) => {
                event.stopPropagation();
                clearTimeout(timeoutRef.current);
                setActiveMenu(null);
                setDesktopMoreOpen(false);
                setShowNotifications((value) => !value);
              }}
              aria-label="Toggle notifications"
            >
              <Bell size={24} className="group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  background: "#ff4d4d",
                  color: "white",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  border: "2px solid white",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
                }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                {/* Backdrop */}
                <div 
                  onClick={() => setShowNotifications(false)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(4px)",
                    zIndex: 1999,
                    cursor: "default"
                  }}
                />
                
                {/* Sidebar Drawer */}
                <div style={{
                  position: "fixed",
                  top: 0,
                  right: 0,
                  width: "600px",
                  maxWidth: "100vw",
                  height: "100vh",
                  background: "white",
                  boxShadow: "-10px 0 50px rgba(0, 0, 0, 0.15)",
                  zIndex: 2000,
                  display: "flex",
                  flexDirection: "column",
                  animation: "vs-slide-in-right 0.3s ease-out"
                }}>
                  <div className="bg-gradient-to-r from-primary to-indigo-500 text-white p-6 sm:p-8 flex justify-between items-center shadow-md">
                    <div>
                      <h3 className="m-0 text-2xl font-black tracking-tight text-white">Notifications</h3>
                      <span className="text-sm font-medium text-indigo-100 mt-1 block">{unreadCount} pending queries</span>
                    </div>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="btn btn-circle btn-sm btn-ghost hover:bg-white/20 text-white border-0 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {isAdmin && (
                        <>
                          {contacts.length > 0 ? (
                            <>
                              <div style={{ padding: "8px 4px", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                Recent Contact Queries
                              </div>
                              {contacts.map(contact => (
                                <div 
                                  key={contact.id} 
                                  onMouseEnter={() => !contact.isRead && markContactRead(contact.id)}
                                  className={`p-6 rounded-none border transition-all duration-300 hover:shadow-xl ${contact.isRead ? 'bg-white border-slate-200' : 'bg-gold/10/50 border-gold/30 shadow-md'}`}
                                >
                                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e293b", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                                    <span>{contact.name}</span>
                                    {!contact.isRead && <span style={{ fontSize: "0.6rem", background: "#f59e0b", color: "white", padding: "2px 8px", borderRadius: "10px" }}>NEW</span>}
                                  </div>
                                  
                                  <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                      <span style={{ fontSize: "1rem" }}>📧</span> {contact.email || "No email"}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                      <span style={{ fontSize: "1rem" }}>📞</span> {contact.phone}
                                    </div>
                                    {contact.subject && (
                                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontSize: "1rem" }}>📌</span> {contact.subject}
                                      </div>
                                    )}
                                  </div>

                                  <div style={{ 
                                    fontSize: "1rem", 
                                    color: "#334155", 
                                    lineHeight: 1.7, 
                                    marginBottom: "20px", 
                                    padding: "16px", 
                                    background: "white", 
                                    borderRadius: "14px", 
                                    border: "1px solid #e2e8f0" 
                                  }}>
                                    {contact.message}
                                  </div>

                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                                    <span style={{ color: "#94a3b8" }}>{new Date(contact.createdAt).toLocaleString()}</span>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          markContactRead(contact.id);
                                        }}
                                        style={{ color: "#f59e0b", background: "#fffbeb", border: "1px solid #fef3c7", fontWeight: 700, cursor: "pointer", padding: "6px 12px", borderRadius: "8px" }}
                                      >
                                        Done
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (window.confirm("Delete this query?")) deleteContact(contact.id);
                                        }}
                                        style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2", fontWeight: 700, cursor: "pointer", padding: "6px 12px", borderRadius: "8px" }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : null}
                        </>
                      )}

                      {messages.length > 0 && (
                        <>
                          <div style={{ padding: "8px 4px", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "12px" }}>
                            Platform Messages
                          </div>
                          {messages.map(msg => {
                            const isSentByMe = msg.senderId === user.id;
                            const isReceivedByMe = msg.receiverId === user.id;
                            
                            return (
                              <div 
                                key={msg.id} 
                                className={`p-5 rounded-none border transition-all duration-300 hover:shadow-lg relative ${isReceivedByMe && !msg.isRead ? 'bg-gold/10 border-gold/30 shadow-md' : 'bg-white border-slate-200'}`}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "start" }}>
                                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--blue)", textTransform: "uppercase" }}>
                                    {isSentByMe ? (
                                      <>To: <span style={{ color: "#334155" }}>{msg.receiver?.name || "User"}</span></>
                                    ) : (
                                      <>From: <span style={{ color: "#334155" }}>{msg.sender?.name || "System"}</span></>
                                    )}
                                  </div>
                                  {isSentByMe && (
                                    <div style={{ 
                                      fontSize: "0.65rem", 
                                      fontWeight: 800, 
                                      padding: "2px 8px", 
                                      borderRadius: "10px",
                                      background: msg.isRead ? "#dcfce7" : "#fee2e2",
                                      color: msg.isRead ? "#166534" : "#991b1b"
                                    }}>
                                      {msg.isRead ? "READ" : "UNREAD"}
                                    </div>
                                  )}
                                </div>

                                {isSentByMe && msg.isDocRequest && (!msg.documents || msg.documents.length === 0) && (
                                  <div style={{ 
                                    padding: "8px 12px", 
                                    background: "#fff7ed", 
                                    color: "#c2410c", 
                                    borderRadius: "8px", 
                                    fontSize: "0.8rem", 
                                    fontWeight: 700,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    marginBottom: "10px",
                                    border: "1px solid #ffedd5"
                                  }}>
                                    <span>⏳</span> Awaiting Client Upload
                                  </div>
                                )}

                                <div style={{ fontSize: "0.9rem", color: "#1e293b", lineHeight: 1.5, marginBottom: "8px" }}>
                                  {msg.content}
                                </div>

                                {/* Quick Action for Document Requests (for clients) */}
                                {msg.isDocRequest && isReceivedByMe && (
                                  <Link 
                                    href={`${dashboardHref}?section=messages`}
                                    onClick={() => setShowNotifications(false)}
                                    style={{ 
                                      display: "inline-flex", 
                                      alignItems: "center", 
                                      gap: "8px", 
                                      padding: "8px 16px", 
                                      background: "#fef2f2", 
                                      color: "#ef4444", 
                                      borderRadius: "8px", 
                                      fontSize: "0.85rem", 
                                      fontWeight: 800, 
                                      textDecoration: "none",
                                      marginBottom: "12px",
                                      border: "1px solid #fee2e2"
                                    }}
                                  >
                                    <span>📤</span> Upload Requested Document
                                  </Link>
                                )}

                                {msg.documents && msg.documents.length > 0 && (
                                  <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {msg.documents.map(doc => (
                                      <div key={doc.id} style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                                        <a 
                                          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${doc.fileUrl}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ 
                                            fontSize: "0.75rem", 
                                            padding: "6px 12px", 
                                            background: "#eff6ff", 
                                            color: "var(--blue)", 
                                            borderRadius: "8px",
                                            textDecoration: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontWeight: 700,
                                            border: "1px solid #dbeafe"
                                          }}
                                        >
                                          <span style={{ fontSize: "1rem" }}>📄</span> View {doc.documentType || "File"}
                                        </a>
                                        {isAdmin && doc.status === "PENDING" && (
                                          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                                            <button 
                                              onClick={async (e) => {
                                                e.stopPropagation();
                                                if (!doc.id) return toast.error("Error: Missing document ID");
                                                try {
                                                  console.log("Verifying document:", doc.id);
                                                  await verifyDocument({ id: doc.id, status: "VERIFIED" }).unwrap();
                                                  markAsRead(msg.id);
                                                  toast.success("Document verified successfully!");
                                                } catch (err) { 
                                                  console.error("Verify Error:", err);
                                                  toast.error(`Failed to verify: ${err.data?.message || "Check console for details"}`); 
                                                }
                                              }}
                                              style={{ 
                                                flex: 1,
                                                fontSize: "0.7rem", 
                                                padding: "8px", 
                                                background: "#dcfce7", 
                                                color: "#166534", 
                                                borderRadius: "8px",
                                                border: "1px solid #bbf7d0",
                                                fontWeight: 900,
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "4px"
                                              }}
                                            >
                                              ✅ Verify
                                            </button>
                                            <button 
                                              onClick={async (e) => {
                                                e.stopPropagation();
                                                if (!doc.id) return toast.error("Error: Missing document ID");
                                                const reason = window.prompt("Reason for rejection (e.g. invalid file, blurry, etc.):", "Incorrect file or low quality");
                                                if (reason === null) return;
                                                try {
                                                  console.log("Rejecting document:", doc.id);
                                                  await verifyDocument({ id: doc.id, status: "REJECTED", reason }).unwrap();
                                                  markAsRead(msg.id);
                                                  toast.success("Document rejected and user notified.");
                                                } catch (err) { 
                                                  console.error("Reject Error:", err);
                                                  toast.error(`Failed to reject: ${err.data?.message || "Check console for details"}`); 
                                                }
                                              }}
                                              style={{ 
                                                flex: 1,
                                                fontSize: "0.7rem", 
                                                padding: "8px", 
                                                background: "#fee2e2", 
                                                color: "#991b1b", 
                                                borderRadius: "8px",
                                                border: "1px solid #fecaca",
                                                fontWeight: 900,
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "4px"
                                              }}
                                            >
                                              ❌ Reject
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", marginTop: "12px" }}>
                                  <span style={{ color: "#94a3b8" }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                                  {isReceivedByMe && !msg.isRead && (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(msg.id);
                                      }}
                                      style={{ color: "#f59e0b", background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}
                                    >
                                      Mark Read
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}

                      {contacts.length === 0 && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 md:py-20 text-slate-400">
                          <div className="text-3xl md:text-6xl mb-4 opacity-50">📭</div>
                          <p className="text-lg font-medium">No new notifications at the moment.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

