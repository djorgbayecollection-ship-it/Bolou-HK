"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plane, Ship, Package, Zap, ChevronRight, 
  Globe2, Clock, ShieldCheck, 
  Calendar, CheckCircle2, TrendingUp, X, Send, Utensils
} from "lucide-react";

// --- COMPOSANT MODAL FORMULAIRE ---
const QuoteModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[3rem] max-w-lg w-full overflow-hidden shadow-2xl relative"
      >
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-black uppercase italic">Demande de Devis</h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X /></button>
        </div>
        <form className="p-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nom complet" className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-blue-500" />
            <input type="tel" placeholder="WhatsApp" className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-blue-500" />
          </div>
          <select className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none">
            <option>Import Chine → Abidjan</option>
            <option>Export Abidjan → Paris</option>
            <option>Import Dubaï → Abidjan</option>
            <option>Export Abidjan → Dubaï</option>
            <option>Envoi Express (DHL/FedEx)</option>
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Marchandise" className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none" />
            <input type="number" placeholder="Poids (kg)" className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none" />
          </div>
          <textarea placeholder="Précisions sur votre cargaison..." rows={2} className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none"></textarea>
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
            Envoyer ma demande <Send size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- DONNÉES DES AXES ---
const ROUTES = [
  {
    id: "paris",
    title: "Abidjan ↔ Paris",
    icon: <Plane size={24} />,
    color: "bg-orange-500",
    badge: "Groupage Hebdomadaire",
    intro: "Express plis et colis",
    details: [
      { label: "Transit", val: "6 Heures", icon: <Clock size={16} /> },
      { label: "Dédouanement", val: "Inclus", icon: <Zap size={16} /> },
      { label: "Départs", val: "Hebdomadaires", icon: <Calendar size={16} /> }
    ],
  },
  {
    id: "chine",
    title: "Chine ↔ Abidjan",
    icon: <Globe2 size={24} />,
    color: "bg-blue-600",
    badge: "Sourcing & Transit",
    intro: "Importation sécurisée depuis Canton, Yiwu et Shanghai etc...",
    details: [
      { label: "Modes", val: "Air & Mer", icon: <Ship size={16} /> },
      { label: "Sourcing", val: "Accompagnement", icon: <TrendingUp size={16} /> },
      { label: "Sécurité", val: "100% Garanti", icon: <ShieldCheck size={16} /> }
    ],
  },
  {
    id: "Dubaï",
    title: "Dubaï ↔ Abidjan",
    icon: <Globe2 size={24} />,
    color: "bg-blue-600",
    badge: "Global Trade Hub",
    intro: "Dubaï comme porte d’entrée internationale, Abidjan comme destination finale. Nous sécurisons chaque étape de votre importation.",
    details: [
      { label: "Modes", val: "Avion & Bateau", icon: <Ship size={16} /> },
      { label: "Sourcing", val: "Accompagnement", icon: <TrendingUp size={16} /> },
      { label: "Sécurité", val: "100% Garanti", icon: <ShieldCheck size={16} /> }
    ],
  }
];

const PARTNERS = ["DHL", "FedEx", "UPS"];

export default function ImportExportPage() {
  const [activeRoute, setActiveRoute] = useState("paris");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const current = ROUTES.find(r => r.id === activeRoute);

  return (
    <main className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-20 px-6 bg-slate-900 rounded-b-[4rem] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20">
              Expertise Logistique HK
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter mt-6 leading-tight">
              BOLOU-HK <br /> <span className="text-blue-500">GROUPE.</span>
            </h1>
            <p className="text-slate-400 mt-8 text-lg italic font-medium max-w-xl leading-relaxed">
              Simplifiez vos échanges internationaux. Nous gérons le transport de vos marchandises entre la <span className="text-white">Chine, Abidjan, Dubai et Paris</span> avec une rigueur absolue.
            </p>
          </motion.div>

          <div className="relative">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl aspect-square">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80" alt="Logistique" className="w-full h-full object-cover grayscale-[20%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </motion.div>
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-6 -right-6 z-20 bg-blue-600 p-4 rounded-2xl text-white shadow-xl"><Plane size={28} /></motion.div>
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/2 -left-10 z-20 bg-white p-4 rounded-2xl text-slate-900 shadow-xl"><Package size={28} className="text-orange-500" /></motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40" />
      </section>

      {/* 2. SECTION INTERACTIVE D'AXES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black italic uppercase text-slate-900">Axes Stratégiques de <span className="text-blue-600">Transit</span></h2>
          </div>
          <div className="flex bg-slate-100 p-2 rounded-2xl">
            {ROUTES.map((route) => (
              <button 
                key={route.id} 
                onClick={() => setActiveRoute(route.id)} 
                className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeRoute === route.id ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}
              >
                {route.title}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeRoute} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid lg:grid-cols-2 gap-8">
            <div className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${current?.color}`}>{current?.icon}</div>
                  <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase">{current?.badge}</span>
                </div>
                <h3 className="text-4xl font-black uppercase italic text-slate-900 mb-4">{current?.title}</h3>
                <p className="text-slate-500 font-medium italic mb-8 leading-relaxed">{current?.intro}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {current?.details.map((d, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="text-blue-600 mb-2">{d.icon}</div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1">{d.label}</p>
                      <p className="text-sm font-bold text-slate-800">{d.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION SERVICES (Remplace les prix et listes de produits) */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6">Logistique Certifiée</h4>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0"><Utensils size={18} className="text-orange-500"/></div>
                        <div>
                            <p className="font-black italic uppercase text-sm">Fret Alimentaire</p>
                            <p className="text-xs text-slate-400 italic mt-1">denré alimentaire et divers</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0"><Ship size={18} className="text-blue-400"/></div>
                        <div>
                            <p className="font-black italic uppercase text-sm">Sourcing International</p>
                            <p className="text-xs text-slate-400 italic mt-1">Achat et transport de marchandises depuis (Chine/Turquie/dubai/paris).</p>
                        </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-10 w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-blue-600 transition-all"
                >
                  Obtenir une cotation <ChevronRight size={18} />
                </button>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 3. SECTION PARTENAIRES EXPRESS */}
      <section className="py-20 bg-slate-50 border-y border-slate-100 text-center">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">Réseau Express International</h3>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {PARTNERS.map(p => (<span key={p} className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter">{p}</span>))}
        </div>
      </section>

      {/* 4. SECTION ENGAGEMENT FINAL */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-blue-600 rounded-[4rem] p-12 md:p-20 text-white grid lg:grid-cols-2 gap-12 items-center shadow-2xl shadow-blue-500/20">
          <div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-none mb-6">Expertise <span className="text-slate-900">Sans Frontières.</span></h2>
            <div className="space-y-4">
              {["Dédouanement automatisé", "Traçabilité temps réel", "Assurance transport incluse", "Support WhatsApp 24/7"].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-slate-900" size={20} />
                  <span className="font-bold italic text-sm md:text-lg">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-[3rem] p-8 border border-white/20 text-center">
            <h4 className="text-xl font-black uppercase italic mb-4">Prêt à expédier ?</h4>
            <p className="text-sm mb-8 opacity-90 italic">Nos experts sont disponibles pour optimiser vos coûts de transport.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black uppercase italic tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl"
            >
              Démarrer mon projet
            </button>
          </div>
        </div>
      </section>

      {/* APPEL DU FORMULAIRE */}
      <AnimatePresence>
        {isModalOpen && <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}