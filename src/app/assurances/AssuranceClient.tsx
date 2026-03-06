"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Zap, Camera, ArrowRight, Heart, 
  Stethoscope, Plane, X, Send, Car, Home, ShieldAlert, 
  Upload, Loader2, Clock, Smartphone, FileText, CheckCircle2, Shield, Wallet, Layout, MessageCircle, Phone
} from "lucide-react";

// --- CONFIG & DATA ---
const BG_IMAGES = [
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80",
  "https://res.cloudinary.com/dkjqh8snc/image/upload/v1770803154/Discover_the_5_crucial_safety_measures_to_tow_y_bp9k1e.jpg"
];

const CLOUDINARY_UPLOAD_PRESET = "bolouhk";
const CLOUDINARY_CLOUD_NAME = "dkjqh8snc";

const CATEGORIES = [
  { id: "auto", label: "Auto", icon: <Car size={18} /> },
  { id: "vie", label: "Vie & Prévoyance", icon: <Heart size={18} /> },
  { id: "sante", label: "Santé", icon: <Stethoscope size={18} /> },
  { id: "voyages", label: "Voyages", icon: <Plane  size={18} /> },
  { id: "pro", label: "Professionnel", icon: <ShieldAlert size={18} /> },
];

const OFFERS = {
  auto: [
    { 
      id: "auto", 
      title: "Assurance Auto — Côte d'Ivoire", 
      desc: "Protégez votre véhicule avec nos formules Tiers Simple, Complet ou Tous Risques auprès des meilleures compagnies.", 
      icon: <Car size={24} />, 
      details: ["Responsabilité Civile", "Défense et Recours", "Sécurité Conducteur"],
      docs: [{ name: "Carte grise", req: true }, { name: "Vignette", req: true }]
    },
  ],
  vie: [
    { 
      id: "vie-groupe", 
      title: "Vie & Prévoyance",
      desc: "Anticipez l'avenir et protégez vos proches. Versement d'un capital en cas de coup dur.",
      icon: <Heart size={24} />, 
      details: ["Capital Décès", "Épargne Retraite", "Frais Obsèques"],
      docs: [{ name: "Pièce d'identité", req: true }, { name: "Acte de naissance", req: true }]
    },
  ],
  sante: [
    { 
      id: "sante-famille", 
      title: "Assurance Santé", 
      desc: "Accédez aux meilleurs soins en Côte d'Ivoire. Remboursements rapides et réseau étendu.", 
      icon: <Stethoscope size={24} />, 
      details: ["Médicaments", "Soins dentaires", "Optique", "Maternité"],
      docs: [{ name: "CNI/Passport", req: true }, { name: "Questionnaire", req: true }]
    },
  ],
  voyages: [
    { 
      id: "voyages", 
      title: "Assurance Voyage", 
      desc: "Voyagez l'esprit tranquille. Assurance conforme pour les demandes de visa Schengen.", 
      icon: <Plane size={24} />, 
      details: ["Frais médicaux", "Rapatriement", "Bagages"],
      docs: [{ name: "Passeport", req: true }, { name: "Billet", req: true }]
    },
  ],
  pro: [
    { 
      id: "habitation", 
      title: "Assurance Habitation", 
      desc: "Protégez votre logement contre l'incendie, les dégâts des eaux et le vol.",
      icon: <Home size={24} />, 
      details: ["Incendie", "Dégâts des eaux", "Vol"],
      docs: [{ name: "CNI", req: true }, { name: "Surface (m²)", req: true }]
    },
  ]
};

