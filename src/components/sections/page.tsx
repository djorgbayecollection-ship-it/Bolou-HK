"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Partners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. On crée la requête pour récupérer les partenaires par date
    const q = query(collection(db, "partners"), orderBy("createdAt", "desc"));

    // 2. "onSnapshot" permet de mettre à jour le site INSTANTANÉMENT 
    // dès que tu ajoutes un logo dans l'admin
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const partnersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPartners(partnersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || partners.length === 0) return null;

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">
          Ils nous font <span className="text-orange-500">Confiance</span>
        </p>
      </div>

      {/* Carousel Infini */}
      <div className="flex w-full group">
        <motion.div 
          className="flex flex-nowrap gap-12 items-center"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {/* On double la liste pour l'effet infini */}
          {[...partners, ...partners].map((partner, index) => (
            <div key={`${partner.id}-${index}`} className="flex-shrink-0">
              <img 
                src={partner.logoUrl} 
                alt={partner.name} 
                className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}