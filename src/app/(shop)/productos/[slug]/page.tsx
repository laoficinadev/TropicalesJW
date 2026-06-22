import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/productos/AddToCartButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductoDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.published) notFound();

  const images = JSON.parse(product.images || "[]") as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50">
          {images[0] ? (
            <img
              src={images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-4xl text-emerald-600">
                    {product.name.charAt(0)}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Sin imagen disponible</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          {product.category && (
            <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-600">
              {product.category.name}
            </span>
          )}

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-3 text-3xl font-bold text-emerald-700">
            {formatPrice(product.price)}
          </p>

          <div className="mt-2">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                En stock ({product.stock} disponibles)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-red-500">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Agotado
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-gray-600">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
