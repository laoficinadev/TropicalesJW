"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-light to-brand-accent/10 p-8 transition-all"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0, scale: zoomed ? 1.5 : 1 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="relative flex h-[400px] w-full items-center justify-center"
          >
            <Image
              src={images[selected]}
              alt={`${name} ${selected + 1}`}
              width={500}
              height={500}
              className="max-h-[400px] w-full cursor-zoom-in object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelected((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSelected((prev) => (prev + 1) % images.length)}
              className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-gray-400 backdrop-blur-sm">
          <ZoomIn className="h-4 w-4" />
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === selected
                  ? "border-brand-accent ring-2 ring-brand-accent/20"
                  : "border-gray-200 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
