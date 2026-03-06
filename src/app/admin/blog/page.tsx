"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { CldUploadWidget } from "next-cloudinary";
import { Send, Loader2, CheckCircle, UploadCloud, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminBlog() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [posts, setPosts] = useState<any[]>([]); // État pour stocker les articles
  const [formData, setFormData] = useState({
    title: "",
    category: "voyage",
    image: "",
    excerpt: "",
    content: ""
  });

  // 1. RÉCUPÉRATION DES ARTICLES EN TEMPS RÉEL
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  // 2. SUPPRESSION D'UN ARTICLE
  const handleDelete = async (postId: string) => {
    if (window.confirm("Es-tu sûr de vouloir supprimer cet article ?")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

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
    <div className="max-w-6xl mx-auto space-y-16 p-6">
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
          Rédaction <span className="text-orange-500">Média</span>
        </h1>
      </header>

      {/* FORMULAIRE DE PUBLICATION */}
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
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
              rows={8}
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-medium italic"
              placeholder="Écrivez ici..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-6 shadow-xl">
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
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl font-bold text-xs uppercase text-white outline-none focus:border-orange-500"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="voyage" className="bg-slate-900 text-white">Voyage & Tourisme</option>
                <option value="assurance" className="bg-slate-900 text-white">Assurance</option>
                <option value="traiteur" className="bg-slate-900 text-white">Traiteur</option>
                <option value="logistique" className="bg-slate-900 text-white">Import-Export</option>
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

      {/* --- SECTION GESTION DES ARTICLES --- */}
      <section className="space-y-8">
        <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 flex items-center gap-3">
          Articles <span className="text-orange-500">Publiés</span> 
          <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-400">{posts.length}</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="relative h-48 overflow-hidden">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="font-bold italic text-slate-900 line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <Link href={`/blog/${post.id}`} target="_blank" className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-orange-500 transition-colors">
                    <Eye size={20} />
                  </Link>
                  
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase"
                  >
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-medium italic">Aucun article n'a encore été publié.</p>
          </div>
        )}
      </section>
    </div>
  );
}