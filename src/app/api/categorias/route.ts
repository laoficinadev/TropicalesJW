import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: categories } = await supabase
    .from("Category")
    .select("*")
    .order("name", { ascending: true })
    .limit(50);

  return NextResponse.json(categories || []);
}
