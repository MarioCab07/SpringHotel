import React, { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageCarousel = ({ images = [], children, className = "" }) => {
  const imgList = (Array.isArray(images) ? images : []).filter(Boolean);
  // si no hay imágenes usa placeholder vacío para evitar crash
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // si cambian las imágenes, reiniciar índice
    setCurrent(0);
  }, [images]);

  const prev = useCallback((e) => {
    e && e.stopPropagation();
    if (!imgList.length) return;
    setCurrent((c) => (c === 0 ? imgList.length - 1 : c - 1));
  }, [imgList.length]);

  const next = useCallback((e) => {
    e && e.stopPropagation();
    if (!imgList.length) return;
    setCurrent((c) => (c === imgList.length - 1 ? 0 : c + 1));
  }, [imgList.length]);

  // Navegación con teclas izquierda/derecha
  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === "ArrowLeft") prev();
      if (ev.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const currentSrc = imgList.length ? imgList[current] : null;

  return (
    <div className={`relative h-64 md:h-80 overflow-hidden group ${className}`}>
      {/* Imagen */}
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={`room-img-${current}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
          No image
        </div>
      )}

      {/* Gradiente (igual que antes) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>

      {/* Flechas */}
      <button
        aria-label="Anterior"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow-md"
      >
        <FaChevronLeft />
      </button>

      <button
        aria-label="Siguiente"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow-md"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {imgList.length === 0 ? (
          <></>
        ) : (
          imgList.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
              className={`w-2 h-2 rounded-full ${idx === current ? "bg-[#bfa166]" : "bg-white/80"}`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))
        )}
      </div>

      {/* slot para badge / overlays del room (se renderiza encima del gradiente) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {/*
          children normalmente contienen elementos posicionados (badge, title),
          los cuales usan pointer-events-auto si necesitan clicks.
        */}
        {children}
      </div>
    </div>
  );
};

export default ImageCarousel;
