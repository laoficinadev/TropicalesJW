"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
}

export function LiveSearch() {
  const router = useRouter();
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/productos?q=${encodeURIComponent(value)}&limit=5`);
        const data = await res.json();
        setResults(data || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={ref} className="relative hidden md:block flex-1 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={t("liveSearch.placeholder")}
          className="w-full rounded-l-lg border border-brand-accent/30 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-brand-accent focus:bg-white"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-r-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-accent-dark"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-surface"
          >
            {loading ? (
              <div className="space-y-3 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex animate-pulse gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-gray-200" />
                      <div className="h-3 w-1/4 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 && query.length >= 2 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                {t("liveSearch.noResults")}
              </div>
            ) : (
              <div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {results.map((product) => {
                    const images = JSON.parse(product.images || "[]") as string[];
                    return (
                      <Link
                        key={product.id}
                        href={`/productos/${product.slug}`}
                        onClick={() => { setOpen(false); setQuery(""); }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-gray-50"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-light">
                          {images[0] ? (
                            <Image
                              src={images[0]}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-bold text-brand-accent/30">
                              {product.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs font-semibold text-brand-primary">
                            {formatPrice(Number(product.price))}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {results.length > 0 && (
                  <Link
                    href={`/buscar?q=${encodeURIComponent(query)}`}
                    onClick={() => { setOpen(false); setQuery(""); }}
                    className="block border-t border-gray-100 p-3 text-center text-xs font-medium text-brand-accent transition hover:bg-gray-50"
                  >
                    {t("liveSearch.viewAll")} &rarr;
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
