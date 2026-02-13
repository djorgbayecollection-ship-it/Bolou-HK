"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Ship, Utensils, ShieldCheck, ArrowRight, 
  Globe, CheckCircle2, ShoppingCart, Star 
} from "lucide-react";
import { useServiceModal } from "@/context/ServiceContext";

const DIVERS_SECTIONS = [
  {
    id: "DIVERS-LOGISTIQUE",
    title: "Import - Export",
    subtitle: "Logistique Mondiale",
    desc: "De la Chine vers l'Afrique ou l'Europe, nous gérons l'approvisionnement, le dédouanement et la livraison de vos marchandises avec une précision chirurgicale.",
    icon: <Ship size={40} />,
    image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=1000",
    features: ["Sourcing Fournisseurs", "Fret Maritime & Aérien", "Contrôle Qualité"]
  },
  {
    id: "DIVERS-EVENT",
    title: "Traiteur & Events",
    subtitle: "Expériences Gastronomiques",
    desc: "HK Traiteur transforme vos événements en moments mémorables. Cocktails dînatoires, mariages ou repas d'affaires : l'excellence est dans l'assiette.",
    icon: <Utensils size={40} />,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000",
    features: ["Cuisine du Monde", "Service Premium", "Décoration Thématique"]
  },
  {
    id: "DIVERS-ASSURANCE",
    title: "Assurances",
    subtitle: "Protection & Sérénité",
    desc: "Courtage en assurances sur-mesure. Nous négocions pour vous les meilleures couvertures (Auto, Santé, Pro) auprès des plus grands assureurs.",
    icon: <ShieldCheck size={40} />,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000",
    features: ["Audit de Risques", "Optimisation de Primes", "Gestion de Sinistres"]
  }
];

export default function DiversPage() {
  const { openModal } = useServiceModal();

  return (
    <main className="bg-slate-50 min-h-screen pb-20">
      {/* HERO MINI */}
      <section className="bg-slate-900 pt-32 pb-20 px-6 rounded-b-[4rem] md:rounded-b-[6rem]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px]"
          >
            Multi-Expertise BOLOU-HK
          </motion.span>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter mt-4 leading-none">
            Services <br /><span className="text-slate-500">Hors Limites.</span>
          </h1>
        </div>
      </section>

      {/* SECTIONS DE SERVICES */}
      <section className="px-6 -mt-10">
        <div className="max-w-7xl mx-auto space-y-10">
          {DIVERS_SECTIONS.map((section, idx) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white rounded-[4rem] overflow-hidden shadow-xl border border-slate-100`}
            >
              {/* Image */}
              <div className="md:w-1/2 h-[400px] relative">
                <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/20" />
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-900 shadow-2xl">
                  {section.icon}
                </div>
              </div>

              {/* Contenu */}
              <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
                <span className="text-orange-500 font-black uppercase text-xs tracking-widest">{section.subtitle}</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mt-2 mb-6 text-slate-900">
                  {section.title}
                </h2>
                <p className="text-slate-500 text-lg italic mb-8 leading-relaxed">
                  {section.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {section.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-slate-700 font-bold uppercase text-[10px]">
                      <CheckCircle2 size={16} className="text-emerald-500" /> {feat}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => openModal(section.id)}
                  className="w-full sm:w-max px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-orange-500 transition-all flex items-center justify-center gap-4 group"
                >
                  Faire une demande <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER APPEL À L'ACTION */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Globe size={200} />
          </div>
          <h2 className="text-4xl font-black uppercase italic leading-tight mb-6 relative z-10">
            Besoin d'un service <br />sur-mesure ?
          </h2>
          <p className="text-slate-400 font-medium italic mb-10 max-w-xl mx-auto relative z-10">
            Notre équipe est prête à relever tous vos défis logistiques ou événementiels. Contactez-nous pour une offre personnalisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
             <button className="px-10 py-5 bg-orange-500 text-white rounded-2xl font-black uppercase italic tracking-widest">
               WhatsApp Direct
             </button>
          </div>
        </div>
      </section>
    </main>
  );
}