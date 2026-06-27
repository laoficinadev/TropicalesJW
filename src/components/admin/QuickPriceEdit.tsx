"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

export function QuickPriceEdit({
  productId,
  currentPrice,
}: {
  productId: string;
  currentPrice: number;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(formatPrice(currentPrice));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  async function handleSave() {
    const numericPrice = parseFloat(price.replace(/[₡,.\s]/g, "").replace(",", "."));
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Precio inválido");
      return;
    }

    try {
      const res = await fetch(`/api/admin/productos/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: numericPrice }),
      });

      if (!res.ok) throw new Error();
      toast.success("Precio actualizado");
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Error al actualizar precio");
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-1">
        <span className="font-medium text-gray-900">{formatPrice(currentPrice)}</span>
        <button
          onClick={() => setEditing(true)}
          className="rounded p-0.5 text-gray-300 transition hover:text-brand-primary"
        >
          <Pencil className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-400">₡</span>
      <input
        ref={inputRef}
        type="number"
        step="0.01"
        defaultValue={Number(currentPrice)}
        className="w-20 rounded border border-brand-accent px-1.5 py-0.5 text-sm font-medium text-gray-900"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") setEditing(false);
        }}
        onBlur={handleSave}
      />
    </div>
  );
}