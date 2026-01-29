"use client";
import { useState } from "react";
import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";

export default function ImageUploader({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadToCloudinary = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aperçu local immédiat
    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bolouhk"); // Remplacer ici

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dkjqh8snc/image/upload`, // Remplacer ici
        { method: "POST", body: formData }
      );
      const data = await res.json();
      
      // On envoie l'URL finale au composant parent (Firebase)
      onUploadSuccess(data.secure_url);
    } catch (error) {
      alert("Erreur lors de l'envoi vers Cloudinary");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative">
        {preview ? (
          <img src={preview} className="w-full h-full object-cover" alt="Aperçu" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-12 h-12 text-brand-orange mb-4" />
            <p className="text-sm text-slate-500 font-bold">Cliquez pour uploader une bannière</p>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <Loader2 className="animate-spin text-brand-blue" size={40} />
          </div>
        )}

        <input type="file" className="hidden" onChange={uploadToCloudinary} accept="image/*" />
      </label>
    </div>
  );
}