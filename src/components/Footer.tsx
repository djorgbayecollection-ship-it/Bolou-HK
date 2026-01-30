"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Instagram, Facebook, Linkedin, 
  Mail, Phone, MapPin, ArrowUpRight, ShieldCheck 
} from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Services",
    links: [
      { name: "Agence Digitale", href: "/services/digital" },
      { name: "Voyage & Tourisme", href: "/services/voyages" },
      { name: "Import - Export", href: "/services/divers" },
      { name: "HK Academy", href: "/services/formation" },
    ]
  },
  {
    title: "Expertises",
    links: [
      { name: "Assistance & Création", href: "/services/divers" },
      { name: "Gestion Assurances", href: "/services/divers" },
      { name: "Traiteur & Events", href: "/services/divers" },
      { name: "Blog & Actualités", href: "/blog" },
    ]
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] text-white pt-12 pb-6 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION 1 : APPEL À L'ACTION RÉDUIT */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none"
          >
            Prêt pour <br />
            <span className="text-orange-500">votre vision ?</span>
          </motion.h2>
          
          <Link href="/contact" className="group relative">
            <div className="relative px-8 py-4 bg-white text-slate-900 rounded-xl font-black uppercase italic tracking-widest text-sm flex items-center gap-3 transition-transform group-hover:scale-95">
              Contact <ArrowUpRight size={20} />
            </div>
          </Link>
        </div>

        <hr className="border-white/5 mb-10" />

        {/* SECTION 2 : LIENS ET INFOS COMPACTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          
          {/* LOGO ET BIO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">
                BOLOU-HK<span className="text-orange-500">.</span>
              </span>
            </div>
            <p className="text-slate-400 font-medium italic leading-snug text-xs max-w-xs">
              L'excellence multi-services. Tech, logistique et service premium.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={<Instagram size={18} />} href="https://www.instagram.com/bhk_voyages/" />
              <SocialIcon icon={<Facebook size={18} />} href="https://www.facebook.com/profile.php?id=61587018501632" />
              <SocialIcon icon={<Linkedin size={18} />} href="https://www.linkedin.com/in/amos-de-vincy-tene-42a5683a9/" />
            </div>
          </div>

          {/* LIENS DYNAMIQUES */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="text-orange-500 font-black uppercase text-[10px] tracking-[0.2em] mb-5 italic">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-400 hover:text-white transition-colors font-bold uppercase text-[9px] tracking-widest">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CONTACT RAPIDE */}
          <div>
            <h4 className="text-orange-500 font-black uppercase text-[10px] tracking-[0.2em] mb-5 italic">Direct</h4>
            <ul className="space-y-3">
              <ContactLink icon={<Phone size={14} />} text="+225 0574467386" />
              <ContactLink icon={<Mail size={14} />} text="info@bolou-hk.com" />
              <ContactLink icon={<MapPin size={14} />} text="Abidjan, CI" />
            </ul>
          </div>

        </div>

        {/* SECTION 3 : COPYRIGHT MINIMALISTE */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">
            © {currentYear} BOLOU-HK GROUPE.
          </p>
          <div className="flex gap-6 text-[9px] font-black uppercase text-slate-500 tracking-widest">
            <Link href="/mentions" className="hover:text-orange-500 transition-colors">Mentions</Link>
            <Link href="/admin" className="hover:text-orange-500 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }: { icon: any, href: string }) {
  return (
    <Link href={href} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
      {icon}
    </Link>
  );
}

function ContactLink({ icon, text }: { icon: any, text: string }) {
  return (
    <li className="flex items-center gap-3 group cursor-pointer">
      <div className="text-orange-500">{icon}</div>
      <span className="text-slate-400 font-bold text-[9px] uppercase group-hover:text-white transition-colors">{text}</span>
    </li>
  );
}