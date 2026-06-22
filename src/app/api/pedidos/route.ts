import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.customerName ||
      !body.customerEmail ||
      !body.items ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone || null,
        customerNotes: body.customerNotes || null,
        shippingAddress: body.shippingAddress || null,
        total: body.total,
        status: "PENDING",
        items: {
          create: body.items.map(
            (item: { productId: string; price: number; quantity: number }) => ({
              productId: item.productId,
              price: item.price,
              quantity: item.quantity,
            })
          ),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}
