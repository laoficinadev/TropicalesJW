"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { slugify } from "@/lib/utils";

interface ProductData {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  published?: boolean;
  featured?: boolean;
  categoryId?: string | null;
  images?: string;
}

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductData;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const isEdit = !!product?.id;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");

  function handleNameChange(value: string) {
    setName(value);
    if (!isEdit) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const payload = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      price: form.get("price"),
      stock: form.get("stock"),
      published: form.get("published") === "on",
      featured: form.get("featured") === "on",
      categoryId: form.get("categoryId") || null,
      images: [],
    };

    const url = isEdit
      ? `/api/admin/productos/${product.id}`
      : "/api/admin/productos";

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar");

      toast.success(isEdit ? "Producto actualizado" : "Producto creado");
      router.push("/admin/productos");
      router.refresh();
    } catch {
      toast.error("Error al guardar el producto");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre del producto *
            </label>
            <input
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              name="categoryId"
              defaultValue={product?.categoryId || ""}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            >
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Descripción *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={product?.description || ""}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio *
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={product?.price || ""}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              name="stock"
              type="number"
              defaultValue={product?.stock || 0}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              name="published"
              type="checkbox"
              defaultChecked={product?.published ?? true}
              className="rounded border-gray-300 text-brand-primary focus:ring-brand-accent"
            />
            Publicado
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={product?.featured ?? false}
              className="rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
            />
            Destacado
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary disabled:opacity-50"
        >
          {loading
            ? "Guardando..."
            : isEdit
              ? "Actualizar Producto"
              : "Crear Producto"}
        </button>
      </div>
    </form>
  );
}
