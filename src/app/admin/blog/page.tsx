"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CldUploadWidget } from "next-cloudinary"; // Import Cloudinary
import { Send, Image as ImageIcon, Loader2, CheckCircle, UploadCloud } from "lucide-react";

export default function AdminBlog() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "voyage",
    image: "", // Sera rempli par l'URL Cloudinary
    excerpt: "",
    content: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert("Veuillez uploader une image avant de publier.");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        ...formData,
        createdAt: serverTimestamp(),
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      });
      setSuccess(true);
      setFormData({ title: "", category: "voyage", image: "", excerpt: "", content: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Erreur lors de la publication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6">
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
          Rédaction <span className="text-orange-500">Média</span>
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* TEXTE ET CONTENU */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
            <input 
              required
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold text-xl italic"
              placeholder="Titre de l'article..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <textarea 
              required
              rows={12}
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-medium italic"
              placeholder="Écrivez ici..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>
        </div>

        {/* CLOUDINARY & PARAMS */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-6 shadow-xl">
            
            {/* BOUTON UPLOAD CLOUDINARY */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500">Image de couverture</label>
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result: any) => {
                  setFormData({ ...formData, image: result.info.secure_url });
                }}
              >
                {({ open }) => (
                  <button 
                    type="button"
                    onClick={() => open()}
                    className="w-full py-8 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-orange-500 hover:bg-white/5 transition-all"
                  >
                    {formData.image ? (
                      <img src={formData.image} className="h-20 w-full object-cover rounded-lg px-4" alt="Preview" />
                    ) : (
                      <>
                        <UploadCloud className="text-orange-500" />
                        <span className="text-[10px] font-black uppercase">Choisir une photo</span>
                      </>
                    )}
                  </button>
                )}
              </CldUploadWidget>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500">Service cible</label>
              <select 
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl font-bold text-xs uppercase text-white"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="voyage" className="bg-slate-900">Voyage & Tourisme</option>
                <option value="assurance" className="bg-slate-900">Assurance</option>
                <option value="traiteur" className="bg-slate-900">Traiteur</option>
                <option value="logistique" className="bg-slate-900">Import-Export</option>
              </select>
            </div>

            <button 
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 ${
                success ? "bg-emerald-500" : "bg-orange-500 hover:bg-white hover:text-slate-900"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : success ? <CheckCircle /> : <Send size={18} />}
              {success ? "EN LIGNE !" : "PUBLIER L'ARTICLE"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}