"use client";
import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, ArrowRight } from "lucide-react";
import CountUp from 'react-countup';

const COURS = [
  {
    title: "Santé et Sécurité au Travail",
    desc: "Maintenir une personne en vie en cas d'urgence vitale dépend de la réactivité et du savoir-faire des témoins. À Bolou-HK, nous vous transmettons le savoir-faire.",
    icon: <BookOpen className="text-blue-500" />,
    duration: "3 Mois"
  },
  {
    title: "Informatique",
    desc: "L'analphabète est celui qui n'a aucune maîtrise du numérique.",
    icon: <GraduationCap className="text-orange-500" />,
    duration: "6 Mois"
  },
  {
    title: "Marketing et vente",
    desc: "La vente est l'oxygène de toute entreprise.",
    icon: <Users className="text-emerald-500" />,
    duration: "4 Mois"
  }
];

// --- COMPOSANT HERO AVEC COMPTAGE ---
function AcademyHero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-slate-900 rounded-b-[4rem]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <span className="px-4 py-2 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
            Bolou-HK Academy
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mt-6 leading-none">
            Propulsez votre <br /> <span className="text-orange-500">Carrière.</span>
          </h1>
          <p className="text-slate-400 mt-6 text-lg italic font-medium max-w-lg">
            Des formations certifiantes animées par des experts du terrain pour devenir les leaders de demain.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-center">
            <p className="text-4xl font-black text-white">
              <CountUp end={500} duration={3} prefix="+" enableScrollSpy={true} scrollSpyOnce={true} />
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-2">Diplômés</p>
          </div>

          <div className="bg-orange-500 p-8 rounded-[2.5rem] text-center shadow-xl shadow-orange-500/20">
            <p className="text-4xl font-black text-white">
              <CountUp end={95} duration={3} suffix="%" enableScrollSpy={true} scrollSpyOnce={true} />
            </p>
            <p className="text-[10px] text-white/80 uppercase font-black tracking-widest mt-2">Insertion</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- PAGE PRINCIPALE ---
export default function FormationPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Utilisation du composant Hero définit plus haut */}
      <AcademyHero />

      {/* LISTE DES FORMATIONS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black italic uppercase text-slate-900 mb-12">
          Nos Programmes <span className="text-orange-500">Certifiants</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {COURS.map((cours, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col h-full group transition-all hover:bg-white hover:shadow-2xl"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                {cours.icon}
              </div>
              <h3 className="text-xl font-black uppercase italic text-slate-900 mb-4">{cours.title}</h3>
              <p className="text-slate-500 text-sm italic font-medium mb-8 flex-1">{cours.desc}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {cours.duration}
                </span>
                <button className="text-orange-500 font-black text-[10px] uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
                  S'inscrire <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}