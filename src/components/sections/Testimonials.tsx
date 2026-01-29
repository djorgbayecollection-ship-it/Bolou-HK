"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export default function Testimonials() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || list.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* En-tête de section */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">
            Ce que disent nos <span className="text-emerald-500">Clients</span>
          </h2>
          <div className="flex gap-1 text-orange-400">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            <span className="ml-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Avis vérifiés</span>
          </div>
        </div>

        {/* Grille de témoignages */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {list.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="break-inside-avoid bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <Quote className="text-emerald-500/20 mb-4 group-hover:text-emerald-500/40 transition-colors" size={40} />
              
              <p className="text-slate-600 leading-relaxed italic mb-6">
                "{item.text}"
              </p>

              <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black italic">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black uppercase text-[11px] tracking-tight text-slate-900">
                    {item.name}
                  </h4>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}