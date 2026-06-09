"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import { portfolioItems, ARTIST } from "@/lib/data";

const filters = ["Todos", "Realismo", "Religioso", "Fineline"];

const SLAB_DEPTH = 26; // espessura do "monólito" em px
const MAX_TILT = 24; // ângulo máximo de rotação ao passar pela tela

type PortfolioItem = (typeof portfolioItems)[0];

/**
 * Cada tatuagem é um "monólito": uma placa 3D com espessura que gira em torno
 * do eixo vertical conforme atravessa a viewport. O ângulo é derivado da posição
 * do card na tela a cada frame, então funciona tanto no scroll horizontal fixo
 * (desktop) quanto no swipe nativo (mobile).
 */
function Card({ item, index }: { item: PortfolioItem; index: number }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const rotY = useMotionValue(0);
  const smoothRot = useSpring(rotY, { stiffness: 110, damping: 22, mass: 0.4 });
  const reduced = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }, []);

  useAnimationFrame(() => {
    const el = slotRef.current;
    if (!el || reduced.current) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth || 1;
    // -1 quando o card está totalmente à esquerda, 0 no centro, +1 à direita
    const t = (r.left + r.width / 2 - vw / 2) / (vw / 2);
    const clamped = Math.max(-1, Math.min(1, t));
    rotY.set(clamped * -MAX_TILT);
  });

  return (
    // slot: mantém o tamanho do card e fornece a perspectiva
    <div
      ref={slotRef}
      data-cursor="hover"
      className="group relative h-full w-[78vw] flex-shrink-0 sm:w-[56vw] lg:w-[34vw] xl:w-[30vw]"
      style={{ perspective: "1400px" }}
    >
      {/* corpo 3D que gira */}
      <motion.div
        className="relative h-full w-full"
        style={{
          rotateY: smoothRot,
          transformStyle: "preserve-3d",
        }}
      >
        {/* face frontal: a tatuagem */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ transform: `translateZ(${SLAB_DEPTH / 2}px)`, backfaceVisibility: "hidden" }}
        >
          <img
            src={item.src}
            alt={item.alt}
            loading={index < 3 ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-[900ms] ease-out group-hover:scale-[1.05] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper-950/85 via-paper-950/15 to-transparent" />

          <div className="absolute right-5 top-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <p className="bg-paper-950/60 px-2 py-1 text-[8px] uppercase tracking-widest text-paper-300 backdrop-blur-sm">
              {item.style}
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="mb-1 text-[8px] uppercase tracking-[0.4em] text-paper-500">
              {item.style} · {item.placement}
            </p>
            <p className="font-serif text-lg font-semibold tracking-wider text-paper-100">
              {item.label}
            </p>
          </div>
        </div>

        {/* face traseira: cópia escurecida da tatuagem */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ transform: `translateZ(-${SLAB_DEPTH / 2}px) rotateY(180deg)`, backfaceVisibility: "hidden" }}
        >
          <img src={item.src} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover grayscale" />
          <div className="absolute inset-0 bg-paper-950/80" />
        </div>

        {/* espessura: aresta direita */}
        <div
          className="absolute inset-y-0 right-0 bg-gradient-to-l from-paper-950 to-paper-900"
          style={{
            width: `${SLAB_DEPTH}px`,
            transform: `rotateY(90deg) translateZ(${SLAB_DEPTH / 2}px)`,
            transformOrigin: "right center",
          }}
        />
        {/* espessura: aresta esquerda */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-paper-950 to-paper-900"
          style={{
            width: `${SLAB_DEPTH}px`,
            transform: `rotateY(-90deg) translateZ(${SLAB_DEPTH / 2}px)`,
            transformOrigin: "left center",
          }}
        />
      </motion.div>
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("Todos");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const filtered: PortfolioItem[] =
    active === "Todos"
      ? portfolioItems
      : portfolioItems.filter((i) => i.style === active);

  // Measure how far the track overruns the viewport so vertical scroll can be
  // mapped 1:1 onto a horizontal translate. Re-measures on resize and whenever
  // the active filter changes the number of cards.
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      setDistance(isDesktop ? Math.max(track.scrollWidth - window.innerWidth, 0) : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [filtered.length]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(xRaw, { damping: 40, stiffness: 220, mass: 0.5 });

  const pinned = distance > 0;

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="bg-paper-200"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div
        className={
          pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-12" : "py-24 lg:py-36"
        }
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="mb-10 flex flex-col gap-8 lg:mb-14 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p className="label-section mb-4">01 — Portfólio</p>
              <h2
                className="font-serif font-light leading-[0.95] tracking-tight text-ink"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
              >
                Trabalhos
                <br />
                Selecionados
              </h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`border px-4 py-2 text-[9px] font-light uppercase tracking-widest transition-all duration-200 ${
                    active === f
                      ? "border-ink bg-ink text-paper-100"
                      : "border-paper-400 text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Horizontal reel — pinned scroll on desktop, native swipe on mobile */}
        {pinned ? (
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex h-[60vh] gap-5 pl-6 pr-[12vw] lg:pl-16"
          >
            {filtered.map((item, i) => (
              <Card key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        ) : (
          <div
            ref={trackRef}
            className="flex h-[62vh] snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 lg:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filtered.map((item, i) => (
              <div key={item.id} className="snap-center">
                <Card item={item} index={i} />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-16">
          <div className="mt-10 flex items-center justify-between border-t border-paper-300 pt-8 lg:mt-14">
            <p className="text-xs font-light text-ink-faint">
              {pinned ? "Role para percorrer ·" : "Arraste para o lado ·"} +1000 trabalhos realizados
            </p>
            <a
              href={ARTIST.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-widest text-ink-muted transition-colors duration-300 hover:text-ink"
            >
              Ver Instagram →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
