import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductosPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500">
            {products.length} producto{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition hover:bg-gray-50/50"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400">{product.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {product.category?.name || "—"}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.stock > 0
                        ? "text-emerald-600"
                        : "text-red-500"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {product.published ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
