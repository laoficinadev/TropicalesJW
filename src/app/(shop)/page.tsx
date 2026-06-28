import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, Truck, Shield } from "lucide-react";
import { t } from "@/lib/i18n/server";
import { supabase } from "@/lib/supabase";
import { HomeProductGrid } from "@/components/productos/HomeProductGrid";

export const metadata: Metadata = {
  title: "TropicalesJW - Productos Tropicales Frescos",
  description: "Descubre nuestra selección de productos tropicales frescos y de la mejor calidad. Envíos a todo el país.",
  openGraph: {
    title: "TropicalesJW - Productos Tropicales Frescos",
    description: "Descubre nuestra selección de productos tropicales frescos y de la mejor calidad.",
  },
};

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

export default async function Home() {
  const features = [
    {
      icon: Leaf,
      title: await t("home.natural"),
      desc: await t("home.naturalDesc"),
    },
    {
      icon: Truck,
      title: await t("home.shipping"),
      desc: await t("home.shippingDesc"),
    },
    {
      icon: Shield,
      title: await t("home.quality"),
      desc: await t("home.qualityDesc"),
    },
  ];

  const featuredTitle = await t("home.featured");
  const viewAll = await t("products.viewAll");

  const { data: featuredProducts } = await supabase
    .from("Product")
    .select("*, category:Category(*)")
    .eq("published", true)
    .eq("featured", true)
    .order("createdAt", { ascending: false })
    .limit(3);

  return (
    <div className="flex flex-col">
      <section className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {features.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gradient-primary">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gradient-primary sm:text-4xl">
                {featuredTitle}
              </h2>
            </div>
            <Link
              href="/productos"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-accent hover:text-brand-accent-dark transition"
            >
              {viewAll} &rarr;
            </Link>
          </div>

          {featuredProducts && featuredProducts.length > 0 ? (
            <HomeProductGrid products={featuredProducts as unknown as Product[]} />
          ) : (
            <p className="text-center text-lg text-gray-500">{await t("common.comingSoon")}</p>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/productos"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-accent hover:text-brand-accent-dark transition"
            >
              {viewAll} &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
