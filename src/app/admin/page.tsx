import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Package, ShoppingBag, MessageSquare } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const stats = [
    {
      icon: Package,
      label: "Productos",
      value: "—",
      href: "/admin/productos",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: ShoppingBag,
      label: "Pedidos",
      value: "—",
      href: "/admin/pedidos",
      color: "text-amber-600 bg-amber-50",
    },
    {
      icon: MessageSquare,
      label: "Mensajes",
      value: "—",
      href: "#",
      color: "text-blue-600 bg-blue-50",
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div
              className={`inline-flex rounded-lg p-3 ${stat.color} mb-4`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
