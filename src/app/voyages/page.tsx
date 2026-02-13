"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from 'typewriter-effect';
import { 
  Plane, Hotel, Globe, Navigation, X, Send, Loader2, 
  Calendar, User, Phone, Shield, Star, Heart, Clock, MapPin, Briefcase, Activity, CheckCircle
} from "lucide-react";
import { db } from "@/lib/firebase"; 
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";

// --- CONFIGURATION ---
const travelBanners = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=2070",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070",
];

const typewriterWords = ["le Monde", "l'Afrique", "vos Rêves", "le Futur"];

const THEME_ICONS: Record<number, React.ReactElement[]> = {
  0: [<Shield key="q1" size={48} strokeWidth={2.5} />, <Star key="q2" size={48} strokeWidth={2.5} />],
  1: [<Heart key="f1" size={48} strokeWidth={2.5} />, <Navigation key="f2" size={48} strokeWidth={2.5} />],
  2: [<Plane key="d1" size={48} strokeWidth={2.5} />, <Hotel key="d2" size={48} strokeWidth={2.5} />],
  3: [<Clock key="a1" size={48} strokeWidth={2.5} />, <Globe key="a2" size={48} strokeWidth={2.5} />],
  4: [<Star key="i1" size={48} strokeWidth={2.5} />, <Heart key="i2" size={48} strokeWidth={2.5} />],
};

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
  const [showNotification, setShowNotification] = useState(false);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  const [activeBooking, setActiveBooking] = useState<{ 
    title: string; 
    image?: string; 
    type: string; 
    step?: number; 
  } | null>(null);

  const [formData, setFormData] = useState({ name: "", phone: "", date: "", destination: "", projet: "" });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert("Veuillez remplir les champs obligatoires");

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        clientName: formData.name,
        whatsapp: formData.phone,
        travelDate: formData.date,
        destinationSouhaitee: formData.destination || null,
        projetTouristique: formData.projet || null,
        interest: activeBooking?.title,
        type: activeBooking?.type || "Voyage",
        image: activeBooking?.image || null,
        status: "nouveau",
        createdAt: serverTimestamp()
      });

      setActiveBooking(null);
      setShowNotification(true);
      setFormData({ name: "", phone: "", date: "", destination: "", projet: "" });
      setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white overflow-hidden relative">
      
      {/* NOTIFICATION DE SUCCÈS PREMIUM */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 20, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-orange-500/30 p-1 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center p-4 gap-5">
                <div className="relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-500/40"
                  >
                    <CheckCircle size={28} className="text-white" strokeWidth={3} />
                  </motion.div>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-black italic uppercase text-sm tracking-tighter leading-none mb-1">
                    Demande <span className="text-orange-500">transmise !</span>
                  </h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight leading-tight">
                    Un agent BHK Voyage vous recontacte sur WhatsApp d'ici peu.
                  </p>
                </div>
                <button onClick={() => setShowNotification(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-500">
                  <X size={20} />
                </button>
              </div>
              <motion.div initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 5, ease: "linear" }} className="h-1 bg-orange-500 rounded-full mx-6 mb-1 opacity-50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
      <section className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase italic">Nos Services De Qualité</h2>
          <div className="max-w-3xl mx-auto mb-10 min-h-[140px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {THEME_ICONS[currentThemeIndex]?.map((icon, i) => (
              <motion.div
                key={`${currentThemeIndex}-${i}`}
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1.2, y: [0, -30, 0], x: i === 0 ? -220 : 220 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.5 } }}
                className="absolute text-brand-orange drop-shadow-[0_10px_10px_rgba(249,115,22,0.3)] hidden lg:flex items-center justify-center bg-white/10 backdrop-blur-sm p-4 rounded-full border border-brand-orange/20"
              >
                {icon}
              </motion.div>
            ))}
            </AnimatePresence>
            <div className="text-slate-600 text-lg md:text-2xl leading-relaxed font-medium italic text-center z-10 px-10">
            <Typewriter
            onInit={(typewriter) => {
              typewriter
                // --- PHRASE 1 ---
                .typeString("Nos services de <span style='color: #f97316; font-weight: 900;'>Qualité</span> vous offrent des solutions.")
                

                // --- PHRASE 2 ---
                .callFunction(() => setCurrentThemeIndex(1))
                .typeString("Nous proposons des <span style='color: #3b82f6; font-weight: 900;'>Forfaits Personnalisés</span>.")
                

                // --- PHRASE 3 ---
                .callFunction(() => setCurrentThemeIndex(2))
                .typeString("Billets d'avion aux <span style='color: #f97316; font-weight: 900;'>Meilleures Destinations</span>.")
                

                // --- PHRASE 4 ---
                .callFunction(() => setCurrentThemeIndex(3))
                .typeString("Assistance <span style='color: #3b82f6; font-weight: 900;'>24h/7j</span> pour un voyage sans stress.")
                

                // --- PHRASE 5 ---
                .callFunction(() => setCurrentThemeIndex(4))
                .typeString("Rendre votre expérience <span style='color: #f97316; font-weight: 900;'>Inoubliable</span>.")
                .pauseFor(3000)
                .deleteAll(30)
                
                // Retour à l'index 0 pour la boucle
                .callFunction(() => setCurrentThemeIndex(0))
                .start();
            }}
            options={{ 
              autoStart: true, 
              loop: true, 
              delay: 40, 
              cursor: "|" 
            }}
          />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ServiceCard icon={<Plane />} title="Billetterie" onClick={() => setActiveBooking({ title: "Billetterie Aérienne", type: "Voyage", image: "https://res.cloudinary.com/dkjqh8snc/image/upload/v1770802310/Voici_pourquoi_vous_devez_toujours_d%C3%A9truire_votre_carte_d_embarquement_et_votre_billet_apr%C3%A8s_un_vol_ohgrus.jpg" })} />
          <ServiceCard icon={<Hotel />} title="Hôtels Luxe" onClick={() => setActiveBooking({ title: "Réservation d'Hôtels", type: "Voyage", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800" })} />
          <ServiceCard icon={<Globe />} title="Assistance Visa" onClick={() => setActiveBooking({ title: "Assistance Visa", type: "Voyage", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800" })} />
          <ServiceCard icon={<Navigation />} title="Circuits" onClick={() => setActiveBooking({ title: "Circuits Spécialisés", type: "Voyage", step: 0 })} />
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
                <DestinationCard key={dest.id} dest={dest} onReserve={() => setActiveBooking({ title: dest.city, type: "Voyage", image: dest.imageUrl })} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODALE ADAPTATIVE */}
      <AnimatePresence>
        {activeBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveBooking(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <button onClick={() => setActiveBooking(null)} className="absolute top-6 right-6 z-50 p-2 bg-slate-900 text-white rounded-full transition-all"><X size={24} /></button>
              <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                
                {/* ETAPE 0 : CAROUSEL DES CIRCUITS */}
                {activeBooking.type === "Voyage" && activeBooking.step === 0 ? (
                  <div className="flex flex-col">
                    <div className="mb-10">
                      <h3 className="text-4xl font-black uppercase italic tracking-tighter">Nos Circuits <span className="text-brand-orange">Spécialisés</span></h3>
                      <p className="text-slate-500 font-medium italic">Sélectionnez le type de voyage qui vous correspond</p>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
                      {/* CARD: AFFAIRE */}
                      <motion.div whileHover={{ y: -10 }} className="min-w-[250px] md:min-w-[300px] snap-center bg-slate-50 rounded-[2.5rem] overflow-hidden border-2 border-transparent hover:border-brand-orange transition-all group flex flex-col">
                        <div className="h-75 overflow-hidden">
                          <img src="https://res.cloudinary.com/dkjqh8snc/image/upload/v1771020820/collage_site_web_ya8awm.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Affaire" />
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                          <Briefcase className="text-brand-orange mb-4" size={32} />
                          <h3 className="text-2xl font-black uppercase italic mb-3">Tourisme Affaire</h3>
                          <p className="text-slate-600 text-sm italic mb-8 flex-1">Visite touristique de sites attractifs et exceptionnels. Dubaï, Turquie et pôles économiques majeurs.</p>
                          <button onClick={() => setActiveBooking({...activeBooking, step: 1, title: "Circuit Affaire", image: "https://res.cloudinary.com/dkjqh8snc/image/upload/v1771021352/collage_site_web_2_h0zvgj.png"})} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase italic hover:bg-brand-orange transition-colors">Choisir ce circuit</button>
                        </div>
                      </motion.div>

                      {/* CARD: MEDICAL */}
                      <motion.div whileHover={{ y: -10 }} className="min-w-[300px] md:min-w-[400px] snap-center bg-slate-50 rounded-[2.5rem] overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all group flex flex-col">
                        <div className="h-78 overflow-hidden">
                          <img src="https://res.cloudinary.com/dkjqh8snc/image/upload/v1771021075/t%C3%A9l%C3%A9chargement_9_rfgjyz.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Medical" />
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                          <Activity className="text-blue-500 mb-4" size={32} />
                          <h3 className="text-2xl font-black uppercase italic mb-3">Tourisme Médical</h3>
                          <p className="text-slate-600 text-sm italic mb-8 flex-1">Besoin d'un bilan ou suivi médical spécialisé de pointe dans les meilleures infrastructures mondiales.</p>
                          <button onClick={() => setActiveBooking({...activeBooking, step: 1, title: "Circuit Médical", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800"})} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase italic hover:bg-blue-500 transition-colors">Visiter votre centre</button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  /* FORMULAIRE FINAL */
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="hidden lg:block h-full min-h-[400px]">
                      <img src={activeBooking.image || "https://res.cloudinary.com/dkjqh8snc/image/upload/v1770803751/Mastering_Transportation_Logistics_-_Your_Guide_to_Seamless_Travel_hcdtip.jpg"} className="w-full h-full object-cover rounded-[2rem]" alt="" />
                    </div>
                    <div>
                      <div className="mb-8">
                        <span className="bg-brand-orange/10 text-brand-orange px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Demande Directe</span>
                        <h4 className="text-3xl font-black text-slate-800 mt-2 italic uppercase tracking-tighter">{activeBooking.title}</h4>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-4 text-brand-orange" size={18} />
                          <input required type="text" placeholder="Destination souhaitée" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 outline-none focus:border-brand-orange transition-all" />
                        </div>
                        <div className="relative group">
                          <User className="absolute left-4 top-4 text-slate-300" size={18} />
                          <input required type="text" placeholder="Nom complet" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 outline-none focus:border-brand-orange transition-all" />
                        </div>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-4 text-slate-300" size={18} />
                          <input required type="tel" placeholder="WhatsApp" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 outline-none focus:border-brand-orange transition-all" />
                        </div>
                        <div className="relative group">
                          <Calendar className="absolute left-4 top-4 text-slate-300" size={18} />
                          <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 outline-none focus:border-brand-orange transition-all text-slate-600" />
                        </div>
                        <button disabled={isSubmitting} className="w-full bg-brand-orange text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl mt-4 italic uppercase">
                          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Finaliser sur WhatsApp"} <Send size={20} />
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

// --- SOUS-COMPOSANTS ---
function ServiceCard({ icon, title, onClick }: any) {
  return (
    <motion.div onClick={onClick} whileHover={{ y: -10 }} className="cursor-pointer p-10 rounded-[2.5rem] bg-white border-2 border-slate-50 shadow-xl hover:border-brand-orange/50 transition-all flex flex-col items-center group text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">{icon}</div>
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
          <button onClick={onReserve} className="flex-1 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-brand-orange hover:text-white transition-all shadow-xl uppercase italic">Réserver</button>
          <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl font-black text-sm border border-white/10">{dest.price}</div>
        </div>
      </div>
    </motion.div>
  );
}