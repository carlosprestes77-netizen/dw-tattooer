import type { Metadata } from "next";
import { Playfair_Display, Raleway } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/ui/Analytics";
import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "@/components/ui/CustomCursor";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
});

const SITE_URL = "https://carlosprestes77-netizen.github.io/dw-tattooer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DW Tattooer — Realismo Preto e Cinza | Maringá",
    template: "%s · DW Tattooer",
  },
  description:
    "Tatuagens autorais de alto padrão em Maringá. DW Tattooer — realismo preto e cinza, retratos, projetos exclusivos e orçamento pelo WhatsApp.",
  keywords: [
    "tatuagem", "tatuador", "realismo", "preto e cinza", "tatuagem autoral",
    "tatuador Maringá", "DW Tattooer", "dw.tattooer",
  ],
  authors: [{ name: "DW Tattooer" }],
  creator: "DW Tattooer",
  openGraph: {
    title: "DW Tattooer — Realismo Preto e Cinza",
    description:
      "Tatuagens autorais de alto padrão em Maringá. Realismo preto e cinza e projetos exclusivos.",
    url: SITE_URL,
    siteName: "DW Tattooer",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DW Tattooer — Realismo Preto e Cinza",
    description: "Tatuagens autorais de alto padrão em Maringá.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  name: "DW Tattooer",
  description:
    "Estúdio de tatuagem com projetos autorais em realismo preto e cinza.",
  url: SITE_URL,
  founder: { "@type": "Person", name: "DW Tattooer" },
  sameAs: ["https://www.instagram.com/dw.tattooer"],
  telephone: "+5544991373995",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Maringá",
    addressRegion: "PR",
    addressCountry: "BR",
  },
  areaServed: "Maringá e região",
  priceRange: "$$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${raleway.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </head>
      <body className="bg-paper-200 text-ink font-sans antialiased">
        {children}
        <GrainOverlay />
        <CustomCursor />
      </body>
    </html>
  );
}
