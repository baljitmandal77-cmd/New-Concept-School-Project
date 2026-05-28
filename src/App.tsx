/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Mail, MapPin, Facebook, Youtube, Instagram, Bell,
  ChevronLeft, ChevronRight, Download, Search, LayoutGrid, Calendar, Users, 
  Award, BookOpen, GraduationCap, Clock, MessageSquare, Plus, 
  Globe, ShieldCheck, ArrowRight, ExternalLink, Menu as MenuIcon,
  Play, Sparkles, Heart, Zap, Camera, Shield, Coffee, Bus, Eye,
  AlertCircle, CheckCircle, ShieldAlert, FileText
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { SchoolDataProvider, useSchoolData } from './context/SchoolDataContext';
import AdminPanel from './components/AdminPanel';

import logoUrl from './assets/images/school_logo_minimalist_1779109493110.png';
import heroBannerUrl from './assets/images/school_hero_banner_1779108511571.png';
import uniqueFeatureUrl from './assets/images/regenerated_image_1779108373950.jpg';
import principalPortraitUrl from './assets/images/regenerated_image_1779108859642.jpg';

// Local or placeholder image assets for safety (These can be uploaded to /src/assets/images/ and imported as well)
const techlearningUrl = "https://images.unsplash.com/photo-1560523182-7ea90df18903?q=80&w=2070&auto=format&fit=crop";
const smartclasslabUrl = "https://images.unsplash.com/photo-1524178232363-1fb28f74b0ed?q=80&w=2070&auto=format&fit=crop";
const printcampus2Url = "https://images.unsplash.com/photo-1524178232363-1fb28f74b0ed?q=80&w=2070&auto=format&fit=crop";
const printcampus3Url = "https://images.unsplash.com/photo-1549845345-0cd8f813c9fb?q=80&w=2070&auto=format&fit=crop";

