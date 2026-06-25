import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NuevoProductoPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { data: categories } = await supabase
    .from("Category")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Nuevo Producto</h1>
        <p className="text-sm text-gray-500">Agrega un nuevo producto a la tienda</p>
      </div>
      <ProductForm
        categories={(categories || []).map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
