"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { 
  Package, Clock, CheckCircle, Trash2, 
  ExternalLink, Phone, ArrowRightLeft, Filter 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminImportExport() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [filter, setFilter] = useState("tous");

  // Récupération en temps réel depuis Firebase
  useEffect(() => {
    const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuotes(docs);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, "quotes", id), { status: newStatus });
  };

  const deleteQuote = async (id: string) => {
    if(confirm("Supprimer cette demande ?")) {
      await deleteDoc(doc(db, "quotes", id));
    }
  };

  const filteredQuotes = filter === "tous" 
    ? quotes 
    : quotes.filter(q => q.type.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DASHBOARD */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic text-slate-900 leading-none">
              Admin <span className="text-blue-600 underline decoration-slate-900">Logistique</span>
            </h1>
            <p className="text-slate-500 font-bold italic mt-2">Gestion des demandes de devis BOLOU-HK</p>
          </div>
          
          <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            {["tous", "Importation", "Exportation"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                  filter === f ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* GRILLE DES DEMANDES */}
        <div className="grid gap-6">
          <AnimatePresence>
            {filteredQuotes.map((quote) => (
              <motion.div
                key={quote.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  
                  {/* Colonne 1 : Client & Info de base */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        quote.status === 'traité' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600 animate-pulse'
                      }`}>
                        {quote.status}
                      </span>
                      <span className="text-slate-300">/</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase italic">
                        {quote.createdAt?.toDate().toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-900 italic uppercase leading-none mb-2">
                      {quote.clientName}
                    </h2>
                    
                    <div className="flex items-center gap-4 text-blue-600">
                      <a href={`https://wa.me/${quote.whatsapp}`} target="_blank" className="flex items-center gap-1.5 text-sm font-bold hover:underline">
                        <Phone size={14} /> {quote.whatsapp}
                      </a>
                    </div>
                  </div>

                  {/* Colonne 2 : Détails Logistiques */}
                  <div className="flex-[1.5] grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1"><ArrowRightLeft size={10}/> Trajet</p>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{quote.type}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1"><Package size={10}/> Produit</p>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{quote.product}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1"><Clock size={10}/> Poids</p>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{quote.weight} kg</p>
                    </div>
                  </div>

                  {/* Colonne 3 : Actions */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateStatus(quote.id, quote.status === 'traité' ? 'en_attente' : 'traité')}
                      className={`p-4 rounded-2xl transition-all ${
                        quote.status === 'traité' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:scale-105'
                      }`}
                      title="Marquer comme traité"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button 
                      onClick={() => deleteQuote(quote.id)}
                      className="p-4 bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                </div>

                {quote.message && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2 italic">Note client :</p>
                    <p className="text-sm text-slate-600 font-medium bg-slate-50 p-4 rounded-xl italic">"{quote.message}"</p>
                  </div>
                )}
              </motion.div>
            ))}

            {filteredQuotes.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300 text-slate-400">
                <p className="italic font-bold">Aucune demande de devis pour le moment.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}