/** Utility for Tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const IMG_CACHE_BUSTER = Date.now().toString(36);

interface LocalImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  localName: string;
  fallback: string;
}

const LocalImg: React.FC<LocalImgProps> = ({ localName, fallback, className, alt, ...props }) => {
  const isBase64OrAbsolute = fallback && (fallback.startsWith("data:") || fallback.startsWith("http://") || fallback.startsWith("https://"));
  const initialSrc = (isBase64OrAbsolute && !localName)
    ? fallback
    : `/images/${localName}?cb=${IMG_CACHE_BUSTER}`;

  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const nextSrc = (isBase64OrAbsolute && !localName)
      ? fallback
      : `/images/${localName}?cb=${IMG_CACHE_BUSTER}`;
    setImgSrc(nextSrc);
    setHasError(false);
  }, [localName, fallback, isBase64OrAbsolute]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

const LogoImg: React.FC<{ className?: string }> = ({ className }) => {
  const { websiteContent } = useSchoolData();
  const logoSrc = websiteContent?.schoolLogo || logoUrl;
  return (
    <img 
      src={logoSrc}
      alt="School Logo"
      className={`${className || ''} rounded-full object-contain`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = logoUrl;
      }}
    />
  );
};

// --- SHARED COMPONENTS ---

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { websiteContent, publicNotifications = [] } = useSchoolData();

  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("nc_read_notif_ids");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = publicNotifications.filter((n: any) => !readNotifIds.includes(n.id)).length;

  const markAllPublicAsRead = () => {
    const allIds = publicNotifications.map((n: any) => n.id);
    localStorage.setItem("nc_read_notif_ids", JSON.stringify(allIds));
    setReadNotifIds(allIds);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Academics', path: '/academics' },
    { name: 'Notices', path: '/notices' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  // Dynamic School Name Splitting for Logo
  const schoolName = websiteContent?.schoolName || "New Concept";
  const parts = schoolName.split(" ");
  const word1 = parts[0] || "New";
  const word2 = parts[1] || "Concept";
  const restStr = parts.slice(2).join(" ") || "English Medium Boarding School";

  return (
    <header className="relative z-50">
      {/* Top Utility Bar */}
      <div className="bg-[#0b223d] text-white/95 py-2.5 hidden md:block border-b border-white/5 shadow-sm">
        <div className="container mx-auto px-6 flex justify-between items-center text-[11px] font-semibold uppercase tracking-[0.16em]">
          <div className="flex items-center space-x-8">
            {(websiteContent?.schoolPhone || "+977-9817681582, +977-9801671714").split(/[,/]/).map((p, idx) => (
              <span key={idx} className="flex items-center gap-2 hover:text-accent transition-colors duration-300">
                <Phone size={12} className="text-accent" /> {p.trim()}
              </span>
            ))}
            <span className="flex items-center gap-2 hover:text-accent transition-colors duration-300">
              <Mail size={12} className="text-accent" /> {websiteContent?.schoolEmail || "admissions@NCEMBS.edu.np"}
            </span>
            <span className="flex items-center gap-2 hover:text-accent transition-colors duration-300">
              <MapPin size={12} className="text-accent" /> {websiteContent?.schoolAddress || "Baheda, Ekdara-6 Mahottari"}
            </span>
          </div>
          <div className="flex items-center space-x-5 text-white/70">
            <a href="https://www.facebook.com/share/18tuMWYjma/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-all hover:scale-110 duration-300" title="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="hover:text-accent transition-all hover:scale-110 duration-300" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://youtube.com/@newconceptenglishmediumboardin?si=fs_uWpWoGv6MVXHH" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-all hover:scale-110 duration-300" title="Youtube"><i className="fa-brands fa-youtube"></i></a>
            <a href="https://www.tiktok.com/@newconceptembschool?_r=1&_t=ZS-96UBP2WKLaS" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-all hover:scale-110 duration-300" title="TikTok"><i className="fa-brands fa-tiktok"></i></a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#030c17]/75 backdrop-blur-xl border-b border-white/5 sticky top-0 py-3.5 transition-all duration-300 shadow-sm z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105 shrink-0 rounded-full bg-transparent p-0">
              <LogoImg className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl md:text-2xl font-black uppercase tracking-tight relative inline-block leading-none pb-1.5 flex items-center gap-1.5 font-sans">
                <span className="relative inline-block bg-gradient-to-r from-[#ffb703] to-[#ffd000] bg-clip-text text-transparent font-black drop-shadow-[0_2px_10px_rgba(255,183,3,0.3)] px-2 py-0.5 rounded-xl bg-[#ffb703]/[0.05] border border-[#ffb703]/15 shadow-inner">
                  {word1}
                </span>
                <span className="relative inline-block bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent font-black drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)] px-2 py-0.5 rounded-xl bg-white/[0.04] border border-white/10 shadow-inner">
                  {word2}
                </span>
                {/* Always-on subtle modern accent underline that expands completely on hover */}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ffb703] to-white rounded-full scale-x-[0.3] group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </span>
              <span className="text-[7.5px] md:text-[9.5px] font-black uppercase tracking-[0.26em] bg-gradient-to-r from-[#ffb703] to-white bg-clip-text text-transparent block mt-2 ml-1 leading-none antialiased border-t border-white/10 pt-2 drop-shadow-[0_1.5px_6px_rgba(255,183,3,0.18)]">
                {restStr}
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4.5 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 rounded-2xl relative overflow-hidden",
                  pathname === link.path
                    ? "text-[#030c17] bg-[#ffb703] font-extrabold scale-[1.03] shadow-md shadow-accent/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="w-[1px] h-5 bg-white/10 mx-3"></div>
            {/* Public Notifications Bell for Students & Parents (Desktop) */}
            <div className="relative mx-2">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="bg-white/5 hover:bg-white/10 rounded-2xl text-accent p-2.5 transition-all relative flex items-center justify-center active:scale-95 duration-200 border border-white/10"
                title="School Notices Feed"
              >
                <Bell size={16} className={unreadCount > 0 ? "animate-bounce text-[#ffb703]" : ""} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#ff4d4d] rounded-full text-[9px] font-black text-white flex items-center justify-center border border-[#030c17]">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0c233f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-50 text-left text-white"
                  >
                    <div className="bg-[#030c17] p-5 border-b border-white/10 flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-xs uppercase tracking-wider text-accent">School Notices & Updates</h4>
                        <p className="text-[10px] text-white/50 mt-1">{publicNotifications.length} Bulletins posted</p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            markAllPublicAsRead();
                            setNotifDropdownOpen(false);
                          }}
                          className="text-[9px] bg-accent/20 hover:bg-accent hover:text-primary px-2.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[320px] overflow-y-auto divide-y divide-white/5">
                      {publicNotifications.length === 0 ? (
                        <div className="p-8 text-center text-white/40 text-xs font-semibold">
                          <Bell size={24} className="mx-auto mb-3 opacity-20" />
                          No new public notices.
                        </div>
                      ) : (
                        publicNotifications.map((n: any) => {
                          const isUnread = !readNotifIds.includes(n.id);
                          return (
                            <div key={n.id} className={`p-4 transition-all relative group ${isUnread ? "bg-white/5" : "hover:bg-white/5 opacity-85"}`}>
                              <div className="flex items-start gap-2.5">
                                <div className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${isUnread ? "bg-[#ffb703] animate-pulse" : "bg-white/20"}`}></div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start gap-2 mb-1">
                                    <p className="text-xs font-black text-white group-hover:text-accent transition-colors leading-tight">{n.title}</p>
                                    <span className="text-[9px] text-[#ffb703] font-mono shrink-0">
                                      {new Date(n.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric" })}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-white/70 font-semibold leading-relaxed mb-2">{n.message}</p>
                                  <Link
                                    to="/notices"
                                    onClick={() => {
                                      const updated = [...readNotifIds, n.id];
                                      localStorage.setItem("nc_read_notif_ids", JSON.stringify(updated));
                                      setReadNotifIds(updated);
                                      setNotifDropdownOpen(false);
                                    }}
                                    className="text-[10px] text-accent hover:underline font-bold inline-flex items-center gap-1 group/btn"
                                  >
                                    View on Notice Board <ArrowRight size={10} className="transition-transform group-hover/btn:translate-x-0.5" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/admissions" className="bg-[#ffb703] hover:bg-accent hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/15 text-primary px-5.5 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] active:scale-95 transition-all duration-300">
              Apply Now
            </Link>
          </div>

          {/* Mobile Trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Mobile Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-[#ffb703] border border-white/10 transition-all flex items-center justify-center relative active:scale-95 duration-200"
                title="School Notices"
              >
                <Bell size={18} className={unreadCount > 0 ? "animate-bounce text-[#ffb703]" : "text-white/85"} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff4d4d] rounded-full text-[8.5px] font-black text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-72 sm:w-80 bg-[#0c233f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-50 text-left text-white"
                  >
                    <div className="bg-[#030c17] p-4 border-b border-white/10 flex justify-between items-center">
                      <span className="font-black text-[11px] uppercase tracking-wider text-accent">School Notices</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            markAllPublicAsRead();
                            setNotifDropdownOpen(false);
                          }}
                          className="text-[9px] bg-[#ffb703]/25 hover:bg-[#ffb703] hover:text-primary px-2.5 py-1 rounded-xl font-black uppercase transition-all"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="max-h-[250px] overflow-y-auto divide-y divide-white/5">
                      {publicNotifications.length === 0 ? (
                        <div className="p-6 text-center text-white/40 text-xs font-semibold">
                          No alerts.
                        </div>
                      ) : (
                        publicNotifications.map((n: any) => {
                          const isUnread = !readNotifIds.includes(n.id);
                          return (
                            <div key={n.id} className={`p-4 transition-all relative ${isUnread ? "bg-white/5" : "hover:bg-white/5 opacity-80"}`}>
                              <p className="text-xs font-black text-white leading-snug mb-1">{n.title}</p>
                              <p className="text-[10px] text-white/70 font-semibold mb-2">{n.message}</p>
                              <Link
                                to="/notices"
                                onClick={() => {
                                  const updated = [...readNotifIds, n.id];
                                  localStorage.setItem("nc_read_notif_ids", JSON.stringify(updated));
                                  setReadNotifIds(updated);
                                  setNotifDropdownOpen(false);
                                  setIsOpen(false);
                                }}
                                className="text-[10px] text-accent hover:underline font-bold"
                              >
                                View Bulletins &rarr;
                              </Link>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setIsOpen(true)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-white border border-white/10 transition-all">
              <MenuIcon size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#000a14]/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#030c17] z-[1110] shadow-2xl p-8 overflow-y-auto rounded-l-[40px] border-l border-white/10 text-white"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center overflow-hidden shrink-0 rounded-full bg-transparent p-0">
                    <LogoImg className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-base font-black uppercase tracking-tight relative inline-block leading-none pb-0.5">
                      <span className="bg-gradient-to-r from-[#ffb703] to-[#ffd000] bg-clip-text text-transparent font-black">
                        New
                      </span>{" "}
                      <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent font-black drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
                        Concept
                      </span>
                    </span>
                    <span className="text-[6.5px] font-black uppercase tracking-[0.18em] text-[#ffb703] block mt-1.5 leading-none">
                      Boarding School
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-3 bg-white/5 hover:bg-[#ffb703]/20 rounded-2xl text-white hover:text-[#ffb703] transition-colors border border-white/5">
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col space-y-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-bold uppercase tracking-wider p-4 rounded-2xl transition-all",
                      pathname === link.path ? "bg-[#ffb703] text-primary" : "text-white/80 hover:bg-white/5"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-6">
                   <Link to="/admissions" onClick={() => setIsOpen(false)} className="block bg-[#ffb703] text-primary p-5 rounded-3xl text-center font-black uppercase tracking-widest shadow-xl hover:bg-accent transition-all">
                    Online Enrollment
                  </Link>
                </div>
              </div>
              <div className="mt-16 pt-8 border-t border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-bold text-white/80">
                    <Phone size={16} className="text-accent" /> 9817681582
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-white/80">
                    <Phone size={16} className="text-accent" /> 9801671714
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-white/80">
                    <Mail size={16} className="text-accent" /> info@NCEMBS.edu.np
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

const SectionHeader = ({ badge, title, desc, centered = false }: { badge: string, title: string, desc?: string, centered?: boolean }) => (
  <div className={cn("mb-16 md:mb-24 relative z-10", centered ? "text-center max-w-3xl mx-auto" : "text-left")}>
    <div className={cn("inline-flex items-center gap-2.5 bg-white/5 border border-white/10 text-accent px-4 py-1.5 rounded-full text-[9px] md:text-xs font-black uppercase tracking-[0.25em] mb-6 shadow-sm", centered ? "justify-center" : "")}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
      </span>
      {badge}
    </div>
    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.1] relative pb-6 italic">
      {title}
      {/* Premium elite dual colored structured horizontal rule indicator */}
      <span className={cn("absolute bottom-0 h-[3px] bg-gradient-to-r from-accent to-white rounded-full", centered ? "left-1/2 -translate-x-1/2 w-24" : "left-0 w-16")} />
      <span className={cn("absolute bottom-0 h-[3px] bg-white/10 rounded-full", centered ? "left-1/2 -translate-x-1/2 w-48" : "left-0 w-32 -z-10")} />
    </h2>
    {desc && (
      <p className="text-sm md:text-base text-white/70 mt-6 leading-relaxed font-semibold max-w-2xl mx-auto antialiased">
        {desc}
      </p>
    )}
  </div>
);

const Footer = () => {
  const { websiteContent } = useSchoolData();
  const schoolName = websiteContent?.schoolName || "New Concept English Medium Boarding School";
  const parts = schoolName.split(" ");
  const word1 = parts[0] || "New";
  const word2 = parts[1] || "Concept";
  const restStr = parts.slice(2).join(" ") || "English Medium Boarding School";

  return (
    <footer className="bg-[#010912]/95 border-t-4 border-accent text-white pt-24 relative overflow-hidden backdrop-blur-md">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-16">
        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 shrink-0 bg-transparent rounded-full p-0 flex items-center justify-center overflow-hidden">
              <LogoImg className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black uppercase tracking-tight relative inline-block leading-none pb-1.5 flex items-center gap-1.5 font-sans">
                <span className="relative inline-block bg-gradient-to-r from-[#ffb703] to-[#ffd000] bg-clip-text text-transparent font-black drop-shadow-[0_2px_10px_rgba(255,183,3,0.3)] px-2.5 py-1 rounded-xl bg-[#ffb703]/[0.05] border border-[#ffb703]/15 shadow-inner">
                  {word1}
                </span>
                <span className="relative inline-block bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent font-black drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)] px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 shadow-inner">
                  {word2}
                </span>
              </span>
              <span className="text-[7.5px] md:text-[9.5px] font-black uppercase tracking-[0.22em] bg-gradient-to-r from-[#ffb703] to-white bg-clip-text text-transparent block mt-2 ml-1 leading-none antialiased border-t border-white/10 pt-2 drop-shadow-[0_1.5px_6px_rgba(255,183,3,0.18)]">
                {restStr}
              </span>
            </div>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            The most trusted name in basic level education in Mahottari. Widely recognized as K.D. Sir's School, we nurture the seeds of tomorrow with modern technology and ancient values.
          </p>
          <div className="flex gap-4">
              {[
                { Icon: Facebook, url: "https://www.facebook.com/share/18tuMWYjma/" },
                { Icon: Youtube, url: "https://youtube.com/@newconceptenglishmediumboardin?si=fs_uWpWoGv6MVXHH" },
                { Icon: Instagram, url: "#" },
                { 
                  Icon: () => (
                    <svg xmlns="http://www.w3.org/2005/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  ), 
                  url: "https://wa.me/9779817681582" 
                },
                { 
                  Icon: () => (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                  ), 
                  url: "https://www.tiktok.com/@newconceptembschool?_r=1&_t=ZS-96UBP2WKLaS" 
                }
              ].map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary hover:-translate-y-1 transition-all">
                  {typeof social.Icon === 'function' ? <social.Icon /> : <social.Icon size={20} />}
                </a>
              ))}
          </div>
        </div>

        <div>
          <h4 className="text-accent font-black uppercase tracking-[0.2em] mb-10 text-xs">Navigation</h4>
          <ul className="space-y-5 text-sm font-bold text-white/60">
            <li><Link to="/about" className="hover:text-accent transition-all flex items-center gap-3 group"><div className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform"></div> About Excellence</Link></li>
            <li><Link to="/academics" className="hover:text-accent transition-all flex items-center gap-3 group"><div className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform"></div> Curriculum Map</Link></li>
            <li><Link to="/admissions" className="hover:text-accent transition-all flex items-center gap-3 group"><div className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform"></div> Admission Portal</Link></li>
            <li><Link to="/notices" className="hover:text-accent transition-all flex items-center gap-3 group"><div className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform"></div> Digital Notice Board</Link></li>
            <li><Link to="/gallery" className="hover:text-accent transition-all flex items-center gap-3 group"><div className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform"></div> Photo Archives</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-accent font-black uppercase tracking-[0.2em] mb-10 text-xs">Direct Support</h4>
          <ul className="space-y-6 text-sm font-bold text-white/70">
            <li className="flex gap-4">
              <MapPin size={22} className="text-accent shrink-0" />
              <span className="leading-relaxed">{websiteContent?.schoolAddress || "Baheda, Ekdara-6, Mahottari, Madhesh Nepal"}</span>
            </li>
            <li className="flex gap-4">
              <Phone size={22} className="text-accent shrink-0" />
              <span>
                {(websiteContent?.schoolPhone || "9801671714 / 9817681582").split(/[,/]/).map((p, idx) => (
                  <span key={idx} className="block">{p.trim()}</span>
                ))}
              </span>
            </li>
            <li className="flex gap-4">
              <Mail size={22} className="text-accent shrink-0" />
              <span className="break-all">{websiteContent?.schoolEmail || "admissions@NCEMBS.edu.np"}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
          <h4 className="text-accent font-black uppercase tracking-[0.2em] mb-6 text-xs italic">School Mobile App COMING SOON!</h4>
          <p className="text-xs text-white/40 mb-8 leading-relaxed font-semibold">Get daily homework, attendance, and fee alerts on your smartphone.</p>
          <div className="space-y-4">
            <button className="w-full bg-white text-primary flex items-center justify-center gap-3 py-3.5 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-accent transition-colors">
              <Sparkles size={18} /> Google Play
            </button>
            <button className="w-full bg-transparent border-2 border-white/20 text-white flex items-center justify-center gap-3 py-3.5 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-white/10 transition-colors">
              App Store
            </button>
          </div>
        </div>
      </div>

      <div className="bg-black/40 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/30 gap-6">
          <p className="font-bold tracking-widest uppercase">&copy; {new Date().getFullYear()} NEW CONCEPT ENGLISH MEDIUM BOARDING SCHOOL PVT. LTD. EDUCATIONAL PRIDE.</p>
          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <div className="flex items-center gap-3 p-1.5 bg-[#041424]/80 border border-white/10 rounded-[22px] backdrop-blur-md shadow-premium relative group/craft">
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/60 pl-3">
                Crafted By
              </span>
              <a 
                href="https://www.baljitmandal.com.np" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative overflow-hidden bg-[#0c233f]/60 hover:bg-[#0c233f] border border-white/10 hover:border-accent/40 px-5 py-2.5 rounded-[16px] text-accent font-extrabold tracking-wider transition-all duration-500 flex items-center gap-2 shadow-lg group/dev"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-amber-500 opacity-5 group-hover/dev:opacity-10 transition-opacity duration-500"></span>
                <span className="font-black text-xs bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent transition-all duration-300">
                  Baljit Mandal
                </span>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.15em] border-l border-white/10 pl-3.5 group-hover/dev:text-white/65 transition-colors">
                  TechMind IT Solution
                </span>
              </a>
            </div>
            
            <Link to="/admin" className="text-accent/60 hover:text-accent font-black tracking-widest text-[10px] uppercase flex items-center gap-1.5 transition-colors bg-white/[0.03] border border-white/10 px-4 py-3 rounded-2xl">
              <ShieldCheck size={11} /> Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- HOME PAGE ---
const Home = () => {
  const { tickerMessage, websiteContent } = useSchoolData();
  const schoolName = websiteContent?.schoolName || "New Concept English Medium Boarding School";
  const parts = schoolName.split(" ");
  const word1 = parts[0] || "New";
  const word2 = parts[1] || "Concept";
  return (
    <main className="bg-[#030c17]">
      {/* Dynamic Emergency ticker */}
      <div className="bg-[#b91c1c] text-white py-3.5 relative overflow-hidden whitespace-nowrap z-40 shadow-sm">
        <div className="flex flex-row flex-nowrap w-max animate-ticker font-black text-[11px] uppercase tracking-[0.22em] select-none">
          <span className="flex items-center gap-3 shrink-0 pr-24"><Zap size={13} className="fill-[#ffb703] text-[#ffb703] animate-pulse" /> {tickerMessage || 'Admission Open for 2083 Session!'}</span>
          <span className="flex items-center gap-3 shrink-0 pr-24"><Zap size={13} className="fill-[#ffb703] text-[#ffb703] animate-pulse" /> {tickerMessage || 'Admission Open for 2083 Session!'}</span>
          <span className="flex items-center gap-3 shrink-0 pr-24"><Zap size={13} className="fill-[#ffb703] text-[#ffb703] animate-pulse" /> {tickerMessage || 'Admission Open for 2083 Session!'}</span>
          <span className="flex items-center gap-3 shrink-0 pr-24"><Zap size={13} className="fill-[#ffb703] text-[#ffb703] animate-pulse" /> {tickerMessage || 'Admission Open for 2083 Session!'}</span>
        </div>
      </div>

      {/* Modern Hero Area */}
      <section className="relative min-h-[92vh] lg:min-h-[95vh] flex items-center overflow-hidden bg-gradient-to-b from-[#0a1f33] via-[#0d2c54] to-[#041324] py-20 lg:py-0 selection:bg-accent selection:text-primary">
        <div className="absolute inset-0 z-0">
          <img 
            src={websiteContent?.heroPhoto || "/images/hero_banner.png"} 
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = heroBannerUrl; }} 
            className="w-full h-full object-cover opacity-20 filter brightness-90 mix-blend-luminosity scale-105 transition-transform duration-[12s] hover:scale-100" 
            alt="School Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041324] via-[#0d2c54]/75 to-transparent"></div>
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl"
              >
                <div className="flex items-center gap-3 pt-4 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb703] animate-ping" />
                  <span className="text-accent font-black uppercase tracking-[0.25em] text-[10px] md:text-[11.5px] inline-flex items-center">
                    {websiteContent?.heroTagline || "Ekdara's Premier Academic Institution"}
                  </span>
                </div>
                
                {/* Premium fancy styled School Name design in Hero area */}
                <div className="mb-10 block mt-2 md:mt-4 relative group">
                  <span className="text-5xl md:text-9xl font-black tracking-tighter uppercase block leading-[0.92] select-none relative z-10">
                    <span className="bg-gradient-to-r from-[#ffb703] via-[#fff2cc] to-[#ffb703] text-transparent bg-clip-text filter drop-shadow-[0_4px_22px_rgba(255,183,3,0.4)] mr-2 md:mr-4">
                      {word1}
                    </span>
                    <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 text-transparent bg-clip-text filter drop-shadow-[0_4px_20px_rgba(255,255,255,0.25)] relative">
                      {word2}
                      <span className="absolute bottom-2 left-0 right-0 h-[3px] md:h-[6px] bg-gradient-to-r from-[#ffb703] to-white rounded-full opacity-95 shadow-lg shadow-[#ffb703]/30" />
                    </span>
                  </span>
                  <span className="text-[10px] md:text-sm font-black tracking-[0.35em] text-white/95 uppercase bg-[#ffb703]/10 backdrop-blur-md px-4 py-2.5 border-l-4 border-accent inline-block mt-6 rounded-r-xl shadow-inner shadow-white/5">
                    {websiteContent?.heroSubheader || "English Medium Boarding School"}
                  </span>
                </div>

                <h1 className="text-3xl md:text-7xl font-extrabold text-white leading-[0.95] tracking-tight mb-8">
                  Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white italic">Young Minds.</span>
                </h1>
                
                <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl leading-relaxed font-semibold">
                  {websiteContent?.heroDesc || "Providing a world-class English medium foundation for children from Nursery to Grade 7 with a focus on holistic development, modern digital tools, and deep character building."}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4.5">
                  <Link to="/admissions" className="bg-[#ffb703] hover:bg-accent hover:scale-[1.03] text-[#0d2c54] px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-accent/10 hover:shadow-accent/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3">
                    Start Admission <ArrowRight size={16} />
                  </Link>
                  <Link to="/gallery" className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-10 py-5 rounded-2xl font-black uppercase text-xs text-white hover:border-white/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3">
                    Virtual School Tour <Play size={15} className="fill-current text-[#ffb703]" />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Hero Column: Premium Interactive Showcase */}
            <div className="lg:col-span-12 xl:col-span-5 hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-accent/10 rounded-[48px] blur-3xl opacity-60"></div>
                <div className="relative flex flex-col bg-[#0d2c54]/25 backdrop-blur-md rounded-[48px] overflow-hidden border border-white/10 shadow-3xl p-4">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-[36px]">
                    <img 
                      src={websiteContent?.spotlightPhoto || techlearningUrl} 
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop"; }} 
                      className="w-full h-full object-cover filter brightness-95" 
                      alt="Campus Interactive Learning"
                    />
                  </div>
                  <div className="mt-5 p-6 bg-black/15 rounded-[28px] border border-white/5 text-left">
                    <span className="inline-block bg-[#ffb703]/25 text-[#ffb703] border border-[#ffb703]/35 px-2.5 py-1 rounded-lg text-[8.5px] font-black uppercase tracking-[0.2em] mb-2 shadow-sm">
                      {websiteContent?.spotlightTag || "Learning Spotlight"}
                    </span>
                    <h4 className="text-white text-base md:text-lg font-black tracking-tight leading-snug">{websiteContent?.spotlightTitle || "Empowering with Modern Technology Integration"}</h4>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Standalone Quick Highlights Cards (No Images, Fully Responsive, No Overlap) */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#001021] to-[#041324] relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Card 1: Secure School */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="group relative bg-[#0d2c54]/45 backdrop-blur-md rounded-[32px] p-8 md:p-10 border border-white/10 hover:border-accent/40 hover:bg-[#0d2c54]/70 transition-all duration-500 shadow-premium hover:shadow-glow flex gap-6 text-left overflow-hidden"
            >
              {/* Left Accent Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#0d2c54] group-hover:h-full transition-all duration-500"></div>

              {/* Huge elegant serial number */}
              <span className="absolute right-8 bottom-4 text-5xl md:text-6xl font-mono font-black text-white/5 select-none pointer-events-none group-hover:scale-110 group-hover:text-accent/10 transition-all duration-500">
                01
              </span>

              <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#0d2c54]/40 flex items-center justify-center text-[#ffb703] shrink-0 border border-white/10 shadow-sm group-hover:bg-[#0d2c54] group-hover:text-white transition-all duration-500">
                <Shield size={24} className="stroke-[2.5]" />
              </div>
              
              <div className="relative z-10">
                <span className="text-[9px] font-black tracking-[0.2em] text-[#ffb703]/75 uppercase block mb-1.5">
                  Absolute Safety
                </span>
                <h4 className="text-xl font-black text-white tracking-tight mb-2 group-hover:text-accent transition-colors leading-tight italic">
                  Secure School
                </h4>
                <p className="text-white/70 text-xs md:text-sm font-semibold leading-relaxed">
                  24/7 CCTV & Security Monitoring
                </p>
              </div>
            </motion.div>

            {/* Card 2: Smart Classes */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="group relative bg-[#0d2c54]/45 backdrop-blur-md rounded-[32px] p-8 md:p-10 border border-white/10 hover:border-accent/40 hover:bg-[#0d2c54]/70 transition-all duration-500 shadow-premium hover:shadow-glow flex gap-6 text-left overflow-hidden"
            >
              {/* Left Accent Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-accent group-hover:h-full transition-all duration-500"></div>

              {/* Huge elegant serial number */}
              <span className="absolute right-8 bottom-4 text-5xl md:text-6xl font-mono font-black text-white/5 select-none pointer-events-none group-hover:scale-110 group-hover:text-accent/10 transition-all duration-500">
                02
              </span>

              <div className="relative z-10 w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-[#ffb703] shrink-0 border border-accent/20 shadow-sm group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                <Sparkles size={24} className="stroke-[2.5]" />
              </div>
              
              <div className="relative z-10">
                <span className="text-[9px] font-black tracking-[0.2em] text-[#ffb703]/75 uppercase block mb-1.5">
                  Modern Pedagogy
                </span>
                <h4 className="text-xl font-black text-white tracking-tight mb-2 group-hover:text-accent transition-colors leading-tight italic">
                  Smart Classes
                </h4>
                <p className="text-white/70 text-xs md:text-sm font-semibold leading-relaxed">
                  Interactive Audiovisual Education
                </p>
              </div>
            </motion.div>

            {/* Card 3: Expert Teachers */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="group relative bg-[#0d2c54]/45 backdrop-blur-md rounded-[32px] p-8 md:p-10 border border-white/10 hover:border-accent/40 hover:bg-[#0d2c54]/70 transition-all duration-500 shadow-premium hover:shadow-glow flex gap-6 text-left overflow-hidden"
            >
              {/* Left Accent Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#005cbb] group-hover:h-full transition-all duration-500"></div>

              {/* Huge elegant serial number */}
              <span className="absolute right-8 bottom-4 text-5xl md:text-6xl font-mono font-black text-white/5 select-none pointer-events-none group-hover:scale-110 group-hover:text-[#005cbb]/10 transition-all duration-500">
                03
              </span>

              <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#005cbb]/10 flex items-center justify-center text-[#005cbb] shrink-0 border border-[#005cbb]/25 shadow-sm group-hover:bg-[#005cbb] group-hover:text-white transition-all duration-500">
                <Users size={24} className="stroke-[2.5]" />
              </div>
              
              <div className="relative z-10">
                <span className="text-[9px] font-black tracking-[0.2em] text-[#005cbb]/75 uppercase block mb-1.5">
                  Direct Guidance
                </span>
                <h4 className="text-xl font-black text-white tracking-tight mb-2 group-hover:text-accent transition-colors leading-tight italic">
                  Expert Teachers
                </h4>
                <p className="text-white/70 text-xs md:text-sm font-semibold leading-relaxed">
                  1:10 Teacher-Student Ratio
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

       {/* Featured visual section: Why Choose Us */}
      <section className="py-24 md:py-32 bg-transparent relative overflow-hidden">
        {/* Decorative dynamic ambient circle */}
        <div className="absolute top-1/4 -left-36 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-36 w-96 h-96 bg-[#005cbb]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader 
            badge="EXCELLENCE SYSTEM"
            title="Why New Concept is Unique"
            desc="We don't just teach subjects; we architect futures with a blend of regional values and global innovation."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {(() => {
              const defaultFeatures = [
                {
                  id: "feat-1",
                  img: uniqueFeatureUrl,
                  localName: "unique_feature.jpg",
                  title: "Holistic Environment",
                  desc: "Our School is designed to inspire creativity, with open spaces and modern courses."
                },
                {
                  id: "feat-2",
                  img: techlearningUrl,
                  localName: "tech_learning.jpg",
                  title: "Tech-Infused Learning",
                  desc: "Students use computer and smart boards to grasp complex concepts through visualization."
                },
                {
                  id: "feat-3",
                  img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2040&auto=format&fit=crop",
                  localName: "moral_integrity.jpg",
                  title: "Moral Integrity",
                  desc: "We instill core human values and ethics to ensure our students grow into responsible citizens."
                },
                {
                  id: "feat-4",
                  img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2040&auto=format&fit=crop",
                  localName: "cctv_secured.jpg",
                  title: "CCTV Secured Campus",
                  desc: "24/7 high-definition smart camera surveillance and active security protocols across every corner."
                },
                {
                  id: "feat-5",
                  img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
                  localName: "safe_transport.jpg",
                  title: "GPS-Tracked Transport",
                  desc: "Comfortable and secure school transport covering primary routes with real-time tracking support."
                },
                {
                  id: "feat-6",
                  img: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=2070&auto=format&fit=crop",
                  localName: "sports_wellness.jpg",
                  title: "Elite Sports & Wellness",
                  desc: "Ample playground with training facilities to develop sportsmanship, fitness, and team synergy."
                }
              ];

              const currentFeatures = (websiteContent?.features && websiteContent.features.length > 0)
                ? websiteContent.features
                : defaultFeatures;

              return currentFeatures.map((item, i) => (
                <motion.div 
                  key={item.id || i}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative h-[450px] md:h-[530px] rounded-[36px] overflow-hidden shadow-premium hover:shadow-glow border border-white/10 outline outline-4 outline-white/5 hover:border-accent/40 hover:outline-accent/10 transition-all duration-500 flex flex-col justify-end"
                >
                  {/* Full-height background image viewable fully */}
                  <LocalImg 
                    localName={item.localName || ""} 
                    fallback={item.img} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s] ease-out" 
                    alt={item.title} 
                  />

                  {/* Rich double visual gradient for optimal contrast readouts */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none group-hover:from-black/95 transition-all duration-300"></div>

                  {/* Text overlay box */}
                  <div className="relative p-6 md:p-8 text-left w-full mt-auto transition-colors duration-300">
                    <span className="inline-block bg-accent text-primary px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.18em] mb-4.5 shadow-md">
                        Academic Core
                    </span>
                    <h4 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight block drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                       {item.title}
                    </h4>
                    <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-6 font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                       {item.desc}
                    </p>
                    <div>
                      <Link to="/about" className="inline-flex items-center gap-2 text-accent hover:text-white text-xs font-black uppercase tracking-widest group/btn transition-all duration-300">
                       Explore Curriculum <ArrowRight size={13} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Visual Activity Timeline on Home */}
      <section className="py-32 bg-light-bg">
        <div className="container mx-auto px-4">
          <SectionHeader 
            badge="Life at NCEMBS"
            title="Experience The Daily Journey"
            desc="Take a visual walk-through of a standard productive day at New Concept."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {(Array.isArray(websiteContent?.timelineEvents) && websiteContent.timelineEvents.length > 0
               ? websiteContent.timelineEvents
               : [
                 { time: "09:30 AM", event: "Morning Assembly", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop", localName: "assembly.jpg" },
                 { time: "11:00 AM", event: "Smart Class Labs", img: smartclasslabUrl, localName: "science_lab.jpg" },
                 { time: "01:00 PM", event: "Healthy Lunch Break", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=2048&auto=format&fit=crop", localName: "healthy_lunch.jpg" },
                 { time: "02:30 PM", event: "Co-Curricular Clubs", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop", localName: "curricular_clubs.jpg" }
               ]
             ).map((node: any, i: number) => (
               <div key={node.id || i} className="group bg-[#0d2c54]/45 backdrop-blur-md rounded-[36px] overflow-hidden border border-white/10 hover:border-accent/40 hover:bg-[#0d2c54]/70 transition-all duration-500 shadow-premium hover:shadow-glow flex flex-col">
                 <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 shrink-0">
                   <LocalImg localName={node.localName || ""} fallback={node.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[0.8s]" alt={node.event} />
                 </div>
                 <div className="p-5 flex flex-col text-left">
                   <span className="inline-block self-start bg-accent/20 border border-accent/40 text-accent px-3 py-1 rounded-lg text-[8.5px] font-black uppercase tracking-widest mb-2.5 shadow-sm">
                     {node.time}
                   </span>
                   <h5 className="text-white group-hover:text-accent transition-colors font-black text-base tracking-tight leading-tight">{node.event}</h5>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Principal Desk visual section integrated - more professional */}
      <section className="py-20 md:py-32 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="bg-[#0d2c54]/45 backdrop-blur-md border border-white/10 rounded-[40px] md:rounded-[60px] p-8 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center shadow-3xl text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -mr-40 -mt-40 hidden md:block"></div>
             
             <div className="relative">
               <div className="bg-white/5 rounded-3xl md:rounded-[40px] overflow-hidden border border-white/10 relative p-3 md:p-4 group flex flex-col">
                 <div className="relative aspect-square overflow-hidden rounded-2xl md:rounded-[30px] bg-slate-800">
                   <img 
                    src={websiteContent?.principalPhoto || "/images/principal.jpg"} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = principalPortraitUrl; }} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                    alt="Principal" 
                   />
                 </div>
                 <div className="mt-4 p-5 md:p-6 bg-black/40 rounded-2xl md:rounded-[30px] border border-white/10 text-left">
                    <h3 className="text-xl md:text-2xl font-black mb-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(124,58,237,0.35)] leading-tight">{websiteContent?.principalName || "Mr. Kaushlendra Giri"}</h3>
                    <span className="inline-block bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-3 py-1 rounded-xl text-accent font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-inner">
                      {websiteContent?.principalRole || "Academic Excellence Lead"}
                    </span>
                 </div>
               </div>
             </div>

             <div className="relative">
               <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] mb-6 md:mb-8 block">Leader's Vision</span>
               <h2 className="text-3xl md:text-6xl font-black mb-8 md:mb-10 tracking-tighter leading-tight italic">
                 "{websiteContent?.principalQuote || "Our Vision Is To Build Character Before Carriers."}"
                 

               </h2>
               <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-xl mb-10 md:mb-12">
                 {websiteContent?.principalBio || "At New Concept, we believe every child is a potential masterpiece. Our goal is to provide the canvas, the colors, and the technique to let their inner brilliance shine brightly in the heart of Madhesh."}
               </p>
               <div className="flex bg-white/5 p-5 md:p-6 rounded-2xl md:rounded-3xl items-center gap-4 md:gap-6 border border-white/10">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent text-primary flex items-center justify-center shrink-0">
                    <MessageSquare size={24} className="md:w-7 md:h-7" />
                 </div>
                 <p className="text-[11px] md:text-xs font-bold leading-relaxed italic text-white/70">
                    "{websiteContent?.principalStat || "Ranked #1 for basic education institutional standards in Ekdara block for 3 consecutive years."}"
                 </p>
               </div>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
};

// --- ADMISSIONS PAGE ---
const Admissions = () => {
    const [feeTab, setFeeTab] = useState<"monthly" | "yearly">("monthly");
    const [submitted, setSubmitted] = useState(false);
    const { fees, monthlyFeeCategories = [], yearlyFeeCategories = [], loading, submitAdmissionRequest, websiteContent } = useSchoolData();

    // Helper to beautifully format category database keys for table column headings
    const formatFeeKey = (key: string) => {
        if (key === "monthlyFee") return "Monthly Fee";
        if (key === "computerFee") return "Computer Lab";
        if (key === "transportationFee") return "Transportation Fee";
        if (key === "admissionFee") return "Admission Fee";
        if (key === "examFee") return "Exam Fee";
        if (key === "miscFee") return "Other Fees";
        const result = key
            .replace(/([a-zA-Z])([0-9]+)/g, "$1 $2")
            .replace(/([A-Z])/g, " $1")
            .replace(/\s+/g, " ")
            .trim();
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    // Form states
    const [studentName, setStudentName] = useState("");
    const [targetClass, setTargetClass] = useState("Nursery");
    const [guardianContact, setGuardianContact] = useState("");
    const [address, setAddress] = useState("");
    const [previousSchool, setPreviousSchool] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Optional Attachments states
    const [birthCertificate, setBirthCertificate] = useState<string>("");
    const [studentPhoto, setStudentPhoto] = useState<string>("");
    const [birthCertificateName, setBirthCertificateName] = useState<string>("");
    const [studentPhotoName, setStudentPhotoName] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "cert" | "photo") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isPdf = file.type === "application/pdf";
        const isImage = file.type.startsWith("image/");

        if (type === "cert" && !isPdf && !isImage) {
            alert("Only secure PDF or Images can be uploaded for Birth Certificate!");
            return;
        }
        if (type === "photo" && !isImage) {
            alert("Only safe Images can be uploaded for Student Picture!");
            return;
        }

        if (file.size > 15 * 1024 * 1024) {
            alert("File too large! Strict security limit is 15MB.");
            return;
        }

        if (type === "cert") {
            setBirthCertificateName(file.name);
        } else {
            setStudentPhotoName(file.name);
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            if (type === "cert") {
                setBirthCertificate(base64String);
            } else {
                setStudentPhoto(base64String);
            }
        };
        reader.readAsDataURL(file);
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSubmitting(true);
        try {
            const success = await submitAdmissionRequest({
                studentName,
                targetClass,
                guardianContact,
                address,
                previousSchool,
                birthCertificate: birthCertificate || undefined,
                studentPhoto: studentPhoto || undefined
            });
            if (success) {
                setSubmitted(true);
                setStudentName("");
                setTargetClass("Nursery");
                setGuardianContact("");
                setAddress("");
                setPreviousSchool("");
                setBirthCertificate("");
                setStudentPhoto("");
                setBirthCertificateName("");
                setStudentPhotoName("");
            } else {
                setErrorMessage("Your upload may have failed validation. Make sure your files are safe and run standard PDFs or pictures.");
            }
        } catch (err: any) {
            setErrorMessage("An error occurred: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="pt-10 bg-[#030c17]">
            <section className="bg-primary pt-28 pb-52 text-white text-center relative overflow-hidden">
                {/* Decorative dynamic ambient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0c233f] via-primary to-[#0d2c54]/95"></div>
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="bg-accent text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 inline-block shadow-lg border border-accent/20">
                            Academic Intake Active
                        </span>
                        <h1 className="text-4xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.95] italic">
                            Secure Their <br /><span className="text-white/40">Future Growth.</span>
                        </h1>
                        <p className="text-white/70 max-w-xl mx-auto text-base md:text-lg mb-0 font-medium leading-relaxed">
                            Submit your inquiry today to join the most competitive basic-level institutional community in Mahottari.
                        </p>
                    </motion.div>
                </div>
                <div className="absolute top-0 right-0 opacity-5 -mr-40 -mt-40 z-0 pointer-events-none">
                  <GraduationCap size={600} />
                </div>
            </section>

            <section className="container mx-auto px-4 -mt-36 relative z-10 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                   {/* Left: Interactive Info */}
                   <div className="lg:col-span-5 space-y-8">
                      <div className="bg-[#0c233f]/40 backdrop-blur-md p-10 md:p-12 rounded-[36px] border border-white/10 outline outline-4 outline-white/5 shadow-premium relative overflow-hidden text-left">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full pointer-events-none"></div>
                         <h3 className="text-2xl font-black text-white mb-12 flex items-center gap-4 italic tracking-tight">
                            <Sparkles className="text-accent" /> Admission Pillars
                         </h3>
                         <div className="space-y-10">
                            {[
                                { title: "Holistic Entrance Assessment", desc: "Interactive session for student aptitude identification and customized batching.", color: "bg-[#005cbb]" },
                                { title: "Lateral Sibling Priority", desc: "Structured dynamic enrollment priority for siblings of currently active students.", color: "bg-accent" },
                                { title: "Transparent Selection Ledger", desc: "Purely merit-guided selection indexes with document trace transparency.", color: "bg-emerald-500" }
                            ].map((p, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className={cn("w-[5px] h-auto rounded-full shrink-0", p.color)}></div>
                                    <div>
                                        <h4 className="font-black text-white group-hover:text-accent transition-colors mb-1.5 text-lg leading-snug">{p.title}</h4>
                                        <p className="text-white/60 text-xs md:text-sm font-semibold leading-relaxed">{p.desc}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-primary p-10 md:p-12 rounded-[36px] shadow-deep text-white border border-white/5 relative group overflow-hidden text-left">
                         <img src={websiteContent?.admissionsBgPhoto || "/images/admissions_bg.jpg"} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2132&auto=format&fit=crop"; }} className="absolute inset-0 w-full h-full object-cover opacity-15 filter grayscale hover:scale-105 transition-transform duration-1000" alt="Support" />
                         <div className="relative z-10">
                            <h4 className="text-xl font-black mb-5 italic text-accent uppercase tracking-wider">Need Direct Assistance?</h4>
                            <p className="text-white/70 text-sm mb-10 leading-relaxed font-semibold">Our outreach admission desk is active 10:00 AM - 04:00 PM (Sun-Fri) for parent registration help.</p>
                            <div className="flex gap-4">
                                <a href={`tel:${(websiteContent?.schoolPhone || "+9779817681582").split(/[,/]/)[0].trim()}`} className="w-14 h-14 bg-white/10 hover:bg-accent hover:text-primary rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/10" title="Call directly"><Phone size={22} /></a>
                                <a href={`mailto:${websiteContent?.schoolEmail || "info@NCEMBS.edu.np"}`} className="w-14 h-14 bg-white/10 hover:bg-accent hover:text-primary rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/10" title="Mail directly"><Mail size={22} /></a>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Right: Modern Inquiry Intake Terminal */}
                   <div className="lg:col-span-7">
                      <div className="bg-[#0c233f]/40 backdrop-blur-md p-8 md:p-16 rounded-[36px] border border-white/10 outline outline-4 outline-white/5 shadow-premium relative overflow-hidden text-left text-white">
                        {submitted ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 text-white shadow-xl shadow-emerald-500/20">
                                    <ShieldCheck size={48} />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-primary mb-5 tracking-tighter italic">Inquiry Dispatched!</h2>
                                <p className="text-primary/60 text-base max-w-sm mx-auto font-semibold leading-relaxed">An admission officer will reach out to your provided contact numbers within 24 operational hours.</p>
                                <button onClick={() => setSubmitted(false)} className="mt-12 bg-accent text-primary px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all duration-300">Send Another Inquiry</button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="mb-14">
                                    <h2 className="text-3xl font-black text-white mb-3 italic tracking-tight">Intake Inquiry Registry</h2>
                                    <p className="text-accent font-black text-xs uppercase tracking-[0.2em]">Fill carefully for document validation</p>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-8 font-semibold text-white/90">
                                    {errorMessage && (
                                        <div className="p-5 rounded-2xl bg-red-50 text-red-600 font-bold text-xs border border-red-100">
                                            {errorMessage}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-accent/90 ml-4">Student Full Name</label>
                                            <input
                                                type="text"
                                                value={studentName}
                                                onChange={(e) => setStudentName(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4.5 focus:bg-white/15 focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-bold text-white placeholder-white/40 focus:outline-none"
                                                placeholder="e.g. Rahul Kumar Shah"
                                                required
                                                disabled={submitting}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-accent/90 ml-4">Target Class</label>
                                            <div className="relative">
                                                <select
                                                    value={targetClass}
                                                    onChange={(e) => setTargetClass(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4.5 focus:bg-white/15 focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-bold text-white placeholder-white/40 focus:outline-none appearance-none focus:text-white"
                                                    disabled={submitting}
                                                >
                                                    {['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'].map(cls => <option key={cls} className="bg-[#041424] text-white" value={cls}>{cls}</option>)}
                                                </select>
                                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-primary/40">
                                                    <ChevronRight className="rotate-90" size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-accent/90 ml-4">Guardian Contact</label>
                                            <input
                                                type="tel"
                                                value={guardianContact}
                                                onChange={(e) => setGuardianContact(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4.5 focus:bg-white/15 focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-bold text-white placeholder-white/40 focus:outline-none"
                                                placeholder="+977-XXXXXXXXXX"
                                                required
                                                disabled={submitting}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-accent/90 ml-4">Address</label>
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4.5 focus:bg-white/15 focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-bold text-white placeholder-white/40 focus:outline-none"
                                                placeholder="e.g. Baheda, Ekdara"
                                                required
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-accent/90 ml-4">Previous Institution (If Any)</label>
                                        <input
                                            type="text"
                                            value={previousSchool}
                                            onChange={(e) => setPreviousSchool(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4.5 focus:bg-white/15 focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-bold text-white placeholder-white/40 focus:outline-none"
                                            placeholder="Previous School name / Self-study"
                                            disabled={submitting}
                                        />
                                    </div>
                                    
                                    {/* Optional Birth Certificate & Passport Photo Inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-accent/90 ml-4">
                                                Birth Certificate (PDF/Image) - <span className="text-white/40 font-bold lowercase italic">Optional</span>
                                            </label>
                                            <div className="relative border border-dashed border-white/20 rounded-2xl p-4.5 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[96px] text-center">
                                                <input
                                                    type="file"
                                                    accept=".pdf,image/*"
                                                    onChange={(e) => handleFileChange(e, "cert")}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    disabled={submitting}
                                                />
                                                <div>
                                                    <FileText className="mx-auto text-accent mb-2" size={20} />
                                                    <span className="block text-xs font-bold text-white/80 truncate max-w-[200px]">
                                                        {birthCertificateName ? birthCertificateName : "Upload Birth Certificate"}
                                                    </span>
                                                    <span className="block text-[9px] text-white/40 mt-1">PDF or image, max 15MB</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-accent/90 ml-4">
                                                Student Picture - <span className="text-white/40 font-bold lowercase italic">Optional</span>
                                            </label>
                                            <div className="relative border border-dashed border-white/20 rounded-2xl p-4.5 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[96px] text-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, "photo")}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    disabled={submitting}
                                                />
                                                <div>
                                                    {studentPhoto ? (
                                                        <img src={studentPhoto} className="w-9 h-9 object-cover rounded-full mx-auto mb-1 border border-accent" alt="Preview" />
                                                    ) : (
                                                        <Camera className="mx-auto text-accent mb-2" size={20} />
                                                    )}
                                                    <span className="block text-xs font-bold text-white/80 truncate max-w-[200px]">
                                                        {studentPhotoName ? studentPhotoName : "Upload Passport Photo"}
                                                    </span>
                                                    <span className="block text-[9px] text-white/40 mt-1">JPEG/PNG/WEBP, max 15MB</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-xs hover:bg-[#0c233f] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 shadow-premium"
                                    >
                                        {submitting ? "Sending Inquiry..." : "Validate & Submit Inquiry"}{" "}
                                        <ArrowRight className="text-accent" size={16} />
                                    </button>
                                </form>
                            </>
                        )}
                      </div>
                   </div>
                </div>
            </section>

            {/* FEE STRUCTURE SECTION */}
            <section className="bg-transparent py-24 border-t border-white/10">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <span className="text-[9px] bg-white/5 border border-white/10 text-accent px-5 py-1.5 rounded-full font-black uppercase tracking-[0.2em] inline-block shadow-md">
                            Academic Finance Office
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white mt-6 tracking-tight italic">Fee Schedule & Tuition Register</h2>
                        <span className="w-16 h-1 bg-gradient-to-r from-accent to-white mx-auto block mt-6 rounded-full" />
                        <p className="text-white/70 text-sm md:text-base font-semibold mt-6 max-w-xl mx-auto leading-relaxed antialiased">
                            No hidden charges or unexpected school bills. Real-time transparent fee records validated on the official school ledger.
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto bg-[#0c233f]/40 backdrop-blur-md rounded-[32px] border border-white/10 outline outline-4 outline-white/5 shadow-premium overflow-hidden">
                        {loading ? (
                            <div className="p-24 text-center text-primary/40 font-bold text-sm flex flex-col items-center justify-center gap-4">
                                <div className="animate-spin w-8 h-8 rounded-full border-4 border-accent border-t-primary"></div>
                                Retrieving active tariff indices...
                            </div>
                        ) : !fees || fees.length === 0 ? (
                            <div className="p-24 text-center text-primary/40 font-bold text-sm">
                                Fee schedules are undergoing yearly administration revisions. Please check back soon or consult offline admissions details.
                            </div>
                        ) : (
                            <>
                                {/* Fee Tabs */}
                                <div className="flex border-b border-white/10 bg-[#0d2c54]/50 p-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFeeTab("monthly")}
                                        className={`flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                            feeTab === "monthly"
                                                ? "bg-accent text-[#0d2c54] shadow-md"
                                                : "text-white/70 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        Monthly Wise Fees
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFeeTab("yearly")}
                                        className={`flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                            feeTab === "yearly"
                                                ? "bg-accent text-[#0d2c54] shadow-md"
                                                : "text-white/70 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        Yearly / One-Time Fees
                                    </button>
                                </div>

                                {/* Unified Compact Responsive Ledger Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead>
                                            {feeTab === "monthly" ? (
                                                <tr className="bg-[#0d2c54] text-white text-[9.5px] font-black uppercase tracking-wider border-none">
                                                    <th className="p-5 text-center bg-[#0a2343]">Class Name</th>
                                                    {monthlyFeeCategories.map((cat) => (
                                                        <th key={cat} className="p-4 text-right">{formatFeeKey(cat)}</th>
                                                    ))}
                                                    <th className="p-5 text-right bg-accent text-primary">Monthly Total</th>
                                                </tr>
                                            ) : (
                                                <tr className="bg-[#0d2c54] text-white text-[9.5px] font-black uppercase tracking-wider border-none">
                                                    <th className="p-5 text-center bg-[#0a2343]">Class Name</th>
                                                    {yearlyFeeCategories.map((cat) => (
                                                        <th key={cat} className="p-4 text-right">{formatFeeKey(cat)}</th>
                                                    ))}
                                                    <th className="p-5 text-right bg-accent text-primary">Yearly / Session Total</th>
                                                </tr>
                                            )}
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-xs font-semibold text-white/80">
                                            {fees.map((f, i) => {
                                                const monthlyTotal = monthlyFeeCategories.reduce(
                                                    (total, cat) => total + (Number(f[cat]) || 0), 
                                                    0
                                                );
                                                const yearlyTotal = yearlyFeeCategories.reduce(
                                                    (total, cat) => total + (Number(f[cat]) || 0), 
                                                    0
                                                );

                                                return (
                                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                                        <td className="p-5 font-black uppercase tracking-tight text-white text-center bg-white/5 min-w-[90px] italic border-r border-[#0d2c54]">{f.className}</td>
                                                        {feeTab === "monthly" ? (
                                                            <>
                                                                {monthlyFeeCategories.map((cat, ci) => (
                                                                    <td key={cat} className={`p-4 text-right ${ci === monthlyFeeCategories.length - 1 ? 'border-r border-white/10' : ''}`}>
                                                                        Rs. {(Number(f[cat]) || 0).toLocaleString()}
                                                                    </td>
                                                                ))}
                                                                <td className="p-5 text-right bg-accent/20 text-accent font-black font-mono">Rs. {monthlyTotal.toLocaleString()}</td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {yearlyFeeCategories.map((cat, ci) => (
                                                                    <td key={cat} className={`p-4 text-right ${ci === yearlyFeeCategories.length - 1 ? 'border-r border-white/10' : ''}`}>
                                                                        Rs. {(Number(f[cat]) || 0).toLocaleString()}
                                                                    </td>
                                                                ))}
                                                                <td className="p-5 text-right bg-accent/20 text-accent font-black font-mono">Rs. {yearlyTotal.toLocaleString()}</td>
                                                            </>
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                        <div className="p-8 md:p-12 bg-white/5 border-t border-white/10 text-center text-[10px] font-bold text-white/50 uppercase tracking-widest">
                            * Exam fees are structured per terminal schedule. Books and uniform expenditures are calculated separately at local stationery indices.
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

// --- ACADEMICS PAGE UPDATE ---
const Academics = () => {
    const { websiteContent } = useSchoolData();
    const defaultClasses = [
        { name: "Nursery", img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=2070&auto=format&fit=crop", localName: "class_nursery.jpg", desc: "The beginning of a beautiful journey. We focus on play-based motor skill development and sensory learning.", focus: ["Cognitive Play", "Social Interaction", "Art & Music"] },
        { name: "LKG & UKG", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop", localName: "class_lkg_ukg.jpg", desc: "Preparing young minds for formal education with phonetic sounds, elementary counting, and etiquette.", focus: ["Early Literacy", "Numerical Foundation", "Team Building"] },
        { name: "Grade 1 - 3", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop", localName: "class_grade1_3.jpg", desc: "Core conceptual learning in English, Maths, and Social Science through project-based teaching methodologies.", focus: ["Reading Fluency", "Logical Math", "Cultural Studies"] },
        { name: "Grade 4 - 5", img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop", localName: "class_grade4_5.jpg", desc: "Transitioning into advanced analytical thinking and environmental awareness in preparation for upper-primary.", focus: ["Complex Sci-Inquiry", "Grammar Mastery", "Social Responsibility"] },
        { name: "Grade 6 - 7", img: "https://images.unsplash.com/photo-1524178232363-1fb28f74b0ed?q=80&w=2070&auto=format&fit=crop", localName: "class_grade6_7.jpg", desc: "Transitioning into advanced analytical thinking, computer applications, and digital literacy to face lower-secondary challenges.", focus: ["Advanced Mathematics", "Technology Basics", "Leadership & Civic Sense"] }
    ];

    const classes = websiteContent?.coursePrograms && websiteContent.coursePrograms.length > 0
        ? websiteContent.coursePrograms
        : defaultClasses;

    const getFocusArray = (focusVal: any): string[] => {
        if (Array.isArray(focusVal)) return focusVal;
        if (typeof focusVal === "string") {
            return focusVal.split(",").map(item => item.trim()).filter(Boolean);
        }
        return [];
    };

    return (
        <main className="pt-10 bg-[#030c17]">
            <section className="bg-primary py-24 md:py-32 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0c233f] via-primary to-primary"></div>
                <div className="absolute -top-12 -right-12 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-4xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic leading-none">
                            Curriculum <br /><span className="text-accent underline decoration-white/10 decoration-8 underline-offset-10">Spectrum.</span>
                        </h1>
                        <p className="text-white/50 max-w-xl mx-auto font-black uppercase tracking-[0.25em] text-[10px] md:text-xs">
                            Specialized Foundation for Nursery to Grade 7
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 md:py-32 bg-transparent relative z-10">
                <div className="container mx-auto px-4">
                    <SectionHeader 
                        badge="Academic Architecture"
                        title="Nurturing Brilliance Step-by-Step"
                        desc="Detailed breakdown of how we structure our basic level teaching for young scholars."
                        centered
                    />

                    <div className="space-y-24 md:space-y-36">
                        {classes.map((cls, i) => {
                            const focusItems = getFocusArray(cls.focus);
                            const imgSrc = cls.img || (cls.localName ? `/images/${cls.localName}` : "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop");
                            return (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 35 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                    className={cn(
                                        "flex flex-col lg:flex-row items-center gap-12 md:gap-24",
                                        i % 2 !== 0 && "lg:flex-row-reverse"
                                    )}
                                >
                                    <div className="w-full lg:w-1/2 relative group">
                                        <div className="absolute -inset-2 md:-inset-4 bg-accent/20 rounded-3xl md:rounded-[50px] blur-2xl md:blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                                        <div className="relative aspect-video bg-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-premium border border-white/10 outline outline-4 outline-white/5 group-hover:outline-accent/10 group-hover:border-accent/30 transition-all duration-500">
                                            <LocalImg localName={cls.localName} fallback={imgSrc} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={cls.name || ""} />
                                            <div className="absolute top-4 left-4 md:top-6 md:left-6">
                                                <div className="bg-primary/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] shadow-lg">
                                                    NC-ACADEMICS-{i+1}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-left">
                                        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic">{cls.name} <span className="text-accent">.</span></h3>
                                        <p className="text-base md:text-lg text-white/70 leading-relaxed font-semibold">{cls.desc}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {focusItems.map((f, fi) => (
                                                <div key={fi} className="flex items-center gap-3 bg-[#0d2c54]/45 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-accent/40 hover:bg-[#0d2c54]/70 transition-all duration-300 group">
                                                    <div className="w-2 h-2 rounded-full bg-accent shrink-0"></div>
                                                    <span className="text-[10.5px] font-black uppercase tracking-wider text-white group-hover:text-accent transition-colors">{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
};

// --- GALLERY PAGE UPDATE ---
const Gallery = () => {
    const { websiteContent } = useSchoolData();
    const defaultPhotos = [
        { src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop", localName: "gallery1.jpg", title: "Smart Science Lab", desc: "Advanced laboratory setup for basic experimentation and conceptual research." },
        { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop", localName: "gallery2.jpg", title: "Morning Assembly", desc: "Inculcating discipline and national pride through daily prayers and updates." },
        { src: "https://images.unsplash.com/photo-1524178232363-1fb28f74b0ed?q=80&w=2070&auto=format&fit=crop", localName: "gallery3.jpg", title: "ICT Learning Hub", desc: "Where students interact with digital worlds and coding fundamentals." },
        { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop", localName: "gallery4.jpg", title: "Cultural Festival", desc: "Celebrating the vibrant heritage of Madhesh through art, dance, and music." },
        { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2132&auto=format&fit=crop", localName: "gallery5.jpg", title: "Sports Pavilion", desc: "Promoting physical wellness and competitive spirit in athletics." },
        { src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2070&auto=format&fit=crop", localName: "gallery6.jpg", title: "Play Area", desc: "Safe and modern recreational spaces for Nursery and Kindergarten scholars." }
    ];

    const photos = (websiteContent?.galleryPhotos && websiteContent.galleryPhotos.length > 0)
        ? websiteContent.galleryPhotos.map((photo) => ({
            src: photo.url,
            localName: "custom-gallery-photo",
            title: photo.title || "School Activity",
            desc: photo.desc || photo.category || "Celebration Photo"
          }))
        : defaultPhotos;

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [headerBgIndex, setHeaderBgIndex] = useState<number>(0);

    // Auto-advance header background slideshow every 5 seconds (5000ms)
    useEffect(() => {
        const interval = setInterval(() => {
            setHeaderBgIndex((prev) => (prev + 1) % photos.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [photos.length]);

    // Auto-advance slideshow
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isPlaying && activeIndex !== null) {
            interval = setInterval(() => {
                setActiveIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
            }, 3000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, activeIndex, photos.length]);

    const handleNext = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setActiveIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
    };

    const handlePrev = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setActiveIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
    };

    const handleClose = () => {
        setActiveIndex(null);
        setIsPlaying(false);
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeIndex === null) return;
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeIndex]);

    return (
        <main className="pt-10">
            <section className="bg-primary pt-24 pb-48 text-white text-center relative overflow-hidden">
                {/* Header background slideshow with AnimatePresence */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={headerBgIndex}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 0.25, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <img 
                                src={`/images/${photos[headerBgIndex].localName}`} 
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = photos[headerBgIndex].src; }} 
                                alt="Slideshow Background" 
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>
                    {/* Atmospheric shade overlays to guarantee superb text contrast and blend seamlessly with school branding */}
                    <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/80 via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="bg-accent text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 inline-block shadow-xl">Visual Chronicles</span>
                        <h1 className="text-4xl md:text-8xl font-black mb-6 uppercase tracking-tighter italic">Photo <br /><span className="text-white/40">Archives.</span></h1>
                        <p className="text-white/60 max-w-xl mx-auto text-base md:text-lg font-medium">A window into the vibrant life, activities, and achievements of our young scholars.</p>
                    </motion.div>
                </div>
                <div className="absolute top-0 right-0 opacity-5 -mr-20 -mt-20 z-10 pointer-events-none">
                    <Camera size={500} />
                </div>
            </section>

            <section className="py-24 bg-white -mt-32 relative z-10 container mx-auto px-4">
                <div className="bg-white p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-3xl border border-light-bg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {photos.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                onClick={() => setActiveIndex(i)}
                                className="group bg-white rounded-[40px] overflow-hidden shadow-lg hover:shadow-2xl border border-light-bg cursor-pointer flex flex-col transition-all duration-300"
                            >
                                 <div className="relative aspect-[4/3] overflow-hidden bg-white/5 shrink-0">
                                      <img src={`/images/${item.localName}`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = item.src; }} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                      {/* Micro subtle hover overlay for slideshow action */}
                                      <div className="absolute inset-0 bg-[#0d2c54]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 duration-300">
                                          <span className="bg-[#ffb703] text-[#0d2c54] font-black uppercase tracking-widest text-[9.5px] px-6 py-3.5 rounded-2xl shadow-xl scale-90 group-hover:scale-100 transition-all duration-300">
                                              Open Slideshow
                                          </span>
                                      </div>
                                 </div>
                                 
                                 <div className="p-6 flex flex-col flex-grow text-left">
                                    <div className="flex items-center gap-2.5 mb-3">
                                      <div className="w-7 h-7 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center text-[#7c3aed] shrink-0 border border-[#7c3aed]/15">
                                          <Camera size={13} />
                                      </div>
                                      <span className="inline-block bg-[#0d2c54]/5 border border-[#0d2c54]/5 px-2.5 py-1 rounded-md text-primary/80 text-[8px] font-black uppercase tracking-widest">
                                        Gallery Record
                                      </span>
                                    </div>
                                    <h4 className="text-lg font-black text-[#0d2c54] mb-2 italic tracking-tight">{item.title}</h4>
                                    <p className="text-primary/70 text-xs leading-relaxed font-semibold">{item.desc}</p>
                                 </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Slideshow Lightbox Showcase overlay modal */}
            <AnimatePresence>
                {activeIndex !== null && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8"
                        style={{ height: "100dvh" }}
                    >
                        {/* Title Row / Count Controls */}
                        <div className="flex justify-between items-center w-full max-w-7xl mx-auto z-10" onClick={(e) => e.stopPropagation()}>
                            <div className="text-white text-xs md:text-sm font-bold tracking-widest uppercase selection:bg-transparent">
                                Captured Memory {activeIndex + 1} of {photos.length}
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="bg-white/10 hover:bg-accent hover:text-primary text-white border border-white/10 rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 cursor-pointer select-none"
                                    title={isPlaying ? "Pause Auto Slideshow" : "Run Auto Slideshow"}
                                >
                                    <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-ping' : 'bg-white/40'}`}></span>
                                    {isPlaying ? "Pause Slideshow" : "Play Slideshow"}
                                </button>
                                <button 
                                    onClick={handleClose}
                                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-red-500 text-white hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 shadow-lg select-none"
                                    title="Close View Window (Esc)"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Middle Large View Column */}
                        <div className="flex-1 flex items-center justify-between w-full max-w-7xl mx-auto relative my-4 md:my-0">
                            {/* Left Nav trigger */}
                            <button 
                                onClick={handlePrev}
                                className="absolute left-2 md:-left-8 z-10 w-14 h-14 rounded-full bg-white/5 hover:bg-accent border border-white/10 text-white hover:text-primary flex items-center justify-center transition-all shadow-2xl cursor-pointer select-none"
                                title="Previous Memory (←)"
                            >
                                <ChevronLeft size={28} />
                            </button>

                            {/* Main Frame showcase block */}
                            <div 
                                className="w-full max-w-4xl mx-auto aspect-video max-h-[58vh] md:max-h-[68vh] rounded-[32px] md:rounded-[40px] overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(251,191,36,0.15)] bg-primary/20 relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img 
                                        key={activeIndex}
                                        src={`/images/${photos[activeIndex].localName}`} 
                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = photos[activeIndex].src; }} 
                                        alt={photos[activeIndex].title}
                                        initial={{ opacity: 0, x: 40, scale: 0.98 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -40, scale: 1.02 }}
                                        transition={{ duration: 0.35, ease: "easeInOut" }}
                                        className="w-full h-full object-cover" 
                                    />
                                </AnimatePresence>
                                {/* Info Box */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-10 text-left pointer-events-none select-none">
                                    <h4 className="text-xl md:text-3xl font-black text-accent mb-2 italic tracking-tight uppercase">
                                        {photos[activeIndex].title}
                                    </h4>
                                    <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-2xl font-medium">
                                        {photos[activeIndex].desc}
                                    </p>
                                </div>
                            </div>

                            {/* Right Nav trigger */}
                            <button 
                                onClick={handleNext}
                                className="absolute right-2 md:-right-8 z-10 w-14 h-14 rounded-full bg-white/5 hover:bg-accent border border-white/10 text-white hover:text-primary flex items-center justify-center transition-all shadow-2xl cursor-pointer select-none"
                                title="Next Memory (→)"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </div>

                        {/* Bottom Thumbnail strip bar */}
                        <div 
                            className="w-full max-w-3xl mx-auto z-10 bg-white/5 border border-white/10 p-4 rounded-[30px] flex gap-3 md:gap-4 overflow-x-auto justify-start md:justify-center items-center scrollbar-none scroll-smooth select-none mb-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {photos.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative h-12 w-20 md:h-16 md:w-28 rounded-2xl overflow-hidden shrink-0 transition-all border-2 cursor-pointer ${
                                        activeIndex === idx 
                                        ? 'border-accent scale-105 ring-2 ring-accent/30 shadow-[0_0_15px_rgba(251,191,36,0.5)]' 
                                        : 'border-transparent opacity-40 hover:opacity-80'
                                    }`}
                                >
                                    <img src={`/images/${item.localName}`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = item.src; }} alt={item.title} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}

// --- OTHER PAGES ---
const About = () => {
    const { websiteContent } = useSchoolData();
    return (
        <main className="pt-10 bg-[#030c17]">
             <section className="bg-primary py-24 text-white relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic leading-[0.9]">Legacy Of <br /><span className="text-accent underline decoration-white/10 decoration-8 underline-offset-10">Excellence.</span></h1>
                    <p className="text-white/60 max-w-2xl text-base md:text-lg font-medium leading-relaxed">Defining the standards of education in Mahottari since 2071 with a vision beyond classrooms.</p>
                </div>
                <div className="absolute inset-0 bg-primary/40 z-0">
                  <LocalImg localName="about_bg.jpg" fallback="https://images.unsplash.com/photo-1541339907198-e08759df9a13?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 mix-blend-overlay" alt="About BG" />
                </div>
             </section>
            
             <section className="py-32 bg-transparent text-white">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <SectionHeader 
                            badge="Our Manifesto"
                            title="Nurturing Roots, Growing Wings."
                        />
                        <div className="space-y-8 text-white/70 text-lg leading-relaxed">
                            <p>Founded on the principles of academic rigor and moral integrity, New Concept English Medium Boarding School has stood as a bastion of quality for over a decade. We began with a handful of students and a mountain of resolve.</p>
                            <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/10">
                                <div className="space-y-2">
                                    <div className="text-3xl font-black text-white italic tracking-tighter">13+ Years</div>
                                    <p className="text-xs font-black uppercase tracking-widest text-accent">Pedagogical Experience</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-black text-white italic tracking-tighter">1200+</div>
                                    <p className="text-xs font-black uppercase tracking-widest text-accent">Brilliant Alumni</p>
                                </div>
                            </div>
                            <p>Our curriculum is a dynamic living entity, evolving with the latest global standards while remaining firmly anchored in the cultural soil of Nepal.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="h-48 md:h-64 bg-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-lg border border-white/10">
                                <img src={websiteContent?.campusPhoto1 || "/images/campus1.jpg"} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop"; }} className="w-full h-full object-cover" alt="Campus 1" />
                            </div>
                            <div className="h-64 md:h-96 bg-[#0d2c54]/45 backdrop-blur-md rounded-[32px] md:rounded-[40px] overflow-hidden shadow-lg border border-white/10 flex items-center justify-center p-6 md:p-8 text-center">
                                <p className="text-white font-black italic text-lg md:text-xl">"A sanctuary where every question finds a path to discovery."</p>
                            </div>
                        </div>
                        <div className="space-y-6 md:pt-12">
                            <div className="h-64 md:h-96 bg-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-lg border border-white/10">
                                <img src={websiteContent?.campusPhoto2 || "/images/campus2.jpg"} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = printcampus2Url; }} className="w-full h-full object-cover" alt="Campus 2" />
                            </div>
                            <div className="h-48 md:h-64 bg-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-lg border border-white/10">
                                <img src={websiteContent?.campusPhoto3 || "/images/campus3.jpg"} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = printcampus3Url; }} className="w-full h-full object-cover" alt="Campus 3" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Faculty Section */}
            <section className="py-32 bg-transparent border-t border-white/10">
                <div className="container mx-auto px-4">
                    <SectionHeader 
                        badge="Our Faculty"
                        title="Meet The Mentors"
                        desc="A dedicated team of educators committed to shaping the intellectual landscape of Mahottari."
                        centered
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {(websiteContent?.faculty || [
                            { id: "fac-sita", name: "Sita Kumari Sah", role: "Primary Coordinator", qual: "M.Ed in English", desc: "With 12 years of experience, she leads the linguistic foundation of our young scholars with passion.", img: "https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=2070&auto=format&fit=crop" },
                            { id: "fac-pukar", name: "Pukar Mandal", role: "Sr. Administrator", qual: "MBA (Human Resources)", desc: "The operational backbone of New Concept, ensuring seamless academic management and student support.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" },
                            { id: "fac-kd", name: "K.D Sir", role: "Principal", qual: "M.A. (Ed. Admin)", desc: "A visionary leader focus on character building and institutional discipline.", img: principalPortraitUrl }, 
                            { id: "fac-anish", name: "Anish Gupta", role: "ICT Instructor", qual: "B.Tech in CS", desc: "Bridging the gap between traditional learning and modern technology for our students.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" },
                            { id: "fac-sunita", name: "Sunita Yadav", role: "Early Childhood Lead", qual: "B.Ed (Child Psych)", desc: "Specializes in play-based learning and cognitive development for Nursery students.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
                            { id: "fac-kaviraj", name: "Kavi Raj Jha", role: "Mathematics Dept.", qual: "M.Sc in Applied Math", desc: "Simplifying complex numbers into fun challenges for primary grade students.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" }
                        ]).map((faculty: any, i: number) => (
                            <motion.div 
                                key={faculty.id || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="group bg-[#0c233f]/40 backdrop-blur-md rounded-[50px] overflow-hidden shadow-premium border border-white/10 hover:border-accent transition-all flex flex-col"
                            >
                                <div className="aspect-[4/5] relative overflow-hidden bg-white/5 shrink-0">
                                     <img src={faculty.img} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=2070&auto=format&fit=crop"; }} alt={faculty.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <div className="p-8 md:p-10 text-left flex flex-col flex-grow">
                                    <div className="flex flex-wrap items-center gap-2 mb-3.5">
                                        <span className="bg-[#7c3aed]/10 text-accent border border-[#7c3aed]/15 px-3 py-1 rounded-xl text-[8.5px] font-black uppercase tracking-widest">
                                           {faculty.qual}
                                        </span>
                                        <span className="bg-accent/10 text-accent border border-accent/25 px-3 py-1 rounded-xl text-[8.5px] font-black uppercase tracking-widest">
                                           {faculty.role}
                                        </span>
                                    </div>
                                    <h4 className="text-2xl font-black text-white tracking-tight mb-2.5">{faculty.name}</h4>
                                    <p className="text-white/70 text-xs leading-relaxed font-semibold">{faculty.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

const Notices = () => {
    const { notices, loading } = useSchoolData();
    const [selectedNotice, setSelectedNotice] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredNotices = notices.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              n.desc.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeFilter === "All") return matchesSearch;
        return matchesSearch && n.cat.toLowerCase() === activeFilter.toLowerCase();
    });

    return (
        <main className="pt-10 bg-[#030c17] min-h-screen pb-32">
             <section className="bg-primary pt-24 pb-48 text-white relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0c233f] via-primary to-primary"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-8xl font-black mb-6 uppercase tracking-tighter italic">News & <br /><span className="text-accent underline decoration-white/10 decoration-8 underline-offset-10">Alerts.</span></h1>
                    <p className="text-white/60 max-w-xl mx-auto text-base md:text-lg font-medium">Synchronized updates directly from the administrative dispatch desk.</p>
                </div>
            </section>
            
            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <div className="bg-[#0c233f]/40 backdrop-blur-md p-6 md:p-20 rounded-[40px] md:rounded-[60px] shadow-3xl border border-white/10 outline outline-4 outline-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                        <div className="flex bg-white/5 p-3 rounded-2xl border border-white/10 w-full max-w-md items-center">
                            <Search size={22} className="text-accent mx-3 shrink-0" />
                            <input 
                              type="text" 
                              placeholder="Search archive..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="bg-transparent border-none focus:ring-0 text-white placeholder-white/40 text-sm font-bold flex-1 focus:outline-none" 
                            />
                        </div>
                        <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
                             {["All", "Enrollment", "Test", "Holiday", "Urgent"].map(f => (
                                 <button 
                                   key={f} 
                                   onClick={() => setActiveFilter(f)}
                                   className={cn(
                                     "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
                                     activeFilter === f 
                                       ? "bg-accent text-[#0d2c54] border-accent shadow-glow" 
                                       : "bg-white/5 text-white/70 border-white/10 hover:bg-accent hover:text-[#0d2c54] hover:border-accent"
                                   )}
                                 >
                                     {f}
                                 </button>
                             ))}
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        {loading ? (
                          <div className="space-y-4">
                            {[1, 2].map((x) => (
                              <div key={x} className="p-8 rounded-[40px] bg-white/5 border border-white/10 animate-pulse flex flex-col md:flex-row gap-6 items-center justify-between">
                                <div className="h-10 w-48 bg-white/10 rounded-xl"></div>
                                <div className="h-10 w-24 bg-white/10 rounded-xl"></div>
                              </div>
                            ))}
                          </div>
                        ) : filteredNotices.length === 0 ? (
                          <div className="text-center py-20 bg-white/5 rounded-[32px] border border-dashed border-white/10 text-white/45 font-black">
                            No notifications match the selected search criteria.
                          </div>
                        ) : (
                          filteredNotices.map((n, i) => {
                            const dateParts = n.date.split(' ');
                            const day = dateParts[1] ? dateParts[1].replace(',', '') : 'Alert';
                            const month = dateParts[0] || 'Notice';
                            return (
                              <div key={n.id || i} className="group p-8 rounded-[40px] bg-white/5 hover:bg-white/10 border border-white/15 hover:border-accent/40 transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm hover:shadow-glow">
                                  <div className="flex flex-1 gap-8 items-center text-left">
                                      <div className="w-16 h-16 rounded-2xl bg-primary border border-white/10 text-accent flex flex-col items-center justify-center shrink-0 shadow-md">
                                          <span className="text-xs font-black leading-none">{day}</span>
                                          <span className="text-[10px] uppercase font-black">{month}</span>
                                      </div>
                                      <div>
                                          <div className="flex items-center gap-2 mb-1">
                                              <span className="text-accent text-[9px] font-black uppercase tracking-widest block">{n.cat}</span>
                                              {n.attachmentUrl && (
                                                  <span className="bg-accent/15 text-accent text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                                      <FileText size={10} /> PDF/Image
                                                  </span>
                                              )}
                                          </div>
                                          <h4 className="text-2xl font-black text-white group-hover:text-accent transition-colors duration-300 tracking-tight">{n.title}</h4>
                                      </div>
                                  </div>
                                  <button 
                                      onClick={() => setSelectedNotice(n)}
                                      className="bg-white text-[#0d2c54] px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-transparent hover:bg-accent hover:text-[#0d2c54] transition-all duration-300 shadow-md flex items-center gap-3 shrink-0"
                                  >
                                      <Eye size={16} /> View Details
                                  </button>
                              </div>
                            );
                          })
                        )}
                    </div>
                </div>
            </div>

            {/* Notice Detail Modal */}
            <AnimatePresence>
                {selectedNotice && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNotice(null)}
                            className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[100]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0c233f] border border-white/10 text-white z-[110] rounded-[32px] md:rounded-[40px] shadow-premium"
                        >
                            <div className="p-6 md:p-12">
                                <div className="flex justify-between items-start mb-8 gap-4">
                                    <div className="flex gap-4 md:gap-6 items-center flex-1 min-w-0 text-left">
                                        <div className="w-14 h-14 rounded-2xl bg-primary border border-white/10 text-accent flex flex-col items-center justify-center shrink-0">
                                            <span className="text-[10px] font-black leading-none">
                                                {selectedNotice.date.split(' ')[1] ? selectedNotice.date.split(' ')[1].replace(',', '') : 'Alert'}
                                            </span>
                                            <span className="text-[8px] uppercase font-black">
                                                {selectedNotice.date.split(' ')[0] || 'Notice'}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-accent text-[9px] font-black uppercase tracking-widest mb-1 block">{selectedNotice.cat}</span>
                                            <h3 className="text-xl md:text-3xl font-black text-white tracking-tighter italic leading-tight break-words">{selectedNotice.title}</h3>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedNotice(null)} className="p-2.5 bg-white/5 text-white/60 border border-white/10 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all shrink-0">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="bg-white/5 p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-white/10 whitespace-pre-line text-white/80 text-sm md:text-base leading-relaxed font-semibold break-words max-h-[50vh] overflow-y-auto select-text text-left">
                                    {selectedNotice.desc}
                                </div>
                                {selectedNotice.attachmentUrl && (
                                    <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/20 text-accent flex items-center justify-center shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-white/40 uppercase font-black tracking-widest leading-none mb-1">Attached Document</p>
                                                <p className="text-sm font-black text-white truncate">{selectedNotice.attachmentName || "Download Attachment"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            {selectedNotice.attachmentUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) && (
                                                <a 
                                                    href={selectedNotice.attachmentUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none text-center bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition duration-300"
                                                >
                                                    View Image
                                                </a>
                                            )}
                                            <a 
                                                href={selectedNotice.attachmentUrl}
                                                download={selectedNotice.attachmentName || "notice_attachment"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 sm:flex-none text-center bg-accent text-primary hover:bg-white transition-colors px-4 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-wider"
                                            >
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-8 flex justify-end">
                                    <button 
                                        onClick={() => setSelectedNotice(null)}
                                        className="bg-accent text-primary hover:bg-white hover:text-primary px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300"
                                    >
                                        Close Notice
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
};

const Contact = () => {
    const { websiteContent } = useSchoolData();
    const [showMapModal, setShowMapModal] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedAddress, setCopiedAddress] = useState(false);

    const mapUrl = "https://www.google.com/maps/place/new+concept+english+medium+boarding+school/@26.6875899,85.7820387,652m/data=!3m2!1e3!4b1!4m6!3m5!1s0xa1c5191716e45d2b:0xc2816e34fadd3984!8m2!3d26.6875899!4d85.7846136!16s%2Fg%2F11xnn_j95c?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D";
    const fallbackUrl = "https://www.google.com/maps/dir//New+Concept+English+Medium+Boarding+School,+Mahottari";

    const handleCopyLink = () => {
        navigator.clipboard.writeText(mapUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText("New Concept English Medium Boarding School, Baheda, Ekdara-6, Mahottari, Madhesh Province, Nepal");
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
    };

    const handleMapTrigger = (e: React.MouseEvent) => {
        // Double-action: open direct link first, then show helper in case of popups blocked inside iframe sandbox
        setShowMapModal(true);
    };

    return (
        <main className="pt-10 bg-[#030c17]">
            <section className="container mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <div>
                    <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] mb-8 block">Locate Us</span>
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-tight italic uppercase">
                        Visit Our <br />
                        <span className="text-white/40 underline decoration-accent/20 decoration-8 underline-offset-10">Administrative</span> <br />
                        Floor.
                    </h1>
                    
                    <div className="space-y-12">
                         <div 
                           onClick={() => setShowMapModal(true)}
                           className="flex gap-8 group cursor-pointer animate-pulse-soft"
                         >
                            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-[#0d2c54] transition-all shrink-0"><MapPin size={24} /></div>
                            <div>
                                <h4 className="font-black text-white mb-2 text-xl italic tracking-tight flex items-center gap-2 group-hover:text-accent transition-colors">Geo Location <ExternalLink size={16} className="text-accent" /></h4>
                                <p className="text-white/70 text-lg leading-relaxed">Baheda, Ekdara-06, Mahottari, Madhesh Province Nepal.</p>
                            </div>
                         </div>
                         <div className="flex gap-8 group">
                            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-[#0d2c54] transition-all shrink-0"><Phone size={24} /></div>
                            <div>
                                <h4 className="font-black text-white mb-2 text-xl italic tracking-tight">Direct Hotlines</h4>
                                <p className="text-white/70 text-lg leading-relaxed">+977-9801671714 / 9817681582</p>
                            </div>
                         </div>
                    </div>
                </div>
                
                <div className="relative group flex flex-col items-center">
                    <div className="absolute -inset-10 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="relative w-full rounded-[60px] overflow-hidden shadow-3xl border-8 border-white/10 bg-white/5 aspect-square">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3564.931215431697!2d85.78204207613618!3d26.68752677002013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec191716e45d2b%3A0xc2816934fa793984!2snew%20concept%20english%20medium%20boarding%20school!5e0!3m2!1sen!2snp!4v1716400000000!5m2!1sen!2snp"
                            className="w-full h-full border-0 transition-all duration-700" 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade" 
                        />
                    </div>
                    <a 
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        // Triggers the help modal simultaneously so details are readily accessible if browser blocks target blank popup windows inside iframes
                        setShowMapModal(true);
                      }}
                      className="mt-8 inline-flex items-center gap-3 bg-accent text-[#0d2c54] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-center"
                    >
                      <MapPin size={16} /> Get Directions on Google Maps <ExternalLink size={14} />
                    </a>
                </div>
            </section>

            {/* CUSTOM MAP REDIRECT HELPER MODAL (Bypasses iframe sandboxing pop-up blocker securely) */}
            <AnimatePresence>
                {showMapModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMapModal(false)}
                            className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[500]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-[#0c233f] z-[510] rounded-[32px] md:rounded-[40px] p-8 shadow-3xl border border-white/10 overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-white italic tracking-tight">Google Maps Services</h3>
                                    <p className="text-[10px] uppercase font-black text-[#ffb703] tracking-widest mt-1">
                                        Navigate to our Administrative School
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setShowMapModal(false)} 
                                    className="p-2.5 bg-white/5 text-white/70 border border-white/10 rounded-xl hover:bg-white/15 hover:text-white transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <p className="text-sm text-white/85 font-semibold mb-6 leading-relaxed text-left">
                                Since this application runs in a sandboxed preview environment, some browsers block direct pop-up redirects. Please use one of the reliable methods below:
                            </p>

                            <div className="space-y-4 font-semibold">
                                {/* Option 1: Open Direct Link */}
                                <a 
                                    href= {mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full p-4.5 bg-[#0a7aff]/10 hover:bg-[#0a7aff]/20 border border-[#0a7aff]/20 rounded-2xl transition-all text-white"
                                >
                                    <div className="flex items-center gap-3 font-semibold">
                                        <div className="w-10 h-10 rounded-xl bg-[#0a7aff] text-white flex items-center justify-center shrink-0">
                                            <ExternalLink size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs uppercase font-black text-[#0a7aff] tracking-wider">Method 1</p>
                                            <h5 className="text-sm font-black text-white">Open in new window</h5>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-[#0a7aff]" />
                                </a>

                                {/* Option 2: Direction route */}
                                <a 
                                    href={fallbackUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full p-4.5 bg-[#34c759]/10 hover:bg-[#34c759]/20 border border-[#34c759]/20 rounded-2xl transition-all text-white"
                                >
                                    <div className="flex items-center gap-3 font-semibold font-sans">
                                        <div className="w-10 h-10 rounded-xl bg-[#34c759] text-white flex items-center justify-center shrink-0">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs uppercase font-black text-[#34c759] tracking-wider">Method 2</p>
                                            <h5 className="text-sm font-black text-white">Get Driving Directions</h5>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-[#34c759]" />
                                </a>

                                {/* Option 3: Copy direct coordinates / link */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button 
                                        onClick={handleCopyLink}
                                        className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-accent hover:bg-accent/5 transition-all gap-1.5 cursor-pointer text-white"
                                    >
                                        <span className="text-[9px] uppercase font-black text-white/40 tracking-wider">Map CID Link</span>
                                        <span className="text-xs font-black text-white flex items-center gap-1.5">
                                            {copiedLink ? <span className="text-[#34c759]">Copied!</span> : "Copy Shared URL"}
                                        </span>
                                    </button>

                                    <button 
                                        onClick={handleCopyAddress}
                                        className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-accent hover:bg-accent/5 transition-all gap-1.5 cursor-pointer text-white"
                                    >
                                        <span className="text-[9px] uppercase font-black text-white/40 tracking-wider">Camp Address</span>
                                        <span className="text-xs font-black text-white flex items-center gap-1.5">
                                            {copiedAddress ? <span className="text-[#34c759]">Copied!</span> : "Copy Location"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Personnel Section */}
            <section className="py-32 bg-transparent border-t border-white/10">
                <div className="container mx-auto px-4">
                    <SectionHeader 
                        badge="Contact Personnel"
                        title="Meet Our Outreach Team"
                        desc="Connect directly with our administrators for specific academic or legal inquiries."
                        centered
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {((websiteContent?.outreachTeam && websiteContent.outreachTeam.length > 0)
                            ? websiteContent.outreachTeam.map((member) => ({
                                name: member.name,
                                role: member.role,
                                phone: member.phone,
                                img: member.img,
                                localName: "custom-outreach-member"
                              }))
                            : [
                                { name: "Pukar Mandal", role: "Sr. Administrator", phone: "+977-9817681582", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop", localName: "outreach_pukar.jpg" },
                                { name: "Suman Kumar", role: "Admission Head", phone: "+977-9817681582", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop", localName: "outreach_suman.jpg" },
                                { name: "Anita Kumari", role: "Public Relations", phone: "+977-9817681582", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop", localName: "outreach_anita.jpg" },
                                { name: "Vikram Shah", role: "Logistics Mgr", phone: "+977-9817681582", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop", localName: "outreach_vikram.jpg" }
                            ]
                        ).map((person, i) => (
                            <div key={i} className="bg-[#0c233f]/40 backdrop-blur-md p-6 rounded-[32px] border border-white/10 outline outline-4 outline-white/5 hover:border-accent group transition-all duration-300">
                                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <img src={`/images/${person.localName}`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = person.img; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform animate-ticker-alt" alt={person.name} />
                                </div>
                                <h4 className="text-lg font-black text-white mb-1">{person.name}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">{person.role}</p>
                                <a href={`tel:${person.phone}`} className="flex items-center gap-3 text-xs font-bold text-white/70 hover:text-accent transition-colors">
                                    <Phone size={14} className="text-accent" /> {person.phone}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

// --- APP ROOT ---

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

export default function App() {
  return (
    <SchoolDataProvider>
      <Router>
        <div className="min-h-screen flex flex-col selection:bg-accent selection:text-primary">
          <ScrollToTop />
          <Header />
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/admissions" element={<Admissions />} />
                <Route path="/academics" element={<Academics />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </AnimatePresence>
          </div>
          <Footer />
        </div>
      </Router>
    </SchoolDataProvider>
  );
}
