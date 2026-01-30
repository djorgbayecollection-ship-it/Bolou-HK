"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Rocket, 
  GraduationCap, 
  Laptop, 
  Cog, 
  Phone 
} from "lucide-react";

const otherServices = [
  { name: "Formation", icon: <GraduationCap size={20} />, href: "/services/formation" },
  { name: "Assistance & Création", icon: <Rocket size={20} />, href: "/services/assistance" },
  { name: "Digital", icon: <Laptop size={20} />, href: "/services/digital" },
  { name: "Services Divers", icon: <Cog size={20} />, href: "/services/divers" },
];

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
    document.body.style.overflow = "unset";
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="relative flex items-center hover:opacity-90 transition-opacity">
          <div className="relative w-40 h-10 md:w-52 md:h-14"> 
            <Image 
              src="/logo.png" 
              alt="BOLOU-HK GROUPE" 
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* LINKS DESKTOP - Taille de police augmentée à 14px (text-sm) */}
        <div className="hidden xl:flex items-center gap-6">
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
            <button className="flex items-center gap-1 font-bold text-slate-700 hover:text-brand-blue transition-colors py-8 text-sm uppercase tracking-wide">
              Services + <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-[85%] right-0 w-72 bg-white shadow-2xl rounded-3xl border border-slate-100 p-4"
                >
                  <div className="grid gap-2">
                    {otherServices.map((service) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-slate-700 hover:text-brand-blue font-bold transition-all group"
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

        {/* ACTIONS & BURGER */}
        <div className="flex items-center gap-4">
          <Link 
            href="/contact"
            className="hidden lg:flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-brand-blue/20 hover:bg-brand-orange hover:-translate-y-0.5 transition-all text-sm uppercase"
          >
            <Phone size={16} />
            <span>Contact</span>
          </Link>
          
          <button 
            className="xl:hidden p-2 text-brand-blue bg-slate-50 rounded-xl active:scale-95 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-20 bg-white z-[90] xl:hidden flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
              <MobileNavLink href="/">Accueil</MobileNavLink>
              <MobileNavLink href="/apropos">À Propos</MobileNavLink>
              <MobileNavLink href="/voyages">Voyages</MobileNavLink>
              <MobileNavLink href="/assurances">Assurances</MobileNavLink>
              <MobileNavLink href="/traiteur">Traiteur</MobileNavLink>
              <MobileNavLink href="/import-export">Import-Export</MobileNavLink>
              <MobileNavLink href="/blog">Blog</MobileNavLink>
              
              <div className="border-b border-slate-100">
                <button 
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="flex items-center justify-between w-full font-extrabold text-xl text-slate-800 py-5"
                >
                  Nos Services + <ChevronDown size={24} className={`transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isMobileServicesOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50 rounded-3xl mb-4"
                    >
                      <div className="p-5 flex flex-col gap-5">
                        {otherServices.map((s) => (
                          <Link key={s.href} href={s.href} className="flex items-center gap-4 text-slate-700 font-bold text-lg">
                            <span className="p-2 bg-white rounded-lg shadow-sm text-brand-blue">{s.icon}</span>
                            {s.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link 
                href="/contact" 
                className="mt-8 bg-brand-blue text-white p-5 rounded-2xl text-center font-bold text-lg shadow-xl shadow-brand-blue/30"
              >
                Parlons de votre projet
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="relative group font-bold text-slate-700 hover:text-brand-blue transition-colors text-sm uppercase tracking-wide">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="font-extrabold text-xl text-slate-800 py-5 border-b border-slate-100 hover:text-brand-blue transition-colors flex items-center justify-between group"
    >
      {children}
      <span className="text-brand-orange">→</span>
    </Link>
  );
}