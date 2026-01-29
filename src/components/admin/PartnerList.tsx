"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { Trash2 } from "lucide-react";

export default function PartnerList() {
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "partners"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setPartners(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {partners.map(p => (
        <div key={p.id} className="p-4 bg-white rounded-2xl border border-slate-100 relative group text-center">
          <img src={p.logoUrl} alt="" className="h-10 mx-auto mb-2 object-contain" />
          <p className="text-[10px] font-bold uppercase truncate">{p.name}</p>
          <button onClick={() => confirm("Supprimer ?") && deleteDoc(doc(db, "partners", p.id))} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
        </div>
      ))}
    </div>
  );
}