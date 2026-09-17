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
  title: "AÏLYS | Maison de Confection Contemporaine Tunisienne",
  description:
    "AÏLYS incarne l'élégance contemporaine tunisienne. Silhouettes sport-chic, matières nobles et finitions raffinées façonnées par la lumière méditerranéenne.",
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
    icon: "/brand/ailys-emblem-gold-transparent.png",
  },
};

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
        <CartProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </CartProvider>
      </body>
    </html>
  );
}
