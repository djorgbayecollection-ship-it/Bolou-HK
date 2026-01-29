"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const MESSAGES = [
  "✈️ Promo Voyage : -15% sur les billets vers Dubaï !",
  "🚀 BHK Digital : Votre site web livré en 7 jours.",
  "📞 Assistance 24h/7j : +225 0574467386",
  "🎓 Nouvelle formation HK Academy disponible."
];

export default function TopBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 text-white py-2 overflow-hidden h-8 flex items-center relative z-[60]">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] italic"
        >
          {MESSAGES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}