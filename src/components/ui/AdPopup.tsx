"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, limit, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Zap } from "lucide-react";

export default function AdPopup() {
  const [ad, setAd] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // On écoute la pub "popup" la plus récente et active
    const q = query(
      collection(db, "ads"),
      where("type", "==", "popup"),
      where("active", "==", true),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const adData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setAd(adData);
        
        // Délai d'apparition : 4 secondes après le chargement du site
        const timer = setTimeout(() => {
          const hasSeen = localStorage.getItem(`bhk_popup_${adData.id}`);
          if (!hasSeen) setIsVisible(true);
        }, 4000);

        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // On enregistre qu'il a vu CETTE pub précise
    if (ad) localStorage.setItem(`bhk_popup_${ad.id}`, "true");
  };

  return (
    <AnimatePresence>
      {isVisible && ad && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            className="relative max-w-[450px] w-full bg-white rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/20"
          >
            {/* Bouton Fermer Premium */}
            <button 
              onClick={handleClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 bg-black/10 hover:bg-orange-500 text-white backdrop-blur-xl rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>

            {/* Contenu de la Pub */}
            <a 
              href={ad.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={ad.imageUrl} 
                  alt="Annonce Exclusive" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                   <div className="flex items-center gap-2 text-white font-black italic uppercase text-sm">
                      Voir l'offre maintenant <ExternalLink size={18} />
                   </div>
                </div>
              </div>
              
              {/* Footer de la popup */}
              <div className="p-6 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center animate-pulse">
                    <Zap size={16} fill="currentColor" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Offre Limitée BHK</span>
                </div>
                <div className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                  Profiter
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}