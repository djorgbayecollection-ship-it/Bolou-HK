"use client";
import { useState, useEffect } from "react";
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

  // Fermer le menu au changement de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
    document.body.style.overflow = "unset";
  }, [pathname]);

  // Gestion du scroll ultra-simplifiée
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 w-full z-[120] bg-white border-b border-slate-100 h-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="relative flex items-center">
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

          {/* DESKTOP LINKS */}
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
              <button className="flex items-center gap-1 font-bold text-slate-700 py-8 text-sm uppercase">
                Services + <ChevronDown size={16} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-[90%] right-0 w-72 bg-white shadow-xl rounded-2xl border border-slate-100 p-2 z-[130]">
                  {otherServices.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-colors"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BURGER BUTTON - Reactivité instantanée */}
          <div className="flex items-center gap-4">
            <Link 
              href="/contact"
              className="hidden lg:flex bg-brand-blue text-white px-6 py-3 rounded-full font-bold text-sm uppercase"
            >
              Contact
            </Link>
            
            <button 
              className="xl:hidden p-3 text-brand-blue bg-slate-100 rounded-xl z-[150] touch-manipulation"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU - VERSION SANS ANIMATION POUR VITESSE MAX */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[140] xl:hidden overflow-y-auto pt-24 pb-10">
          <div className="p-6 flex flex-col">
            <MobileNavLink href="/">Accueil</MobileNavLink>
            <MobileNavLink href="/apropos">À Propos</MobileNavLink>
            <MobileNavLink href="/voyages">Voyages</MobileNavLink>
            <MobileNavLink href="/assurances">Assurances</MobileNavLink>
            <MobileNavLink href="/traiteur">Traiteur</MobileNavLink>
            <MobileNavLink href="/import-export">Import-Export</MobileNavLink>
            <MobileNavLink href="/blog">Blog</MobileNavLink>
            
            <button 
              onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
              className="flex items-center justify-between w-full font-black text-xl text-slate-900 py-5 border-b border-slate-100"
            >
              NOS SERVICES + <ChevronDown size={24} className={isMobileServicesOpen ? 'rotate-180' : ''} />
            </button>
            
            {isMobileServicesOpen && (
              <div className="bg-slate-50 p-4 flex flex-col gap-4">
                {otherServices.map((s) => (
                  <Link key={s.href} href={s.href} className="text-slate-700 font-bold text-lg">
                    {s.name}
                  </Link>
                ))}
              </div>
            )}

            <Link 
              href="/contact" 
              className="mt-10 bg-brand-blue text-white p-5 rounded-xl text-center font-black text-lg"
            >
              CONTACTER L'AGENCE
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-bold text-slate-700 hover:text-brand-blue text-sm uppercase tracking-wide transition-colors">
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="font-black text-xl text-slate-900 py-5 border-b border-slate-100 flex items-center justify-between"
    >
      {children}
      <span className="text-brand-orange">→</span>
    </Link>
  );
}