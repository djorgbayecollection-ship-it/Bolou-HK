// src/components/VisitorTracker.tsx
"use client";
import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      // 1. VERIFICATION DU CONSENTEMENT (RGPD)
      const consent = localStorage.getItem("cookie_consent");
      
      // Si l'utilisateur n'a pas encore accepté, on stoppe tout
      if (consent !== "accepted") return;

      // 2. VERIFICATION SESSION (pour éviter les doublons)
      const hasVisited = sessionStorage.getItem("tracked");
      
      if (!hasVisited) {
        try {
          await addDoc(collection(db, "visits"), {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            timestamp: serverTimestamp(),
            path: window.location.pathname // Changé de 'page' à 'path' pour matcher ta StatsPage
          });
          sessionStorage.setItem("tracked", "true");
        } catch (e) {
          console.error("Tracking error", e);
        }
      }
    };
    
    trackVisit();
  }, []);

  return null;
}