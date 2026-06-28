"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";
import { useLocale } from "@/lib/i18n";

const ProductGrid = dynamic(() => import("@/components/productos/ProductGrid").then((m) => m.ProductGrid));
const ProductFilters = dynamic(() => import("@/components/productos/ProductFilters").then((m) => m.ProductFilters));

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string;
  stock: number;
  category?: { name: string; slug: string } | null;
}

interface Category {
  name: string;
  slug: string;
}

function ProductosContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const q = searchParams.get("q");
        const categoria = searchParams.get("categoria");
        if (q) params.set("q", q);
        if (categoria) params.set("categoria", categoria);

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/productos?${params.toString()}`),
          fetch("/api/categorias"),
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData.map((c: { name: string; slug: string }) => ({ name: c.name, slug: c.slug })));
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchParams.toString()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("products.title")}</h1>
        <p className="mt-1 text-gray-500">
          {loading ? t("common.loading") : `${products.length} ${products.length === 1 ? "producto" : "productos"} disponibles`}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <ProductFilters categories={categories} />
        </aside>

        <div className="flex-1">
          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <ProductGrid
              products={products}
              emptyMessage={t("products.noProductsFound")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense>
      <ProductosContent />
    </Suspense>
  );
}
