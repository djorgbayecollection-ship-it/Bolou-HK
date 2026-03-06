"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";

// On garde la Navbar et les structures de base en import classique (priorité haute)
import Navbar from "@/components/layout/Navbar";
import { ServiceProvider } from "@/context/ServiceContext"; 
import PageTransition from "@/components/layout/PageTransition";

// ON CHARGE LES COMPOSANTS LOURDS DE MANIÈRE DYNAMIQUE
const AnimatedBackground = dynamic(() => import("@/components/ui/AnimatedBackground"), { ssr: false });
const WhatsAppBubble = dynamic(() => import("@/components/ui/WhatsAppBubble"), { ssr: false });
const NewsletterPopup = dynamic(() => import("@/components/ui/NewsletterPopup"), { ssr: false });
const CookieBanner = dynamic(() => import("@/components/ui/CookieBanner"), { ssr: false });
const ServiceModal = dynamic(() => import("@/components/ui/ServiceModal").then(mod => mod.ServiceModal), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

const inter = Inter({ subsets: ["latin"], display: 'swap' });

// Tracker optimisé
function VisitorTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const timer = setTimeout(async () => {
      const consent = localStorage.getItem("cookie_consent");
      if (consent !== "accepted") return;
      if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return;
      
      const hasVisited = sessionStorage.getItem("bolou_tracked");
      if (!hasVisited) {
        try {
          const { db } = await import("@/lib/firebase");
          const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
          await addDoc(collection(db, "visits"), {
            path: pathname,
            timestamp: serverTimestamp(),
            platform: navigator.platform,
            userAgent: navigator.userAgent
          });
          sessionStorage.setItem("bolou_tracked", "true");
        } catch (e) { console.error(e); }
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin") || pathname?.startsWith("/login");
  
  // --- AJOUT : DÉTECTION DE LA PAGE ASSURANCES ---
  // Remplace "/assurances" par l'URL exacte de ta page si nécessaire
  const isAssurancePage = pathname === "/assurances";

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-white min-h-screen flex flex-col`}>
        <ServiceProvider>
          <VisitorTracker />
          
          {!isAdminPage && <AnimatedBackground />}
          
          <div className="relative flex flex-col flex-1 w-full overflow-x-hidden">
            {!isAdminPage && <Navbar />}
            
            <main className={`flex-1 relative z-10 w-full ${isAdminPage ? 'bg-slate-50' : ''}`}>
              <PageTransition>
                {children}
              </PageTransition>
            </main>

            {!isAdminPage && <Footer />}
          </div>

          {isLoaded && !isAdminPage && (
            <>
              <Suspense fallback={null}>
                <NewsletterPopup />
                <ServiceModal key="main-service-modal" />
                
                {/* MODIFICATION ICI : On n'affiche WhatsApp que si ce n'est PAS la page assurance */}
                {!isAssurancePage && <WhatsAppBubble />}
                
                <CookieBanner />
              </Suspense>
            </>
          )}
        </ServiceProvider>
      </body>
    </html>
  );
}