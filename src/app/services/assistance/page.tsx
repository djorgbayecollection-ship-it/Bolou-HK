"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, Scale, Users2, LineChart, 
  ArrowRight, ShieldCheck, Zap, TrendingUp, Target 
} from "lucide-react";
import { useServiceModal } from "@/context/ServiceContext";

const EXPERTISES = [
  {
    id: "CREATION",
    title: "Création d'Entreprise",
    desc: "Accompagnement complet : choix du statut juridique, rédaction des statuts, formalités CEPICI et immatriculation.",
    icon: <Briefcase className="text-orange-500" />,
    features: ["Étude de faisabilité", "Business Plan", "Formalités CEPICI"]
  },
  {
    id: "GESTION",
    title: "Excellence de Gestion",
    desc: "Optimisez la performance de votre structure avec un suivi rigoureux et des tableaux de bord précis.",
    icon: <LineChart className="text-blue-500" />,
    features: ["Suivi comptable", "Audit interne", "Optimisation RH"]
  }
];

export default function AssistancePage() {
  const { openModal } = useServiceModal();

  return (
    <main className="bg-transparent min-h-screen">
      
      {/* HERO AVEC OBJET FLOTTANT */}
      <section className="pt-40 pb-32 px-6 bg-slate-900 rounded-b-[5rem] relative overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-[10%] opacity-20 hidden lg:block"
        >
          <Target size={200} className="text-orange-500" />
        </motion.div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="px-5 py-2 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-orange-500/20">
              Business Intelligence
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter mt-8 leading-[0.9]">
              L'Architecture <br /> de votre <span className="text-orange-500 text-outline">Succès.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* SECTION GRAPHIQUE ANIMÉ AU SCROLL */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-12"
          >
            <div className="max-w-md">
              <TrendingUp className="text-orange-500 mb-4" size={40} />
              <h2 className="text-3xl font-black italic uppercase italic">Performance <br /> & Croissance</h2>
              <p className="text-slate-500 mt-4 italic font-medium">Nous transformons vos obligations fiscales en leviers de croissance stratégiques.</p>
            </div>

            {/* LES BARRES DE GRAPHIQUE QUI MONTENT */}
            <div className="flex items-end gap-4 h-48 px-10">
              {[50, 80, 60, 100, 75].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 1.5, ease: "circOut" }}
                  className="w-10 bg-gradient-to-t from-slate-900 to-orange-500 rounded-t-xl"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* GRILLE D'EXPERTISE */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {EXPERTISES.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="p-12 bg-white/50 backdrop-blur-xl rounded-[4rem] border border-white shadow-2xl flex flex-col group relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Zap size={200} />
              </div>

              <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center mb-10 group-hover:bg-orange-500 transition-colors duration-500">
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 32, className: "text-white" })}
              </div>
              
              <h3 className="text-3xl font-black uppercase italic text-slate-900 mb-6">{item.title}</h3>
              <p className="text-slate-500 text-lg italic font-medium mb-10 leading-relaxed">{item.desc}</p>

              <div className="space-y-4 mb-12">
                {item.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-black text-slate-700 uppercase italic tracking-widest">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" /> {f}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => openModal(item.id)}
                className="mt-auto w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase italic tracking-[0.2em] hover:bg-orange-500 transition-all flex items-center justify-center gap-4 shadow-xl shadow-slate-900/20"
              >
                Lancer le diagnostic <ArrowRight size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}