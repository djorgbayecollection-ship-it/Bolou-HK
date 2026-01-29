"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, Rocket, GraduationCap, Laptop, Cog, Phone, Globe } from "lucide-react";

const otherServices = [
  { name: "Formation", icon: <GraduationCap size={18} />, href: "/services/formation" },
  { name: "Assistance & Création", icon: <Rocket size={18} />, href: "/services/assistance" },
  { name: "Digital", icon: <Laptop size={18} />, href: "/services/digital" },
  { name: "Services Divers", icon: <Cog size={18} />, href: "/services/divers" },
];

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("FR");

  // Initialisation de Google Translate (Optionnel mais puissant)
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.setAttribute("src", "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit");
    document.body.appendChild(addScript);
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'fr',
        includedLanguages: 'en,fr,es,ar',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };
  }, []);

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="relative flex items-center hover:opacity-90 transition-opacity">
          <div className="relative w-48 h-12"> 
            <Image 
              src="/logo.png" 
              alt="BOLOU-HK GROUPE" 
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* LINKS DESKTOP */}
        <div className="hidden lg:flex items-center gap-6">
          <NavLink href="/">Accueil</NavLink>
          <NavLink href="/apropos">À Propos</NavLink>
          <NavLink href="/voyages">Voyages</NavLink>
          <NavLink href="/assurances">Assurances</NavLink>
          <NavLink href="/traiteur">Traiteur</NavLink>
          <NavLink href="/import-export">Import-Export</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          
          <div 
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 font-bold text-slate-700 hover:text-brand-blue transition-colors py-8 text-xs uppercase tracking-tight">
              Services + <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-[80%] right-0 w-72 bg-white shadow-2xl rounded-3xl border border-slate-100 p-4"
                >
                  <div className="grid gap-2">
                    {otherServices.map((service) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-brand-blue font-semibold transition-all group"
                      >
                        <span className="p-2 bg-slate-100 rounded-xl group-hover:bg-brand-blue group-hover:text-white transition-all">
                          {service.icon}
                        </span>
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ACTIONS & TRADUCTION */}
        <div className="flex items-center gap-4">
          
          {/* SÉLECTEUR DE LANGUE */}
          <div className="hidden md:flex items-center gap-2 mr-2">
            <div id="google_translate_element" className="hidden"></div>
            <button className="flex items-center gap-1 text-xs font-black text-slate-500 hover:text-brand-orange transition-colors border-2 border-slate-100 px-3 py-1.5 rounded-full">
              <Globe size={14} />
              <span>{currentLang}</span>
            </button>
          </div>

          <Link 
            href="/contact"
            className="hidden sm:flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full font-bold shadow-xl shadow-brand-blue/20 hover:bg-brand-orange hover:-translate-y-1 transition-all duration-300 text-sm"
          >
            <Phone size={16} />
            <span>Parlons de votre projet</span>
          </Link>
          
          <button 
            className="lg:hidden p-2 text-brand-blue"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              <Link href="/" className="font-bold text-lg text-slate-700">Accueil</Link>
              <Link href="/apropos" className="font-bold text-lg text-slate-700">À Propos</Link>
              <Link href="/services" className="font-bold text-lg text-slate-700">Services</Link>
              <Link href="/blog" className="font-bold text-lg text-slate-700">Blog</Link>
              <Link href="/contact" className="bg-brand-orange text-white p-4 rounded-2xl text-center font-bold">Contactez-nous</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="relative group font-bold text-slate-700 hover:text-brand-blue transition-colors text-xs uppercase tracking-tight">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}