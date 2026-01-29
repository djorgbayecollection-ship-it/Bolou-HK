"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // onSnapshot permet de voir les changements en temps réel sans rafraîchir
    const unsubscribe = onSnapshot(doc(db, "settings", "newsletter"), (doc) => {
      if (doc.exists() && doc.data().active === true) {
        setConfig(doc.data());
        
        // Vérifier si l'utilisateur l'a déjà fermée
        const hasSeen = localStorage.getItem("bhk_newsletter_hidden");
        if (!hasSeen) {
          setTimeout(() => setIsOpen(true), 5000); // Apparaît après 5 sec
        }
      } else {
        setIsOpen(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isOpen || !config) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2.5rem] max-w-2xl w-full overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
        >
          <button 
            onClick={() => { setIsOpen(false); localStorage.setItem("bhk_newsletter_hidden", "true"); }}
            className="absolute top-4 right-4 z-10 bg-white/50 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-all"
          >
            <X size={20} />
          </button>

          <div className="md:w-1/2 h-48 md:h-auto">
            <img src={config.imageUrl} className="w-full h-full object-cover" alt="Promo" />
          </div>

          <div className="md:w-1/2 p-8">
            <h3 className="text-2xl font-black uppercase italic italic mb-2">{config.title}</h3>
            <p className="text-slate-500 text-sm mb-6 leading-tight">{config.description}</p>
            <form className="space-y-3">
              <input type="email" placeholder="Email" className="w-full p-4 bg-slate-100 rounded-xl outline-none font-bold text-sm" />
              <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase italic text-xs tracking-widest flex items-center justify-center gap-2">
                S'inscrire <Send size={14} />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}