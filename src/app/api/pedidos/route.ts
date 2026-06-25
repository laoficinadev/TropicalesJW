import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await auth();

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

    const orderData: Record<string, unknown> = {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone || null,
      customerNotes: body.customerNotes || null,
      shippingAddress: body.shippingAddress || null,
      total: body.total,
      status: "PENDING",
    };

    if (session?.user?.id) {
      orderData.userId = session.user.id;
    }

    const { data: order, error: orderError } = await supabase
      .from("Order")
      .insert(orderData)
      .select()
      .single();

    if (orderError) throw orderError;

    const items = body.items.map(
      (item: { productId: string; price: number; quantity: number }) => ({
        orderId: order.id,
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
      })
    );

    const { error: itemsError } = await supabase
      .from("OrderItem")
      .insert(items);

    if (itemsError) throw itemsError;

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}
