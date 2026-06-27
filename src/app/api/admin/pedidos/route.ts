import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: orders } = await supabase
    .from("Order")
    .select("*, items:OrderItem(*, product:Product(*))")
    .order("createdAt", { ascending: false })
    .limit(50);

  return NextResponse.json(orders || []);
}
