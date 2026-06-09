"use client";

import dynamic from "next/dynamic";

// Carrega a cena WebGL apenas no cliente (static export + three.js).
const PhotoMonolith = dynamic(() => import("./PhotoMonolith"), {
  ssr: false,
});

/**
 * Camada 3D do Hero: a foto de fundo montada num monólito que gira e surge,
 * com um brilho radial atrás para destacá-la (estética monolith).
 */
export default function Hero3D({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden>
      {/* brilho radial quente atrás do objeto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(closest-side at 60% 48%, rgba(168,131,79,0.16), rgba(168,131,79,0.04) 46%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0">
        <PhotoMonolith />
      </div>
    </div>
  );
}
