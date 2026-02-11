"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, Megaphone, Camera, Layout, 
  Rocket, ChevronRight, ExternalLink, X 
} from "lucide-react";
import { useServiceModal } from "@/context/ServiceContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const DIGITAL_SERVICES = [
  {
    id: "DIGITAL-DEV",
    title: "Dev & Logiciels",
    desc: "Applications sur mesure et logiciels métiers haute performance.",
    icon: <Code2 size={32} />,
    color: "from-blue-600 to-cyan-400",
    tags: ["Next.js", "Mobile", "SaaS"]
  },
  {
    id: "DIGITAL-MARKETING",
    title: "Marketing Digital",
    desc: "Stratégies d'acquisition et gestion publicitaire orientée ROI.",
    icon: <Megaphone size={32} />,
    color: "from-orange-600 to-yellow-400",
    tags: ["Growth", "SEO", "Ads"]
  },
  {
    id: "DIGITAL-PHOTO",
    title: "Photo & Vidéo",
    desc: "Production visuelle premium pour sublimer votre image de marque.",
    icon: <Camera size={32} />,
    color: "from-emerald-600 to-teal-400",
    tags: ["Shooting", "Drone", "Montage"]
  },
  {
    id: "DIGITAL-CREATION",
    title: "Design & UI/UX",
    desc: "Identités visuelles percutantes et interfaces intuitives.",
    icon: <Layout size={32} />,
    color: "from-purple-600 to-pink-400",
    tags: ["Branding", "Figma", "UI"]
  }
];

console.log("📁 Fichier DigitalPage chargé");


export default function DigitalPage() {
  console.log("🔥 DigitalPage est monté");
  const { openModal } = useServiceModal();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // 🔹 Fetch portfolio depuis Firestore sans orderBy (tri côté client)
  useEffect(() => {
  const fetchPortfolio = async () => {
    console.log("🚀 Début récupération portfolio...");

    try {
      const snap = await getDocs(collection(db, "portfolio"));

      console.log("📦 Snapshot brut :", snap);
      console.log("📊 Nombre de documents :", snap.size);

      if (snap.empty) {
        console.warn("⚠️ La collection portfolio est VIDE !");
      }

      const data = snap.docs.map(doc => {
        const rawData = doc.data();
        console.log("📄 Document brut :", doc.id, rawData);

        let formattedDate = null;

        if (rawData.createdAt?.toDate) {
          formattedDate = rawData.createdAt.toDate();
          console.log("🕒 createdAt est un Timestamp :", formattedDate);
        } else if (rawData.createdAt) {
          formattedDate = new Date(rawData.createdAt);
          console.log("🕒 createdAt est une string :", formattedDate);
        } else {
          formattedDate = new Date(0);
          console.warn("⚠️ createdAt manquant !");
        }

        return {
          id: doc.id,
          ...rawData,
          createdAt: formattedDate
        };
      });

      console.log("✅ Données formatées avant tri :", data);

      data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      console.log("🏆 Données après tri :", data);

      setProjects(data);

    } catch (error) {
      console.error("❌ ERREUR FIRESTORE :", error);
      setProjects([]);
    } finally {
      setLoading(false);
      console.log("🏁 Fin récupération portfolio");
    }
  };

  fetchPortfolio();
}, []);

  const getOptimizedUrl = (url: string) => {
    if (!url || typeof url !== 'string') return "";
    return url.includes('/upload/') 
      ? url.replace('/upload/', '/upload/c_fill,g_auto,w_800,h_1000,q_auto,f_auto/')
      : url;
  };

  const getHDUrl = (url: string) => {
    if (!url || typeof url !== 'string') return "";
    return url.includes('/upload/')
      ? url.replace('/upload/', '/upload/q_auto,f_auto,w_1600/')
      : url;
  };

  return (
    <main className="bg-[#020617] min-h-screen text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000" 
            alt="Digital Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/50 to-[#020617]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 pt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="px-6 py-2 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              BHK Digital Agency
            </span>
            <h1 className="text-6xl md:text-[10rem] font-black italic uppercase tracking-tighter mt-8 leading-[0.85] text-white">
              L'Élite <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">Numérique.</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto mt-10 text-lg md:text-xl font-medium italic opacity-80">
              Expertise tech et créativité sans limite pour votre ascension digitale.
            </p>
            <button 
              onClick={() => openModal("DIGITAL-GENERAL")}
              className="mt-12 px-10 py-5 bg-white text-slate-900 rounded-full font-black uppercase italic tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-2xl"
            >
              Démarrer l'expérience
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-8">
          {DIGITAL_SERVICES.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-12 rounded-[4rem] bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all duration-500"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-10 shadow-xl text-white`}>
                {service.icon}
              </div>
              <h3 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">{service.title}</h3>
              <p className="text-slate-400 text-lg mb-8 italic">{service.desc}</p>
              <button 
                onClick={() => openModal(service.id)}
                className="flex items-center gap-2 text-orange-500 font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all"
              >
                Commander <ChevronRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. PORTFOLIO */}
      <section className="py-32 bg-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Nos <span className="text-orange-500">Réalisations</span></h2>
          <p className="text-slate-400 font-medium italic mt-2 text-lg">Le savoir-faire BOLOU-HK en images.</p>
        </div>

        <div className="flex overflow-x-auto gap-8 px-6 pb-12 no-scrollbar scroll-smooth">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div 
                key="skeleton-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-8"
              >
                {[1, 2, 3].map((n) => (
                  <div key={`skeleton-${n}`} className="min-w-[350px] md:min-w-[450px] aspect-[4/5] bg-white/5 animate-pulse rounded-[3rem]" />
                ))}
              </motion.div>
            ) : (
              projects.map((proj) => (
                <motion.div 
                  key={proj.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedImg(getHDUrl(proj.imageUrl))}
                  className="min-w-[350px] md:min-w-[450px] aspect-[4/5] relative rounded-[3rem] overflow-hidden group border border-white/5 cursor-zoom-in"
                >
                  <img 
                    src={getOptimizedUrl(proj.imageUrl)} 
                    alt={proj.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-10 left-10">
                    <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                      {proj.category}
                    </span>
                    <h4 className="text-3xl font-black uppercase italic mt-4 text-white">{proj.title}</h4>
                    <div className="mt-4 flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase italic opacity-0 group-hover:opacity-100 transition-opacity">
                      Agrandir le projet <ExternalLink size={14} />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. LIGHTBOX */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            key="lightbox-container"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-10 right-10 text-white hover:text-orange-500 transition-colors">
              <X size={40} />
            </button>
            <motion.img 
              key={`img-hd-${selectedImg}`}
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={selectedImg} 
              className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10 object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. CTA */}
      <section className="py-32 px-6 flex justify-center">
        <div className="relative group cursor-pointer" onClick={() => openModal("DIGITAL-PROJET")}>
          <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative border-2 border-orange-500/50 rounded-[4rem] p-10 md:p-16 text-center backdrop-blur-md">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none mb-8 text-white">Prêt à coder <br /> le futur ?</h2>
            <div className="flex items-center justify-center gap-4 text-orange-500 font-black uppercase italic tracking-widest">
              Lancer une consultation <Rocket size={24} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