export default function AssuranceClient() {
  const [activeTab, setActiveTab] = useState("auto");
  const [activeForm, setActiveForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [formData, setFormData] = useState({ name: "", whatsapp: "" });
  const [files, setFiles] = useState<{ [key: string]: File | null }>({ carteGrise: null, permis: null });

  useEffect(() => {
    const timer = setInterval(() => setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length), 5000);
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
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
        const json = await res.json();
        return json.secure_url;
      };

      let cgUrl = files.carteGrise ? await uploadFile(files.carteGrise) : "";
      let pUrl = files.permis ? await uploadFile(files.permis) : "";

      await addDoc(collection(db, "bookings"), {
        clientName: formData.name,
        whatsapp: formData.whatsapp,
        interest: activeForm.title,
        carteGrise: cgUrl,
        permis: pUrl,
        status: "nouveau",
        createdAt: serverTimestamp(),
      });

      alert("Demande envoyée !");
      setActiveForm(null);
    } catch (error) {
      alert("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-slate-900 text-white rounded-b-[4rem] lg:rounded-b-[6rem]">
  {/* --- IMAGE DE FOND AVEC OVERLAY ADAPTATIF --- */}
  <div className="absolute inset-0 z-0 overflow-hidden">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentBg}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_IMAGES[currentBg]})` }}
      />
    </AnimatePresence>
    
    {/* CALQUE NOIR : Plus opaque sur mobile (70%) que sur PC (40%) pour la lisibilité */}
    <div className="absolute inset-0 bg-slate-950/70 lg:bg-slate-950/40 transition-colors duration-500" />
    
    {/* Dégradé supplémentaire pour adoucir le bas de la section */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
  </div>

  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex flex-wrap gap-2 mb-8">
        <Badge icon={<Clock size={12}/>} text="Devis en 2 min" />
        <Badge icon={<Smartphone size={12}/>} text="100% Digital" />
        <Badge icon={<ShieldCheck size={12}/>} text="Attestation WhatsApp" />
      </div>
      
      {/* Texte avec ombre portée légère pour ressortir encore mieux */}
      <h1 className="text-4xl lg:text-7xl font-black leading-[0.95] mb-6 italic tracking-tighter drop-shadow-lg">
        Votre Assurance en Côte d'Ivoire, <br />
        <span className="text-orange-500 underline decoration-white/20">simples & rapides.</span>
      </h1>
      
      <p className="text-lg lg:text-xl text-slate-100 mb-10 max-w-lg font-medium italic drop-shadow-md">
        Comparez, obtenez votre devis en ligne et recevez votre attestation sans vous déplacer. 
        Courtier assurance agréé à Abidjan pour vous servir.
      </p>
    </motion.div>

    {/* --- IMAGE DE DROITE (Désormais visible sur mobile) --- */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="relative flex justify-center lg:justify-end"
    >
      <div className="relative z-10 w-full max-w-[300px] md:max-w-md aspect-square rounded-[3rem] lg:rounded-[4rem] overflow-hidden border-[6px] lg:border-[10px] border-white/20 rotate-3 shadow-2xl mt-8 lg:mt-0">
         <img 
           src="https://res.cloudinary.com/dkjqh8snc/image/upload/v1771021977/ChatGPT_Image_13_f%C3%A9vr._2026_22_28_34_izla0k.png" 
           alt="Courtier" 
           className="w-full h-full object-cover" 
         />
      </div>
      
      {/* Icônes flottantes repositionnées pour le mobile */}
      <FloatingIcon delay={0} className="top-5 -left-4 lg:top-10 lg:-left-10 bg-white text-blue-600 scale-75 lg:scale-100">
        <Shield size={32} />
      </FloatingIcon>
      
      <FloatingIcon delay={1} className="bottom-10 -right-2 lg:bottom-20 lg:-right-6 bg-orange-500 text-white scale-75 lg:scale-100">
        <Car size={32} />
      </FloatingIcon>
    </motion.div>
  </div>
</section>

      {/* --- SELECTEUR DE CATEGORIES --- */}
      <section className="max-w-4xl mx-auto -mt-10 relative z-20 px-4">
        <div className="bg-white p-2 rounded-[2rem] shadow-2xl flex flex-wrap justify-center gap-1 border border-slate-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black italic uppercase text-[10px] transition-all ${
                activeTab === cat.id ? "bg-orange-500 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* --- MAIN CONTENT: GRID 2 COLONNES --- */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* COLONNE GAUCHE: OFFRES (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {(OFFERS as any)[activeTab].map((offer: any) => (
                  <div 
                    key={offer.id}
                    onClick={() => setActiveForm(offer)}
                    className="bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:border-orange-500 transition-all cursor-pointer group shadow-sm hover:shadow-xl"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                          {offer.icon}
                        </div>
                        <h3 className="text-3xl font-black italic uppercase mb-3 text-slate-900 tracking-tighter">{offer.title}</h3>
                        <p className="text-slate-500 text-sm font-medium italic leading-relaxed mb-6">{offer.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {offer.details.map((d: string, i: number) => (
                            <span key={i} className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase italic border border-slate-100">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="w-full md:w-64 bg-slate-50 rounded-[1.5rem] p-6 border border-slate-100">
                        <h4 className="text-[9px] font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
                          <FileText size={12} /> DOCUMENTS
                        </h4>
                        <div className="space-y-2">
                          {offer.docs.map((doc: any, i: number) => (
                            <div key={i} className="bg-white p-3 rounded-xl flex items-center justify-between border border-slate-200/50 shadow-sm">
                              <span className="text-[10px] font-bold text-slate-700 italic">{doc.name}</span>
                              <CheckCircle2 size={12} className={doc.req ? "text-orange-500" : "text-slate-300"} />
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 flex items-center justify-between text-orange-500">
                          <span className="text-[9px] font-black uppercase italic">Souscrire</span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* COLONNE DROITE: CALCULATEUR (1/3) */}
          <aside className="lg:sticky lg:top-24">
            <InsuranceCalculator type={activeTab} />
          </aside>

        </div>
      </section>

      {/* --- MODALE FORMULAIRE --- */}
      <AnimatePresence>
        {activeForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !loading && setActiveForm(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl p-8">
              <button onClick={() => setActiveForm(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-orange-500 hover:text-white transition-all"><X size={20} /></button>
              <h2 className="text-2xl font-black italic uppercase mb-6 text-slate-900">Finaliser ma demande</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputGroup label="Nom & Prénoms" placeholder="Ex: Jean Kouassi" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} />
                <InputGroup label="Numéro WhatsApp" placeholder="+225 07..." type="tel" value={formData.whatsapp} onChange={(e: any) => setFormData({...formData, whatsapp: e.target.value})} />
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <ScanButton label="Carte Grise" sub={files.carteGrise ? "Fichier ajouté ✅" : "Obligatoire"} onChange={(e: any) => setFiles({...files, carteGrise: e.target.files[0]})} />
                  <ScanButton label="Permis / CNI" sub={files.permis ? "Fichier ajouté ✅" : "Optionnel"} onChange={(e: any) => setFiles({...files, permis: e.target.files[0]})} />
                </div>
                <button disabled={loading} className="w-full bg-orange-500 text-white py-4 rounded-xl font-black flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl disabled:opacity-50 mt-4">
                  {loading ? <Loader2 className="animate-spin" /> : "ENVOYER MA DEMANDE"}
                  {!loading && <Send size={18} />}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CHATBOT WIDGET --- */}
      <ChatWidget type={activeTab} />
    </main>
  );
}

// --- COMPOSANT CHATBOT ---
function ChatWidget({ type }: { type: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Mapping des noms propres pour l'affichage
  const labels: { [key: string]: string } = {
    auto: "🚗 Assurance Auto",
    sante: "🏥 Assurance Santé",
    vie: "🛡️ Vie & Prévoyance",
    voyages: "✈️ Assurance Voyage",
    pro: "🏠 Assurance Habitation"
  };

  const messages: { [key: string]: string } = {
    auto: "Bonjour ! 👋 Je vois que vous consultez notre offre 🚗 Assurance Auto en Côte d'Ivoire. Pour finaliser votre devis et obtenir votre attestation en ligne, laissez-nous vos coordonnées — un conseiller vous rappelle dans les 30 min ⚡",
    sante: "Besoin d'une couverture Santé sur mesure ? 🏥 Laissez-nous vos coordonnées, un expert vous rappelle pour vous guider dans votre choix !",
    vie: "Préparez l'avenir sereinement. 🛡️ Nos conseillers Vie sont en ligne pour vous aider à protéger vos proches dès maintenant.",
    voyages: "Un voyage prévu ? ✈️ Obtenez votre attestation conforme pour votre visa en moins de 15 minutes !",
    pro: "Protégez votre patrimoine. 🏠 Un devis personnalisé pour votre habitation ? On vous rappelle immédiatement !"
  };

  // Effet pour la notification et l'animation "Écrit..."
  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 3000);
    return () => clearTimeout(timer);
  }, [type]);

  // Simuler l'écriture quand on ouvre le chat
  useEffect(() => {
    if (isOpen) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  const [loading, setLoading] = useState(false);
const [sent, setSent] = useState(false);
const [userInfos, setUserInfos] = useState({ nom: "", phone: "" });

const handleSendMessage = async () => {
  if (!userInfos.nom || !userInfos.phone) {
    alert("Veuillez remplir tous les champs SVP");
    return;
  }

  setLoading(true);
  try {
    const { db } = await import("@/lib/firebase");
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

    await addDoc(collection(db, "leads"), {
      nom: userInfos.nom,
      telephone: userInfos.phone,
      service: type, // Ex: 'auto', 'voyage', etc.
      source: "Chatbot Assurance",
      status: "nouveau",
      createdAt: serverTimestamp()
    });

    setSent(true);
    // On réinitialise après 3 secondes
    setTimeout(() => {
      setSent(false);
      setIsOpen(false);
      setUserInfos({ nom: "", phone: "" });
    }, 3000);

  } catch (error) {
    console.error("Erreur d'envoi :", error);
    alert("Désolé, une erreur est survenue.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed bottom-12 right-6 z-50 flex flex-col items-end">
      {/* --- NOTIFICATION BUBBLE --- */}
      <AnimatePresence>
        {showNotification && !isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="mb-4 mr-2 bg-white text-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 max-w-[250px] relative">
            <button onClick={() => setShowNotification(false)} className="absolute -top-2 -right-2 bg-slate-200 rounded-full p-1 hover:bg-slate-300"><X size={12} /></button>
            <p className="text-[11px] font-bold leading-tight italic">{messages[type] || "Une question ? Nous sommes là !"}</p>
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CHAT WINDOW --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="mb-4 w-[330px] bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* Header */}
            <div className="bg-[#0f172a] p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-xs">BH</div>
                    <span className="absolute bottom-85 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0f172a] rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="text-white font-black text-[11px] uppercase tracking-wider">Équipe Bolou-HK</h4>
                    <p className="text-[9px] text-green-400 flex items-center gap-1 font-bold">
                       {isTyping ? (
                         <span className="flex gap-0.5 items-center">écrit<span className="animate-bounce">.</span><span className="animate-bounce [animation-delay:0.2s]">.</span><span className="animate-bounce [animation-delay:0.4s]">.</span></span>
                       ) : (
                         "● En ligne · Répond rapidement"
                       )}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
              </div>
              
              {/* Badge Dynamique */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-[9px] text-slate-400 uppercase font-black mb-1">🎯 Votre demande :</p>
                <p className="text-orange-500 font-bold text-[12px] italic">{labels[type]}</p>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-2 pt-2">
  <input 
    type="text" 
    placeholder="Votre nom complet" 
    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[11px] outline-none focus:border-orange-500 transition-all shadow-sm"
    value={userInfos.nom}
    onChange={(e) => setUserInfos({...userInfos, nom: e.target.value})}
  />
  <input 
    type="tel" 
    placeholder="Numéro WhatsApp (ex: 07...)" 
    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[11px] outline-none focus:border-orange-500 transition-all shadow-sm"
    value={userInfos.phone}
    onChange={(e) => setUserInfos({...userInfos, phone: e.target.value})}
  />
  
  <button 
    onClick={handleSendMessage}
    disabled={loading || sent}
    className={`w-full py-4 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg ${
      sent ? "bg-green-500 shadow-green-500/20" : "bg-orange-500 hover:bg-slate-900 shadow-orange-500/20"
    } text-white`}
  >
    {loading ? (
      <Loader2 className="animate-spin" size={14} />
    ) : sent ? (
      <>
        <CheckCircle2 size={14} /> Message Envoyé !
      </>
    ) : (
      <>
        <Phone size={14} /> Me faire rappeler gratuitement
      </>
    )}
  </button>
</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOGGLE BUTTON --- */}
      <button onClick={() => setIsOpen(!isOpen)} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-orange-500 hover:bg-orange-600'}`}>
        {isOpen ? <X className="text-white" size={24} /> : <MessageCircle size={30} className="text-white" />}
        {!isOpen && (
          <span className="absolute -top-2 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-white"></span>
          </span>
        )}
      </button>
    </div>
  );
}
// --- COMPOSANT CALCULATEUR ---
function InsuranceCalculator({ type }: { type: string }) {
  const [result, setResult] = useState<any>(null);

  // --- States Communs & Auto ---
  const [cv, setCv] = useState<number>(5);
  const [duree, setDuree] = useState<number>(12);
  const [formule, setFormule] = useState<string>("tiers-simple");
  const [valeur, setValeur] = useState<number>(3000000);
  const [usage, setUsage] = useState<string>("personnel");

  // --- States Vie & Santé ---
  const [age, setAge] = useState<number>(30);
  const [capitalVie, setCapitalVie] = useState<number>(5000000);
  const [dureeSante, setDureeSante] = useState<number>(5);

  // --- States Voyages ---
  const [destination, setDestination] = useState<string>("schengen");
  const [nbVoyageurs, setNbVoyageurs] = useState<number>(1);
  const [joursSejour, setJoursSejour] = useState<number>(15);

  // --- States Pro (Habitation) ---
  const [typeLogement, setTypeLogement] = useState<string>("studio");
  const [statutOccupant, setStatutOccupant] = useState<string>("locataire");

  const tarifsOfficiels: { [key: number]: number } = {
    5: 12420, 6: 12672, 7: 12923, 8: 14175, 9: 14427,
    10: 17112, 11: 17668, 12: 18223, 13: 18779, 14: 19334,
    15: 19890, 16: 20445, 17: 21001, 18: 21556, 19: 22112, 20: 22667
  };

  const calculate = () => {
    let total = 0;
    
    if (type === "auto") {
      let prixMensuel = tarifsOfficiels[cv] || 12420;
      total = prixMensuel * duree;
      if (formule === "tiers-simple" && duree >= 6) total += 3000;
    } 
    else if (type === "vie" || type === "sante") {
      total = (capitalVie * 0.001) + (age * 500);
    }
    else if (type === "voyages") {
      const base = destination === "schengen" ? 15000 : 10000;
      total = (base + (joursSejour * 500)) * nbVoyageurs;
    }
    else if (type === "pro") {
      const baseLog = typeLogement === "villa" ? 100000 : 45000;
      total = statutOccupant === "proprietaire" ? baseLog * 1.2 : baseLog;
    }

    setResult({
      total: Math.round(total),
      mensuel: Math.round(total / (type === "auto" ? duree : 12))
    });
  };

  useEffect(() => { setResult(null); }, [type]);

  

  return (
    <div className="bg-[#0f172a] rounded-[2.5rem] text-white border border-slate-800 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <span className="text-xl">📊</span>
        <h4 className="font-black uppercase tracking-tighter text-orange-500 text-sm"> Simulateur {type} </h4>
      </div>

      <div className="p-6 space-y-5">
        {type === "auto" && (
          <>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Type de couverture</label>
              <select value={formule} onChange={(e) => setFormule(e.target.value)} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all text-white">
                <option value="tiers-simple">Tiers Simple</option>
                <option value="tiers-complet">Tiers Complet</option>
                <option value="sur-mesure">Sur Mesure</option>
                <option value="tous-risques">Tous Risques</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Valeur du véhicule (FCFA)</label>
              <input type="number" value={valeur} onChange={(e) => setValeur(Number(e.target.value))} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Puissance (CV)</label>
                <select value={cv} onChange={(e) => setCv(Number(e.target.value))} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                  {Object.keys(tarifsOfficiels).map(v => <option key={v} value={v}>{v} CV</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Usage</label>
                <select value={usage} onChange={(e) => setUsage(e.target.value)} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                  <option value="personnel">Personnel</option>
                  <option value="taxi">Taxi / Transport</option>
                  <option value="commerce">Commerce / Livraison</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Durée</label>
              <select value={duree} onChange={(e) => setDuree(Number(e.target.value))} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m} Mois</option>)}
              </select>
            </div>
          </>
        )}

        {(type === "vie" || type === "sante") && (
          <>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Capital souhaité (FCFA)</label>
              <input type="number" value={capitalVie} onChange={(e) => setCapitalVie(Number(e.target.value))} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Votre âge</label>
              <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Durée de contrat</label>
              <select value={dureeSante} onChange={(e) => setDureeSante(Number(e.target.value))} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                {[5,10,15,20].map(a => <option key={a} value={a}>{a} Ans</option>)}
              </select>
            </div>
          </>
        )}

        {type === "voyages" && (
          <>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Destination</label>
              <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                <option value="schengen">Zone Schengen</option>
                <option value="afrique">Afrique</option>
                <option value="monde">Monde Entier</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Durée séjour (jours)</label>
                <input type="number" value={joursSejour} onChange={(e) => setJoursSejour(Number(e.target.value))} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Nb Voyageurs</label>
                <input type="number" value={nbVoyageurs} onChange={(e) => setNbVoyageurs(Number(e.target.value))} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
              </div>
            </div>
          </>
        )}

        {type === "pro" && (
          <>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Type de logement</label>
              <select value={typeLogement} onChange={(e) => setTypeLogement(e.target.value)} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                <option value="studio">Studio / R+1</option>
                <option value="r1-r2">R+1 / R+2</option>
                <option value="r3-r4">R+3 / R+4</option>
                <option value="villa">Villa</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1 italic">Vous êtes ?</label>
              <select value={statutOccupant} onChange={(e) => setStatutOccupant(e.target.value)} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                <option value="locataire">Locataire</option>
                <option value="proprietaire">Propriétaire</option>
              </select>
            </div>
          </>
        )}

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-2xl text-center">
                <p className="text-[10px] font-black uppercase text-orange-500 mb-1">Estimation Prime</p>
                <h2 className="text-3xl font-black text-orange-500 tracking-tighter">
                  {result.total.toLocaleString()} <small className="text-xs">FCFA</small>
                </h2>
                {type === "auto" && formule === "tiers-simple" && duree >= 6 && (
                   <p className="text-[8px] text-green-400 font-bold mt-2 uppercase italic">Incluant 3 000 FCFA de frais</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3 pt-4">
          <button onClick={calculate} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl text-xs font-black uppercase shadow-lg shadow-orange-500/20 transition-colors"> Estimer le prix </button>
          <a href="https://wa.me/2250711812510" target="_blank" className="w-full bg-[#22c55e] text-white py-4 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2">
            <Smartphone size={14} /> Commander sur WhatsApp
          </a>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <BadgeTrust icon="🛡️" text="Agréé ASACI" />
          <BadgeTrust icon="⚡" text="Devis rapide" />
          <BadgeTrust icon="🔒" text="Sécurisé" />
          <BadgeTrust icon="✅" text="+500 clients" />
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---
function BadgeTrust({ icon, text }: { icon: string, text: string }) {
  return (
    <div className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
      <span className="text-sm">{icon}</span>
      <span className="text-[7px] font-black uppercase tracking-tighter text-slate-400">{text}</span>
    </div>
  );
}

function Badge({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase italic">
      <span className="text-orange-500">{icon}</span>
      {text}
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{label}</label>
      <input required type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm outline-none focus:border-orange-500 transition-all text-slate-900" />
    </div>
  );
}

function ScanButton({ label, sub, onChange }: any) {
  return (
    <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-orange-500"><Camera size={18} /></div>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-700">{label}</p>
          <p className="text-[8px] font-bold text-slate-400 italic">{sub}</p>
        </div>
      </div>
      <Upload size={16} className="text-slate-300 group-hover:text-orange-500" />
      <input type="file" onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer" />
    </div>
  );
}
function FloatingIcon({ children, className, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
      }}
      className={`absolute p-4 rounded-2xl shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}