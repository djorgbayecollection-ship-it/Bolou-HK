"use client";
import { useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  Loader2, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Layout, 
  X, 
  CheckCircle2,
  UploadCloud
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddAdForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [type, setType] = useState("horizontal"); 
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CLOUDINARY_UPLOAD_PRESET = "bolouhk"; 
  const CLOUDINARY_CLOUD_NAME = "dkjqh8snc";

  // Gestion de la prévisualisation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST", 
        body: formData
      });
      const imageData = await res.json();

      await addDoc(collection(db, "ads"), {
        imageUrl: imageData.secure_url,
        type,
        link: link || "#",
        active: true,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Reset form
      setFile(null);
      setPreview(null);
      setLink("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (err) { 
      console.error(err);
      alert("Erreur lors de la publication");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <Layout size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase italic leading-none">
            Campagne <span className="text-blue-600">Publicitaire</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gestion des espaces pubs & popups</p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        
        {/* SÉLECTEUR DE TYPE */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Format d'affichage</label>
          <div className="grid grid-cols-3 gap-3">
            {['horizontal', 'vertical', 'popup'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${
                  type === t 
                  ? "border-blue-600 bg-blue-50 text-blue-600" 
                  : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* LIEN DE REDIRECTION */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Lien de redirection</label>
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="url" 
              placeholder="https://votre-offre.com" 
              value={link} 
              onChange={(e)=>setLink(e.target.value)} 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none ring-2 ring-transparent focus:ring-blue-500/20 focus:bg-white transition-all font-medium text-sm"
            />
          </div>
        </div>

        {/* ZONE D'UPLOAD D'IMAGE */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Visuel (Image)</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group cursor-pointer relative border-2 border-dashed border-slate-200 rounded-[2rem] p-4 min-h-[160px] flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/30 transition-all overflow-hidden"
          >
            {preview ? (
              <div className="relative w-full h-full">
                <img src={preview} alt="Preview" className="w-full h-40 object-contain rounded-xl" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-slate-400 group-hover:text-blue-500" size={24} />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Cliquer pour choisir un fichier</p>
                <p className="text-[9px] text-slate-400 mt-1 uppercase">PNG, JPG ou GIF (Max 5MB)</p>
              </div>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
              required 
            />
          </div>
        </div>

        {/* BOUTON DE SOUMISSION */}
        <button 
          type="submit" 
          disabled={loading || !file} 
          className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${
            success 
            ? "bg-emerald-500 text-white shadow-emerald-500/20" 
            : "bg-slate-900 text-white shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/20"
          } disabled:opacity-50 disabled:grayscale`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : success ? (
            <>Lancé avec succès <CheckCircle2 size={20} /></>
          ) : (
            <>Propulser la publicité</>
          )}
        </button>
      </form>
      
      {/* PETIT CONSEIL */}
      <p className="mt-6 text-[9px] text-slate-400 text-center font-bold uppercase tracking-[0.1em]">
        Conseil : Utilisez le format <span className="text-blue-500">Popup</span> pour les offres limitées.
      </p>
    </div>
  );
}