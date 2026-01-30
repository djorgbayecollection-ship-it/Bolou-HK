// src/components/ui/CookieBanner.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On vérifie si un choix existe déjà
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (status: "accepted" | "declined") => {
    localStorage.setItem("cookie_consent", status);
    setIsVisible(false);
    if (status === "accepted") {
      window.location.reload(); // Force l'actualisation pour activer le tracker
    }
  };

  // Très important : si pas monté, on ne rend rien pour éviter les bugs Next.js
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{ zIndex: 9999 }} // On s'assure qu'il est au-dessus de TOUT
          className="fixed bottom-0 left-0 right-0 p-6 md:bottom-6 md:left-6 md:right-6"
        >
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl hidden md:block">
              <ShieldCheck size={32} />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-black uppercase italic text-slate-900 leading-tight">
                Respect de votre <span className="text-orange-500">vie privée</span>
              </h3>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Nous analysons le trafic pour améliorer BOLOU-HK GROUPE. Acceptez-vous les cookies ?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button 
                onClick={() => handleConsent("declined")}
                className="px-6 py-3 text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase transition-colors"
              >
                Refuser
              </button>
              <button 
                onClick={() => handleConsent("accepted")}
                className="px-8 py-3 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase shadow-lg hover:bg-orange-600 transition-all active:scale-95"
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}