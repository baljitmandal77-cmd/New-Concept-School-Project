/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Mail, MapPin, Facebook, Youtube, Instagram, 
  ChevronRight, Download, Search, LayoutGrid, Calendar, Users, 
  Award, BookOpen, GraduationCap, Clock, MessageSquare, Plus, 
  Globe, ShieldCheck, ArrowRight, ExternalLink, Menu as MenuIcon,
  Play, Sparkles, Heart, Zap, Camera, Shield, Coffee, Bus, Eye
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- SHARED COMPONENTS ---

const LOGO_URL = "https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?q=80&w=200&h=200&auto=format&fit=crop";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Academics', path: '/academics' },
    { name: 'Notices', path: '/notices' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="relative z-50">
      {/* Top Utility Bar */}
      <div className="bg-primary text-white py-2 hidden md:block border-b border-white/10">
        <div className="container mx-auto px-4 flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-2"><Phone size={12} className="text-accent" /> +977-9800000000</span>
            <span className="flex items-center gap-2"><Mail size={12} className="text-accent" /> admissions@ncemhs.edu.np</span>
            <span className="flex items-center gap-2"><MapPin size={12} className="text-accent" /> Baheda, Mahottari</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-accent transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="hover:text-accent transition-colors"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="hover:text-accent transition-colors"><i className="fa-brands fa-youtube"></i></a>
            <a href="#" className="hover:text-accent transition-colors"><i className="fa-brands fa-tiktok"></i></a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl shadow-lg border-b sticky top-0 py-2 transition-all">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 md:gap-4 group">
            <div className="w-16 h-16 md:w-28 md:h-28 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-premium group-hover:scale-105 transition-transform shrink-0 border border-black/5">
              <img src={LOGO_URL} alt="NC Logo" className="w-full h-full object-cover" />
            </div>
            <div className="block">
              <h1 className="text-primary font-black text-xl md:text-3xl leading-none uppercase tracking-tighter">New Concept</h1>
              <p className="text-accent text-[8px] md:text-xs font-black uppercase tracking-[0.25em] mt-1 italic">Knowledge & Discipline</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 text-[13px] font-bold uppercase tracking-widest transition-all rounded-lg hover:bg-light-bg hover:text-accent",
                  pathname === link.path ? "text-accent bg-light-bg" : "text-primary/70"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="w-[1px] h-8 bg-black/5 mx-4"></div>
            <Link to="/admissions" className="bg-accent text-primary px-7 py-3 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-premium hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0 transition-all">
              Apply Now
            </Link>
          </div>

          {/* Mobile Trigger */}
          <button onClick={() => setIsOpen(true)} className="lg:hidden p-3 bg-light-bg rounded-xl text-primary border">
            <MenuIcon size={24} />
          </button>
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
              className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border">
                  <img src={LOGO_URL} alt="NC Logo" className="w-full h-full object-cover" />
                </div>
                <button onClick={() => setIsOpen(false)} className="p-3 bg-light-bg rounded-xl hover:bg-accent transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-xl font-black uppercase tracking-tight p-4 rounded-2xl transition-all",
                      pathname === link.path ? "bg-accent text-primary" : "text-primary hover:bg-light-bg"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-8">
                   <Link to="/admissions" onClick={() => setIsOpen(false)} className="block bg-primary text-white p-5 rounded-2xl text-center font-black uppercase tracking-widest shadow-xl">
                    Online Enrollment
                  </Link>
                </div>
              </div>
              <div className="mt-20 pt-8 border-t">
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-4">Official Helpdesk</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-bold text-primary">
                    <Phone size={16} className="text-accent" /> +977-9800000000
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-primary">
                    <Mail size={16} className="text-accent" /> info@ncemhs.edu.np
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
  <div className={cn("mb-12 md:mb-16", centered ? "text-center" : "text-left")}>
    <span className="inline-block bg-accent/10 border border-accent/20 text-accent px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-4">
      {badge}
    </span>
    <h2 className={cn("text-3xl md:text-5xl font-black text-primary leading-tight tracking-tighter", centered && "mx-auto max-w-2xl")}>
      {title}
    </h2>
    {desc && <p className={cn("text-base md:text-lg text-primary/60 mt-4 md:mt-6 leading-relaxed", centered && "mx-auto max-w-2xl")}>{desc}</p>}
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-24 border-t-8 border-accent">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-16">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-xl border-2 border-white/20">
              <img src={LOGO_URL} alt="NC Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-black text-2xl uppercase tracking-tighter">New Concept</h3>
              <p className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Hub</p>
            </div>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            The most trusted name in basic level education in Mahottari. We nurture the seeds of tomorrow with modern technology and ancient values.
          </p>
          <div className="flex gap-4">
             {[Facebook, Youtube, Instagram].map((Icon, i) => (
               <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary hover:-translate-y-1 transition-all">
                 <Icon size={20} />
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
              <span className="leading-relaxed">Baheda, Ekdara-05, Mahottari, Madhesh Nepal</span>
            </li>
            <li className="flex gap-4">
              <Phone size={22} className="text-accent shrink-0" />
              <span>+977-9800000000<br />+977-9811111111</span>
            </li>
            <li className="flex gap-4">
              <Mail size={22} className="text-accent shrink-0" />
              <span className="break-all">admissions@ncemhs.edu.np</span>
            </li>
          </ul>
        </div>

        <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
          <h4 className="text-accent font-black uppercase tracking-[0.2em] mb-6 text-xs italic">School Mobile App</h4>
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
          <p className="font-bold tracking-widest uppercase">&copy; {new Date().getFullYear()} NEW CONCEPT ENGLISH MEDIUM HIGH SCHOOL. INSTITUTIONAL PRIDE.</p>
          <p className="font-black tracking-[0.2em] uppercase bg-white/5 px-4 py-2 rounded-lg">
            Developed & Powered by: <a href="http://www.baljitmandal.com.np" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline decoration-accent/30 decoration-2 transition-all">Baljit Mandal (TechMind IT Solution)</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

// --- HOME PAGE ---
const Home = () => {
  return (
    <main>
      {/* Emergency ticker */}
      <div className="bg-red-600 text-white py-3 relative overflow-hidden whitespace-nowrap z-40">
        <div className="flex gap-16 animate-ticker font-black text-[11px] uppercase tracking-[0.2em]">
          <span className="flex items-center gap-3"><Zap size={14} className="fill-current" /> NEW ADMISSIONS 2026-27 STARTING FROM MAY 20TH. LIMITED SCHOLARSHIP SLOTS!</span>
          <span className="flex items-center gap-3"><Zap size={14} className="fill-current" /> PARENT-TEACHER CONFERENCE SCHEDULED FOR JUNE 5TH.</span>
          <span className="flex items-center gap-3"><Zap size={14} className="fill-current" /> FIRST TERM EXAMINATION RESULTS PUBLISHED FOR CLASSES 1-5.</span>
        </div>
      </div>

      {/* Modern Hero */}
      <section className="relative min-h-[90vh] lg:h-[95vh] flex items-center overflow-hidden bg-primary py-20 lg:py-0">
         <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1577891746234-cbe4e60ca218?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity scale-105" 
            alt="School Banner"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
         </div>
         
         <div className="container mx-auto px-4 relative z-10">
           <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
           >
             <div className="flex items-center gap-4 mb-10">
               <span className="h-[2px] w-12 bg-accent"></span>
               <span className="text-accent font-black uppercase tracking-[0.4em] text-[11px]">Mahottari's Educational Beacon</span>
             </div>
             <h1 className="text-4xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter mb-10">
               Empowering <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white italic">Young Minds.</span>
             </h1>
             <p className="text-lg md:text-2xl text-white/60 mb-10 lg:mb-14 max-w-2xl leading-relaxed font-medium">
               Providing a world-class English medium foundation for children from Nursery to Grade 5 with a focus on holistic development and character building.
             </p>
             <div className="flex flex-col sm:flex-row gap-6">
               <Link to="/admissions" className="bg-accent text-primary px-12 py-6 rounded-2xl font-black uppercase text-sm shadow-2xl hover:shadow-accent/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                 Start Admission <ArrowRight size={20} />
               </Link>
               <Link to="/gallery" className="bg-white/5 backdrop-blur-xl border border-white/10 px-12 py-6 rounded-2xl font-black uppercase text-sm text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                 Inside Our campus <Play size={18} />
               </Link>
             </div>
           </motion.div>
         </div>

         {/* Hero Info Cards */}
         <div className="absolute bottom-0 right-0 left-0 hidden lg:block">
           <div className="container mx-auto px-4 grid grid-cols-3 gap-8 mb-16">
             {[
               { icon: <Shield size={24} />, title: "Secure Campus", desc: "24/7 CCTV & Security Monitoring" },
               { icon: <Sparkles size={24} />, title: "Smart Classes", desc: "Interactive Audiovisual Education" },
               { icon: <Users size={24} />, title: "Expert Teachers", desc: "1:20 Teacher-Student Ratio" }
             ].map((card, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 + i * 0.2 }}
                 className="bg-white/10 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10"
               >
                 <div className="text-accent mb-6">{card.icon}</div>
                 <h4 className="text-white font-bold text-xl mb-2">{card.title}</h4>
                 <p className="text-white/40 text-sm font-semibold">{card.desc}</p>
               </motion.div>
             ))}
           </div>
         </div>
      </section>

      {/* Featured visual section: Why Choose Us */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <SectionHeader 
            badge="Institutional Strength"
            title="Why New Concept is Unique"
            desc="We don't just teach subjects; we architect futures with a blend of regional values and global innovation."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop",
                title: "Holistic Environment",
                desc: "Our campus is designed to inspire creativity, with open spaces and modern classrooms."
              },
              {
                img: "https://images.unsplash.com/photo-1560523182-7ea90df18903?q=80&w=2070&auto=format&fit=crop",
                title: "Tech-Infused Learning",
                desc: "Students use tablets and smart boards to grasp complex concepts through visualization."
              },
              {
                img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2040&auto=format&fit=crop",
                title: "Moral Integrity",
                desc: "We instill core human values and ethics to ensure our students grow into responsible citizens."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group relative h-[400px] md:h-[500px] rounded-[40px] md:rounded-[50px] overflow-hidden shadow-premium"
              >
                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent">
                   <h4 className="text-2xl font-black text-white mb-4 italic tracking-tight">{item.title}</h4>
                   <p className="text-white/60 text-sm leading-relaxed mb-6">{item.desc}</p>
                   <Link to="/about" className="text-accent text-xs font-black uppercase tracking-widest flex items-center gap-3">
                     Explore More <ArrowRight size={14} />
                   </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Activity Timeline on Home */}
      <section className="py-32 bg-light-bg">
        <div className="container mx-auto px-4">
          <SectionHeader 
            badge="Life at NCEMHS"
            title="Experience The Daily Journey"
            desc="Take a visual walk-through of a standard productive day at New Concept."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
               { time: "09:30 AM", event: "Morning Assembly", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop" },
               { time: "11:00 AM", event: "Smart Class Labs", img: "https://images.unsplash.com/photo-1524178232363-1fb28f74b0ed?q=80&w=2070&auto=format&fit=crop" },
               { time: "01:00 PM", event: "Healthy Lunch Break", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=2048&auto=format&fit=crop" },
               { time: "02:30 PM", event: "Co-Curricular Clubs", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop" }
             ].map((node, i) => (
               <div key={i} className="relative group rounded-[40px] overflow-hidden aspect-[4/5] shadow-lg">
                 <img src={node.img} className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" alt={node.event} />
                 <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                   <span className="text-accent text-[11px] font-black uppercase tracking-widest mb-2 block">{node.time}</span>
                   <h5 className="text-white font-bold text-lg">{node.event}</h5>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Principal Desk visual section integrated - more professional */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[40px] md:rounded-[60px] p-8 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center shadow-3xl text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -mr-40 -mt-40 hidden md:block"></div>
             
             <div className="relative">
               <div className="aspect-square bg-white/10 rounded-3xl md:rounded-[40px] overflow-hidden border border-white/10 relative p-3 md:p-4 group">
                 <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                  className="w-full h-full object-cover rounded-2xl md:rounded-[30px] group-hover:scale-105 transition-all duration-700" 
                  alt="Principal" 
                 />
                 <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 p-5 md:p-8 bg-black/60 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/10">
                    <h3 className="text-xl md:text-2xl font-black mb-1">Mr. Ram Dev Mandal</h3>
                    <p className="text-accent text-[9px] md:text-[10px] font-black uppercase tracking-widest">Academic Excellence Lead</p>
                 </div>
               </div>
             </div>

             <div className="relative">
               <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] mb-6 md:mb-8 block">Leader's Vision</span>
               <h2 className="text-3xl md:text-6xl font-black mb-8 md:mb-10 tracking-tighter leading-tight italic">
                 "Our Vision Is To <br />
                 <span className="text-white/40">Build Character</span> <br />
                 Before Carriers."
               </h2>
               <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-xl mb-10 md:mb-12">
                 At New Concept, we believe every child is a potential masterpiece. Our goal is to provide the canvas, the colors, and the technique to let their inner brilliance shine brightly in the heart of Madhesh.
               </p>
               <div className="flex bg-white/5 p-5 md:p-6 rounded-2xl md:rounded-3xl items-center gap-4 md:gap-6 border border-white/10">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent text-primary flex items-center justify-center shrink-0">
                    <MessageSquare size={24} className="md:w-7 md:h-7" />
                 </div>
                 <p className="text-[11px] md:text-xs font-bold leading-relaxed italic text-white/70">
                    "Ranked #1 for basic education institutional standards in Ekdara block for 3 consecutive years."
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
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Enrollment simulation logic
    };

    return (
        <main className="pt-10">
            <section className="bg-primary pt-24 pb-48 text-white text-center relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="bg-accent text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 inline-block shadow-xl">Academic Intake 2026-27</span>
                        <h1 className="text-4xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">Secure Their <br /><span className="text-white/40 italic">Future Growth.</span></h1>
                        <p className="text-white/60 max-w-xl mx-auto text-base md:text-lg mb-12">Submit your inquiry today to join the most competitive basic-level institutional community in Mahottari.</p>
                    </motion.div>
                </div>
                <div className="absolute top-0 right-0 opacity-5 -mr-40 -mt-40">
                  <GraduationCap size={600} />
                </div>
            </section>

            <section className="container mx-auto px-4 -mt-32 relative z-10 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                   {/* Left: Interactive Info */}
                   <div className="lg:col-span-5 space-y-8">
                      <div className="bg-white p-12 rounded-[50px] shadow-premium border relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-5 rounded-bl-full"></div>
                         <h3 className="text-2xl font-black text-primary mb-10 flex items-center gap-4">
                            <Sparkles className="text-accent" /> Admission Pillars
                         </h3>
                         <div className="space-y-10">
                            {[
                                { title: "Holistic Entrance", desc: "Interactive assessment for aptitude identification.", color: "bg-blue-500" },
                                { title: "Sibling Priority", desc: "Easy lateral entry for existing family students.", color: "bg-accent" },
                                { title: "Transparent Selection", desc: "Completely merit-based enrollment protocols.", color: "bg-emerald-500" }
                            ].map((p, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className={cn("w-1.5 h-auto rounded-full shrink-0", p.color)}></div>
                                    <div>
                                        <h4 className="font-bold text-primary mb-2 text-lg">{p.title}</h4>
                                        <p className="text-primary/40 text-sm font-semibold">{p.desc}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-primary p-12 rounded-[50px] shadow-deep text-white border border-white/5 relative group overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2132&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale group-hover:scale-110 transition-all duration-1000" alt="Support" />
                         <div className="relative z-10">
                            <h4 className="text-xl font-bold mb-6 italic underline decoration-accent decoration-4">Need Assistance?</h4>
                            <p className="text-white/60 text-sm mb-8 leading-relaxed font-medium">Our admission officers are available 10:00 AM - 04:00 PM (Sun-Fri) for offline queries.</p>
                            <div className="flex gap-4">
                                <a href="tel:+9779800000000" className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-accent hover:text-primary transition-all"><Phone size={24} /></a>
                                <a href="mailto:info@ncemhs.edu.np" className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-accent hover:text-primary transition-all"><Mail size={24} /></a>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Right: Modern Inquiry Intake Terminal */}
                   <div className="lg:col-span-7">
                      <div className="bg-white p-6 md:p-20 rounded-[40px] md:rounded-[60px] shadow-3xl border border-light-bg relative overflow-hidden">
                        {submitted ? (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 text-white shadow-xl shadow-emerald-500/30">
                                    <ShieldCheck size={48} />
                                </div>
                                <h2 className="text-4xl font-black text-primary mb-6 tracking-tighter">Inquiry Dispatched!</h2>
                                <p className="text-primary/60 text-lg max-w-sm mx-auto font-medium">An admission counselor will reach out to your provided contact number within 24 operational hours.</p>
                                <button onClick={() => setSubmitted(false)} className="mt-12 text-accent font-black uppercase text-xs tracking-widest border-b-2 border-accent pb-2">Send Another Inquiry</button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="mb-14">
                                    <h2 className="text-3xl font-black text-primary mb-4 italic tracking-tight">Lead Intake Terminal</h2>
                                    <p className="text-primary/40 font-bold text-xs uppercase tracking-[0.2em]">Fill carefully for document validation</p>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Student Full Name</label>
                                            <input type="text" className="w-full bg-light-bg border-none rounded-3xl p-6 focus:ring-4 focus:ring-accent/20 transition-all text-sm font-bold" placeholder="e.g. Rahul Kumar Saf" required />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Target Class</label>
                                            <select className="w-full bg-light-bg border-none rounded-3xl p-6 focus:ring-4 focus:ring-accent/20 transition-all text-sm font-bold appearance-none">
                                                {['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'].map(cls => <option key={cls}>{cls}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Guardian Contact</label>
                                            <input type="tel" className="w-full bg-light-bg border-none rounded-3xl p-6 focus:ring-4 focus:ring-accent/20 transition-all text-sm font-bold" placeholder="+977-XXXXXXXXXX" required />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Residential District</label>
                                            <input type="text" className="w-full bg-light-bg border-none rounded-3xl p-6 focus:ring-4 focus:ring-accent/20 transition-all text-sm font-bold" placeholder="e.g. Mahottari" required />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Previous Institution (If Any)</label>
                                        <input type="text" className="w-full bg-light-bg border-none rounded-3xl p-6 focus:ring-4 focus:ring-accent/20 transition-all text-sm font-bold" placeholder="School name / Self-study" />
                                    </div>
                                    <button className="w-full bg-primary text-white py-7 rounded-3xl font-black uppercase tracking-widest text-sm shadow-deep hover:bg-black transition-all flex items-center justify-center gap-4">
                                        Validate & Submit Inquiry <ArrowRight className="text-accent" />
                                    </button>
                                </form>
                            </>
                        )}
                      </div>
                   </div>
                </div>
            </section>
        </main>
    );
};

// --- ACADEMICS PAGE UPDATE ---
const Academics = () => {
    const classes = [
        { name: "Nursery", img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=2070&auto=format&fit=crop", desc: "The beginning of a beautiful journey. We focus on play-based motor skill development and sensory learning.", focus: ["Cognitive Play", "Social Interaction", "Art & Music"] },
        { name: "LKG & UKG", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop", desc: "Preparing young minds for formal education with phonetic sounds, elementary counting, and etiquette.", focus: ["Early Literacy", "Numerical Foundation", "Team Building"] },
        { name: "Grade 1 - 3", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop", desc: "Core conceptual learning in English, Maths, and Social Science through project-based teaching methodologies.", focus: ["Reading Fluency", "Logical Math", "Cultural Studies"] },
        { name: "Grade 4 - 5", img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop", desc: "Transitioning into advanced analytical thinking and environmental awareness in preparation for upper-primary.", focus: ["Complex Sci-Inquiry", "Grammar Mastery", "Social Responsibility"] }
    ];

    return (
        <main className="pt-10">
            <section className="bg-primary py-24 md:py-32 text-white relative overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic">Curriculum <br /><span className="text-accent">Spectrum.</span></h1>
                    <p className="text-white/40 max-w-xl mx-auto font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">Specialized Foundation for Nursery to Grade 5</p>
                </div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </section>

            <section className="py-20 md:py-32 bg-white">
                <div className="container mx-auto px-4">
                    <SectionHeader 
                        badge="Academic Architecture"
                        title="Nurturing Brilliance Step-by-Step"
                        desc="Detailed breakdown of how we structure our basic level teaching for young scholars."
                        centered
                    />

                    <div className="space-y-20 md:space-y-32">
                        {classes.map((cls, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex flex-col lg:flex-row items-center gap-10 md:gap-24",
                                    i % 2 !== 0 && "lg:flex-row-reverse"
                                )}
                            >
                                <div className="w-full lg:w-1/2 relative group">
                                    <div className="absolute -inset-2 md:-inset-4 bg-accent/20 rounded-3xl md:rounded-[60px] blur-2xl md:blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                                    <div className="relative aspect-video bg-light-bg rounded-3xl md:rounded-[50px] overflow-hidden shadow-2xl border-4 border-white">
                                        <img src={cls.img} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={cls.name} />
                                        <div className="absolute top-4 left-4 md:top-8 md:left-8">
                                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/20 text-white font-black uppercase text-[8px] md:text-xs tracking-widest">
                                                NC-ACADEMICS-{i+1}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 space-y-6 md:space-y-10">
                                    <h3 className="text-3xl md:text-5xl font-black text-primary tracking-tighter italic">{cls.name} <span className="text-accent">.</span></h3>
                                    <p className="text-base md:text-xl text-primary/60 leading-relaxed font-medium">{cls.desc}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        {cls.focus.map((f, fi) => (
                                            <div key={fi} className="flex items-center gap-3 md:gap-4 bg-light-bg p-4 md:p-5 rounded-2xl border hover:border-accent transition-colors">
                                                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-accent"></div>
                                                <span className="text-[10px] md:text-sm font-black uppercase tracking-widest text-primary">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

// --- GALLERY PAGE UPDATE ---
const Gallery = () => {
    const photos = [
        { src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop", title: "Smart Science Lab", desc: "Advanced laboratory setup for basic experimentation and conceptual research." },
        { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop", title: "Morning Assembly", desc: "Inculcating discipline and national pride through daily prayers and updates." },
        { src: "https://images.unsplash.com/photo-1524178232363-1fb28f74b0ed?q=80&w=2070&auto=format&fit=crop", title: "ICT Learning Hub", desc: "Where students interact with digital worlds and coding fundamentals." },
        { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop", title: "Cultural Festival", desc: "Celebrating the vibrant heritage of Madhesh through art, dance, and music." },
        { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2132&auto=format&fit=crop", title: "Sports Pavilion", desc: "Promoting physical wellness and competitive spirit in athletics." },
        { src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2070&auto=format&fit=crop", title: "Play Area", desc: "Safe and modern recreational spaces for Nursery and Kindergarten scholars." }
    ];

    return (
        <main className="pt-10">
            <section className="bg-primary pt-24 pb-48 text-white text-center relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="bg-accent text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 inline-block shadow-xl">Visual Chronicles</span>
                        <h1 className="text-4xl md:text-8xl font-black mb-6 uppercase tracking-tighter italic">Photo <br /><span className="text-white/40">Archives.</span></h1>
                        <p className="text-white/60 max-w-xl mx-auto text-base md:text-lg font-medium">A window into the vibrant life, activities, and achievements of our young scholars.</p>
                    </motion.div>
                </div>
                <div className="absolute top-0 right-0 opacity-5 -mr-20 -mt-20">
                    <Camera size={500} />
                </div>
            </section>

            <section className="py-24 bg-white -mt-32 relative z-10 container mx-auto px-4">
                <div className="bg-white p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-3xl border border-light-bg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {photos.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="group bg-white rounded-[40px] overflow-hidden shadow-premium border border-light-bg"
                            >
                                <div className="aspect-video relative overflow-hidden">
                                     <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                     <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                         <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                                            <Camera size={20} />
                                         </div>
                                     </div>
                                </div>
                                <div className="p-10">
                                    <h4 className="text-2xl font-black text-primary mb-4 italic tracking-tight">{item.title}</h4>
                                    <p className="text-primary/60 text-sm leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

// --- OTHER PAGES ---
const About = () => {
    return (
        <main className="pt-10">
             <section className="bg-primary py-24 text-white relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic leading-[0.9]">Legacy Of <br /><span className="text-accent underline decoration-white/10 decoration-8 underline-offset-10">Excellence.</span></h1>
                    <p className="text-white/60 max-w-2xl text-base md:text-lg font-medium leading-relaxed">Defining the standards of education in Mahottari since 2012 with a vision beyond classrooms.</p>
                </div>
                <div className="absolute inset-0 bg-primary/40 z-0">
                  <img src="https://images.unsplash.com/photo-1541339907198-e08759df9a13?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 mix-blend-overlay" alt="About BG" />
                </div>
            </section>
            
            <section className="py-32 bg-white">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <SectionHeader 
                            badge="Our Manifesto"
                            title="Nurturing Roots, Growing Wings."
                        />
                        <div className="space-y-8 text-primary/60 text-lg leading-relaxed">
                            <p>Founded on the principles of academic rigor and moral integrity, New Concept English Medium High School has stood as a bastion of quality for over a decade. We began with a handful of students and a mountain of resolve.</p>
                            <div className="grid grid-cols-2 gap-8 py-8 border-y">
                                <div className="space-y-2">
                                    <div className="text-3xl font-black text-primary italic tracking-tighter">14+ Years</div>
                                    <p className="text-xs font-black uppercase tracking-widest text-accent">Pedagogical Experience</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-black text-primary italic tracking-tighter">1200+</div>
                                    <p className="text-xs font-black uppercase tracking-widest text-accent">Brilliant Alumni</p>
                                </div>
                            </div>
                            <p>Our curriculum is a dynamic living entity, evolving with the latest global standards while remaining firmly anchored in the cultural soil of Nepal.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="h-48 md:h-64 bg-light-bg rounded-[32px] md:rounded-[40px] overflow-hidden shadow-lg border-2 border-white"><img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Campus 1" /></div>
                            <div className="h-64 md:h-96 bg-accent/20 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-lg border-2 border-white flex items-center justify-center p-6 md:p-8 text-center">
                                <p className="text-primary font-black italic text-lg md:text-xl">"A sanctuary where every question finds a path to discovery."</p>
                            </div>
                        </div>
                        <div className="space-y-6 md:pt-12">
                            <div className="h-64 md:h-96 bg-primary/10 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-lg border-2 border-white"><img src="https://images.unsplash.com/photo-1524178232363-1fb28f74b0ed?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Campus 2" /></div>
                            <div className="h-48 md:h-64 bg-light-bg rounded-[32px] md:rounded-[40px] overflow-hidden shadow-lg border-2 border-white"><img src="https://images.unsplash.com/photo-1549845345-0cd8f813c9fb?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Campus 3" /></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Faculty Section */}
            <section className="py-32 bg-light-bg">
                <div className="container mx-auto px-4">
                    <SectionHeader 
                        badge="Our Faculty"
                        title="Meet The Mentors"
                        desc="A dedicated team of educators committed to shaping the intellectual landscape of Mahottari."
                        centered
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[
                            { name: "Sita Kumari Sah", role: "Primary Coordinator", qual: "M.Ed in English", desc: "With 12 years of experience, she leads the linguistic foundation of our young scholars with passion.", img: "https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=2070&auto=format&fit=crop" },
                            { name: "Pukar Mandal", role: "Sr. Administrator", qual: "MBA (Human Resources)", desc: "The operational backbone of New Concept, ensuring seamless academic management and student support.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" },
                            { name: "Ram Mandal", role: "Principal", qual: "M.A. (Ed. Admin)", desc: "A visionary leader focus on character building and institutional discipline.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
                            { name: "Anish Gupta", role: "ICT Instructor", qual: "B.Tech in CS", desc: "Bridging the gap between traditional learning and modern technology for our students.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" },
                            { name: "Sunita Yadav", role: "Early Childhood Lead", qual: "B.Ed (Child Psych)", desc: "Specializes in play-based learning and cognitive development for Nursery students.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
                            { name: "Kavi Raj Jha", role: "Mathematics Dept.", qual: "M.Sc in Applied Math", desc: "Simplifying complex numbers into fun challenges for primary grade students.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" }
                        ].map((faculty, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="group bg-white rounded-[50px] overflow-hidden shadow-premium border border-black/5 hover:border-accent transition-all"
                            >
                                <div className="aspect-[4/5] relative overflow-hidden">
                                     <img src={faculty.img} alt={faculty.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                     <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                                     <div className="absolute bottom-10 left-10 right-10">
                                         <div className="bg-accent text-primary px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-block mb-3">
                                            {faculty.qual}
                                         </div>
                                         <h4 className="text-2xl font-black text-white italic">{faculty.name}</h4>
                                     </div>
                                </div>
                                <div className="p-10">
                                    <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-4 italic">{faculty.role}</p>
                                    <p className="text-primary/60 text-sm leading-relaxed font-medium">{faculty.desc}</p>
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
    const [selectedNotice, setSelectedNotice] = useState<any>(null);

    const notices = [
        { 
            date: "Oct 24, 2026", 
            title: "Terminal Exam Schedule Published", 
            cat: "Exams",
            desc: "The comprehensive examination schedule for the academic term 2026-27 has been finalized. All students are advised to check their respective subjects and timings carefully. Admit cards will be distributed from the administrative office starting next Monday. Please ensure all outstanding fees are cleared before collection."
        },
        { 
            date: "Oct 20, 2026", 
            title: "Annual Science Fair Guidelines", 
            cat: "Events",
            desc: "Join us for the Annual Science Fair! Students from Grade 3-5 are invited to showcase their innovative projects. Participants must submit their project abstracts by the end of this week. The fair will be attended by guest educators from the district. Winning entries will receive special institutional awards and certificates of excellence."
        },
        { 
            date: "Oct 15, 2026", 
            title: "Holiday Announcement - Dashain Festival", 
            cat: "Urgent",
            desc: "In observance of the Dashain Festival, the school will remain closed for one week starting from October 18th. We wish all our students, teachers, and their families a joyous and safe festival season filled with prosperity. Classes will resume following the standard timetable on October 26th."
        }
    ];

    return (
        <main className="pt-10 bg-light-bg min-h-screen pb-32">
             <section className="bg-primary pt-24 pb-48 text-white relative overflow-hidden text-center">
                <div className="container mx-auto px-4 relative z-10 px-4">
                    <h1 className="text-4xl md:text-8xl font-black mb-6 uppercase tracking-tighter italic">News & <br /><span className="text-accent underline decoration-white/10 decoration-8 underline-offset-10">Alerts.</span></h1>
                    <p className="text-white/60 max-w-xl mx-auto text-base md:text-lg font-medium">Synchronized updates directly from the administrative dispatch desk.</p>
                </div>
            </section>
            
            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <div className="bg-white p-6 md:p-20 rounded-[40px] md:rounded-[60px] shadow-3xl border border-light-bg">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                        <div className="flex bg-light-bg p-3 rounded-2xl border w-full max-w-md">
                            <Search size={22} className="text-primary/30 mx-3" />
                            <input type="text" placeholder="Search archive..." className="bg-transparent border-none focus:ring-0 text-sm font-bold flex-1" />
                        </div>
                        <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2">
                             {["All", "Exams", "Events", "Urgent"].map(f => (
                                 <button key={f} className="px-6 py-2.5 rounded-full bg-light-bg text-[10px] font-black uppercase tracking-widest text-primary/40 hover:bg-accent hover:text-primary transition-all shrink-0">
                                     {f}
                                 </button>
                             ))}
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        {notices.map((n, i) => (
                            <div key={i} className="group p-8 rounded-[40px] hover:bg-light-bg border border-transparent hover:border-accent/20 transition-all flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex flex-1 gap-8 items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-primary text-accent flex flex-col items-center justify-center shrink-0">
                                        <span className="text-xs font-black leading-none">{n.date.split(' ')[1].replace(',', '')}</span>
                                        <span className="text-[10px] uppercase font-black">{n.date.split(' ')[0]}</span>
                                    </div>
                                    <div>
                                        <span className="text-accent text-[9px] font-black uppercase tracking-widest mb-1 block">{n.cat}</span>
                                        <h4 className="text-2xl font-black text-primary tracking-tight">{n.title}</h4>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedNotice(n)}
                                    className="bg-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-3"
                                >
                                    <Eye size={16} /> View Details
                                </button>
                            </div>
                        ))}
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
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-white z-[110] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-3xl"
                        >
                            <div className="p-8 md:p-16">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-14 h-14 rounded-2xl bg-primary text-accent flex flex-col items-center justify-center shrink-0">
                                            <span className="text-[10px] font-black leading-none">{selectedNotice.date.split(' ')[1].replace(',', '')}</span>
                                            <span className="text-[8px] uppercase font-black">{selectedNotice.date.split(' ')[0]}</span>
                                        </div>
                                        <div>
                                            <span className="text-accent text-[9px] font-black uppercase tracking-widest mb-1 block">{selectedNotice.cat}</span>
                                            <h3 className="text-3xl font-black text-primary tracking-tighter italic leading-tight">{selectedNotice.title}</h3>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedNotice(null)} className="p-3 bg-light-bg rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="bg-light-bg p-8 md:p-12 rounded-[40px] border border-black/5 whitespace-pre-line text-primary/70 leading-relaxed font-medium">
                                    {selectedNotice.desc}
                                </div>
                                <div className="mt-12 flex justify-end">
                                    <button 
                                        onClick={() => setSelectedNotice(null)}
                                        className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-accent hover:text-primary transition-all"
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
    return (
        <main className="pt-10 bg-white">
            <section className="container mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <div>
                    <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] mb-8 block">Locate Us</span>
                    <h1 className="text-4xl md:text-7xl font-black text-primary mb-10 tracking-tighter leading-tight italic uppercase">
                        Visit Our <br />
                        <span className="text-primary/40 underline decoration-accent/20 decoration-8 underline-offset-10">Administrative</span> <br />
                        Floor.
                    </h1>
                    
                    <div className="space-y-12">
                         <div className="flex gap-8 group">
                            <div className="w-16 h-16 rounded-3xl bg-light-bg flex items-center justify-center text-accent group-hover:bg-primary transition-all shrink-0"><MapPin size={24} /></div>
                            <div>
                                <h4 className="font-black text-primary mb-2 text-xl italic tracking-tight">Geo Location</h4>
                                <p className="text-primary/60 text-lg leading-relaxed">Baheda, Ekdara-05, Mahottari, Madhesh Province Nepal.</p>
                            </div>
                         </div>
                         <div className="flex gap-8 group">
                            <div className="w-16 h-16 rounded-3xl bg-light-bg flex items-center justify-center text-accent group-hover:bg-primary transition-all shrink-0"><Phone size={24} /></div>
                            <div>
                                <h4 className="font-black text-primary mb-2 text-xl italic tracking-tight">Direct Hotlines</h4>
                                <p className="text-primary/60 text-lg leading-relaxed">+977-9800000000 / 9811111111</p>
                            </div>
                         </div>
                    </div>
                </div>
                
                <div className="relative group">
                    <div className="absolute -inset-10 bg-accent/5 rounded-full blur-[100px]"></div>
                    <div className="relative rounded-[60px] overflow-hidden shadow-3xl border-8 border-white bg-light-bg aspect-square">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113941.56453916942!2d85.73684879726562!3d26.7388102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec427f7f0c111d%3A0x67303f8f7c9e054b!2sEkdara!5e0!3m2!1sen!2snp!4v1715959325432!5m2!1sen!2snp" 
                            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700" 
                            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" 
                        />
                    </div>
                </div>
            </section>

            {/* Personnel Section */}
            <section className="py-32 bg-light-bg">
                <div className="container mx-auto px-4">
                    <SectionHeader 
                        badge="Contact Personnel"
                        title="Meet Our Outreach Team"
                        desc="Connect directly with our administrators for specific academic or legal inquiries."
                        centered
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Pukar Mandal", role: "Sr. Administrator", phone: "+977-9824888046", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" },
                            { name: "Suman Kumar", role: "Admission Head", phone: "+977-9811122233", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" },
                            { name: "Anita Kumari", role: "Public Relations", phone: "+977-9811144455", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
                            { name: "Vikram Shah", role: "Logistics Mgr", phone: "+977-9811166677", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" }
                        ].map((person, i) => (
                            <div key={i} className="bg-white p-6 rounded-[32px] border border-black/5 hover:border-accent group transition-all">
                                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <img src={person.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={person.name} />
                                </div>
                                <h4 className="text-lg font-black text-primary mb-1">{person.name}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">{person.role}</p>
                                <a href={`tel:${person.phone}`} className="flex items-center gap-3 text-xs font-bold text-primary/60 hover:text-primary transition-colors">
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
            </Routes>
          </AnimatePresence>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
