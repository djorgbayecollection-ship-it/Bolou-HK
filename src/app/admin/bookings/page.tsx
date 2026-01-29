"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { 
  Phone, Trash2, Calendar, ShieldCheck, 
  CheckCircle2, FileSearch, Filter, 
  Plane, Clock, Briefcase, GraduationCap, Ship, Utensils
} from "lucide-react";

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("tous");

  useEffect(() => {
    // On écoute la collection "leads" (ou "bookings" selon ton choix précédent)
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setBookings(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const deleteBooking = async (id: string) => {
    if (confirm("🚨 Supprimer définitivement cette demande ?")) {
      await deleteDoc(doc(db, "leads", id));
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "traité" ? "nouveau" : "traité";
    await updateDoc(doc(db, "leads", id), { status: nextStatus });
  };

  // Logique d'icône dynamique selon le service
  const getServiceIcon = (service: string) => {
    const s = service?.toLowerCase() || "";
    if (s.includes("assurance")) return <ShieldCheck size={28} className="text-blue-600" />;
    if (s.includes("creation") || s.includes("assistance")) return <Briefcase size={28} className="text-emerald-600" />;
    if (s.includes("formation") || s.includes("academy")) return <GraduationCap size={28} className="text-purple-600" />;
    if (s.includes("import")) return <Ship size={28} className="text-indigo-600" />;
    if (s.includes("traiteur")) return <Utensils size={28} className="text-rose-600" />;
    return <Plane size={28} className="text-orange-600" />;
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === "tous") return true;
    return b.service?.toLowerCase().includes(filter) || b.interest?.toLowerCase().includes(filter);
  });

  return (
    <div className="space-y-8">
      {/* HEADER AVEC FILTRES DYNAMIQUES */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
            Leads & <span className="text-orange-500">Opportunités</span>
          </h2>
          <p className="text-slate-500 font-medium italic text-sm mt-1">Flux centralisé des demandes multi-services.</p>
        </div>

        <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-1">
          <FilterButton active={filter === "tous"} onClick={() => setFilter("tous")} label="Tous" />
          <FilterButton active={filter === "assurance"} onClick={() => setFilter("assurance")} label="Assurances" />
          <FilterButton active={filter === "creation"} onClick={() => setFilter("creation")} label="Business" />
          <FilterButton active={filter === "formation"} onClick={() => setFilter("formation")} label="Academy" />
          <FilterButton active={filter === "voyage"} onClick={() => setFilter("voyage")} label="Voyages" />
        </div>
      </header>

      {/* LISTE DES DEMANDES */}
      <div className="grid gap-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <div 
              key={b.id} 
              className={`bg-white p-8 rounded-[3rem] border-2 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-sm hover:shadow-xl ${b.status === "traité" ? "border-green-100 opacity-70" : "border-slate-100"}`}
            >
              <div className="flex gap-6 items-start flex-1">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner bg-slate-50`}>
                  {getServiceIcon(b.service || b.interest)}
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
                      <Clock size={14} className="text-orange-500"/> {b.service || b.interest}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14}/> {b.createdAt?.toDate().toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  {/* Message / Détails du projet */}
                  {b.message && (
                    <p className="text-slate-500 text-sm italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      "{b.message}"
                    </p>
                  )}

                  {/* DOCUMENTS (Spécifique Assurances/Business) */}
                  {(b.carteGrise || b.permis || b.cv) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {b.carteGrise && <DocLink url={b.carteGrise} label="Carte Grise" color="bg-blue-600" />}
                      {b.permis && <DocLink url={b.permis} label="Permis/CNI" color="bg-indigo-600" />}
                      {b.cv && <DocLink url={b.cv} label="CV / Dossier" color="bg-purple-600" />}
                    </div>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleStatus(b.id, b.status)}
                  className={`p-4 rounded-2xl transition-all ${b.status === "traité" ? "bg-green-500 text-white" : "bg-white text-slate-300 border-2 border-slate-100 hover:text-green-500"}`}
                  title="Changer le statut"
                >
                  <CheckCircle2 size={24} />
                </button>

                <a 
                  href={`https://wa.me/${(b.whatsapp || b.phone || "").replace(/\s+/g, '')}`} 
                  target="_blank"
                  className="flex items-center justify-center gap-3 bg-green-500 text-white px-8 py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-green-500/20"
                >
                  <Phone size={18} /> RÉPONDRE
                </a>

                <button 
                  onClick={() => deleteBooking(b.id)} 
                  className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[4rem] p-24 text-center border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter size={32} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-black uppercase italic tracking-widest text-sm">Le dossier est vide pour ce filtre.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function FilterButton({ active, onClick, label }: any) {
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
    <a href={url} target="_blank" className={`flex items-center gap-2 px-4 py-2 ${color} text-white rounded-xl text-[9px] font-black uppercase hover:scale-105 transition-transform shadow-lg shadow-black/5`}>
      <FileSearch size={14} /> {label}
    </a>
  );
}