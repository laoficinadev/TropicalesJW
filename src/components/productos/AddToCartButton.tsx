"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
  stock: number;
}

export function AddToCartButton({ product }: { product: ProductData }) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const images = JSON.parse(product.images || "[]") as string[];

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(
      (item: { id: string }) => item.id === product.id
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity,
        image: images[0] || null,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success(`${product.name} agregado al carrito`);
    router.refresh();
  }

  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="rounded-xl bg-gray-100 px-8 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed"
      >
        Agotado
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-xl border border-gray-200">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="flex h-12 w-12 items-center justify-center text-gray-500 transition hover:text-emerald-600"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="flex h-12 w-14 items-center justify-center text-sm font-medium text-gray-900 tabular-nums">
          {quantity}
        </span>
        <button
          onClick={() =>
            setQuantity(Math.min(product.stock, quantity + 1))
          }
          className="flex h-12 w-12 items-center justify-center text-gray-500 transition hover:text-emerald-600"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={addToCart}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        <ShoppingCart className="h-4 w-4" />
        Agregar al Carrito
      </button>
    </div>
  );
}
