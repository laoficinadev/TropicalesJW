"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface CartItemData {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string | null;
}

export function CartItem({
  item,
  onUpdate,
}: {
  item: CartItemData;
  onUpdate: () => void;
}) {
  function updateQuantity(delta: number) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(
      (i: { id: string }) => i.id === item.id
    ) as CartItemData | undefined;
    if (existing) {
      existing.quantity = Math.max(1, existing.quantity + delta);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      onUpdate();
    }
  }

  function removeItem() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const filtered = cart.filter(
      (i: { id: string }) => i.id !== item.id
    );
    localStorage.setItem("cart", JSON.stringify(filtered));
    window.dispatchEvent(new Event("cart-updated"));
    onUpdate();
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-brand-light to-brand-accent/10">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-brand-primary">
            {item.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <p className="mt-0.5 text-sm font-medium text-brand-primary">
              {formatPrice(item.price)}
            </p>
          </div>
          <button
            onClick={removeItem}
            className="rounded-full p-1.5 text-gray-300 transition hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-gray-200">
            <button
              onClick={() => updateQuantity(-1)}
              className="flex h-8 w-8 items-center justify-center text-gray-400 transition hover:text-brand-primary"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="flex h-8 w-10 items-center justify-center text-sm font-medium tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(1)}
              className="flex h-8 w-8 items-center justify-center text-gray-400 transition hover:text-brand-primary"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
