import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { ProductForm } from "@/components/admin/ProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  const { data: product } = await supabase
    .from("Product")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const { data: categories } = await supabase
    .from("Category")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Editar Producto</h1>
        <p className="text-sm text-gray-500">{product.name}</p>
      </div>
      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
          published: product.published,
          featured: product.featured,
          categoryId: product.categoryId,
          images: product.images,
        }}
        categories={(categories || []).map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
