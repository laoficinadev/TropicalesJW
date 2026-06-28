import type { Metadata } from "next";
import { Leaf, Truck, Shield } from "lucide-react";
import { t } from "@/lib/i18n/server";
import { supabase } from "@/lib/supabase";
import { HomeProductSection } from "@/components/productos/HomeProductSection";

export const metadata: Metadata = {
  title: "TropicalesJW - Productos Tropicales Frescos",
  description: "Descubre nuestra selección de productos tropicales frescos y de la mejor calidad. Envíos a todo el país.",
  openGraph: {
    title: "TropicalesJW - Productos Tropicales Frescos",
    description: "Descubre nuestra selección de productos tropicales frescos y de la mejor calidad.",
  },
};

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

  const { data: categories } = await supabase
    .from("Category")
    .select("*")
    .order("name", { ascending: true })
    .limit(50);

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

      <HomeProductSection categories={categories?.map((c) => ({ name: c.name, slug: c.slug })) || []} />
    </div>
  );
}
