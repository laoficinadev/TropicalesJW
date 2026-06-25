"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { OrderSkeleton } from "@/components/ui/OrderSkeleton";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  customerName: string;
  orderItems: OrderItem[];
}

export default function PedidosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLocale();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    async function loadOrders() {
      try {
        const res = await fetch("/api/pedidos/usuario");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-12 sm:px-6 lg:px-8">
        <OrderSkeleton />
        <OrderSkeleton />
        <OrderSkeleton />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
            <Package className="h-8 w-8 text-brand-accent/60" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("orders.noOrders")}</h1>
          <p className="mt-2 text-gray-500">{t("orders.startShopping")}</p>
          <Link
            href="/productos"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("orders.startShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("orders.title")}</h1>
        <p className="mt-1 text-gray-500">{orders.length} pedido{orders.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t("orders.orderId")}{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-primary-dark">
                {t(`orders.${order.status}` as keyof typeof t extends never ? string : never) || order.status}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm font-semibold text-gray-900">{t("orders.total")}</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
