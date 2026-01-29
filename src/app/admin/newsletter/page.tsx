"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, Save, Image as ImageIcon, Power, CheckCircle2, UploadCloud } from "lucide-react";

export default function AdminNewsletter() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [config, setConfig] = useState({
    active: false,
    title: "",
    description: "",
    imageUrl: ""
  });

  // 1. Charger les données existantes au démarrage
  useEffect(() => {
    const fetchConfig = async () => {
      const docSnap = await getDoc(doc(db, "settings", "newsletter"));
      if (docSnap.exists()) setConfig(docSnap.data() as any);
      setLoading(false);
    };
    fetchConfig();
  }, []);

  // 2. Fonction pour uploader l'image et sauvegarder tout
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = config.imageUrl;

      // Si une nouvelle image est sélectionnée, on l'uploade d'abord
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "bolouhk"); // Ton preset Cloudinary
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/dkjqh8snc/image/upload`, {
          method: "POST", body: formData
        });
        const data = await res.json();
        finalImageUrl = data.secure_url;
      }

      // On enregistre tout dans Firebase
      await setDoc(doc(db, "settings", "newsletter"), {
        ...config,
        imageUrl: finalImageUrl,
        updatedAt: serverTimestamp()
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black italic">Chargement du Dashboard...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black uppercase italic italic">Config <span className="text-orange-500">Newsletter</span></h1>
        <button 
          onClick={() => setConfig({...config, active: !config.active})}
          className={`px-6 py-3 rounded-2xl font-black uppercase italic text-[10px] transition-all ${
            config.active ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
          }`}
        >
          {config.active ? "Activée" : "Désactivée"}
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Titre du Popup</label>
            <input 
              type="text" 
              value={config.title} 
              onChange={(e) => setConfig({...config, title: e.target.value})}
              className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-orange-500/20"
              placeholder="Ex: Bienvenue chez BHK"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Description</label>
            <textarea 
              rows={4}
              value={config.description} 
              onChange={(e) => setConfig({...config, description: e.target.value})}
              className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-orange-500/20 resize-none"
              placeholder="Votre message ici..."
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase italic flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-xl"
          >
            {saving ? <Loader2 className="animate-spin" /> : success ? <CheckCircle2 /> : <Save />}
            {success ? "Enregistré !" : "Sauvegarder tout"}
          </button>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Visuel de la Newsletter</label>
          <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden aspect-square flex flex-col items-center justify-center bg-white hover:border-orange-500 transition-all">
            {file || config.imageUrl ? (
              <img 
                src={file ? URL.createObjectURL(file) : config.imageUrl} 
                className="w-full h-full object-cover" 
                alt="Preview"
              />
            ) : (
              <div className="text-center p-6">
                <UploadCloud className="mx-auto text-slate-300 mb-2" size={40} />
                <p className="text-[10px] font-black text-slate-400 uppercase">Choisir une image</p>
              </div>
            )}
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </form>
    </div>
  );
}