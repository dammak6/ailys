import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "AÏLYS | Prêt-à-Porter Contemporain Tunisien",
  description:
    "AÏLYS incarne une élégance contemporaine sobre et naturelle. Silhouettes sport-chic, matières confortables et finitions soignées conçues pour la femme moderne et sa famille.",
  keywords: [
    "AÏLYS",
    "mode tunisienne",
    "sport-chic",
    "tailleur femme tunisie",
    "prêt-à-porter tunisie",
    "luxe discret",
    "vêtements contemporains",
  ],
  authors: [{ name: "AÏLYS" }],
  icons: {
    icon: "/logo.svg",
  },
};

import { Suspense } from "react";
import { MetaPixel } from "@/components/tracking/MetaPixel";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${montserrat.variable} ${sourceSerif.variable}`}
    >
      <body className="bg-ailys-bone text-ailys-black antialiased selection:bg-ailys-gold selection:text-ailys-black flex flex-col min-h-screen">
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <CartProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </CartProvider>
      </body>
    </html>
  );
}
