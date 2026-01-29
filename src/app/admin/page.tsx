"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";
import { 
  MessageSquare, Loader2, ArrowUpRight, Clock, Mail, 
  Download, Target, TrendingUp, Utensils, Plane, 
  MonitorSmartphone, GraduationCap, Layout, Star,
  Ship, Eye, Users // Ajout des icônes pour les stats visiteurs
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    partners: 0,
    testimonials: 0,
    voyages: 0,
    subscribers: 0,
    ads: 0,
    traiteur: 0,
    quotes: 0,
    visits: 0, // NOUVEAU : Statistiques de visites
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          leadSnap, 
          voyageSnap, 
          partnerSnap, 
          testimonialSnap, 
          subSnap, 
          adSnap, 
          traiteurSnap,
          quoteSnap,
          visitSnap // Récupération des visites
        ] = await Promise.all([
          getDocs(collection(db, "leads")),
          getDocs(collection(db, "voyages")),
          getDocs(collection(db, "partners")),
          getDocs(collection(db, "testimonials")),
          getDocs(collection(db, "subscribers")),
          getDocs(collection(db, "ads")),
          getDocs(collection(db, "traiteur")),
          getDocs(collection(db, "quotes")),
          getDocs(collection(db, "visits")) // Nouvelle collection pour les stats
        ]);

        const allLeads = [
          ...leadSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), isQuote: false })),
          ...quoteSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), isQuote: true, service: "Logistique" }))
        ];

        setStats({
          totalLeads: leadSnap.size + quoteSnap.size,
          partners: partnerSnap.size,
          testimonials: testimonialSnap.size,
          voyages: voyageSnap.size,
          subscribers: subSnap.size,
          ads: adSnap.size,
          traiteur: traiteurSnap.size,
          quotes: quoteSnap.size,
          visits: visitSnap.size // Mise à jour du compteur
        });

        const sortedLeads = allLeads.sort((a: any, b: any) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        }).slice(0, 8);
        
        setRecentBookings(sortedLeads);

      } catch (error) {
        console.error("Erreur Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const exportToExcel = () => {
    const dataToExport = recentBookings.map(book => ({
      Date: book.createdAt?.toDate ? book.createdAt.toDate().toLocaleString() : "N/A",
      Client: book.clientName || book.name,
      Service: book.isQuote ? `Logistique (${book.type})` : (book.service || book.interest),
      Contact: book.whatsapp || book.phone,
      Message: book.message || "Aucun message",
      Statut: book.status || "Nouveau"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    X.utils.book_append_sheet(workbook, worksheet, "Reporting BOLOU-HK");
    XLSX.writeFile(workbook, `Reporting_BHK_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Chargement des données HK...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4">
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Management • Live</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            DASHBOARD<span className="text-orange-500">.</span>
          </h1>
        </div>
        
        <button onClick={exportToExcel} className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase hover:bg-orange-500 transition-all shadow-xl">
          <Download size={16} /> Exporter les Leads
        </button>
      </header>

      {/* STATS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Eye size={22} />} label="Audience Web" value={stats.visits} trend="Visiteurs uniques" color="bg-indigo-600" link="/admin/stats" />
        <StatCard icon={<Ship size={22} />} label="Import-Export" value={stats.quotes} trend="Devis logistiques" color="bg-blue-600" link="/admin/import-export" />
        <StatCard icon={<Utensils size={22} />} label="Traiteur" value={stats.traiteur} trend="Commandes en ligne" color="bg-orange-500" link="/admin/traiteur" />
        <StatCard icon={<TrendingUp size={22} />} label="Total Leads" value={stats.totalLeads} trend="Toutes demandes" color="bg-slate-900" link="/admin/bookings" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* FLUX ENTRANTS */}
        <div className="lg:col-span-2 bg-white rounded-[4rem] p-10 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black uppercase italic flex items-center gap-3 text-slate-900">
              <Clock className="text-orange-500" size={24} /> Dernières Activités
            </h2>
          </div>

          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((book) => (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={book.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      {getDynamicIcon(book.isQuote ? "logistique" : (book.service || book.interest))}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 uppercase text-sm leading-none">{book.clientName || book.name}</p>
                      <p className="text-[9px] text-orange-500 font-black uppercase mt-2 tracking-widest">
                        {book.isQuote ? `Devis ${book.type}` : (book.service || book.interest)}
                      </p>
                    </div>
                  </div>
                  
                  <a href={`https://wa.me/${(book.whatsapp || book.phone || "").replace(/[^0-9]/g, '')}`} target="_blank" className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform">
                    <MessageSquare size={18} />
                  </a>
                </motion.div>
              ))
            ) : (
              <p className="text-center py-10 text-slate-400 italic">Aucune activité récente.</p>
            )}
          </div>
        </div>

        {/* ACTIONS RAPIDES & TRACKING */}
        <div className="space-y-8">
          {/* NOUVEAU BLOC : ACCÈS STATS */}
          <div className="bg-indigo-900 rounded-[3.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                 <Users className="text-indigo-400" size={20} />
                 <h3 className="font-black uppercase italic text-[10px] tracking-widest">Traffic Insight</h3>
               </div>
               <p className="text-3xl font-black italic mb-6">{stats.visits} Visiteurs</p>
               <Link href="/admin/stats" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-500 hover:text-white transition-all">
                 Voir l'analyse <ArrowUpRight size={14} />
               </Link>
             </div>
             <Eye className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl">
            <h2 className="text-xl font-black uppercase italic mb-8 text-orange-500">Navigation</h2>
            <div className="space-y-3">
              <QuickActionButton href="/admin/stats" label="Statistiques Visiteurs" />
              <QuickActionButton href="/admin/import-export" label="Import-Export" />
              <QuickActionButton href="/admin/traiteur" label="Menu Traiteur" />
              <QuickActionButton href="/admin/newsletter" label="Abonnés Newsletter" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fonction utilitaire icônes
function getDynamicIcon(service: string) {
  const s = service?.toLowerCase() || "";
  if (s.includes("logistique") || s.includes("import") || s.includes("export")) return <Ship size={22} />;
  if (s.includes("traiteur") || s.includes("plat")) return <Utensils size={22} />;
  if (s.includes("digital") || s.includes("dev")) return <MonitorSmartphone size={22} />;
  if (s.includes("voyage")) return <Plane size={22} />;
  return <MessageSquare size={22} />;
}

function StatCard({ icon, label, value, trend, color, link }: any) {
  return (
    <Link href={link} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all block relative overflow-hidden group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${color} text-white shadow-lg relative z-10`}>{icon}</div>
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest relative z-10">{label}</p>
      <p className="text-4xl font-black text-slate-900 mt-2 italic relative z-10">{value}</p>
      <p className="text-[9px] font-bold text-slate-400 uppercase mt-4 bg-slate-50 inline-block px-3 py-1.5 rounded-full relative z-10">{trend}</p>
    </Link>
  );
}

function QuickActionButton({ href, label }: any) {
  return (
    <Link href={href} className="flex items-center justify-between w-full p-5 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-orange-500 hover:border-orange-500 transition-all group">
      <span className="font-bold text-[10px] uppercase tracking-widest">{label}</span>
      <ArrowUpRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}