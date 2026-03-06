// app/assurances/page.tsx
import type { Metadata } from "next"; // Importation du type
import AssuranceClient from "./AssuranceClient";

// Ajout du type : Metadata
export const metadata: Metadata = {
  title: "Assurance Auto & Vie en Côte d'Ivoire | BOLOU-HK",
  description: "Obtenez votre assurance auto, vie et habitation en Côte d'Ivoire en 30 minutes. Attestation livrée en ligne. Devis gratuit – BOLOU-HK GROUP.",
  keywords: [
    "assurance auto Côte d'Ivoire",
    "assurance vie Abidjan",
    "attestation assurance en ligne Côte d'Ivoire",
    "courtier assurance Abidjan",
    "assurance habitation Abidjan",
  ],
  // Utilisation de 'other' pour les balises geo (c'est correct)
  other: {
    'geo.region': 'CI',
    'geo.placename': "Abidjan, Côte d'Ivoire",
    'geo.position': '5.3486;-4.0076',
    'ICBM': '5.3486, -4.0076',
  },
  openGraph: {
    title: "Assurance en Côte d'Ivoire | BOLOU-HK GROUP",
    description: "Devis gratuit en 2 minutes. Attestation en ligne.",
    url: 'https://bolouhk.com/assurances',
    siteName: 'BOLOU-HK GROUP',
    images: [{ 
      url: 'https://res.cloudinary.com/dkjqh8snc/image/upload/v1772543472/logo_bzqyz4.png', // J'ai corrigé le .pngg en .png
      width: 1200, 
      height: 630 
    }],
    locale: 'fr_CI',
    type: 'website',
  },
};

export default function Page() {
  return <AssuranceClient />;
}