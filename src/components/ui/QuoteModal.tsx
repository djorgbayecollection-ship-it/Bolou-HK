"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Package, ArrowRightLeft, Scale, CheckCircle } from "lucide-react";
// Importation de Firebase
import { db } from "@/lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// RENOMMAGE : onClose devient onCloseAction pour satisfaire les contraintes de Next.js
export default function QuoteModal({ isOpen, onCloseAction }: { isOpen: boolean; onCloseAction: () => void }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Envoi direct à Firestore dans la collection "quotes"
      await addDoc(collection(db, "quotes"), {
        clientName: formData.get("name"),
        whatsapp: formData.get("phone"),
        type: formData.get("type"),
        product: formData.get("product"),
        weight: formData.get("weight"),
        message: formData.get("message"),
        status: "en_attente", 
        createdAt: serverTimestamp(), 
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onCloseAction(); // Utilisation du nouveau nom
      }, 3000);
    } catch (error) {
      console.error("Erreur Firebase:", error);
      alert("Erreur de connexion à la base de données.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[3rem] max-w-xl w-full overflow-hidden shadow-2xl relative"
        >
          {/* Header */}
          <div className="bg-blue-600 p-8 text-white relative">
            <button onClick={onCloseAction} className="absolute top-6 right-6 hover:rotate-90 transition-transform">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter">
              {submitted ? "Demande" : "Demander un"} <span className="text-slate-900">{submitted ? "Reçue" : "Devis"}</span>
            </h3>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nom</label>
                      <input name="name" required type="text" placeholder="Nom complet" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-500 font-bold text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">WhatsApp</label>
                      <input name="phone" required type="tel" placeholder="+225 ..." className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-500 font-bold text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-1"><ArrowRightLeft size={10}/> Type d'opération</label>
                    <select name="type" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-500 font-bold text-sm">
                      <option>Importation (Chine → Abidjan)</option>
                      <option>Exportation (Abidjan → Paris)</option>
                      <option>Express International</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-1"><Package size={10}/> Produit</label>
                      <input name="product" required type="text" placeholder="Ex: Karité" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-500 font-bold text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-1"><Scale size={10}/> Poids (kg)</label>
                      <input name="weight" required type="number" placeholder="50" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-500 font-bold text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Précisions</label>
                    <textarea name="message" rows={2} placeholder="..." className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-500 font-bold text-sm resize-none" />
                  </div>

                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all disabled:opacity-50"
                  >
                    {loading ? "Envoi en cours..." : "Envoyer à l'admin"} <Send size={18} />
                  </button>
                </motion.form>
              ) : (
                <motion.div key="success" className="py-12 flex flex-col items-center text-center space-y-4">
                  <CheckCircle size={60} className="text-emerald-500" />
                  <h4 className="text-2xl font-black uppercase italic">Enregistré !</h4>
                  <p className="text-slate-500">Votre demande est maintenant visible sur le tableau de bord.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}