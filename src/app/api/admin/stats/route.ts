import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { count: totalProducts } = await supabase
    .from("Product")
    .select("*", { count: "exact", head: true });

  const { data: ordersByStatus } = await supabase
    .from("Order")
    .select("status, total");

  const totalOrders = ordersByStatus?.length || 0;
  const statusCounts: Record<string, number> = {};
  let totalRevenue = 0;

  for (const order of ordersByStatus || []) {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    if (order.status === "DELIVERED" || order.status === "SHIPPED") {
      totalRevenue += Number(order.total) || 0;
    }
  }

  const { data: recentOrders } = await supabase
    .from("Order")
    .select("id, customerName, total, status, createdAt")
    .order("createdAt", { ascending: false })
    .limit(5);

  const { data: topProducts } = await supabase
    .from("OrderItem")
    .select("name, quantity")
    .limit(50);

  const productSales: Record<string, number> = {};
  for (const item of topProducts || []) {
    productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
  }

  const top5 = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, sold]) => ({ name, sold }));

  return NextResponse.json({
    totalProducts: totalProducts || 0,
    totalOrders,
    totalRevenue,
    statusCounts,
    recentOrders: recentOrders || [],
    topProducts: top5,
  });
}