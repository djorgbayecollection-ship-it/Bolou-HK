"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plane, 
  ShieldCheck, 
  Utensils, 
  Ship, 
  ArrowRight, 
  Search, 
  Clock, 
  Tag
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { id: "all", label: "Tous", icon: null },
  { id: "voyage", label: "Voyage", icon: <Plane size={14} /> },
  { id: "assurance", label: "Assurance", icon: <ShieldCheck size={14} /> },
  { id: "traiteur", label: "Traiteur", icon: <Utensils size={14} /> },
  { id: "logistique", label: "Import-Export", icon: <Ship size={14} /> },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error("Erreur blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(p => p.category?.toLowerCase() === activeCategory));
    }
  }, [activeCategory, posts]);

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* --- HEADER ÉDITORIAL --- */}
      <section className="bg-slate-900 pt-32 pb-20 px-6 rounded-b-[4rem] shadow-2xl">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-6">
              L'Actualité <br /> <span className="text-orange-500">HK Group.</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium italic text-lg">
              Conseils d'experts, guides de voyage et coulisses de nos services d'exception.
            </p>
          </motion.div>

          {/* BARRE DE FILTRES */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat.id 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" 
                  : "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- GRILLE D'ARTICLES --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Clock className="text-orange-500" size={40} />
            </motion.div>
            <p className="mt-4 font-black uppercase text-slate-400 text-xs tracking-widest">Chargement des articles...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 font-black italic">Aucun article disponible pour cette catégorie.</p>
          </div>
        )}
      </section>

    </main>
  );
}

// --- COMPOSANT CARTE ARTICLE ---
function BlogCard({ post }: { post: any }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full"
    >
      {/* Image avec Overlay */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={post.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800"} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={post.title} 
        />
        <div className="absolute top-6 left-6">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase text-slate-900 flex items-center gap-2 shadow-xl">
            <Tag size={12} className="text-orange-500" /> {post.category}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase mb-4 tracking-widest">
          <span className="flex items-center gap-1"><Clock size={12} /> {post.date || "Récemment"}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span>5 min de lecture</span>
        </div>
        
        <h3 className="text-2xl font-black italic text-slate-900 uppercase tracking-tighter leading-tight mb-4 group-hover:text-orange-500 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-slate-500 text-sm font-medium italic line-clamp-3 mb-8">
          {post.excerpt || post.content?.substring(0, 120) + "..."}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-50">
          <Link 
            href={`/blog/${post.id}`} 
            className="flex items-center justify-between group/link"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover/link:text-orange-500 transition-colors">
              Lire l'article
            </span>
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white group-hover/link:bg-orange-500 transition-all group-hover/link:translate-x-2">
              <ArrowRight size={18} />
            </div>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}