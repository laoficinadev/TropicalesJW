"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
}

export function RecentlyViewed() {
  const { t } = useLocale();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Product[];
        setProducts(parsed.slice(0, 6));
      } catch {}
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900"
      >
        <Clock className="h-5 w-5 text-brand-accent" />
        {t("recently.title")}
      </motion.h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {products.map((product, i) => {
          const images = JSON.parse(product.images || "[]") as string[];
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/productos/${product.slug}`}
                className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-24 items-center justify-center bg-gradient-to-br from-brand-light to-brand-accent/10 p-3">
                  {images[0] ? (
                    <Image
                      src={images[0]}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="max-h-20 w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-brand-accent/30">
                      {product.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-brand-primary">
                    {formatPrice(Number(product.price))}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
