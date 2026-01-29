// src/components/VisitorTracker.tsx
"use client";
import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      // On vérifie si on a déjà enregistré cette session pour ne pas spammer la DB
      const hasVisited = sessionStorage.getItem("tracked");
      if (!hasVisited) {
        try {
          await addDoc(collection(db, "visits"), {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            timestamp: serverTimestamp(),
            page: window.location.pathname
          });
          sessionStorage.setItem("tracked", "true");
        } catch (e) {
          console.error("Tracking error", e);
        }
      }
    };
    trackVisit();
  }, []);

  return null; // Ce composant est invisible
}