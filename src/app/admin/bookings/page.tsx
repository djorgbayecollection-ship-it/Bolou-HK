"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, Timestamp 
} from "firebase/firestore";
import { 
  Phone, Trash2, Calendar, ShieldCheck, 
  CheckCircle2, FileSearch, Filter, 
  Plane, Clock, Briefcase, GraduationCap, Ship, Utensils, Image as ImageIcon
} from "lucide-react";

// --- TYPES FIRESTORE ---
type BookingType = {
  id: string;
  originTable: "bookings" | "leads";
  clientName?: string;
  name?: string;
  service?: string;
  interest?: string;
  type?: string;
  status?: string;
  message?: string;
  carteGrise?: string;
  permis?: string;
  image?: string;
  whatsapp?: string;
  phone?: string;
  createdAt?: Timestamp;
};

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [filter, setFilter] = useState("tous");

  useEffect(() => {
    const qBookings = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const qLeads = query(collection(db, "leads"), orderBy("createdAt", "desc"));

    const unsubBookings = onSnapshot(qBookings, (snapBookings) => {
      const bookingsData: BookingType[] = snapBookings.docs.map(d => ({
        id: d.id,
        ...d.data() as Omit<BookingType, 'id' | 'originTable'>,
        originTable: 'bookings'
      }));

      const unsubLeads = onSnapshot(qLeads, (snapLeads) => {
        const leadsData: BookingType[] = snapLeads.docs.map(d => ({
          id: d.id,
          ...d.data() as Omit<BookingType, 'id' | 'originTable'>,
          originTable: 'leads'
        }));

        const combined = [...bookingsData, ...leadsData].sort((a, b) => {
          const dateA = a.createdAt?.toDate().getTime() || 0;
          const dateB = b.createdAt?.toDate().getTime() || 0;
          return dateB - dateA;
        });

        setBookings(combined);
      });

      return () => unsubLeads();
    });

    return () => unsubBookings();
  }, []);

  const deleteBooking = async (id: string, table: "bookings" | "leads" = "bookings") => {
    if (confirm("🚨 Supprimer définitivement cette demande ?")) {
      await deleteDoc(doc(db, table, id));
    }
  };

  const toggleStatus = async (id: string, currentStatus: string, table: "bookings" | "leads" = "bookings") => {
    const nextStatus = currentStatus === "traité" ? "nouveau" : "traité";
    await updateDoc(doc(db, table, id), { status: nextStatus });
  };

  const getServiceIcon = (service?: string, interest?: string) => {
    const s = (service || interest || "").toLowerCase();
    if (s.includes("assurance")) return <ShieldCheck size={28} className="text-blue-600" />;
    if (s.includes("creation") || s.includes("assistance") || s.includes("gestion")) return <Briefcase size={28} className="text-emerald-600" />;
    if (s.includes("formation") || s.includes("academy")) return <GraduationCap size={28} className="text-purple-600" />;
    if (s.includes("import")) return <Ship size={28} className="text-indigo-600" />;
    if (s.includes("traiteur")) return <Utensils size={28} className="text-rose-600" />;
    return <Plane size={28} className="text-orange-600" />;
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === "tous") return true;
    const searchString = `${b.service || ''} ${b.interest || ''} ${b.type || ''}`.toLowerCase();

    if (filter === "voyage") return searchString.includes("voyage") || searchString.includes("billetterie");
    if (filter === "traiteur") return searchString.includes("traiteur");
    if (filter === "creation") return searchString.includes("creation") || searchString.includes("gestion") || searchString.includes("assistance");
    return searchString.includes(filter.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
            Leads & <span className="text-orange-500">Opportunités</span>
          </h2>
          <p className="text-slate-500 font-medium italic text-sm mt-1">Flux synchronisé (Bookings & Leads).</p>
        </div>

        <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-1">
          <FilterButton active={filter === "tous"} onClick={() => setFilter("tous")} label="Tous" />
          <FilterButton active={filter === "assurance"} onClick={() => setFilter("assurance")} label="Assurances" />
          <FilterButton active={filter === "voyage"} onClick={() => setFilter("voyage")} label="Voyages" />
          <FilterButton active={filter === "creation"} onClick={() => setFilter("creation")} label="Business" />
          <FilterButton active={filter === "traiteur"} onClick={() => setFilter("traiteur")} label="Traiteur" />
        </div>
      </header>

      <div className="grid gap-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <div 
              key={b.id} 
              className={`bg-white p-8 rounded-[3rem] border-2 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-sm hover:shadow-xl ${b.status === "traité" ? "border-green-100 opacity-70" : "border-slate-100"}`}
            >
              <div className="flex gap-6 items-start flex-1">
                <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner bg-slate-50">
                  {getServiceIcon(b.service, b.interest)}
                </div>
                
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-slate-900 uppercase text-xl italic leading-none">{b.clientName || b.name}</h3>
                    <span className={`px-3 py-1 text-[8px] font-black uppercase rounded-lg tracking-widest ${b.status === "traité" ? "bg-green-500 text-white" : "bg-orange-100 text-orange-600"}`}>
                      {b.status === "traité" ? "Traité" : "Nouveau"}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-slate-400 text-[11px] font-bold uppercase tracking-tight italic">
                    <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      <Clock size={14} className="text-orange-500"/> {b.service || b.interest || b.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14}/> {b.createdAt?.toDate().toLocaleDateString('fr-FR') || "Date inconnue"}
                    </span>
                  </div>

                  {b.message && (
                    <p className="text-slate-600 text-sm mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      " {b.message} "
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {b.carteGrise && <DocLink url={b.carteGrise} label="Carte Grise" color="bg-blue-600" />}
                    {b.permis && <DocLink url={b.permis} label="Permis/CNI" color="bg-indigo-600" />}
                    {b.image && (
                      <a href={b.image} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-[9px] font-black uppercase hover:scale-105 transition-transform">
                        <ImageIcon size={14} /> Voir l'offre
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleStatus(b.id, b.status || "nouveau", b.originTable)}
                  className={`p-4 rounded-2xl transition-all ${b.status === "traité" ? "bg-green-500 text-white" : "bg-white text-slate-300 border-2 border-slate-100 hover:text-green-500"}`}
                >
                  <CheckCircle2 size={24} />
                </button>

                <a 
                  href={`https://wa.me/${(b.whatsapp || b.phone || "").replace(/\s+/g, '')}`} 
                  target="_blank"
                  className="flex items-center justify-center gap-3 bg-green-500 text-white px-8 py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-900 transition-all shadow-lg"
                >
                  <Phone size={18} /> RÉPONDRE
                </a>

                <button 
                  onClick={() => deleteBooking(b.id, b.originTable)} 
                  className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[4rem] p-24 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-black uppercase italic tracking-widest text-sm">Aucune demande trouvée.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- COMPONENTS UTILES ---
function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? "bg-white text-slate-900 shadow-md scale-105" : "text-slate-400 hover:text-slate-600"}`}
    >
      {label}
    </button>
  );
}

function DocLink({ url, label, color }: { url: string, label: string, color: string }) {
  return (
    <a href={url} target="_blank" className={`flex items-center gap-2 px-4 py-2 ${color} text-white rounded-xl text-[9px] font-black uppercase hover:scale-105 transition-transform shadow-lg`}>
      <FileSearch size={14} /> {label}
    </a>
  );
}
