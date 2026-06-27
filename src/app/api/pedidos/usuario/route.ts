import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: orders, error } = await supabase
    .from("Order")
    .select("*, orderItems:OrderItem(*)")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: "Error al cargar pedidos" }, { status: 500 });
  }

  return NextResponse.json(orders || []);
}
