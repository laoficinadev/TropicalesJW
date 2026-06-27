"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { CartItem } from "@/components/carrito/CartItem";
import { useLocale } from "@/lib/i18n";

const CartSummary = dynamic(() => import("@/components/carrito/CartSummary").then((m) => m.CartSummary));

interface CartItemData {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string | null;
}

export default function CarritoPage() {
  const { t } = useLocale();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadCart = useCallback(() => {
    if (typeof window === "undefined") return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(cart);
  }, []);

  useEffect(() => {
    setMounted(true);
    loadCart();
    const handler = () => loadCart();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [loadCart]);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
            <ShoppingBag className="h-8 w-8 text-brand-accent/60" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("cart.empty")}
          </h1>
          <p className="mt-2 text-gray-500">
            {t("cart.emptyDesc")}
          </p>
          <Link
            href="/productos"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("cart.viewProducts")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("cart.title")}
          </h1>
          <p className="mt-1 text-gray-500">
            {items.length === 1
              ? t("cart.items_one", { count: 1 })
              : t("cart.items_other", { count: items.length })}
          </p>
        </div>
        <Link
          href="/productos"
          className="hidden items-center gap-2 text-sm font-medium text-brand-primary transition hover:text-brand-primary sm:flex"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("cart.continueShopping")}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} onUpdate={loadCart} />
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <CartSummary items={items} />
          <Link
            href="/checkout"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary"
          >
            {t("cart.proceedToCheckout")}
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary transition hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("cart.continueShopping")}
        </Link>
      </div>
    </div>
  );
}
