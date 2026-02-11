"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Zap, Camera, Truck, ArrowRight, Heart, 
  Stethoscope, GraduationCap, Wallet, Phone, CheckCircle2, 
  X, Send, Car, Home, ShieldAlert, Upload, Loader2, Shield
} from "lucide-react";

// Images pour le carousel de fond
const BG_IMAGES = [
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80",
  "https://res.cloudinary.com/dkjqh8snc/image/upload/v1770803078/As_a_family_owned_and_operated_business_our_goal_is_not_to_overcharge_you_for_a_brand_name__https___www.colorcustoms_edvyw2.jpg",
  "https://res.cloudinary.com/dkjqh8snc/image/upload/v1770803154/Discover_the_5_crucial_safety_measures_to_tow_y_bp9k1e.jpg"
];

// --- CONFIG CLOUDINARY ---
const CLOUDINARY_UPLOAD_PRESET = "bolouhk";
const CLOUDINARY_CLOUD_NAME = "dkjqh8snc";

// --- DONNÉES DES OFFRES ---
const ASSURANCES_VIE = [
  { id: "deces", title: "Prévoyance Décès", desc: "Capital garanti pour vos proches.", icon: <Heart size={24} /> },
  { id: "funerailles", title: "Assistance Funéraire", desc: "Accompagner dignement un parent.", icon: <Phone size={24} /> },
  { id: "retraite", title: "Épargne & Retraite", desc: "Préparez votre futur sereinement.", icon: <Wallet size={24} /> },
  { id: "etudes", title: "Étude des enfants", desc: "Financer les études supérieures.", icon: <GraduationCap size={24} /> },
];

const ASSURANCES_NON_VIE = [
  { id: "auto", title: "Assurance Auto", desc: "Attestation et vignette en 30 min.", icon: <Car size={24} /> },
  { id: "habitation", title: "Assurance Habitation", desc: "Protégez votre foyer et vos biens.", icon: <Home size={24} /> },
  { id: "multirisque", title: "Multirisque Pro", desc: "Sécurisez votre activité commerciale.", icon: <ShieldAlert size={24} /> },
  { id: "sante", title: "Santé Famille", desc: "Accès aux soins de qualité.", icon: <Stethoscope size={24} /> },
];

