"use client";

import { formatPrice } from "@/lib/utils";

interface CartItemData {
  id: string;
  price: number;
  quantity: number;
}

export function CartSummary({ items }: { items: CartItemData[] }) {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Resumen del pedido
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>
            Subtotal ({items.length} producto{items.length !== 1 ? "s" : ""})
          </span>
          <span className="font-medium text-gray-900">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Envío</span>
          <span className="text-gray-400">Por calcular</span>
        </div>
      </div>

      <div className="my-4 border-t border-gray-100" />

      <div className="flex justify-between text-base font-semibold text-gray-900">
        <span>Total</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
    </div>
  );
}
