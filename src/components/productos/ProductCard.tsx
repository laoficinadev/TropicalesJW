"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { StockIndicator } from "./StockIndicator";
import { QuickViewModal } from "./QuickViewModal";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string;
  stock: number;
  category?: { name: string; slug: string } | null;
}

export function ProductCard({ product }: { product: Product }) {
  const images = JSON.parse(product.images || "[]") as string[];
  const [quickOpen, setQuickOpen] = useState(false);

  function addToCart(e: React.MouseEvent) {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(
      (item: { id: string }) => item.id === product.id
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity: 1,
        image: images[0] || null,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success(`${product.name} agregado al carrito`);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35 }}
        whileHover={{ y: -4 }}
      >
        <Link
          href={`/productos/${product.slug}`}
          className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-surface"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-light to-brand-accent/10">
            {images[0] ? (
              <Image
                src={images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
                    <span className="text-2xl text-brand-primary">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Sin imagen</p>
                </div>
              </div>
            )}
            {product.stock <= 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                  Agotado
                </span>
              </div>
            )}

            <div className="absolute left-3 top-3">
              <StockIndicator stock={product.stock} />
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              onClick={(e) => {
                e.preventDefault();
                setQuickOpen(true);
              }}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm opacity-0 transition hover:bg-white group-hover:opacity-100"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={addToCart}
              disabled={product.stock <= 0}
              className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md opacity-0 transition hover:bg-brand-primary hover:text-white group-hover:opacity-100 disabled:opacity-0"
            >
              <ShoppingCart className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="flex flex-1 flex-col gap-1 p-4">
            {product.category && (
              <span className="text-[11px] font-medium uppercase tracking-wider text-brand-accent">
                {product.category.name}
              </span>
            )}
            <h3 className="font-semibold text-gray-900 transition group-hover:text-brand-primary dark:text-gray-100">
              {product.name}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
              {product.description}
            </p>
            <div className="mt-auto pt-3">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      <QuickViewModal
        product={product}
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
      />
    </>
  );
}
