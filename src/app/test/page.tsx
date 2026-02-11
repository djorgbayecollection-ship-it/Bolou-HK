"use client";

import React, { useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TestIndex() {
  useEffect(() => {
    const testFirestoreIndex = async () => {
      try {
        // 🔹 La requête qui nécessite l'index
        const q = query(
          collection(db, "portfolio"),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);
        console.log("Documents :", snap.docs.map(d => d.data()));

      } catch (error: any) {
        console.error("Erreur Firestore :", error);

        // 🔹 Firestore fournit un lien pour créer l’index
        if (error.code === "failed-precondition") {
          console.log("🔥 Lien pour créer l'index :", error.message);
        }
      }
    };

    testFirestoreIndex();
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <h1 className="text-white text-xl">Vérifie la console pour le lien Firestore 🔗</h1>
    </main>
  );
}
