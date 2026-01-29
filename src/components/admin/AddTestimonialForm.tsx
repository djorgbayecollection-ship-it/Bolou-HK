"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddTestimonialForm() {
  const [form, setForm] = useState({ name: "", role: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "testimonials"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setForm({ name: "", role: "", text: "" });
      alert("Témoignage ajouté !");
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
      <h2 className="text-xl font-black uppercase italic mb-6 text-emerald-600">Ajouter un Avis</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nom du client" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold" required />
        <input type="text" placeholder="Rôle (ex: CEO, Client Particulier)" value={form.role} onChange={(e)=>setForm({...form, role: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold" required />
        <textarea placeholder="Le témoignage..." value={form.text} onChange={(e)=>setForm({...form, text: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl outline-none font-medium h-32" required />
        <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase hover:bg-emerald-600 transition-all">
          {loading ? "Envoi..." : "Publier l'avis"}
        </button>
      </form>
    </div>
  );
}