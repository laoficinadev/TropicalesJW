"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export function DeleteProductButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const res = await fetch(`/api/admin/productos/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      toast.success("Producto eliminado");
      router.refresh();
    } catch {
      toast.error("Error al eliminar el producto");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
