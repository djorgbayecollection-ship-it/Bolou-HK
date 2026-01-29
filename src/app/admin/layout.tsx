"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  LogOut, 
  Loader2,
  ShieldCheck,
  Plane, 
  MessageSquare,
  Ship,
  Bell,
  Utensils,
  GraduationCap,
  Briefcase,
  MonitorSmartphone,
  Handshake, 
  Star,
  Mail,
  Layout,
  ChevronRight,
  Eye, // Ajout de l'icône pour les stats
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthorized(true);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    if(confirm("Voulez-vous vraiment vous déconnecter ?")) {
      await signOut(auth);
      router.push("/login");
    }
  };

  if (!authorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Vérification des accès HK Cloud...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* SIDEBAR FIXE */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full z-50 shadow-2xl overflow-hidden">
        
        {/* LOGO ADMIN */}
        <div className="p-8 border-b border-white/5 flex items-center gap-3 bg-slate-900">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic block leading-none">
              BHK <span className="text-orange-500">PRO</span>
            </span>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Management Suite</span>
          </div>
        </div>

        {/* NAVIGATION AVEC SCROLL CACHÉ */}
        <nav className="flex-1 p-6 space-y-8 overflow-y-auto scrollbar-hide select-none">
          
          {/* SECTION : VUE D'ENSEMBLE */}
          <div className="space-y-4">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-500 rounded-full" /> Général
            </p>
            <div className="space-y-1">
              <AdminNavLink href="/admin" active={pathname === "/admin"} icon={<LayoutDashboard size={18} />} label="Dashboard" />
              <AdminNavLink href="/admin/stats" active={pathname === "/admin/stats"} icon={<Eye size={18} />} label="Analytique Web" />
              <AdminNavLink href="/admin/bookings" active={pathname === "/admin/bookings"} icon={<MessageSquare size={18} />} label="Demandes Clients" />
            </div>
          </div>

          {/* SECTION : MARKETING */}
          <div className="space-y-4">
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest ml-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full" /> Croissance
            </p>
            <div className="space-y-1">
              <AdminNavLink href="/admin/newsletter" active={pathname === "/admin/newsletter"} icon={<Mail size={18} />} label="Base Newsletter" />
              <AdminNavLink href="/admin/publicities" active={pathname === "/admin/publicities"} icon={<Layout size={18} />} label="Espaces Pubs" />
            </div>
          </div>

          {/* SECTION : SERVICES BUSINESS */}
          <div className="space-y-4">
            <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest ml-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-orange-500 rounded-full" /> Business
            </p>
            <div className="space-y-1">
              <AdminNavLink href="/admin/traiteur" active={pathname === "/admin/traiteur"} icon={<Utensils size={18} />} label="Traiteur & Events" />
              <AdminNavLink href="/admin/voyages" active={pathname === "/admin/voyages"} icon={<Plane size={18} />} label="Voyage & Tourisme" />
              <AdminNavLink href="/admin/assurance" active={pathname === "/admin/assurance"} icon={<Briefcase size={18} />} label="Assurances" />
              <AdminNavLink href="/admin/import-export" active={pathname === "/admin/import-export"} icon={<Ship size={18} />} label="Import - Export" />
            </div>
          </div>

          {/* SECTION : IMAGE & PORTFOLIO */}
          <div className="space-y-4">
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-emerald-500 rounded-full" /> Identité
            </p>
            <div className="space-y-1">
              <AdminNavLink href="/admin/portfolio" active={pathname === "/admin/portfolio"} icon={<MonitorSmartphone size={18} />} label="Portfolio Projets" />
              <AdminNavLink href="/admin/partners" active={pathname === "/admin/partners"} icon={<Handshake size={18} />} label="Partenaires" />
              <AdminNavLink href="/admin/testimonials" active={pathname === "/admin/testimonials"} icon={<Star size={18} />} label="Témoignages" />
            </div>
          </div>

          {/* SECTION : ACADEMY */}
          <div className="space-y-4 pb-4">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-500 rounded-full" /> Éducation
            </p>
            <div className="space-y-1">
              <AdminNavLink href="/admin/formation" active={pathname === "/admin/formation"} icon={<GraduationCap size={18} />} label="HK Academy" />
            </div>
          </div>

        </nav>

        {/* DÉCONNEXION */}
        <div className="p-6 border-t border-white/5 bg-slate-950/40 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-4 w-full bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300 group font-black uppercase text-[10px] tracking-widest active:scale-95"
          >
            <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 ml-72 bg-slate-50 min-h-screen relative">
        <div className="max-w-6xl mx-auto p-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// COMPOSANT NAV LINK AMÉLIORÉ
function AdminNavLink({ href, icon, label, active }: { href: string, icon: any, label: string, active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
        active 
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 translate-x-2" 
        : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-2"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? "text-white scale-110" : "text-slate-500 group-hover:text-orange-500"} transition-all duration-300`}>
          {icon}
        </span>
        <span className={`font-bold uppercase text-[10px] tracking-tight ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
          {label}
        </span>
      </div>
      
      {active ? (
        <motion.div 
          layoutId="activeIndicator"
          className="w-1 h-4 bg-white rounded-full"
        />
      ) : (
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-30 transition-opacity" />
      )}
    </Link>
  );
}