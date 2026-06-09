"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor em formato de máquina de tatuar (caneta rotativa).
 * Segue o ponteiro de forma instantânea — sem mola/atraso, então não dá aquela
 * sensação de "arrasto". A ponta da agulha é o ponto exato do cursor (hotspot).
 * Só ativa em dispositivos com ponteiro fino (mouse/trackpad); no toque, mantém
 * o comportamento nativo.
 */

// Hotspot: ponto da agulha dentro do SVG (coordenadas locais).
const TIP_X = 6;
const TIP_Y = 40;

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null); // segue o ponteiro (translate)
  const iconRef = useRef<HTMLDivElement>(null); // estados de hover/clique (scale/rotate)
  const hovering = useRef(false);
  const down = useRef(false);

  // aplica o transform do ícone conforme hover/clique (pivotando na ponta)
  const applyIcon = () => {
    const el = iconRef.current;
    if (!el) return;
    const scale = (hovering.current ? 1.18 : 1) * (down.current ? 0.86 : 1);
    const rot = down.current ? -12 : hovering.current ? -4 : 0;
    el.style.transform = `translate(${-TIP_X}px, ${-TIP_Y}px) rotate(${rot}deg) scale(${scale})`;
  };

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    setEnabled(true);
    document.body.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      // transform direto = zero atraso (sem mola).
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      hovering.current = !!t?.closest(
        "a, button, input, textarea, select, label, [data-cursor='hover']",
      );
      applyIcon();
    };
    const downH = () => {
      down.current = true;
      applyIcon();
    };
    const upH = () => {
      down.current = false;
      applyIcon();
    };
    const leave = () => {
      if (wrapRef.current) wrapRef.current.style.transform = "translate3d(-100px, -100px, 0)";
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", downH);
    window.addEventListener("mouseup", upH);
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", downH);
      window.removeEventListener("mouseup", upH);
      document.removeEventListener("mouseleave", leave);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
      aria-hidden
    >
      <div
        ref={iconRef}
        className="transition-transform duration-150 ease-out"
        style={{ transform: `translate(${-TIP_X}px, ${-TIP_Y}px)`, transformOrigin: `${TIP_X}px ${TIP_Y}px` }}
      >
        <svg
          width="46"
          height="46"
          viewBox="0 0 46 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.45))" }}
        >
          <defs>
            <linearGradient id="cur-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#46464e" />
              <stop offset="0.5" stopColor="#26262c" />
              <stop offset="1" stopColor="#101013" />
            </linearGradient>
          </defs>
          {/* máquina inclinada, com a ponta da agulha em (TIP_X, TIP_Y) */}
          <g transform="rotate(36 6 40)">
            {/* agulha de aço */}
            <line x1="6" y1="40.5" x2="6" y2="32" stroke="#e9e9ef" strokeWidth="1.4" strokeLinecap="round" />
            {/* bico / tip preto */}
            <polygon points="3.4,32 8.6,32 7.4,27 4.6,27" fill="#0c0c0e" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
            {/* corpo (grip + tubo) */}
            <rect x="1.3" y="6" width="9.4" height="21" rx="4.7" fill="url(#cur-body)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" />
            {/* anel dourado */}
            <rect x="1.3" y="21.4" width="9.4" height="2.8" fill="#a8834f" />
            {/* nervuras do grip */}
            <line x1="2.4" y1="12" x2="9.6" y2="12" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
            <line x1="2.4" y1="15" x2="9.6" y2="15" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
            {/* tampa traseira + nub */}
            <rect x="2.2" y="2.4" width="7.6" height="4.2" rx="2.1" fill="#1a1a1e" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
            <circle cx="6" cy="2.2" r="1.5" fill="#2c2c33" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}
