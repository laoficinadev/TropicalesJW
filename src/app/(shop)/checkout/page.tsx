"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft, ShoppingBag, CreditCard } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";

const CartSummary = dynamic(() => import("@/components/carrito/CartSummary").then((m) => m.CartSummary));

interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string | null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(cart);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    const payload = {
      customerName: form.get("name"),
      customerEmail: form.get("email"),
      customerPhone: form.get("phone") || "",
      customerNotes: form.get("notes") || "",
      shippingAddress: form.get("address"),
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: getTotal(),
    };

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al crear pedido");

      const order = await res.json();
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
      router.push(`/checkout/confirmacion?id=${order.id}`);
    } catch {
      toast.error(t("checkout.error"));
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
            <ShoppingBag className="h-8 w-8 text-brand-accent/60" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("checkout.emptyTitle")}
          </h1>
          <p className="mt-2 text-gray-500">
            {t("checkout.emptyDesc")}
          </p>
          <Link
            href="/productos"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("checkout.viewProducts")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/carrito"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("checkout.backToCart")}
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gradient-primary">{t("checkout.title")}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                {t("checkout.contactInfo")}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("checkout.fullName")} *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("checkout.email")} *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("checkout.phone")}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("checkout.shippingAddress")} *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={2}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("checkout.orderNotes")}
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                    placeholder={t("checkout.orderNotesPlaceholder")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <CartSummary items={items} />

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-5 w-5 text-gray-400" />
                <div className="text-xs text-gray-500">
                  <p className="font-medium text-gray-700">
                    {t("checkout.paymentMethod")}
                  </p>
                  <p className="mt-1">
                    {t("checkout.paymentDesc")}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary disabled:opacity-50"
            >
              {submitting
                ? t("checkout.processing")
                : `${t("checkout.placeOrder")} — ${formatPrice(getTotal())}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
