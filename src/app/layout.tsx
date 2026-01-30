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
import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const inter = Inter({ subsets: ["latin"] });

function VisitorTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const trackVisit = async () => {
      if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return;
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
  const isAdminPage = pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  return (
    <html lang="fr" className="scroll-smooth">
      {/* On retire h-full ici pour laisser le contenu respirer */}
      <body className={`${inter.className} antialiased bg-white selection:bg-orange-500 selection:text-white min-h-screen flex flex-col`}>
        <ServiceProvider>
          <VisitorTracker />
          {!isAdminPage && <AnimatedBackground />}
          
          {/* Conteneur principal avec gestion du overflow intelligente */}
          <div className="relative flex flex-col flex-1 w-full overflow-x-hidden">
            {!isAdminPage && <Navbar />}
            
            <main className={`flex-1 relative z-10 w-full ${isAdminPage ? 'bg-slate-50' : ''}`}>
              <PageTransition>
                {children}
              </PageTransition>
            </main>

            {!isAdminPage && (
              <>
                <Partners />
                <Testimonials />
                <Footer />
              </>
            )}
          </div>

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