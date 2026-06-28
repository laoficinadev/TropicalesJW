import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package, ShoppingBag, MessageSquare, TrendingUp } from "lucide-react";

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-600 bg-yellow-50",
  CONFIRMED: "text-blue-600 bg-blue-50",
  PROCESSING: "text-indigo-600 bg-indigo-50",
  SHIPPED: "text-brand-accent bg-brand-accent/10",
  DELIVERED: "text-emerald-600 bg-emerald-50",
  CANCELLED: "text-red-600 bg-red-50",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { count: totalProducts } = await supabase
    .from("Product")
    .select("*", { count: "exact", head: true });

  const { count: totalOrders } = await supabase
    .from("Order")
    .select("*", { count: "exact", head: true });

  const { count: totalMessages } = await supabase
    .from("ContactMessage")
    .select("*", { count: "exact", head: true });

  const { data: ordersData } = await supabase
    .from("Order")
    .select("status, total");

  const statusCounts: Record<string, number> = {};
  let totalRevenue = 0;

  for (const order of ordersData || []) {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    if (order.status === "DELIVERED" || order.status === "SHIPPED") {
      totalRevenue += Number(order.total) || 0;
    }
  }

  const { data: recentOrders } = await supabase
    .from("Order")
    .select("id, customerName, total, status, createdAt")
    .order("createdAt", { ascending: false })
    .limit(5);

  const { data: topItems } = await supabase
    .from("OrderItem")
    .select("name, quantity")
    .limit(100);

  const productSales: Record<string, number> = {};
  for (const item of topItems || []) {
    productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
  }

  const top5 = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, sold]) => ({ name, sold }));

  const stats = [
    {
      icon: Package,
      label: "Productos",
      value: String(totalProducts || 0),
      href: "/admin/productos",
      color: "text-brand-accent bg-brand-accent/10",
    },
    {
      icon: ShoppingBag,
      label: "Pedidos",
      value: String(totalOrders || 0),
      href: "/admin/pedidos",
      color: "text-brand-accent bg-brand-accent/10",
    },
    {
      icon: MessageSquare,
      label: "Mensajes",
      value: String(totalMessages || 0),
      href: "/admin/mensajes",
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30",
    },
    {
      icon: TrendingUp,
      label: "Ingresos",
      value: formatPrice(totalRevenue),
      href: "/admin/pedidos",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {session.user.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Panel de administracion de TropicalesJW
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className={`inline-flex rounded-lg p-3 ${stat.color} mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Pedidos por Estado
          </h2>
          {Object.keys(statusCounts).length === 0 ? (
            <p className="text-sm text-gray-400">No hay pedidos aún</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || "text-gray-600 bg-gray-50"}`}>
                    {statusLabels[status] || status}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {top5.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Productos Más Vendidos
            </h2>
            <div className="space-y-3">
              {top5.map((product, i) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700">{product.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{product.sold} vendido{product.sold !== 1 ? "s" : ""}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {recentOrders && recentOrders.length > 0 && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Últimos Pedidos
          </h2>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(Number(order.total))}
                  </p>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[order.status] || "text-gray-600 bg-gray-50"}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}