import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
    const order = await prisma.order.update({
      where: { id },
      data: { status: body.status },
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar pedido" },
      { status: 400 }
    );
  }
}
