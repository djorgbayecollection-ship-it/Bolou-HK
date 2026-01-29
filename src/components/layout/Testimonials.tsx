"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export default function Testimonials() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "testimonials");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setList(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || list.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            L'avis de nos <span className="text-orange-500">Clients</span>
          </h2>
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-orange-500 text-orange-500" />)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <Quote className="text-orange-500/20 mb-4" size={32} />
              <p className="text-slate-600 italic mb-6 font-medium leading-relaxed">
                "{item.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xs">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-widest">{item.name}</h4>
                  <p className="text-[9px] font-bold text-orange-500 uppercase">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}