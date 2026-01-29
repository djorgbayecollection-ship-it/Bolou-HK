"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, getDocs, addDoc, deleteDoc, 
  doc, serverTimestamp, query, orderBy 
} from "firebase/firestore";
import ImageUploader from "@/components/admin/ImageUploader";
import { 
  Trash2, Loader2, ImageIcon, Layout, 
  Link as LinkIcon, Monitor, Smartphone, 
  PlusCircle, Zap // Ajout de Zap pour l'icône Popup
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPubs() {
  const [pubs, setPubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // MISE À JOUR ICI : Ajout du type "popup"
  const [adType, setAdType] = useState<"horizontal" | "vertical" | "popup">("horizontal");
  const [adLink, setAdLink] = useState("");

  const fetchPubs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "ads"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPubs(data);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPubs(); }, []);

  const handleUploadSuccess = async (url: string) => {
    setIsUploading(true);
    try {
      await addDoc(collection(db, "ads"), {
        imageUrl: url,
        type: adType,
        link: adLink || "#",
        active: true,
        createdAt: serverTimestamp(),
      });
      setAdLink(""); 
      fetchPubs(); 
    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cette publicité ?")) {
      try {
        await deleteDoc(doc(db, "ads", id));
        setPubs(pubs.filter(p => p.id !== id));
      } catch (error) {
        alert("Erreur suppression.");
      }
    }
  };

  return (
    <div className="space-y-10 p-4">
      <header>
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
          Espaces <span className="text-orange-500">Publicitaires</span>
        </h1>
        <p className="text-slate-500 font-medium italic">Gérez vos bannières et vos fenêtres surgissantes (Popups).</p>
      </header>

      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Layout size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tight">1. Configuration</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Format de l'affichage</label>
              <div className="grid grid-cols-3 gap-3"> {/* Changement à 3 colonnes */}
                <FormatBtn 
                  active={adType === "horizontal"} 
                  onClick={() => setAdType("horizontal")} 
                  icon={<Monitor size={18} />} 
                  label="Horizontal" 
                />
                <FormatBtn 
                  active={adType === "vertical"} 
                  onClick={() => setAdType("vertical")} 
                  icon={<Smartphone size={18} />} 
                  label="Vertical" 
                />
                <FormatBtn 
                  active={adType === "popup"} 
                  onClick={() => setAdType("popup")} 
                  icon={<Zap size={18} />} 
                  label="Popup" 
                  color="text-purple-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Lien de destination</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500">
                  <LinkIcon size={18} />
                </div>
                <input 
                  type="url" 
                  placeholder="https://wa.me/..." 
                  value={adLink}
                  onChange={(e) => setAdLink(e.target.value)}
                  className="w-full p-5 pl-14 bg-slate-50 rounded-[1.5rem] border-none font-bold text-slate-700 focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <ImageIcon size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tight">2. Visuel</h2>
          </div>
          <div className="relative">
            <ImageUploader onUploadSuccess={handleUploadSuccess} />
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-3xl z-20">
                <Loader2 className="animate-spin text-orange-500" size={32} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GALERIE AVEC BADGE POPUP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {pubs.map((pub) => (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={pub.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-50">
              <div className="relative h-56">
                <img src={pub.imageUrl} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] shadow-lg text-white ${
                    pub.type === 'popup' ? 'bg-purple-600' : pub.type === 'horizontal' ? 'bg-blue-600' : 'bg-orange-500'
                  }`}>
                    {pub.type}
                  </span>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div className="max-w-[150px]">
                   <p className="text-[11px] font-bold text-slate-600 truncate italic">{pub.link}</p>
                </div>
                <button onClick={() => handleDelete(pub.id)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Petit composant interne pour les boutons de format
function FormatBtn({ active, onClick, icon, label, color = "text-orange-600" }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
        active 
        ? `border-orange-500 bg-orange-50 ${color}` 
        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
      }`}
    >
      {icon}
      <span className="text-[9px] font-black uppercase">{label}</span>
    </button>
  );
}