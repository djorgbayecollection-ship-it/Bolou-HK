"use client";
import { motion } from "framer-motion";
import { 
  Plane, Shield, Utensils, Truck, GraduationCap, 
  ArrowUpRight, Sparkles, MonitorSmartphone, MousePointerClick 
} from "lucide-react";
import Link from "next/link";
import AdDisplay from "@/components/ui/AdDisplay";

const services = [
  {
    title: "Tourisme & Voyage",
    desc: "Billetterie, circuits touristiques et séjours inoubliables.",
    icon: <Plane className="text-orange-500" size={28} />,
    size: "md:col-span-2 md:row-span-2",
    bg: "bg-slate-900",
    textColor: "text-white",
    img: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1200",
    link: "/voyages"
  },
  {
    title: "Agence Digitale",
    desc: "Développement Web, Design & Marketing.",
    icon: <MonitorSmartphone className="text-blue-500" size={28} />,
    size: "md:col-span-1 md:row-span-2",
    bg: "bg-white border border-slate-100",
    textColor: "text-slate-900",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
    link: "/digital"
  },
  {
    title: "Assurances",
    desc: "Protection Voyage et Auto.",
    icon: <Shield className="text-blue-600" size={28} />,
    size: "md:col-span-1 md:row-span-1",
    bg: "bg-slate-50",
    textColor: "text-slate-900",
    img: "https://res.cloudinary.com/dkjqh8snc/image/upload/v1769222491/Actualit%C3%A9s_ASSURANCES_La_synth%C3%A8se_des_articles___press_omsgbm.jpg",
    link: "/assurances"
  },
  {
    title: "Événementiel",
    desc: "Gastronomie & Organisation.",
    icon: <Utensils className="text-orange-500" size={28} />,
    size: "md:col-span-1 md:row-span-1",
    bg: "bg-blue-600",
    textColor: "text-white",
    img: "https://res.cloudinary.com/dkjqh8snc/image/upload/v1769222732/The_Columbine_room_is_perfect_for_your_event_of_up_to_120_people__Book_your_next_event_at_the_Lincoln_Center_today_Photo_from_our_friends_at_PhoCo_Photography_ckwcmj.jpg",
    link: "/traiteur"
  },
  {
    title: "Import-Export",
    desc: "Logistique internationale.",
    icon: <Truck className="text-blue-600" size={28} />,
    size: "md:col-span-1 md:row-span-1",
    bg: "bg-slate-100",
    textColor: "text-slate-900",
    img: "https://res.cloudinary.com/dkjqh8snc/image/upload/v1769222491/Export_Import_Data_o8w6ci.jpg",
    link: "/import-export"
  },
  {
    title: "Bolou-HK Academy",
    desc: "Expertise & Développement de compétences.",
    icon: <GraduationCap className="text-orange-500" size={28} />,
    size: "md:col-span-2 md:row-span-1",
    bg: "bg-gradient-to-r from-orange-500 to-orange-600",
    textColor: "text-white",
    img: "https://res.cloudinary.com/dkjqh8snc/image/upload/v1769222491/What_Brands_Love_About_Working_With_Affiliate_Creators_chflnd.jpg",
    link: "/formation"
  }
];

export default function HomePage() {
  return (
    <div className="pt-32 pb-10 px-4 md:px-10 overflow-hidden bg-white">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto mb-20 relative">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="h-[1px] w-12 bg-blue-600"></div>
            <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px]">L'Excellence à 360°</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8 italic">
            BOLOU-HK <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-600 to-orange-500">GROUPE</span>
          </h1>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <p className="max-w-2xl text-base md:text-xl text-slate-500 font-medium leading-relaxed italic">
              Une architecture de services pensée pour l'excellence. Nous fusionnons le 
              <span className="text-slate-900 font-bold"> Voyages</span>, le 
              <span className="text-slate-900 font-bold"> Digital</span>, l' 
              <span className="text-slate-900 font-bold"> Assurance</span> et l' 
              <span className="text-slate-900 font-bold"> Logistique</span>.
            </p>
            
            {/* ESPACE PUB VERTICAL DANS LE HERO (Optionnel) */}
            <div className="hidden lg:block w-48 shrink-0">
               <AdDisplay type="vertical" />
            </div>
          </div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-10 flex items-center gap-2 text-slate-300"
          >
            <MousePointerClick size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Explorez nos pôles</span>
          </motion.div>
        </motion.div>

        <div className="absolute top-0 right-0 -z-10 opacity-5 pointer-events-none">
          <Sparkles size={500} className="text-blue-600" />
        </div>
      </section>

      {/* --- BENTO GRID --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
        {services.map((s, i) => (
          <Link href={s.link} key={i} className={`${s.size}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative h-full rounded-[3rem] p-8 overflow-hidden transition-all duration-500 cursor-pointer ${s.bg} ${s.textColor}`}
            >
              {s.img && (
                <>
                  <div className="absolute inset-0 z-0">
                    <img src={s.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-30 group-hover:opacity-50" alt="" />
                  </div>
                  <div className={`absolute inset-0 z-0 bg-gradient-to-br ${s.bg === 'bg-slate-900' ? 'from-black/60' : 'from-transparent'} via-transparent to-transparent`} />
                </>
              )}

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-2xl shadow-black/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                    {s.icon}
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                    <ArrowUpRight className="group-hover:text-white transition-colors" size={20} />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-black leading-none mb-2 tracking-tighter italic uppercase">{s.title}</h3>
                  <p className="text-[11px] opacity-70 font-bold italic tracking-wide uppercase">{s.desc}</p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* --- ESPACE PUB HORIZONTAL --- */}
      <div className="max-w-7xl mx-auto my-16 px-2">
        <AdDisplay type="horizontal" />
      </div>

      {/* --- SECTION INFÉRIEURE (CTA) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mt-10 mb-10 flex flex-col md:flex-row items-center justify-between p-12 rounded-[3.5rem] bg-slate-950 text-white relative overflow-hidden shadow-2xl shadow-blue-900/10"
      >
        <div className="relative z-10 mb-8 md:mb-0 text-center md:text-left">
          <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
             <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Work with us</span>
          </div>
          <h4 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">
            Donnez vie à vos <br /> <span className="text-orange-500">projets d'envergure</span>
          </h4>
        </div>
        
        <Link href="/contact" className="group relative z-10 bg-white text-slate-950 px-12 py-6 rounded-3xl font-black uppercase italic tracking-widest transition-all duration-300 hover:bg-orange-500 hover:text-white shadow-xl hover:-translate-y-2">
           Démarrer l'aventure
        </Link>
        
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full" />
      </motion.div>
    </div>
  );
}