import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");
  const category = searchParams.get("categoria");
  const featured = searchParams.get("destacados");

  let query = supabase
    .from("Product")
    .select("*, category:Category(*)")
    .eq("published", true);

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  if (category) {
    const { data: cat } = await supabase
      .from("Category")
      .select("id")
      .eq("slug", category)
      .single();
    if (cat) {
      query = query.eq("categoryId", cat.id);
    }
  }

  if (featured === "true") {
    query = query.eq("featured", true);
  }

  query = query.order("createdAt", { ascending: false });

  const { data: products } = await query;

  return NextResponse.json(products || []);
}
