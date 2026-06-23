import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: categories } = await supabase
    .from("Category")
    .select("*")
    .order("name", { ascending: true });

  return NextResponse.json(categories || []);
}
