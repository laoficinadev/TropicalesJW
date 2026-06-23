import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { data: order, error } = await supabase
      .from("Order")
      .update({ status: body.status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar pedido" },
      { status: 400 }
    );
  }
}
