"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";

interface ItemWithProduct {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product: { name: string };
}

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { t } = useLocale();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [items, setItems] = useState<ItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const { data: orderData } = await supabase
        .from("Order")
        .select("*")
        .eq("id", id)
        .single();

      if (!orderData) return;

      setOrder(orderData);

      const { data: orderItems } = await supabase
        .from("OrderItem")
        .select("*, product:Product(name)")
        .eq("orderId", id);

      setItems((orderItems || []) as unknown as ItemWithProduct[]);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
          <CheckCircle className="h-10 w-10 text-brand-accent" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("confirmation.subtitle")}
        </h1>
        <p className="mt-2 text-gray-500">
          {t("confirmation.thankYou")}, {(order as { customerName?: string }).customerName}.{" "}
          {t("confirmation.confirmationEmail")}{" "}
          <strong>{(order as { customerEmail?: string }).customerEmail}</strong>.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("confirmation.orderNumber")}: {(order.id as string).slice(-8).toUpperCase()}
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-primary-dark">
            <Package className="h-3 w-3" />
            {t("orders.pending")}
          </span>
        </div>

        <div className="mt-6 divide-y divide-gray-100">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-xs font-bold text-brand-primary">
                  {item.quantity}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatPrice(Number(item.price))} c/u
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatPrice(Number(item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>{t("cart.total")}</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-brand-accent/20 bg-brand-accent/10 p-4">
        <p className="text-center text-sm text-brand-primary">
          {t("checkout.paymentMethod")}.{" "}
          {t("checkout.paymentDesc")}
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary"
        >
          {t("confirmation.returnToShop")}
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense>
      <ConfirmacionContent />
    </Suspense>
  );
}
