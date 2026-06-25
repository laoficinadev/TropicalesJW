"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { ProductFilters } from "@/components/productos/ProductFilters";
import { useLocale } from "@/lib/i18n";

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
      const q = searchParams.get("q");
      const categoria = searchParams.get("categoria");

      let query = supabase
        .from("Product")
        .select("*, category:Category(*)")
        .eq("published", true);

      if (q) {
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
      }

      if (categoria) {
        const { data: cat } = await supabase
          .from("Category")
          .select("id")
          .eq("slug", categoria)
          .single();
        if (cat) {
          query = query.eq("categoryId", cat.id);
        }
      }

      query = query.order("createdAt", { ascending: false });

      const { data: productsData } = await query;
      const { data: categoriesData } = await supabase
        .from("Category")
        .select("*")
        .order("name", { ascending: true });

      setProducts((productsData || []) as unknown as Product[]);
      setCategories((categoriesData || []).map((c) => ({ name: c.name, slug: c.slug })));
      setLoading(false);
    }
    load();
  }, [searchParams]);

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
            <p className="text-center text-gray-500">{t("common.loading")}</p>
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
