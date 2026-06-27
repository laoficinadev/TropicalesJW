"use client";

import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export function TogglePublishedButton({
  productId,
  published,
}: {
  productId: string;
  published: boolean;
}) {
  const router = useRouter();

  async function handleToggle() {
    try {
      const res = await fetch(`/api/admin/productos/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });

      if (!res.ok) throw new Error();
      toast.success(published ? "Producto ocultado" : "Producto publicado");
      router.refresh();
    } catch {
      toast.error("Error al cambiar estado");
    }
  }

  return (
    <button
      onClick={handleToggle}
      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-brand-light hover:text-brand-primary"
      title={published ? "Ocultar producto" : "Publicar producto"}
    >
      {published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}