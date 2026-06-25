"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProductGrid } from "@/components/productos/ProductGrid";
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

function BuscarContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const search = useCallback(async () => {
    if (!q) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data } = await supabase
      .from("Product")
      .select("*, category:Category(*)")
      .eq("published", true)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .order("createdAt", { ascending: false });

    setProducts((data || []) as unknown as Product[]);
    setLoading(false);
  }, [q]);

  useEffect(() => {
    search();
  }, [search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("search.title")}</h1>
        {q && (
          <p className="mt-2 text-gray-500">
            {t("search.resultsFor")} &ldquo;<span className="font-medium text-gray-900">{q}</span>&rdquo;
          </p>
        )}
      </div>

      {!q ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
            <Search className="h-8 w-8 text-brand-accent/60" />
          </div>
          <p className="text-gray-500">{t("search.searchPlaceholder")}</p>
        </div>
      ) : loading ? (
        <p className="text-center text-gray-500">{t("common.loading")}</p>
      ) : (
        <ProductGrid
          products={products}
          emptyMessage={`${t("search.noResults")} "${q}". ${t("search.tryDifferent")}`}
        />
      )}
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense>
      <BuscarContent />
    </Suspense>
  );
}
