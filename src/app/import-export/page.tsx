"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from 'typewriter-effect';
import { db } from "@/lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  Plane, Ship, Package, Zap, ChevronRight, 
  Globe2, Clock, ShieldCheck, 
  Calendar, CheckCircle2, TrendingUp, X, Send, Utensils, MapPin
} from "lucide-react";

// --- COMPOSANT MODAL FORMULAIRE AVEC ÉCRAN DE SUCCÈS ---
const QuoteModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nom: formData.get("nom"),
      whatsapp: formData.get("whatsapp"),
      destination: formData.get("destination"),
      marchandise: formData.get("marchandise"),
      poids: formData.get("poids"),
      details: formData.get("details"),
      status: "en_attente",
      createdAt: serverTimestamp(),
    };

    try {
      // 1. Enregistrement dans la base de données Firebase
      await addDoc(collection(db, "devis"), data);

      // 2. Préparation du message WhatsApp
      const phone = "2250703353873"; // 🔥 REMPLACE PAR TON NUMÉRO (avec indicatif, sans le +)
      const message = `*NOUVELLE DEMANDE DE DEVIS* 📦%0A%0A` +
        `👤 *Nom:* ${data.nom}%0A` +
        `📱 *WhatsApp:* ${data.whatsapp}%0A` +
        `📍 *Destination:* ${data.destination}%0A` +
        `📦 *Marchandise:* ${data.marchandise}%0A` +
        `⚖️ *Poids:* ${data.poids} kg%0A` +
        `📝 *Détails:* ${data.details || 'Aucun'}`;

      const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

      // 3. Ouverture de WhatsApp dans un nouvel onglet
      window.open(whatsappUrl, "_blank");

      // 4. Affichage de l'écran de succès
      setIsSuccess(true);
      
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 3500);
    } catch (error) {
      console.error("Erreur Firebase:", error);
      alert("Une erreur est survenue lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[3rem] max-w-lg w-full overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form-content"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col h-full"
            >
              <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                <h3 className="text-xl font-black uppercase italic">Demande de Devis</h3>
                <button onClick={onClose} className="hover:rotate-90 transition-transform"><X /></button>
              </div>

              <form className="p-8 space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <input name="nom" required type="text" placeholder="Nom complet" className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-blue-500" />
                  <input name="whatsapp" required type="tel" placeholder="WhatsApp" className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-blue-500" />
                </div>

                <select 
                  name="destination" 
                  required 
                  defaultValue=""
                  className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-blue-500 appearance-none"
                >
                  <option value="" disabled>Choisir une destination...</option>
                  <optgroup label="Axes Internationaux">
                    <option value="Import Chine → Abidjan">Import Chine → Abidjan</option>
                    <option value="Export Abidjan → Paris">Export Abidjan → Paris</option>
                    <option value="Import Dubaï → Abidjan">Import Dubaï → Abidjan</option>
                  </optgroup>
                  <optgroup label="Axe Afrique">
                    <option value="Transit → Libreville (Gabon)">Transit → Libreville (Gabon)</option>
                    <option value="Transit → Brazzaville (Congo)">Transit → Brazzaville (Congo)</option>
                    <option value="Transit → Cameroun">Transit → Cameroun</option>
                    <option value="Transit → Kinshasa (RDC)">Transit → Kinshasa (RDC)</option>
                    <option value="Transit → Bamako (Mali)">Transit → Bamako (Mali)</option>
                    <option value="Transit → Dakar (Sénégal)">Transit → Dakar (Sénégal)</option>
                  </optgroup>
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <input name="marchandise" required type="text" placeholder="Marchandise" className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none" />
                  <input name="poids" required type="number" placeholder="Poids (kg)" className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none" />
                </div>

                <textarea name="details" placeholder="Précisions..." rows={2} className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none resize-none"></textarea>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase italic flex items-center justify-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Clock size={20} />
                    </motion.div>
                  ) : (
                    <>Envoyer ma demande <Send size={16} /></>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success-content"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-12 text-center"
            >
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100"
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <h3 className="text-3xl font-black uppercase italic text-slate-900 mb-2">Demande Reçue !</h3>
              <p className="text-slate-500 font-medium italic leading-relaxed">
                Votre demande a été transmise à nos experts. <br />
                Nous vous contacterons sur <span className="text-blue-600 font-bold underline">WhatsApp</span> très rapidement.
              </p>
              
              <div className="mt-10 w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: 3, ease: "easeInOut" }}
                  className="w-full h-full bg-emerald-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    intro: "Dubaï comme porte d’entrée internationale, Abidjan comme destination finale.",
    details: [
      { label: "Modes", val: "Avion & Bateau", icon: <Ship size={16} /> },
      { label: "Sourcing", val: "Accompagnement", icon: <TrendingUp size={16} /> },
      { label: "Sécurité", val: "100% Garanti", icon: <ShieldCheck size={16} /> }
    ],
  },
  {
    id: "afrique",
    title: "Axe Afrique",
    icon: <MapPin size={24} />,
    color: "bg-emerald-600",
    badge: "Transit Sous-Régional",
    intro: "Un réseau interconnecté à travers tout le continent.",
    details: [
      { label: "Zones", val: "UEMOA & CEMAC", icon: <Globe2 size={16} /> },
      { label: "Pays", val: "Mali, Sénégal, Gabon...", icon: <CheckCircle2 size={16} /> },
      { label: "Suivi", val: "Temps Réel", icon: <Zap size={16} /> }
    ],
    countries: [
      "Libreville (Gabon)", "Brazzaville (Congo)", "Cameroun", "Kinshasa (RDC)", 
      "Conakry (Guinée)", "Bamako (Mali)", "Ouagadougou (Burkina)", "Dakar (Sénégal)"
    ]
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
            <div className="mt-8 min-h-[100px]">
              <div className="text-slate-400 text-lg italic font-medium max-w-xl leading-relaxed">
                Simplifiez vos échanges entre{" "}
                <span className="text-white font-bold inline-block">
                  <Typewriter
                    options={{
                      strings: ["la Chine, Dubaï et Paris.", "Abidjan et Libreville.", "Bamako, Ouaga et le Sénégal."],
                      autoStart: true, loop: true, delay: 40, cursor: "_"
                    }}
                  />
                </span> avec une rigueur absolue.
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl aspect-square">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80" alt="Logistique" className="w-full h-full object-cover grayscale-[20%]" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION AXES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="text-3xl font-black italic uppercase text-slate-900">Axes Stratégiques de <span className="text-blue-600">Transit</span></h2>
          <div className="flex flex-wrap bg-slate-100 p-2 rounded-2xl gap-1">
            {ROUTES.map((route) => (
              <button 
                key={route.id} 
                onClick={() => setActiveRoute(route.id)} 
                className={`px-6 md:px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeRoute === route.id ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}
              >
                {route.id === "afrique" ? "Afrique" : route.title.split(' ↔ ')[0]}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeRoute} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid lg:grid-cols-2 gap-8">
            <div className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${current?.color}`}>{current?.icon}</div>
                  <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase">{current?.badge}</span>
                </div>
                <h3 className="text-4xl font-black uppercase italic text-slate-900 mb-4">{current?.title}</h3>
                <p className="text-slate-500 font-medium italic mb-8 leading-relaxed">{current?.intro}</p>
                
                {current?.id === "afrique" && (
                  <div className="mb-8 flex flex-wrap gap-2">
                    {current.countries?.map((c, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">{c}</span>
                    ))}
                  </div>
                )}

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

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6">Logistique Certifiée</h4>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0"><Utensils size={18} className="text-orange-500"/></div>
                        <div>
                            <p className="font-black italic uppercase text-sm">Fret Alimentaire</p>
                            <p className="text-xs text-slate-400 italic mt-1">Denrée alimentaire et divers</p>
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
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* FOOTER */}
      <section className="py-20 bg-slate-50 border-y border-slate-100 text-center">
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {PARTNERS.map(p => (<span key={p} className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter">{p}</span>))}
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}