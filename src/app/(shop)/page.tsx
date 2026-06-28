import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { HomeProductSection } from "@/components/productos/HomeProductSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TropicalesJW - Productos Tropicales Frescos",
  description: "Descubre nuestra selección de productos tropicales frescos y de la mejor calidad. Envíos a todo el país.",
  openGraph: {
    title: "TropicalesJW - Productos Tropicales Frescos",
    description: "Descubre nuestra selección de productos tropicales frescos y de la mejor calidad.",
  },
};

export default async function Home() {
  const { data: categories } = await supabase
    .from("Category")
    .select("*")
    .order("name", { ascending: true })
    .limit(50);

  return (
    <div className="flex flex-col">
      <HomeProductSection categories={categories?.map((c) => ({ name: c.name, slug: c.slug })) || []} />
    </div>
  );
}
