"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, ShieldCheck, Zap, Cog, 
  HeartHandshake, Award, Star, Users, 
  Target, Sparkles, Phone, Mail, ChevronRight
} from "lucide-react";
import CountUp from 'react-countup';
import Image from "next/image";

const bannerImages = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165833767-027ffea9e778?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop"
];

export default function AproposPage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute inset-0 bg-slate-900/50 z-10" />
              <img 
                src={bannerImages[currentImage]} 
                alt="BHK Banner" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-20 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
            <span className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest mb-6 border border-white/20">
              Bienvenue chez Bolou HK
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 drop-shadow-lg uppercase italic tracking-tighter">
              Votre partenaire de <br />
              <span className="text-blue-500">confiance</span>
            </h1>
            <p className="text-white/90 text-xl font-medium max-w-2xl mx-auto italic">
              "Voyagez, assurez et célébrez en toute sérénité !"
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. STATISTIQUES */}
      <section className="relative z-30 -mt-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 bg-white shadow-2xl rounded-[3rem] overflow-hidden border border-slate-100 divide-x divide-slate-50">
          <StatCounter number="03+" label="Années d'Entreprise" icon={<Star className="text-orange-500" />} />
          <StatCounter number="246" label="Clients Satisfaits" icon={<Users className="text-blue-600" />} />
          <StatCounter number="100%" label="Tranquillité Totale" icon={<ShieldCheck className="text-orange-500" />} />
        </div>
      </section>

      {/* 3. POURQUOI NOUS CHOISIR */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic">Pourquoi Nous <span className="text-blue-600">Choisir ?</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ChoiceCard icon={<Zap />} title="Service rapide et fiable" desc="Assurances, vols et événementiel au même endroit." color="text-orange-500" />
            <ChoiceCard icon={<ShieldCheck />} title="Offres compétitives" desc="Des prix attractifs sans frais cachés pour tous les budgets." color="text-blue-600" />
            <ChoiceCard icon={<HeartHandshake />} title="Assistance 24/7" desc="Équipe disponible jour et nuit pour vous assister." color="text-orange-500" />
            <ChoiceCard icon={<Award />} title="Expertise" desc="Solutions personnalisées par des professionnels passionnés." color="text-blue-600" />
            <ChoiceCard icon={<Cog />} title="Service Dépannage" desc="Assistance technique et logistique disponible à chaque instant." color="text-orange-500" />
          </div>
        </div>
      </section>

      {/* 4. SECTION TEAM (MISE À JOUR : 5 CARTES) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
              Notre <span className="text-blue-600">Team</span>
            </h2>
            <p className="text-slate-500 font-bold mt-2 italic">L'excellence au service de votre sérénité</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <TeamCard 
              name="Hermann Bolou"
              role="CEO, Founder"
              img="/team/hermann.jpg"
              desc="Visionnaire et passionné par l'innovation logistique."
            />
            <TeamCard 
              name="Karole Bolou"
              role="Co-Founder, Gérante"
              img="/team/karole.jpg"
              desc="Experte en gestion opérationnelle et relation client."
            />
            <TeamCard 
              name="Syriak Setchy"
              role="Assistante Commerciale"
              img="/team/syriak.jpg"
              desc="Le pilier de notre réactivité commerciale au quotidien."
            />
            <TeamCard 
              name="Amos De vincy"
              role="IT & Digital"
              img="/team/amos.jpg"
              desc="Architecte de nos solutions digitales et de notre croissance."
            />
            <TeamCard 
              name="Kanko Assietou"
              role="Resp Call Center"
              img="/team/assietou.jpg"
              desc="Le pilier de notre réactivité commerciale au quotidien."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

/* --- COMPOSANTS AUXILIAIRES --- */

function StatCounter({ number, label, icon }: any) {
  const numericValue = parseFloat(number.replace(/[^0-9.]/g, ''));
  const suffix = number.replace(/[0-9.]/g, '');
  return (
    <div className="p-10 flex flex-col items-center text-center hover:bg-slate-50 transition-colors">
      <div className="mb-4 text-2xl">{icon}</div>
      <span className="text-4xl font-black text-slate-900 mb-1">
        <CountUp end={numericValue} duration={3} decimals={numericValue % 1 !== 0 ? 1 : 0} suffix={suffix} enableScrollSpy={true} scrollSpyOnce={true} />
      </span>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function ChoiceCard({ icon, title, desc, color }: any) {
  return (
    <motion.div whileHover={{ y: -10 }} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group">
      <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-2xl ${color} group-hover:bg-blue-600 group-hover:text-white transition-all duration-500`}>
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}

function TeamCard({ name, role, desc, img }: { name: string; role: string; desc: string; img?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      className="flex flex-col items-center text-center p-5 bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all group"
    >
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 bg-blue-600 rounded-[1.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-10" />
        <div className="absolute inset-0 bg-slate-100 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-md flex items-center justify-center">
          {img ? (
            <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <Users className="text-slate-300 group-hover:text-orange-500 transition-colors" size={30} />
          )}
        </div>
      </div>
      <h3 className="text-sm font-black text-slate-900 leading-tight uppercase italic">{name}</h3>
      <p className="text-blue-600 font-bold text-[9px] uppercase tracking-widest mt-1 mb-3">{role}</p>
      <p className="text-slate-500 text-[10px] font-medium leading-relaxed italic line-clamp-3">
        {desc}
      </p>
    </motion.div>
  );
}