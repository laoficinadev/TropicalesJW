"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import toast from "react-hot-toast";

interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string;
  stock: number;
  category?: { name: string; slug: string } | null;
}

export default function ProductoSlugPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [related, setRelated] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function load() {
      const slug = params.slug as string;

      const { data: prod } = await supabase
        .from("Product")
        .select("*, category:Category(*)")
        .eq("slug", slug)
        .single();

      if (!prod) {
        router.push("/productos");
        return;
      }

      setProduct(prod as unknown as ProductWithCategory);

      if (prod.categoryId) {
        const { data: rel } = await supabase
          .from("Product")
          .select("*, category:Category(*)")
          .eq("categoryId", prod.categoryId)
          .neq("id", prod.id)
          .eq("published", true)
          .limit(3);

        setRelated((rel || []) as unknown as ProductWithCategory[]);
      }

      setLoading(false);
    }
    load();
  }, [params.slug, router]);

  function addToCart() {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i: { id: string }) => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        quantity: 1,
        image: product.images || null,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);
    toast.success(t("products.addedToCart"));
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/productos"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("common.back")}
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-light to-brand-accent/10 p-8">
          {product.images ? (
            <Image
              src={product.images}
              alt={product.name}
              width={500}
              height={500}
              className="max-h-[400px] w-full object-contain"
            />
          ) : (
            <span className="text-6xl font-bold text-brand-accent/30">
              {product.name.charAt(0)}
            </span>
          )}
        </div>

        <div>
          {product.category && (
            <Link
              href={`/productos?categoria=${product.category.slug}`}
              className="inline-block rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-accent transition hover:bg-brand-accent/20"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>

          <p className="mt-2 text-3xl font-bold text-brand-primary">
            {formatPrice(Number(product.price))}
          </p>

          <div className="mt-6">
            <p className="text-base leading-relaxed text-gray-600">
              {product.description}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={addToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary"
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" />
                  {t("products.addedToCart")}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  {t("products.addToCart")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">
            {t("products.relatedProducts")}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/productos/${rel.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gradient-to-br from-brand-light to-brand-accent/10">
                  {rel.images ? (
                    <Image
                      src={rel.images}
                      alt={rel.name}
                      width={200}
                      height={200}
                      className="max-h-36 w-full object-contain"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-brand-accent/30">
                      {rel.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-brand-primary">
                  {rel.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-brand-primary">
                  {formatPrice(Number(rel.price))}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
