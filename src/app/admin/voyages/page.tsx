"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Upload, Send, Loader2, CheckCircle, Image as ImageIcon, Trash2, MapPin, Globe } from "lucide-react";

export default function AdminVoyages() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [destinations, setDestinations] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    city: "",
    country: "",
    price: "",
    description: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 1. CHARGEMENT DES DESTINATIONS EXISTANTES
  useEffect(() => {
    const q = query(collection(db, "voyages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDestinations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 2. UPLOAD VERS CLOUDINARY
  const uploadImage = async () => {
    if (!imageFile) return null;
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "bolouhk"); 
    data.append("cloud_name", "dkjqh8snc"); 

    const res = await fetch(`https://api.cloudinary.com/v1_1/dkjqh8snc/image/upload`, {
      method: "POST",
      body: data
    });
    const file = await res.json();
    return file.secure_url;
  };

  // 3. SOUMISSION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Traitement...");

    try {
      const imageUrl = await uploadImage();
      if (!imageUrl) throw new Error("Image manquante");

      await addDoc(collection(db, "voyages"), {
        ...formData,
        imageUrl,
        createdAt: new Date()
      });

      setStatus("Destination ajoutée !");
      setFormData({ city: "", country: "", price: "", description: "" });
      setImageFile(null);
    } catch (error) {
      setStatus("Erreur lors de l'ajout.");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  // 4. SUPPRESSION
  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette destination ?")) {
      await deleteDoc(doc(db, "voyages", id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* COLONNE GAUCHE : FORMULAIRE */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h1 className="text-2xl font-black text-slate-800 mb-8 uppercase italic">Ajouter un Voyage</h1>
              <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                <div className="space-y-5">
                  <input required type="text" placeholder="Ville (ex: Paris)" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 outline-none focus:border-brand-orange" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}/>
                  <input required type="text" placeholder="Pays" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 outline-none focus:border-brand-orange" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})}/>
                  <input required type="text" placeholder="Prix (ex: 450.000 FCFA)" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 outline-none focus:border-brand-orange" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}/>
                  
                  <textarea required rows={3} placeholder="Description..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 outline-none focus:border-brand-orange" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}/>
                  
                  <div className="relative">
                    <input required type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="hidden" id="img-upload"/>
                    <label htmlFor="img-upload" className="w-full bg-slate-900 text-white rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer hover:bg-brand-orange transition-all">
                      {imageFile ? <CheckCircle size={18} /> : <ImageIcon size={18} />}
                      <span className="font-bold text-xs uppercase">{imageFile ? "Image prête" : "Choisir une photo"}</span>
                    </label>
                  </div>

                  <button disabled={loading} className="w-full py-4 bg-brand-blue text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-brand-orange transition-all shadow-lg shadow-brand-blue/20">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    PUBLIER
                  </button>
                  {status && <p className="text-center text-xs font-bold text-brand-blue mt-2">{status}</p>}
                </div>
              </form>
            </div>
          </div>

          {/* COLONNE DROITE : LISTE DES VOYAGES */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase italic">Destinations en ligne ({destinations.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destinations.map((dest) => (
                <div key={dest.id} className="bg-white rounded-[2rem] overflow-hidden shadow-md border border-slate-100 group relative">
                  <div className="h-48 overflow-hidden relative">
                    <img src={dest.imageUrl} alt={dest.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <button 
                      onClick={() => handleDelete(dest.id)}
                      className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-brand-orange font-bold text-[10px] uppercase tracking-widest mb-1">
                      <MapPin size={12} /> {dest.country}
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">{dest.city}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-4 font-medium">{dest.description}</p>
                    <div className="text-brand-blue font-black text-lg">{dest.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}