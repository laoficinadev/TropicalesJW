"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export function ProductFilters({
  categories,
}: {
  categories: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const currentQ = searchParams.get("q") || "";
  const currentCat = searchParams.get("categoria") || "";

  function handleSearch(formData: FormData) {
    const q = formData.get("q") as string;
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    params.delete("categoria");
    router.push(`/productos?${params.toString()}`);
  }

  function handleCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === currentCat) params.delete("categoria");
    else params.set("categoria", slug);
    params.delete("q");
    router.push(`/productos?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <form action={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            name="q"
            defaultValue={currentQ}
            placeholder={t("products.searchProducts")}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
          />
        </div>
      </form>

      {categories.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-900">
            {t("products.allCategories")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategory(cat.slug)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  currentCat === cat.slug
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-brand-light hover:text-brand-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
