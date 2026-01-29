"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Partners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "partners");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPartners(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || partners.length === 0) return null;

  // Astuce : On répète la liste pour qu'il y ait assez d'éléments pour défiler
  // Même si tu n'as qu'un seul logo, il en affichera 12 à la suite
  const displayList = [...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-12 bg-white border-y border-slate-50 relative z-20">
      <div className="container mx-auto px-4 mb-8 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Ils nous font <span className="text-slate-900">Confiance</span>
          </p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden h-16 flex items-center">
        <motion.div 
          className="flex whitespace-nowrap gap-12 md:gap-24 px-12"
          animate={{ x: [0, -1000] }} // On force un mouvement horizontal simple
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {displayList.map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`} 
              className="inline-block flex-shrink-0"
            >
              <img 
                src={partner.logoUrl} 
                alt={partner.name} 
                className="h-8 md:h-10 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 object-contain"
              />
            </div>
          ))}
        </motion.div>

        {/* Masques de dégradé pour la finition */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
      </div>
    </section>
  );
}