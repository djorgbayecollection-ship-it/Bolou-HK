"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function AddPartnerForm() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const CLOUDINARY_UPLOAD_PRESET = "bolouhk"; 
  const CLOUDINARY_CLOUD_NAME = "dkjqh8snc";

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !file) return alert("Remplis tous les champs !");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST", body: formData
      });
      const imageData = await res.json();
      
      // Optimisation auto via URL Cloudinary (hauteur 120px)
      const optimizedUrl = imageData.secure_url.replace("/upload/", "/upload/f_auto,q_auto,h_120,c_limit/");

      await addDoc(collection(db, "partners"), {
        name: name.trim(),
        logoUrl: optimizedUrl,
        createdAt: serverTimestamp(),
      });

      setStatus("success");
      setName(""); setFile(null);
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) { setStatus("error"); } finally { setLoading(false); }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
      <h2 className="text-xl font-black uppercase italic mb-6">Ajouter <span className="text-orange-500">Partenaire</span></h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nom de l'entreprise" className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold" required />
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="w-full text-xs" accept="image/*" required />
        <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase italic hover:bg-orange-500 transition-all">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : status === "success" ? "Ajouté !" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}