"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import ImageUploader from "@/components/admin/ImageUploader";
import { Trash2, ExternalLink, Loader2, ImageIcon } from "lucide-react";

export default function AdminPubs() {
  const [pubs, setPubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Charger les publicités depuis Firestore
  const fetchPubs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "publicities"), orderBy("createdAt", "desc"));
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

  // 2. Ajouter une publicité après l'upload Cloudinary
  const handleUploadSuccess = async (url: string) => {
    try {
      await addDoc(collection(db, "publicities"), {
        imageUrl: url,
        createdAt: serverTimestamp(),
      });
      fetchPubs(); // Rafraîchir la liste
    } catch (error) {
      alert("Erreur lors de l'enregistrement en base de données.");
    }
  };

  // 3. Supprimer une publicité
  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette publicité ?")) {
      await deleteDoc(doc(db, "publicities", id));
      setPubs(pubs.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-brand-blue">
          Gestion des <span className="text-brand-orange">Publicités</span>
        </h1>
        <p className="text-slate-500 font-medium">Uploadez et gérez vos bannières publicitaires.</p>
      </header>

      {/* SECTION UPLOAD */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ImageIcon className="text-brand-orange" /> Ajouter une nouvelle image
        </h2>
        <ImageUploader onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* SECTION GALERIE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-10 text-brand-blue animate-spin">
            <Loader2 size={40} />
          </div>
        ) : pubs.length > 0 ? (
          pubs.map((pub) => (
            <div key={pub.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all">
              <img src={pub.imageUrl} alt="Pub" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
              
              <div className="p-4 flex justify-between items-center bg-white">
                <span className="text-xs text-slate-400 font-bold">
                  {pub.createdAt?.toDate().toLocaleDateString('fr-FR')}
                </span>
                <div className="flex gap-2">
                  <a href={pub.imageUrl} target="_blank" className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-brand-blue hover:text-white transition-colors">
                    <ExternalLink size={18} />
                  </a>
                  <button onClick={() => handleDelete(pub.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
            <p className="text-slate-400 font-bold italic">Aucune publicité en ligne pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}