"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/Footer"; 
import PageTransition from "@/components/layout/PageTransition";
import { ServiceProvider } from "@/context/ServiceContext"; 
import { ServiceModal } from "@/components/ui/ServiceModal"; 
import WhatsAppBubble from "@/components/ui/WhatsAppBubble";
import NewsletterPopup from "@/components/ui/NewsletterPopup";

import Partners from "@/components/layout/Partners";
import Testimonials from "@/components/layout/Testimonials";

// --- IMPORT DU TRACKER ---
import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const inter = Inter({ subsets: ["latin"] });

// Petit composant interne pour le tracking
function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      // On ne tracke pas les visites sur les pages admin
      if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return;

      // On utilise le sessionStorage pour ne compter qu'une visite par session (évite le spam au refresh)
      const hasVisited = sessionStorage.getItem("bolou_tracked");
      
      if (!hasVisited) {
        try {
          await addDoc(collection(db, "visits"), {
            path: pathname,
            timestamp: serverTimestamp(),
            platform: navigator.platform,
            language: navigator.language,
            userAgent: navigator.userAgent,
            referrer: document.referrer || "Direct"
          });
          sessionStorage.setItem("bolou_tracked", "true");
        } catch (error) {
          console.error("Tracking error:", error);
        }
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Vérifie si l'utilisateur est sur une page d'administration ou de login
  const isAdminPage = pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  return (
    <html lang="fr" className="h-full scroll-smooth">
      <body className={`${inter.className} antialiased bg-white h-full selection:bg-orange-500 selection:text-white`}>
        <ServiceProvider>
          {/* Activation du tracker silencieux */}
          <VisitorTracker />

          {/* L'arrière-plan animé ne s'affiche que sur le site public */}
          {!isAdminPage && <AnimatedBackground />}
          
          <div className="relative flex flex-col min-h-screen overflow-x-hidden">
            
            {/* Navbar Masquée en Admin */}
            {!isAdminPage && <Navbar />}
            
            <main className={`flex-1 relative z-10 w-full ${isAdminPage ? 'bg-slate-50' : ''}`}>
              <PageTransition>
                {children}
              </PageTransition>
            </main>

            {/* Sections Marketing Dynamiques (Masquées en Admin) */}
            {!isAdminPage && (
              <>
                <Partners />
                <Testimonials />
                <Footer />
              </>
            )}
          </div>

          {/* --- ÉLÉMENTS FLOTTANTS & MODALS --- */}
          {!isAdminPage && (
            <>
              <NewsletterPopup />
              <ServiceModal />
              <WhatsAppBubble />
            </>
          )}
          
        </ServiceProvider>
      </body>
    </html>
  );
}