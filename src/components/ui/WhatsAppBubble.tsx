"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppBubble() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Délai de 3 secondes avant l'apparition
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const phoneNumber = "2250574467386"; // Ton numéro
  const message = "Bonjour BOLOU-HK GROUPE, j'aimerais avoir des informations sur vos services.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] group"
        >
          {/* Halo d'appel à l'action */}
          <span className="absolute inset-0 rounded-2xl bg-[#25D366] blur-xl opacity-40 group-hover:opacity-60 animate-pulse" />
          
          <div className="relative flex items-center gap-3 bg-[#25D366] text-white p-4 md:p-5 rounded-2xl shadow-2xl border-2 border-white/20">
            <MessageCircle size={28} fill="currentColor" />
            
            {/* Texte qui apparaît au hover */}
            <span className="max-w-0 overflow-hidden whitespace-nowrap font-black uppercase italic tracking-tighter transition-all duration-500 group-hover:max-w-[150px] text-sm md:text-base">
              Discuter avec nous
            </span>
          </div>

          {/* Indicateur de statut en ligne */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
}