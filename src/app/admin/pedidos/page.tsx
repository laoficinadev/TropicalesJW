import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export default async function AdminPedidosPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-sm text-gray-500">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="mb-4 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No hay pedidos aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">
                      #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {order.customerName} — {order.customerEmail}
                  </p>
                  {order.customerPhone && (
                    <p className="text-xs text-gray-400">
                      Tel: {order.customerPhone}
                    </p>
                  )}
                  {order.shippingAddress && (
                    <p className="text-xs text-gray-400">
                      {order.shippingAddress}
                    </p>
                  )}
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(order.total)}
                </p>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {item.quantity}x
                        </span>
                        <span className="text-gray-700">
                          {item.product.name}
                        </span>
                      </div>
                      <span className="text-gray-600">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.customerNotes && (
                <div className="mt-3 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500">Notas:</p>
                  <p className="mt-0.5 text-sm text-gray-700">
                    {order.customerNotes}
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-400">
                <span>
                  {new Date(order.createdAt).toLocaleDateString("es-CR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
