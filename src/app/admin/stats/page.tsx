"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Eye, Clock, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
// --- IMPORTS RECHARTS ---
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function StatsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "visits"), orderBy("timestamp", "desc"), limit(500));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVisits(data);
      processChartData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fonction pour transformer les données pour le graphique
  const processChartData = (rawVisits: any[]) => {
    const counts: { [key: string]: number } = {};
    
    rawVisits.forEach(v => {
      if (v.timestamp) {
        const date = v.timestamp.toDate().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        counts[date] = (counts[date] || 0) + 1;
      }
    });

    const formattedData = Object.keys(counts).map(date => ({
      date,
      visites: counts[date]
    })).reverse(); // Pour avoir l'ordre chronologique

    setChartData(formattedData);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <Link href="/admin" className="text-[10px] font-black uppercase text-slate-400 hover:text-orange-500 flex items-center gap-2 mb-2 transition-all">
            <ArrowLeft size={12} /> Retour Dashboard
          </Link>
          <h1 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">
            Analytique <span className="text-orange-500">Trafic</span>
          </h1>
        </div>
      </div>

      {/* GRAPHIQUE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="font-black uppercase italic text-sm text-slate-900">Flux des Visiteurs</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Évolution sur les derniers jours</p>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
                dy={10}
              />
              <YAxis 
                hide={true}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="visites" 
                stroke="#f97316" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorVisits)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* JOURNAL DES VISITES */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="font-black italic uppercase text-slate-900 flex items-center gap-3">
            <Clock size={18} className="text-orange-500" /> Journal Live
          </h2>
          <span className="px-4 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[9px] font-black uppercase">
            {visits.length} sessions totalisées
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-50/50">
                <th className="px-8 py-4">Moment</th>
                <th className="px-8 py-4">Page</th>
                <th className="px-8 py-4">Navigateur</th>
                <th className="px-8 py-4">OS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visits.slice(0, 50).map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-4 text-xs font-bold text-slate-600">
                    {v.timestamp?.toDate().toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{v.path || "/"}</span>
                  </td>
                  <td className="px-8 py-4 text-[10px] text-slate-400 italic truncate max-w-[150px]">{v.userAgent}</td>
                  <td className="px-8 py-4 text-xs font-black text-slate-900">{v.platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}