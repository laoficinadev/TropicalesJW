import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const { error } = await supabase
      .from("ContactMessage")
      .insert({
        name: "Newsletter",
        email,
        message: "Suscripción al boletín de noticias",
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la suscripción" },
      { status: 500 }
    );
  }
}
