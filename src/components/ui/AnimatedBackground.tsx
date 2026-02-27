"use client";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState, memo } from "react";
import { Plane, Shield, Rocket } from "lucide-react";

// Utilisation de memo pour éviter que le composant ne se re-rende 
// inutilement lors des changements de page dans le Layout
const AnimatedBackground = memo(() => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setIsMounted(true);
    // Détection mobile pour alléger les calculs
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    if (window.innerWidth >= 768) {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  // Ressorts plus légers
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const xTranslate = useTransform(springX, [0, 2000], [-30, 30]);
  const yTranslateMouse = useTransform(springY, [0, 1200], [-30, 30]);
  
  // Désactivation du scroll transform sur mobile pour fluidifier la navigation
  const yBlobScroll = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "0%" : "15%"]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden h-screen w-screen pointer-events-none bg-white">
      
      {/* Premier Blob */}
      <motion.div
        style={{ 
          y: yBlobScroll,
          x: isMobile ? 0 : xTranslate,
          translateY: isMobile ? 0 : yTranslateMouse
        }}
        className="absolute -top-[5%] -left-[5%] w-[60vw] h-[60vw] opacity-[0.06] blur-[60px] text-blue-600"
      >
        <svg viewBox="0 0 200 200" className="fill-current">
          <path d="M40,-60C52,-50,62,-38,68,-24C74,-10,76,5,72,19C68,33,58,45,46,55C34,65,20,73,5,75C-10,77,-25,73,-38,65C-51,57,-62,45,-68,31C-74,17,-75,1,-71,-14C-67,-29,-58,-43,-46,-53C-34,-63,-17,-69,-2,-67Z" transform="translate(100 100)" />
        </svg>
      </motion.div>

      {/* Deuxième Blob */}
      <motion.div
        style={{ 
          y: isMobile ? 0 : yBlobScroll,
          x: isMobile ? 0 : xTranslate,
          rotate: 180
        }}
        className="absolute -bottom-[10%] -right-[5%] w-[50vw] h-[50vw] opacity-[0.04] blur-[80px] text-orange-500"
      >
        <svg viewBox="0 0 200 200" className="fill-current">
          <path d="M44.3,-63.4C56.9,-55.4,66.3,-41.8,71.2,-26.8C76.1,-11.8,76.5,4.6,71.8,19.3C67.1,33.9,57.3,46.8,44.7,55.4C32.1,64,16.1,68.3,0.5,67.6C-15.1,66.9,-30.2,61.1,-42.9,52.4C-55.6,43.7,-65.9,32,-70.6,18.3C-75.3,4.6,-74.4,-11.2,-68.2,-24.5C-62,-37.8,-50.5,-48.6,-37.7,-56.6C-24.9,-64.6,-12.4,-69.8,1.7,-72.1C15.8,-74.4,31.7,-71.4,44.3,-63.4Z" transform="translate(100 100)" />
        </svg>
      </motion.div>

      {/* Icônes flottantes - Désactivées sur mobile pour soulager le CPU */}
      {!isMobile && [Plane, Shield, Rocket].map((Icon, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: `${20 + i * 25}%`, top: `${25 + i * 20}%`, opacity: 0.15 }}
          className="absolute p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-400"
        >
          <Icon size={18} />
        </motion.div>
      ))}
      
      {/* Texture de grain - Optimisée */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  ); 
});

AnimatedBackground.displayName = "AnimatedBackground";
export default AnimatedBackground;