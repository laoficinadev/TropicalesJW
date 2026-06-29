"use client";

import { useLocale } from "@/lib/i18n";

export function StockIndicator({ stock }: { stock: number }) {
  const { t } = useLocale();

  if (stock <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        {t("stock.outOfStock")}
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-600">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
        {t("stock.lowStock", { count: stock })}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {t("stock.inStock")}
    </span>
  );
}
