import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
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
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: parseFloat(body.price),
        images: JSON.stringify(body.images || []),
        stock: parseInt(body.stock) || 0,
        published: body.published ?? false,
        featured: body.featured ?? false,
        categoryId: body.categoryId || null,
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Producto eliminado" });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 400 }
    );
  }
}
