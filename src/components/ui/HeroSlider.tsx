"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/lib/i18n";

const slides = [
  {
    key: "slide1",
    image: "/hero-bg.svg",
    gradient: "from-emerald-600/90 to-teal-700/90",
  },
  {
    key: "slide2",
    image: "/hero-bg.svg",
    gradient: "from-amber-600/90 to-orange-700/90",
  },
  {
    key: "slide3",
    image: "/hero-bg.svg",
    gradient: "from-indigo-600/90 to-blue-700/90",
  },
];

export function HeroSlider() {
  const { t } = useLocale();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  function prev() {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function next() {
    setCurrent((prev) => (prev + 1) % slides.length);
  }

  return (
    <section className="relative mb-12 overflow-hidden rounded-3xl bg-brand-primary">
      <div className="relative h-[420px] w-full md:h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 flex items-center bg-gradient-to-br ${slides[current].gradient} p-8 md:p-16`}
          >
            <div className="relative z-10 max-w-lg">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-2 text-sm font-medium uppercase tracking-widest text-white/70"
              >
                TropicalesJW
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-4xl font-bold text-white md:text-5xl"
              >
                {t(`hero.${slides[current].key}Title`)}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-2 text-xl font-semibold text-white/90"
              >
                {t(`hero.${slides[current].key}Sub`)}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-3 text-sm leading-relaxed text-white/80"
              >
                {t(`hero.${slides[current].key}Desc`)}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="mt-6 flex gap-3"
              >
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-white/90"
                >
                  {t("hero.cta")}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
