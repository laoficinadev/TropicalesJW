import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: order } = await supabase
    .from("Order")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  const { data: items } = await supabase
    .from("OrderItem")
    .select("*, product:Product(name)")
    .eq("orderId", id);

  return NextResponse.json({ ...order, items: items || [] });
}
