"use client";
import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { 
  Send, Phone, Mail, MapPin, Instagram, 
  Linkedin, MessageSquare, Loader2, CheckCircle2, Globe, Facebook
} from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    subject: "Business & Digital",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        source: "Page Contact",
        status: "nouveau",
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setFormData({ name: "", email: "", whatsapp: "", subject: "Business & Digital", message: "" });
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      
      {/* HEADER */}
      <section className="px-6 max-w-7xl mx-auto mb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block">
            Get in touch
          </span>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-slate-900 leading-none">
            Parlons de votre <br /> <span className="text-orange-500">Prochain Projet.</span>
          </h1>
        </motion.div>
      </section>

      <section className="px-6 max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
        
        {/* COLONNE GAUCHE : INFOS & RESEAUX */}
        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-8">
            <ContactInfo 
              icon={<Phone className="text-orange-500" />} 
              title="Téléphone & WhatsApp" 
              value="+225 07 11 81 25 10 • 05 74 46 73 86 • 07 19 65 93 68 • 07 13 82 87 61" 
              sub="Disponible H24/6J"
            />
            <ContactInfo 
              icon={<Mail className="text-orange-500" />} 
              title="Email Direct" 
              value="info@bolouhk.com" 
              sub="Réponse sous 24h"
            />
            <ContactInfo 
              icon={<MapPin className="text-orange-500" />} 
              title="Bureaux" 
              value="Abidjan, Cocody Angré" 
              sub="Côte d'Ivoire"
            />
          </div>

          <div className="p-8 bg-slate-900 rounded-[3rem] text-white space-y-6 relative overflow-hidden group">
            <Globe className="absolute -right-10 -bottom-10 text-white/10 group-hover:text-orange-500/20 transition-colors duration-700" size={200} />
            <h3 className="text-2xl font-black italic uppercase leading-none relative z-10">Suivez <br /> l'aventure</h3>
            
            <div className="flex gap-4 relative z-10">
              {/* LIENS RÉSEAUX SOCIAUX CONFIGURÉS */}
              <SocialBtn icon={<Instagram size={20} />} link="https://www.instagram.com/bhk_voyages/" />
              <SocialBtn icon={<Facebook size={20} />} link="https://www.facebook.com/profile.php?id=61587018501632" />
              <SocialBtn icon={<Linkedin size={20} />} link="https://www.linkedin.com/in/amos-de-vincy-tene-42a5683a9/" />
              <SocialBtn icon={<MessageSquare size={20} />} link={`https://wa.me/2250711812510`} />
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className="lg:col-span-8">
          <div className="bg-slate-50 rounded-[4rem] p-8 md:p-16 border border-slate-100">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black italic uppercase text-slate-900">Message Envoyé !</h2>
                <button onClick={() => setSent(false)} className="text-orange-500 font-black uppercase text-xs tracking-widest hover:underline">
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <InputGroup label="Votre Nom" placeholder="Jean Kouadio" required value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
                  <InputGroup label="Email" type="email" placeholder="jean@gmail.com" required value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <InputGroup label="WhatsApp / Mobile" placeholder="+225 07 11 81 25 10" value={formData.whatsapp} onChange={(e:any) => setFormData({...formData, whatsapp: e.target.value})} />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Sujet d'intérêt</label>
                    <select className="w-full bg-white rounded-full px-6 py-5 text-sm font-bold border-none ring-2 ring-slate-100 focus:ring-orange-500 transition-all appearance-none outline-none" value={formData.subject} onChange={(e:any) => setFormData({...formData, subject: e.target.value})}>
                      <option>Business & Digital</option>
                      <option>Traiteur & Événementiel</option>
                      <option>Voyage & Tourisme</option>
                      <option>Bolou-HK Academy</option>
                      <option>Autre</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Votre Message</label>
                  <textarea rows={5} required placeholder="Dites-nous tout..." className="w-full bg-white rounded-[2rem] p-6 text-sm font-bold border-none ring-2 ring-slate-100 focus:ring-orange-500 transition-all outline-none" value={formData.message} onChange={(e:any) => setFormData({...formData, message: e.target.value})} />
                </div>
                <button disabled={loading} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black italic uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-orange-500 transition-all shadow-2xl disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" /> : <>Envoyer le message <Send size={18} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION MAP CLIQUABLE */}
      <section className="mt-24 px-6 max-w-7xl mx-auto">
        <a 
          href="https://maps.app.goo.gl/NRF3rFYCLPqgZeVf9" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block h-[400px] rounded-[4rem] overflow-hidden bg-slate-100 border-8 border-slate-50 relative group cursor-pointer"
        >
          {/* Simulation de Map avec un effet au survol */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000')] bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-20" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white/80 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl border border-white group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
              <MapPin size={48} className="mx-auto mb-4 animate-bounce" />
              <p className="font-black italic text-slate-900 group-hover:text-white uppercase text-xl leading-none">Nos bureaux à Angré</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-60">Cliquer pour ouvrir l'itinéraire</p>
            </div>
          </div>
        </a>
      </section>

    </main>
  );
}

// --- HELPERS ---

function ContactInfo({ icon, title, value, sub }: any) {
  return (
    <div className="flex gap-6 group">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</h4>
        <p className="text-xl font-black text-slate-900 italic tracking-tight leading-none mb-1">{value}</p>
        <p className="text-xs font-medium text-slate-500 italic">{sub}</p>
      </div>
    </div>
  );
}

function SocialBtn({ icon, link }: any) {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="w-12 h-12 bg-white/10 hover:bg-orange-500 text-white rounded-xl flex items-center justify-center transition-all hover:-translate-y-2 shadow-lg"
    >
      {icon}
    </a>
  );
}

function InputGroup({ label, placeholder, value, onChange, type = "text", required = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{label}</label>
      <input type={type} required={required} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-white rounded-full px-6 py-5 text-sm font-bold border-none ring-2 ring-slate-100 focus:ring-orange-500 transition-all outline-none" />
    </div>
  );
}