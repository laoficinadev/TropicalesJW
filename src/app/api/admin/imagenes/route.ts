import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL requerida" }, { status: 400 });
    }

    const path = url.split("/").pop();
    if (!path) throw new Error("Invalid path");

    const { error } = await supabase.storage
      .from("product-images")
      .remove([path]);

    if (error) throw error;

    return NextResponse.json({ message: "Imagen eliminada" });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar imagen" },
      { status: 400 }
    );
  }
}