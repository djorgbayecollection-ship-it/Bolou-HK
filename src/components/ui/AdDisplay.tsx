"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function AdDisplay({ type }: { type: "horizontal" | "vertical" }) {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const q = query(
          collection(db, "ads"), 
          where("active", "==", true), 
          where("type", "==", type),
          limit(10) // Augmenté un peu pour plus de variété
        );
        
        const snap = await getDocs(q);
        if (!snap.empty) {
          const ads = snap.docs.map(doc => doc.data());
          setAd(ads[Math.floor(Math.random() * ads.length)]);
        }
      } catch (error) {
        console.error("Erreur pub:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [type]);

  if (loading) return (
    <div className={`bg-slate-100 animate-pulse rounded-[2rem] ${
      type === "horizontal" ? "w-full h-40 md:h-56" : "w-full aspect-[4/5]"
    }`} />
  );

  if (!ad) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative group overflow-hidden rounded-[2rem] shadow-xl border border-slate-100 ${
          type === "horizontal" ? "w-full h-40 md:h-56" : "w-full aspect-[4/5]"
        }`}
      >
        <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
          <img 
            src={ad.imageUrl} 
            alt="Publicité BHK" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Overlay dégradé pour la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badge Sponsorisé */}
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-[7px] font-black text-white uppercase tracking-[0.2em] shadow-lg">
            Sponsorisé
          </div>
        </a>
      </motion.div>
    </AnimatePresence>
  );
}