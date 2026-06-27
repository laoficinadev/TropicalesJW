import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ProductDetailClient } from "@/components/productos/ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data: product } = await supabase
    .from("Product")
    .select("name, description, images")
    .eq("slug", slug)
    .single();

  if (!product) {
    return { title: "Producto no encontrado - TropicalesJW" };
  }

  const images = JSON.parse(product.images || "[]") as string[];

  return {
    title: `${product.name} - TropicalesJW`,
    description: product.description?.slice(0, 160) || "Producto Tropical",
    openGraph: {
      title: `${product.name} - TropicalesJW`,
      description: product.description?.slice(0, 160),
      images: images.length > 0 ? [images[0]] : [],
    },
  };
}

export default async function ProductoSlugPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}