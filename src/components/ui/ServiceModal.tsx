"use client";
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2 } from "lucide-react";
import { useServiceModal } from "@/context/ServiceContext";
// Importations Firebase
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function ServiceModal() {
  const { isOpen, closeModal, serviceType } = useServiceModal();
  const [isSent, setIsSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const leadData = {
      clientName: formData.get("name"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      service: serviceType, // Récupère "ASSISTANCE-CREATION" ou "ASSISTANCE-GESTION"
      status: "nouveau",
      createdAt: serverTimestamp(),
    };

    try {
      // Envoi vers la collection "leads"
      await addDoc(collection(db, "leads"), leadData);
      
      // Feedback visuel et sonore
      setIsSent(true);
      if (audioRef.current) audioRef.current.play().catch(() => {});
      
      // Reset après 3 secondes
      setTimeout(() => {
        setIsSent(false);
        closeModal();
      }, 3500);
    } catch (error) {
      console.error("Erreur Firebase:", error);
      alert("Erreur lors de l'envoi. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <button onClick={closeModal} className="absolute top-8 right-8 text-slate-400 hover:text-orange-500 transition-colors">
                <X size={24} />
              </button>

              {!isSent ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Diagnostic Gratuit</span>
                    <h2 className="text-3xl font-black italic uppercase text-slate-900 leading-tight">
                      Projet <span className="text-orange-500">{serviceType?.replace("ASSISTANCE-", "")}</span>
                    </h2>
                  </div>

                  <div className="space-y-4 pt-4">
                    <input name="name" required className="modal-input" placeholder="Nom complet" />
                    <input name="phone" required className="modal-input" placeholder="Numéro WhatsApp (ex: +225...)" />
                    <textarea name="message" required className="modal-input h-32 resize-none" placeholder="Décrivez votre besoin en quelques mots..." />
                  </div>

                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-[0.2em] hover:bg-orange-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? "Envoi en cours..." : <><Send size={18} /> Envoyer la demande</>}
                  </button>
                </form>
              ) : (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="py-12 text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase text-slate-900">Demande Enregistrée</h3>
                  <p className="text-slate-500 italic mt-2 font-medium">Un expert BOLOU-HK vous rappellera.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" />
    </AnimatePresence>
  );
}