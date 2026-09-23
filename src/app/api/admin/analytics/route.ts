import { NextRequest, NextResponse } from "next/server";
import { enforceRbac } from "@/lib/rbac";
import { AilysRepository } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  // Server-side RBAC: Only SUPER_ADMIN can access analytics and statistics
  const authCheck = await enforceRbac(req, "analytics");
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: authCheck.error || "Accès interdit aux statistiques. Privilèges SUPER_ADMIN requis." },
      { status: authCheck.status || 403 }
    );
  }

  try {
    const [orders, returns, products] = await Promise.all([
      AilysRepository.getAllAdminOrders(),
      AilysRepository.getAllAdminReturns(),
      AilysRepository.getProducts(),
    ]);

    const totalRevenue = orders.reduce((sum: number, ord: any) => sum + (ord.total || 0), 0);
    const pendingOrders = orders.filter((o: any) => o.status === "nouveau" || o.status === "en_preparation").length;
    const deliveredOrders = orders.filter((o: any) => o.status === "livre").length;
    const pendingReturns = returns.filter((r: any) => r.status === "en_attente").length;
    const soldOutProducts = products.filter((p: any) => p.isSoldOut || p.stockQuantity === 0).length;

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      deliveredOrders,
      totalReturns: returns.length,
      pendingReturns,
      totalProducts: products.length,
      soldOutProducts,
      ordersByGovernorate: orders.reduce((acc: Record<string, number>, order: any) => {
        const gov = order.governorate || "Autre";
        acc[gov] = (acc[gov] || 0) + 1;
        return acc;
      }, {}),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
