import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: messages } = await supabase
    .from("ContactMessage")
    .select("*")
    .order("createdAt", { ascending: false });

  return NextResponse.json(messages || []);
}
