"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

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
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg hover:border-brand-accent/20"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-light to-brand-accent/10">
        {images[0] ? (
          <Image
            src={images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-brand-light flex items-center justify-center">
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
        <button
          onClick={addToCart}
          disabled={product.stock <= 0}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md opacity-0 transition hover:bg-brand-primary hover:text-white group-hover:opacity-100 disabled:opacity-0"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.category && (
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand-primary">
            {product.category.name}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 transition group-hover:text-brand-primary">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
          {product.description}
        </p>
        <div className="mt-auto pt-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
