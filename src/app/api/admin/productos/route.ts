import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: products } = await supabase
    .from("Product")
    .select("*, category:Category(*)")
    .order("createdAt", { ascending: false });

  return NextResponse.json(products || []);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { data: product, error } = await supabase
      .from("Product")
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: parseFloat(body.price),
        images: JSON.stringify(body.images || []),
        stock: parseInt(body.stock) || 0,
        published: body.published ?? false,
        featured: body.featured ?? false,
        categoryId: body.categoryId || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 400 }
    );
  }
}
