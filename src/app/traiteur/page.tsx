"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UtensilsCrossed, 
  Users, 
  ChefHat, 
  Star, 
  ArrowRight, 
  X, 
  Send, 
  Loader2, 
  Coffee,
  GlassWater
} from "lucide-react";

export default function TraiteurPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]); // État pour les plats du dashboard
  const [formData, setFormData] = useState({
    nom: "",
    whatsapp: "",
    convives: "",
    typeEvent: "Dîner Privé",
    date: ""
  });

  // --- RÉCUPÉRATION DES PLATS DEPUIS LE DASHBOARD ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const q = query(collection(db, "traiteur"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(data);
      } catch (err) {
        console.error("Erreur récupération menu:", err);
      }
    };
    fetchMenu();
  }, []);

  // --- ENVOI DE LA RÉSERVATION À FIREBASE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "bookings"), {
        clientName: formData.nom,
        whatsapp: formData.whatsapp,
        interest: `TRAITEUR: ${formData.typeEvent}`,
        details: `Convives: ${formData.convives} | Date: ${formData.date}`,
        status: "nouveau",
        createdAt: serverTimestamp(),
      });
      alert("Votre demande de devis a été envoyée avec succès !");
      setIsModalOpen(false);
      setFormData({ nom: "", whatsapp: "", convives: "", typeEvent: "Dîner Privé", date: "" });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white selection:bg-orange-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1600" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 shadow-inner"
          alt="Gastronomie"
        />
        <div className="relative z-10 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-[0.3em] mb-6 backdrop-blur-md border border-orange-500/30">
              <ChefHat size={14} /> Haute Gastronomie Ivoirienne
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-none mb-6">
              L'Art de <br /> <span className="text-orange-500 italic">Bien Recevoir à Abidjan et partout ailleurs.</span>
            </h1>
            <p className="text-slate-300 max-w-xl mx-auto text-lg font-medium italic mb-10">
              Des saveurs authentiques et une présentation raffinée pour vos moments d'exception à Abidjan.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-5 bg-orange-500 text-white font-black rounded-full shadow-2xl hover:bg-white hover:text-slate-900 transition-all uppercase italic flex items-center gap-3 mx-auto group"
            >
              Demander un devis <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* 2. NOS SERVICES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Nos Univers <span className="text-orange-500">Culinaires</span></h2>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard icon={<GlassWater />} title="Cocktails" desc="Amuse-bouches raffinés pour vos vernissages et lancements." />
          <ServiceCard icon={<UtensilsCrossed />} title="Dîners Privés" desc="Un chef à domicile pour une expérience gastronomique intime." />
          <ServiceCard icon={<Users />} title="Événements" desc="Mariages et banquets avec une logistique irréprochable." />
          <ServiceCard icon={<Coffee />} title="Corporate" desc="Pauses-café et déjeuners d'affaires pour vos équipes." />
        </div>
      </section>

      {/* 3. POURQUOI NOUS ? */}
      <section className="bg-slate-50 py-24 px-6 rounded-[4rem] mx-4 mb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img src="https://res.cloudinary.com/dkjqh8snc/image/upload/v1769674264/fruit_wudkea.jpg" className="rounded-[3rem] shadow-2xl" alt="Service" />
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl hidden md:block border border-slate-100">
                <div className="flex text-orange-500 mb-2"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                <p className="font-black italic text-slate-900">"Un service d'exception <br /> et des plats divins."</p>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-black italic uppercase text-slate-900 mb-8 leading-tight">Le raffinement dans <br /> <span className="text-orange-500">chaque détail</span></h2>
            <ul className="space-y-6">
              <FeatureItem title="Produits Frais" desc="Nous sélectionnons le meilleur du marché local chaque matin." />
              <FeatureItem title="Sur Mesure" desc="Chaque menu est conçu selon vos goûts et restrictions." />
              <FeatureItem title="Service Pro" desc="Une équipe de maîtres d'hôtel qualifiée et discrète." />
            </ul>
          </div>
        </div>
      </section>

      {/* 4. NOS INCONTOURNABLES (SECTION DYNAMIQUE) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              Nos <span className="text-orange-500">Incontournables</span>
            </h2>
            <p className="text-slate-500 font-medium italic mt-4">
              Découvrez les créations phares de notre chef, gérées depuis votre dashboard.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <MenuCard 
                key={item.id}
                image={item.imageUrl}
                category={item.category || "Signature"}
                title={item.title}
                desc={item.description}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
              <p className="text-slate-400 font-bold italic">
                Notre menu est en cours de mise à jour...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MODALE FORMULAIRE */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="p-8 md:p-12 text-slate-900">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">Votre Devis <span className="text-orange-500">Traiteur</span></h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-orange-500 hover:text-white transition-all text-slate-900"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputGroup label="Nom complet" placeholder="M. / Mme Kouadio" value={formData.nom} onChange={(e:any)=>setFormData({...formData, nom:e.target.value})} />
                    <InputGroup label="WhatsApp" placeholder="+225 07..." value={formData.whatsapp} onChange={(e:any)=>setFormData({...formData, whatsapp:e.target.value})} />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1 text-slate-900">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Type d'Événement</label>
                      <select 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-orange-500 appearance-none text-slate-900"
                        value={formData.typeEvent}
                        onChange={(e:any)=>setFormData({...formData, typeEvent:e.target.value})}
                      >
                        <option>Dîner Privé</option>
                        <option>Mariage</option>
                        <option>Cocktail</option>
                        <option>Buffet Entreprise</option>
                      </select>
                    </div>
                    <InputGroup label="Nombre de convives" type="number" placeholder="Ex: 50" value={formData.convives} onChange={(e:any)=>setFormData({...formData, convives:e.target.value})} />
                  </div>

                  <InputGroup label="Date prévue" type="date" value={formData.date} onChange={(e:any)=>setFormData({...formData, date:e.target.value})} />

                  <button 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-orange-500 transition-all shadow-xl disabled:opacity-50 mt-8 group"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "RECEVOIR MA PROPOSITION"}
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

function MenuCard({ image, category, title, desc }: any) {
  return (
    <motion.div whileHover={{ y: -10 }} className="group relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-xl bg-slate-100">
      {image && (
        <img src={image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8 w-full">
        <span className="inline-block px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase rounded-lg mb-3">{category}</span>
        <h4 className="text-2xl font-black text-white italic uppercase leading-tight mb-2">{title}</h4>
        <p className="text-slate-300 text-sm font-medium italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">{desc}</p>
      </div>
    </motion.div>
  );
}

function ServiceCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-orange-500/20 hover:shadow-xl transition-all group text-slate-900">
      <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">{title}</h3>
      <p className="text-slate-500 text-sm font-medium italic leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureItem({ title, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 text-orange-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div>
        <h4 className="font-black uppercase italic text-slate-900 leading-none mb-1">{title}</h4>
        <p className="text-slate-500 text-sm font-medium italic">{desc}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{label}</label>
      <input 
        required
        type={type} 
        value={value}
        onChange={onChange}
        placeholder={placeholder} 
        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-orange-500 transition-all text-slate-900" 
      />
    </div>
  );
}