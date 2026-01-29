"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { Trash2, Quote } from "lucide-react";

export default function TestimonialList() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  return (
    <div className="space-y-4">
      {list.map(t => (
        <div key={t.id} className="p-6 bg-white rounded-2xl border border-slate-100 flex justify-between items-center group">
          <div className="flex gap-4">
            <Quote className="text-emerald-500 opacity-20" size={24} />
            <div>
              <p className="text-sm italic text-slate-600 mb-1">"{t.text}"</p>
              <p className="text-[10px] font-black uppercase">{t.name} • <span className="text-emerald-500">{t.role}</span></p>
            </div>
          </div>
          <button onClick={() => confirm("Supprimer ?") && deleteDoc(doc(db, "testimonials", t.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
        </div>
      ))}
    </div>
  );
}