import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Si 'turbopack' est rejeté dans experimental, 
  // Next.js utilise souvent 'serverComponentsExternalPackages' ou gère la racine automatiquement 
  // via le dossier d'exécution. 
  
  // Pour forcer la racine et supprimer l'avertissement proprement en TypeScript :
  experimental: {
    // @ts-ignore : On force le passage si la version de Next supporte la propriété mais pas encore le type
    turbopack: {
      root: '.',
    },
  },
};

export default nextConfig;