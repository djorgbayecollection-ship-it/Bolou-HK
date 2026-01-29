"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Hotel, Globe, Navigation, X, Send, Loader2, Calendar, User, Phone } from "lucide-react";
import { db } from "@/lib/firebase"; 
import { collection, onSnapshot, query, orderBy, addDoc } from "firebase/firestore";

const travelBanners = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=2070",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070",
];

const typewriterWords = ["le Monde", "l'Afrique", "vos Rêves", "le Futur"];

interface Destination {
  id: string;
  city: string;
  country: string;
  price: string;
  description: string;
  imageUrl: string;
}

export default function VoyagesPage() {
  const [currentBg, setCurrentBg] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ÉTATS POUR LA MODALE ET LE FORMULAIRE
  const [activeBooking, setActiveBooking] = useState<{ title: string; image?: string; type: string } | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", date: "" });

  useEffect(() => {
    const bgTimer = setInterval(() => setCurrentBg((prev) => (prev + 1) % travelBanners.length), 5000);
    const wordTimer = setInterval(() => setWordIndex((prev) => (prev + 1) % typewriterWords.length), 3000);

    const q = query(collection(db, "voyages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDestinations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Destination[]);
      setLoading(false);
    });

    return () => { clearInterval(bgTimer); clearInterval(wordTimer); unsubscribe(); };
  }, []);

  // FONCTION D'ENREGISTREMENT RÉEL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert("Veuillez remplir les champs obligatoires");

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        clientName: formData.name,
        whatsapp: formData.phone,
        travelDate: formData.date,
        interest: activeBooking?.title,
        type: activeBooking?.type,
        status: "en_attente",
        createdAt: new Date()
      });

      alert("🎉 Demande envoyée ! Notre équipe vous contactera sur WhatsApp.");
      setFormData({ name: "", phone: "", date: "" }); // Reset
      setActiveBooking(null); // Fermer la modale
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      alert("Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white overflow-hidden relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div key={currentBg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0 w-full h-full">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img src={travelBanners[currentBg]} alt="BHK" className="w-full h-full object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative z-20 text-center px-6">
          <motion.h1 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase italic tracking-tighter">
            Explorez <br />
            <span className="text-brand-orange">{typewriterWords[wordIndex]}</span>
          </motion.h1>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Nos Services Experts</h2>
          <p className="text-slate-500 font-medium italic">Cliquez sur un service pour demander une cotation personnalisée.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ServiceCard icon={<Plane />} title="Billetterie" onClick={() => setActiveBooking({ title: "Billetterie Aérienne", type: "Service", image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=800" })} />
          <ServiceCard icon={<Hotel />} title="Hôtels Luxe" onClick={() => setActiveBooking({ title: "Réservation d'Hôtels", type: "Service", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800" })} />
          <ServiceCard icon={<Globe />} title="Assistance Visa" onClick={() => setActiveBooking({ title: "Assistance Visa", type: "Service", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800" })} />
          <ServiceCard icon={<Navigation />} title="Circuits" onClick={() => setActiveBooking({ title: "Circuits Touristiques", type: "Service", image: "https://images.unsplash.com/photo-1500835595336-7971e596db50?q=80&w=800" })} />
        </div>
      </section>

      {/* 3. DESTINATIONS SECTION */}
      <section className="py-32 bg-slate-900 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-20 uppercase tracking-tight italic">Destinations <span className="text-brand-orange">Fascinantes</span></h2>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="text-brand-orange animate-spin" size={48} /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {destinations.map((dest) => (
                <DestinationCard key={dest.id} dest={dest} onReserve={() => setActiveBooking({ title: dest.city, type: "Destination", image: dest.imageUrl })} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- MODALE UNIVERSELLE DE RÉSERVATION --- */}
      <AnimatePresence>
        {activeBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveBooking(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">
              <button onClick={() => setActiveBooking(null)} className="absolute top-6 right-6 z-20 p-2 bg-white/20 hover:bg-brand-orange text-white rounded-full transition-all"><X size={24} /></button>
              
              <div className="relative h-48 lg:h-auto overflow-hidden">
                <img src={activeBooking.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-10">
                  <h3 className="text-white text-3xl font-black uppercase italic tracking-tighter leading-none">{activeBooking.title}</h3>
                </div>
              </div>

              <div className="p-10 lg:p-12">
                <div className="mb-8">
                  <span className="bg-brand-orange/10 text-brand-orange px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest tracking-tighter">BHK TRAVEL AGENT</span>
                  <h4 className="text-2xl font-black text-slate-800 mt-2 italic uppercase tracking-tighter leading-none">Votre demande</h4>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-4 text-slate-300 group-focus-within:text-brand-orange transition-colors" size={18} />
                    <input required type="text" placeholder="Votre nom complet" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 outline-none focus:border-brand-orange transition-all" />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-4 text-slate-300 group-focus-within:text-brand-orange transition-colors" size={18} />
                    <input required type="tel" placeholder="WhatsApp (avec indicatif)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 outline-none focus:border-brand-orange transition-all" />
                  </div>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-4 text-slate-300 group-focus-within:text-brand-orange transition-colors" size={18} />
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 outline-none focus:border-brand-orange transition-all text-slate-600" />
                  </div>
                  
                  <button disabled={isSubmitting} className="w-full bg-brand-orange text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-brand-blue disabled:bg-slate-300 transition-all shadow-xl shadow-brand-orange/20 mt-6 group">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "ENVOYER MA DEMANDE"} <Send size={20} className="group-hover:translate-x-1 transition-transform" />
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

/* --- COMPOSANTS INTERNES --- */

function ServiceCard({ icon, title, onClick }: any) {
  return (
    <motion.div onClick={onClick} whileHover={{ y: -10 }} className="cursor-pointer p-10 rounded-[2.5rem] bg-white border-2 border-slate-50 shadow-xl shadow-slate-200/50 hover:border-brand-orange/50 transition-all flex flex-col items-center group text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-50 text-brand-blue flex items-center justify-center mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">{icon}</div>
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 italic">{title}</h3>
      <div className="mt-4 w-0 group-hover:w-12 h-1 bg-brand-orange rounded-full transition-all duration-500" />
    </motion.div>
  );
}

function DestinationCard({ dest, onReserve }: { dest: Destination, onReserve: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl">
      <img src={dest.imageUrl} alt={dest.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute bottom-10 left-10 right-10 text-white">
        <p className="text-brand-orange font-black text-xs uppercase tracking-[0.2em] mb-2">{dest.country}</p>
        <h3 className="text-4xl font-black mb-4 group-hover:text-brand-orange transition-colors uppercase italic leading-none">{dest.city}</h3>
        <p className="text-white/60 text-sm mb-6 line-clamp-2 leading-relaxed font-medium italic">{dest.description}</p>
        <div className="flex items-center gap-4">
          <button onClick={onReserve} className="flex-1 py-4 bg-white text-brand-blue font-black rounded-2xl hover:bg-brand-orange hover:text-white transition-all shadow-xl shadow-black/20 uppercase italic">Réserver</button>
          <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl font-black text-sm border border-white/10">{dest.price}</div>
        </div>
      </div>
    </motion.div>
  );
}