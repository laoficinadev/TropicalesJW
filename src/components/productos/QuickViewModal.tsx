"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Check, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { StockIndicator } from "./StockIndicator";
import { useState } from "react";

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

export function QuickViewModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const [added, setAdded] = useState(false);
  const images = JSON.parse(product.images || "[]") as string[];

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: { id: string }) => item.id === product.id);
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
    setAdded(true);
    toast.success(`${product.name} agregado al carrito`);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="fixed inset-4 z-50 m-auto flex max-h-[90vh] max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-surface sm:inset-x-auto sm:inset-y-8"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-1 flex-col overflow-y-auto sm:flex-row">
              <div className="flex items-center justify-center bg-gradient-to-br from-brand-light to-brand-accent/10 p-6 sm:w-1/2">
                {images[0] ? (
                  <Image
                    src={images[0]}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="max-h-60 w-full object-contain"
                  />
                ) : (
                  <span className="text-6xl font-bold text-brand-accent/30">
                    {product.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6 sm:w-1/2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {product.category && (
                      <span className="text-[11px] font-medium uppercase tracking-wider text-brand-accent">
                        {product.category.name}
                      </span>
                    )}
                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                      {product.name}
                    </h2>
                  </div>
                </div>

                <StockIndicator stock={product.stock} />

                <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">
                  {product.description}
                </p>

                <div className="mt-auto space-y-3 pt-4">
                  <p className="text-2xl font-bold text-brand-primary">
                    {formatPrice(Number(product.price))}
                  </p>

                  <button
                    onClick={addToCart}
                    disabled={product.stock <= 0}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary-dark disabled:opacity-50"
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" /> Agregado
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" /> Agregar al Carrito
                      </>
                    )}
                  </button>

                  <Link
                    href={`/productos/${product.slug}`}
                    onClick={onClose}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" /> Ver detalle completo
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
