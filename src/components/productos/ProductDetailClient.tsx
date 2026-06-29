"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Check, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import { ProductDetailSkeleton } from "@/components/ui/ProductDetailSkeleton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StockIndicator } from "./StockIndicator";
import { ImageGallery } from "./ImageGallery";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
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
  categoryId?: string;
}

export function ProductDetailClient({ slug: initialSlug }: { slug: string }) {
  const router = useRouter();
  const { t } = useLocale();
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [related, setRelated] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/productos/${initialSlug}`);
        if (!res.ok) {
          router.push("/productos");
          return;
        }
        const prod: ProductWithCategory = await res.json();
        setProduct(prod);

        // Save to recently viewed
        try {
          const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
          const filtered = viewed.filter((v: { id: string }) => v.id !== prod.id);
          filtered.unshift({ id: prod.id, name: prod.name, slug: prod.slug, price: prod.price, images: prod.images });
          localStorage.setItem("recentlyViewed", JSON.stringify(filtered.slice(0, 12)));
        } catch {}

        if (prod.category?.slug) {
          const relRes = await fetch(`/api/productos?categoria=${prod.category.slug}`);
          const relData: ProductWithCategory[] = await relRes.json();
          setRelated(relData.filter((r) => r.id !== prod.id).slice(0, 3));
        }
      } catch {
        router.push("/productos");
        return;
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [initialSlug, router]);

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
    return <ProductDetailSkeleton />;
  }

  if (!product) return null;

  const images = JSON.parse(product.images || "[]") as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          ...(product.category
            ? [{ label: product.category.name, href: `/productos?categoria=${product.category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <AnimatedSection>
          {images.length > 1 ? (
            <ImageGallery images={images} name={product.name} />
          ) : (
            <div className="flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-light to-brand-accent/10 p-8">
              {images[0] ? (
                <img
                  src={images[0]}
                  alt={product.name}
                  className="max-h-[400px] w-full object-contain"
                />
              ) : (
                <span className="text-6xl font-bold text-brand-accent/30">
                  {product.name.charAt(0)}
                </span>
              )}
            </div>
          )}
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {product.category && (
            <Link
              href={`/productos?categoria=${product.category.slug}`}
              className="inline-block rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-accent transition hover:bg-brand-accent/20"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gradient-primary">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1 text-xs text-gray-400">(0 reseñas)</span>
            </div>
          </div>

          <p className="mt-4 text-3xl font-bold text-brand-primary">
            {formatPrice(Number(product.price))}
          </p>

          <div className="mt-4">
            <StockIndicator stock={product.stock} />
          </div>

          <div className="mt-6">
            <p className="text-base leading-relaxed text-gray-600">
              {product.description}
            </p>
          </div>

          <motion.div
            className="mt-8 flex items-center gap-4"
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={addToCart}
              disabled={product.stock <= 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary-dark disabled:opacity-50"
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
          </motion.div>
        </AnimatedSection>
      </div>

      {related.length > 0 && (
        <AnimatedSection delay={0.2}>
          <section className="mt-20">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              {t("products.relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => {
                const relImages = JSON.parse(rel.images || "[]") as string[];
                return (
                  <motion.div
                    key={rel.id}
                    whileHover={{ y: -4 }}
                  >
                    <Link
                      href={`/productos/${rel.slug}`}
                      className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gradient-to-br from-brand-light to-brand-accent/10">
                        {relImages[0] ? (
                          <Image
                            src={relImages[0]}
                            alt={rel.name}
                            width={200}
                            height={200}
                            className="max-h-36 w-full object-contain transition duration-300 group-hover:scale-105"
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
                  </motion.div>
                );
              })}
            </div>
          </section>
        </AnimatedSection>
      )}
    </div>
  );
}

function Image({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}
