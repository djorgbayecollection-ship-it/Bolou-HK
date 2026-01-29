"use client";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollLine() {
  const { scrollYProgress } = useScroll();
  
  // On crée un effet de ressort pour que la ligne soit fluide
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed left-4 top-0 bottom-0 w-[2px] z-50 hidden lg:block">
      {/* Ligne grise de fond */}
      <div className="absolute inset-0 bg-slate-200/50" />
      
      {/* Ligne orange qui se dessine au scroll */}
      <motion.div 
        className="absolute top-0 left-0 w-full bg-brandOrange origin-top"
        style={{ scaleY }}
      />
      
      {/* Petit cercle bleu qui suit la pointe de la ligne */}
      <motion.div 
        className="absolute left-[-4px] w-3 h-3 bg-brandBlue rounded-full border-2 border-white shadow-md"
        style={{ top: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
      />
    </div>
  );
}