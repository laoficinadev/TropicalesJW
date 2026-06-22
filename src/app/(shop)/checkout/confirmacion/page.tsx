import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle, Package } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ConfirmacionPage({
  searchParams,
}: PageProps) {
  const { id } = await searchParams;
  if (!id) redirect("/");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Pedido Confirmado!
        </h1>
        <p className="mt-2 text-gray-500">
          Gracias por tu compra, {order.customerName}. Te hemos enviado un
          resumen a <strong>{order.customerEmail}</strong>.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Pedido #{order.id.slice(-8).toUpperCase()}
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <Package className="h-3 w-3" />
            Pendiente
          </span>
        </div>

        <div className="mt-6 divide-y divide-gray-100">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-600">
                  {item.quantity}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatPrice(item.price)} c/u
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-center text-sm text-amber-800">
          Pagarás en efectivo cuando recibas tu pedido. Te contactaremos
          para coordinar la entrega.
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
