"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, addDoc, getDocs, deleteDoc, 
  doc, serverTimestamp, query, orderBy 
} from "firebase/firestore";
import { 
  Plus, Trash2, ImageIcon, Loader2, 
  CheckCircle2, X, CloudUpload, AlertCircle 
} from "lucide-react";

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // États du formulaire
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Développement");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Récupération des projets existants
  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { 
      console.error("Erreur de chargement:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchPortfolio(); }, []);

  // Gestion de la sélection d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Upload vers Cloudinary + Enregistrement Firestore
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !title) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", image);
    // Assurez-vous que ce preset est configuré en "Unsigned" dans Cloudinary
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      // 1. Envoi à Cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      
      if (!res.ok) throw new Error("Échec de l'upload Cloudinary");
      
      const data = await res.json();

      // 2. Enregistrement dans Firestore
      await addDoc(collection(db, "portfolio"), {
        title,
        category,
        imageUrl: data.secure_url,
        publicId: data.public_id,
        createdAt: serverTimestamp()
      });

      // Reset du formulaire
      setTitle("");
      setImage(null);
      setPreview(null);
      fetchPortfolio();
      alert("Projet publié avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la publication.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible.")) {
      try {
        await deleteDoc(doc(db, "portfolio", id));
        setProjects(projects.filter(p => p.id !== id));
      } catch (e) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">
            Gestion <span className="text-orange-500">Portfolio</span>
          </h1>
          <p className="text-slate-500 font-medium italic">Ajoutez vos dernières créations digitales.</p>
        </div>
      </header>

      {/* SECTION FORMULAIRE D'AJOUT */}
      <div className="bg-white border border-slate-100 shadow-2xl rounded-[3rem] p-8 md:p-12">
        <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-10">
          
          {/* Zone de Texte */}
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Titre du Projet</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Application Mobile E-commerce"
                className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-orange-500 font-bold transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Catégorie</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 cursor-pointer"
              >
                <option>Développement</option>
                <option>Marketing Digital</option>
                <option>Photographie</option>
                <option>Design UI/UX</option>
              </select>
            </div>

            <button 
              disabled={uploading || !image || !title}
              type="submit"
              className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-[0.2em] hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              {uploading ? (
                <> <Loader2 className="animate-spin" /> Envoi en cours... </>
              ) : (
                <> <Plus size={20} /> Publier le projet </>
              )}
            </button>
          </div>

          {/* Zone d'Image */}
          <div className="relative">
            <label className="flex flex-col items-center justify-center w-full h-full min-h-[250px] bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] cursor-pointer hover:border-orange-500 transition-all overflow-hidden group">
              {preview ? (
                <div className="relative w-full h-full">
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-black uppercase text-xs italic">Changer l'image</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <CloudUpload className="text-slate-300 mx-auto mb-4" size={50} />
                  <p className="text-sm font-black uppercase text-slate-400 tracking-tighter">Glissez ou cliquez pour uploader</p>
                  <p className="text-[9px] text-slate-300 mt-2">JPG, PNG ou WEBP (Max 10Mo)</p>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
        </form>
      </div>

      {/* GALERIE DE GESTION */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <CheckCircle2 className="text-emerald-500" />
          <h2 className="text-xl font-black uppercase italic tracking-tight">Projets en ligne ({projects.length})</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 text-slate-300">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold italic uppercase text-xs tracking-widest">Synchronisation avec Cloudinary...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-slate-50 rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-200">
            <AlertCircle className="mx-auto text-slate-300 mb-4" size={40} />
            <p className="text-slate-400 font-bold italic">Votre portfolio est vide pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {projects.map((p) => (
              <div key={p.id} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={p.imageUrl.replace('/upload/', '/upload/c_thumb,w_400,h_500,g_auto/')} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[7px] font-black text-orange-500 uppercase tracking-widest mb-1">{p.category}</p>
                  <p className="font-bold text-slate-900 text-[10px] uppercase truncate italic">{p.title}</p>
                </div>
                
                {/* Overlay de suppression */}
                <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="p-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 hover:scale-110 transition-all shadow-xl"
                    title="Supprimer le projet"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}