export default function AssurancePage() {
  const [activeForm, setActiveForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [formData, setFormData] = useState({ name: "", whatsapp: "" });
  const [files, setFiles] = useState<{ [key: string]: File | null }>({ carteGrise: null, permis: null });

  // Carousel Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp) return alert("Veuillez remplir les champs obligatoires");
    setLoading(true);

    try {
      const uploadFile = async (file: File) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: data,
        });
        const json = await res.json();
        return json.secure_url;
      };

      let carteGriseUrl = "";
      let permisUrl = "";
      if (files.carteGrise) carteGriseUrl = await uploadFile(files.carteGrise);
      if (files.permis) permisUrl = await uploadFile(files.permis);

      await addDoc(collection(db, "bookings"), {
        clientName: formData.name,
        whatsapp: formData.whatsapp,
        interest: activeForm.title,
        carteGrise: carteGriseUrl,
        permis: permisUrl,
        status: "nouveau",
        createdAt: serverTimestamp(),
      });

      alert("Demande envoyée avec succès !");
      setActiveForm(null);
      setFormData({ name: "", whatsapp: "" });
      setFiles({ carteGrise: null, permis: null });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION UPDATED WITH BETTER BACKGROUND VISIBILITY */}
      <section className="relative pt-32 pb-40 px-6 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBg}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${BG_IMAGES[currentBg]})` }}
            >
              {/* Overlay réduit à 70% et flou réduit à 1px pour voir les images */}
              <div className="absolute inset-0 bg-slate-50/70 backdrop-blur-[1px]" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black mb-6 uppercase tracking-widest">
              <Zap size={14} /> 100% Digital & Rapide
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] mb-8 italic tracking-tighter">
              AVEC BOLOU-HK, <br /> 
              <span className="text-blue-600">GÉREZ TOUT</span> <br />
              <span className="text-slate-900 underline decoration-orange-500 decoration-8 text-6xl lg:text-7xl">EN LIGNE</span>
            </h1>
            <p className="text-xl text-slate-800 mb-10 max-w-lg font-bold italic drop-shadow-sm">
              Plus besoin de vous déplacer. Obtenez vos cotations d'assurance vie et auto avec un accompagnement d'experts.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative">
            <div className="relative z-10 w-full max-w-md mx-auto aspect-square rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl rotate-3">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" alt="Courtier" className="w-full h-full object-cover" />
            </div>
            <FloatingIcon delay={0} className="top-0 -left-10 bg-white text-blue-600"><Shield size={32} /></FloatingIcon>
            <FloatingIcon delay={0.5} className="bottom-20 -right-6 bg-orange-500 text-white"><Car size={32} /></FloatingIcon>
            <FloatingIcon delay={1} className="-top-12 right-10 bg-white text-red-500 shadow-xl"><Heart size={32} fill="currentColor" /></FloatingIcon>
          </motion.div>
        </div>
      </section>

      {/* SECTION ÉTAPES */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        <Step number="01" title="Offre" desc="Choisissez votre solution." icon={<ShieldCheck className="text-blue-600" />} />
        <Step number="02" title="Documents" desc="Scannez vos pièces." icon={<Camera className="text-orange-500" />} />
        <Step number="03" title="Livraison" desc="Recevez votre attestation." icon={<Truck className="text-green-600" />} />
      </section>

      {/* SECTION DES OFFRES */}
      <section className="py-24 px-6 bg-slate-900 text-white rounded-[4rem] mx-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase mb-20 text-center">Votre Protection <span className="text-orange-500">sur Mesure</span></h2>
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h3 className="text-2xl font-black italic uppercase mb-10 flex items-center gap-3 text-blue-400"><Heart /> Assurances Vie</h3>
              <div className="grid gap-4">
                {ASSURANCES_VIE.map(item => <OfferCard key={item.id} item={item} onSelect={setActiveForm} color="blue" />)}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase mb-10 flex items-center gap-3 text-orange-500"><Zap /> Assurances Non-Vie</h3>
              <div className="grid gap-4">
                {ASSURANCES_NON_VIE.map(item => <OfferCard key={item.id} item={item} onSelect={setActiveForm} color="orange" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODALE DE FORMULAIRE */}
      <AnimatePresence>
        {activeForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !loading && setActiveForm(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="relative w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-2xl grid md:grid-cols-2">
              <button onClick={() => setActiveForm(null)} className="absolute top-6 right-6 z-20 p-2 bg-slate-100 rounded-full hover:bg-orange-500 hover:text-white transition-all"><X size={20} /></button>

              <div className="bg-slate-900 p-12 text-white hidden md:flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6 text-white">{activeForm.icon}</div>
                  <h2 className="text-3xl font-black italic uppercase mb-4">{activeForm.title}</h2>
                  <p className="text-slate-400 text-sm font-medium italic">Cotation rapide et sécurisée BOLOU-HK.</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl italic text-sm text-orange-500 font-bold">📞 07 11 81 25 10</div>
              </div>

              <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputGroup label="Nom & Prénoms" placeholder="Votre nom complet" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} />
                  <InputGroup label="Numéro WhatsApp" placeholder="+225 07..." type="tel" value={formData.whatsapp} onChange={(e: any) => setFormData({...formData, whatsapp: e.target.value})} />
                  <div className="h-px bg-slate-100 my-6" />
                  <ScanButton label="Scan Carte Grise" sub={files.carteGrise ? "Fichier sélectionné ✅" : "Obligatoire"} onChange={(e: any) => setFiles({...files, carteGrise: e.target.files[0]})} />
                  <ScanButton label="Scan Permis / CNI" sub={files.permis ? "Fichier sélectionné ✅" : "Facultatif"} onChange={(e: any) => setFiles({...files, permis: e.target.files[0]})} />
                  <button disabled={loading} className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl disabled:opacity-50 mt-8 group">
                    {loading ? <Loader2 className="animate-spin" /> : "VALIDER MA DEMANDE"}
                    {!loading && <Send size={18} />}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

// --- SOUS-COMPOSANTS ---

function FloatingIcon({ children, className, delay = 0 }: any) {
  return (
    <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }} className={`absolute z-20 p-5 rounded-3xl shadow-xl border border-slate-100 ${className}`}>
      {children}
    </motion.div>
  );
}

function OfferCard({ item, onSelect, color }: any) {
  return (
    <div onClick={() => onSelect(item)} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group">
      <div className="flex items-center gap-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${color === 'orange' ? 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white'}`}>
          {item.icon}
        </div>
        <div>
          <h4 className="font-black italic uppercase tracking-tighter text-white transition-colors">{item.title}</h4>
          <p className="text-slate-500 text-xs font-medium italic">{item.desc}</p>
        </div>
      </div>
      <ArrowRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </div>
  );
}

function Step({ number, title, desc, icon }: any) {
  return (
    <div className="group">
      <div className="text-5xl font-black text-slate-100 mb-2 italic">{number}</div>
      <div className="flex items-center gap-3 mb-2">
        <span className="p-2 bg-white shadow-md rounded-lg">{icon}</span>
        <h3 className="font-black uppercase italic text-sm">{title}</h3>
      </div>
      <p className="text-slate-500 text-xs font-medium italic leading-relaxed">{desc}</p>
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{label}</label>
      <input required type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-orange-500 transition-all text-slate-900" />
    </div>
  );
}

function ScanButton({ label, sub, onChange }: any) {
  return (
    <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-orange-500"><Camera size={18} /></div>
        <div>
          <p className="text-[11px] font-black uppercase text-slate-700">{label}</p>
          <p className="text-[9px] font-bold text-slate-400 italic leading-none">{sub}</p>
        </div>
      </div>
      <Upload size={16} className="text-slate-300 group-hover:text-orange-500" />
      <input type="file" onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer" />
    </div>
  );
}