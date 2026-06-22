import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { ProductFilters } from "@/components/productos/ProductFilters";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const { q, categoria } = await searchParams;

  const where: Record<string, unknown> = { published: true };

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (categoria) {
    where.category = { slug: categoria };
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <p className="mt-1 text-gray-500">
          {products.length}{" "}
          {products.length === 1 ? "producto disponible" : "productos disponibles"}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <ProductFilters
            categories={categories.map((c) => ({
              name: c.name,
              slug: c.slug,
            }))}
          />
        </aside>

        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
