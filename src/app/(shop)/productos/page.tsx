import { supabase } from "@/lib/supabase";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { ProductFilters } from "@/components/productos/ProductFilters";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const { q, categoria } = await searchParams;

  let query = supabase
    .from("Product")
    .select("*, category:Category(*)")
    .eq("published", true);

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,description.ilike.%${q}%`
    );
  }

  if (categoria) {
    const { data: cat } = await supabase
      .from("Category")
      .select("id")
      .eq("slug", categoria)
      .single();
    if (cat) {
      query = query.eq("categoryId", cat.id);
    }
  }

  query = query.order("createdAt", { ascending: false });

  const { data: products } = await query;

  const { data: categories } = await supabase
    .from("Category")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <p className="mt-1 text-gray-500">
          {products?.length || 0}{" "}
          {(products?.length || 0) === 1 ? "producto disponible" : "productos disponibles"}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <ProductFilters
            categories={(categories || []).map((c) => ({
              name: c.name,
              slug: c.slug,
            }))}
          />
        </aside>

        <div className="flex-1">
          <ProductGrid products={products || []} />
        </div>
      </div>
    </div>
  );
}
