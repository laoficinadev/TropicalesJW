"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { HomeProductGrid } from "./HomeProductGrid";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";
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

export function HomeProductSection({ categories }: { categories: Category[] }) {
  const { t } = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQ) params.set("q", searchQ);
      if (selectedCategory) params.set("categoria", selectedCategory);

      const res = await fetch(`/api/productos?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQ, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetchProducts();
  }

  function toggleCategory(slug: string) {
    setSelectedCategory((prev) => (prev === slug ? "" : slug));
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-gradient-primary sm:text-4xl">
            {t("products.title")}
          </h2>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="flex w-full max-w-md">
            <input
              ref={searchRef}
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder={t("nav.searchPlaceholder")}
              className="w-full rounded-l-lg border border-brand-accent/30 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-brand-accent focus:bg-white"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-r-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-accent-dark"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => toggleCategory(cat.slug)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat.slug
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-brand-light hover:text-brand-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="rounded-full px-4 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
              >
                {t("common.reset")}
              </button>
            )}
          </div>
        )}

        {loading ? (
          <ProductGridSkeleton />
        ) : products.length > 0 ? (
          <HomeProductGrid products={products} />
        ) : (
          <p className="text-center text-lg text-gray-500">{t("products.noProductsFound")}</p>
        )}
      </div>
    </section>
  );
}
