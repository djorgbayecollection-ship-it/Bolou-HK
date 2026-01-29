"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, onSnapshot, query, orderBy, 
  addDoc, deleteDoc, doc, serverTimestamp 
} from "firebase/firestore";
import ImageUploader from "@/components/admin/ImageUploader";
import { 
  ChefHat, Trash2, Plus, Loader2, 
  Utensils, Tag, AlignLeft, Eye 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTraiteur() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États du formulaire
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Entrée");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const q = query(collection(db, "traiteur"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUploadSuccess = async (url: string) => {
    if (!title || !description) {
      alert("Remplissez le titre et la description avant l'image !");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "traiteur"), {
        title,
        category,
        description,
        imageUrl: url,
        createdAt: serverTimestamp(),
      });
      // Reset
      setTitle("");
      setDescription("");
      setCategory("Entrée");
      alert("Plat ajouté au menu !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce plat du menu ?")) {
      await deleteDoc(doc(db, "traiteur", id));
    }
  };

  return (
    <div className="space-y-10 p-4">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
            Menu <span className="text-orange-500">Traiteur</span>
          </h1>
          <p className="text-slate-500 font-medium italic">Gérez vos plats signatures et vos incontournables.</p>
        </div>
      </header>

      {/* AJOUT DE PLAT */}
      <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center">
              <Plus size={20} />
            </div>
            <h2 className="text-xl font-black uppercase italic">Nouveau Plat</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Nom du plat</label>
              <div className="relative">
                <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Ex: Souris d'Agneau..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Catégorie</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-orange-500 appearance-none"
                  >
                    <option>Entrée</option>
                    <option>Plat Signature</option>
                    <option>Dessert</option>
                    <option>Cocktail</option>
                  </select>
                </div>
              </div>
              <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Statut</label>
                 <div className="w-full p-4 bg-green-50 text-green-600 rounded-2xl font-black text-center text-xs uppercase tracking-widest">En Ligne</div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Description courte</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 text-slate-300" size={18} />
                <textarea 
                  rows={3}
                  placeholder="Décrivez les saveurs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none font-medium focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block text-center">Photo du plat</label>
          <div className="relative group">
            <ImageUploader onUploadSuccess={handleUploadSuccess} />
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-[2rem] z-10">
                <Loader2 className="animate-spin text-orange-500" size={32} />
              </div>
            )}
          </div>
          <p className="text-[9px] text-center text-slate-400 italic">L'image validera l'ajout définitif au menu.</p>
        </div>
      </div>

      {/* LISTE DES PLATS ACTUELS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-xl font-black uppercase italic flex items-center gap-2">
            <Eye className="text-orange-500" size={20} /> Aperçu du Menu
          </h2>
          <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">{items.length} Plats</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {loading ? (
              <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
            ) : items.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id} 
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-50"
              >
                <div className="relative h-48">
                  <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-md shadow-lg">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-black italic text-slate-900 leading-tight mb-1">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2">{item.description}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}