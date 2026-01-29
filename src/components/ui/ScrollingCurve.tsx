"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollingCurve() {
  const { scrollYProgress } = useScroll();
  
  // On transforme le scroll en déformation de la courbe (path SVG)
  // On fait varier la hauteur de la courbe de 20 à 80
  const pathData = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z", // Forme 1
      "M0,50 Q25,80 50,50 T100,50 L100,100 L0,100 Z", // Forme 2 (plus creusée)
      "M0,50 Q25,10 50,50 T100,50 L100,100 L0,100 Z"  // Forme 3 (plus haute)
    ]
  );

  return (
    <div className="absolute left-0 w-full h-32 -mt-16 z-20 overflow-hidden">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <motion.path
          d={pathData}
          fill="#f8fafc" // Couleur de fond du site (slate-50)
          transition={{ ease: "linear" }}
        />
      </svg>
    </div>
  );
}