"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Plus, GraduationCap, Clock, FileCheck, Loader2 } from "lucide-react";

export default function AdminFormation() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", duration: "", description: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "formations"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setFormData({ title: "", duration: "", description: "" });
      alert("Formation ajoutée !");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-slate-900">Gestion <span className="text-orange-500">Academy</span></h1>
          <p className="text-slate-500 font-medium italic">Créez et gérez vos programmes de formation.</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* FORMULAIRE D'AJOUT */}
        <form onSubmit={handleCreate} className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-6 shadow-2xl">
          <h2 className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
            <Plus size={16} /> Nouveau Module
          </h2>
          <div className="space-y-4">
            <input 
              className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl outline-none focus:border-orange-500 text-sm font-bold italic"
              placeholder="Nom de la formation"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <input 
              className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl outline-none focus:border-orange-500 text-sm font-bold italic"
              placeholder="Durée (ex: 3 Mois)"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
            />
            <textarea 
              className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl outline-none focus:border-orange-500 text-sm italic h-32"
              placeholder="Description du programme..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <button className="w-full py-5 bg-orange-50 rounded-2xl text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-white transition-all">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Enregistrer le module"}
          </button>
        </form>

        {/* LISTE DES INSCRITS (SIMULATION) */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black uppercase italic text-slate-900 mb-8 flex items-center gap-2">
            <FileCheck className="text-orange-500" /> Candidatures Récentes
          </h2>
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold italic">K</div>
                 <div>
                   <p className="font-black text-xs uppercase">Koffi Kouassi</p>
                   <p className="text-[10px] text-slate-400 font-bold italic uppercase">Module : Billetterie</p>
                 </div>
               </div>
               <button className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg">Voir Dossier</button>
            </div>
            {/* Répéter dynamiquement avec Firebase */}
          </div>
        </div>
      </div>
    </div>
  );
}