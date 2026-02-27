"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    /* On change "wait" par "popLayout" ou on le retire pour plus de réactivité */
    <AnimatePresence mode="popLayout"> 
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        /* Duration à 0.2s : c'est le "sweet spot" pour la sensation de vitesse */
        transition={{ duration: 0.2, ease: "linear" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}