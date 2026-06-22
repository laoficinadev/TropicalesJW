import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package, ShoppingBag, LayoutDashboard, MessageSquare, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="font-semibold text-emerald-700">
            TropicalesJW Admin
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{session.user.email}</span>
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-xs transition hover:bg-gray-100"
            >
              Ver tienda
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 sm:block">
          <nav className="space-y-1">
            {[
              { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
              { href: "/admin/productos", icon: Package, label: "Productos" },
              { href: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos" },
              { href: "/admin/mensajes", icon: MessageSquare, label: "Mensajes" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-gray-200" />
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Link>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
