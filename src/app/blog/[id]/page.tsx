"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, Share2 } from "lucide-react";
import Link from "next/link";

export default function BlogPostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const docRef = doc(db, "posts", id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setPost(snap.data());
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center italic text-slate-400">Chargement de l'histoire...</div>;
  if (!post) return <div className="h-screen flex items-center justify-center">Article introuvable.</div>;

  return (
    <main className="bg-white min-h-screen pb-20">
      {/* HERO ARTICLE */}
      <header className="relative h-[60vh] w-full">
        <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
        <Link href="/blog" className="absolute top-10 left-10 p-4 bg-white rounded-full shadow-2xl hover:scale-110 transition-transform">
          <ArrowLeft size={20} />
        </Link>
      </header>

      <article className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-slate-50">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase rounded-full">
              {post.category}
            </span>
            <span className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
              <Clock size={12} /> {post.date || "Janvier 2026"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-10 text-slate-900">
            {post.title}
          </h1>

          <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium italic leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </article>
    </main>
  );
}