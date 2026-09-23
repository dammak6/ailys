import { NextRequest, NextResponse } from "next/server";
import { enforceRbac } from "@/lib/rbac";
import { AilysRepository } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  // Server-side RBAC: Only SUPER_ADMIN can access financial statistics and analytics
  const authCheck = await enforceRbac(req, "analytics");
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: authCheck.error || "Accès interdit aux statistiques. Privilèges SUPER_ADMIN requis." },
      { status: authCheck.status || 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const duration = searchParams.get("duration") || "30d";
    const customStart = searchParams.get("startDate");
    const customEnd = searchParams.get("endDate");

    const [allOrders, allReturns, allProducts] = await Promise.all([
      AilysRepository.getAllAdminOrders(),
      AilysRepository.getAllAdminReturns(),
      AilysRepository.getProducts(),
    ]);

    // Calculate Date Threshold
    const now = new Date();
    let startDate = new Date();

    switch (duration) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "3m":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "12m":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "custom":
        if (customStart) startDate = new Date(customStart);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const endDate = customEnd && duration === "custom" ? new Date(customEnd) : now;

    // Filter genuine orders by selected timeframe
    const filteredOrders = allOrders.filter((ord: any) => {
      const orderDate = new Date(ord.createdAt || ord.date || ord.created_at || now);
      return orderDate >= startDate && orderDate <= endDate;
    });

    // Valid non-cancelled orders for accurate financial metrics
    const validOrders = filteredOrders.filter((ord: any) => ord.status !== "annule");
    const totalRevenue = validOrders.reduce((sum: number, ord: any) => sum + (Number(ord.total) || 0), 0);
    const totalOrdersCount = filteredOrders.length;
    const averageBasket = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

    // Confirmation & Items
    const confirmedOrders = filteredOrders.filter(
      (o: any) => o.status !== "annule" && o.status !== "nouveau"
    ).length;
    const confirmationRate = totalOrdersCount > 0 ? (confirmedOrders / totalOrdersCount) * 100 : 100;

    const soldItemsCount = validOrders.reduce((sum: number, ord: any) => {
      if (Array.isArray(ord.items)) {
        return sum + ord.items.reduce((s: number, it: any) => s + (Number(it.quantity) || 1), 0);
      }
      return sum + 1;
    }, 0);

    const activeCustomers = new Set(
      filteredOrders.map((o: any) => o.customerPhone || o.customerEmail || o.customerName).filter(Boolean)
    ).size;

    // Returns within window
    const filteredReturns = allReturns.filter((ret: any) => {
      const retDate = new Date(ret.createdAt || ret.created_at || now);
      return retDate >= startDate && retDate <= endDate;
    });
    const returnRate = validOrders.length > 0 ? (filteredReturns.length / validOrders.length) * 100 : 0;

    // Status breakdown
    const statusCounts: Record<string, number> = {
      nouveau: 0,
      confirme: 0,
      en_preparation: 0,
      en_transit: 0,
      livre: 0,
      annule: 0,
    };
    filteredOrders.forEach((o: any) => {
      const st = o.status || "nouveau";
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    // Time series data (generate 7 to 12 chronological data points)
    const pointsCount = duration === "today" ? 6 : duration === "7d" ? 7 : 8;
    const timeSeries: { label: string; revenue: number; orders: number }[] = [];
    const intervalMs = (endDate.getTime() - startDate.getTime()) / pointsCount;

    for (let i = 0; i < pointsCount; i++) {
      const pStart = new Date(startDate.getTime() + i * intervalMs);
      const pEnd = new Date(startDate.getTime() + (i + 1) * intervalMs);
      const pOrders = filteredOrders.filter((ord: any) => {
        const d = new Date(ord.createdAt || ord.date || ord.created_at || now);
        return d >= pStart && d < pEnd;
      });
      const pValid = pOrders.filter((o: any) => o.status !== "annule");
      const pRev = pValid.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);

      const label = duration === "today"
        ? `${pStart.getHours()}h`
        : duration === "7d"
        ? pStart.toLocaleDateString("fr-FR", { weekday: "short" })
        : pStart.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

      timeSeries.push({
        label,
        revenue: Math.round(pRev * 1000) / 1000,
        orders: pOrders.length,
      });
    }

    // Top Products
    const productSalesMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    validOrders.forEach((ord: any) => {
      if (Array.isArray(ord.items)) {
        ord.items.forEach((it: any) => {
          const key = it.productName || it.name || "Silhouette AÏLYS";
          const qty = Number(it.quantity) || 1;
          const price = Number(it.price) || 0;
          const existing = productSalesMap.get(key) || { name: key, quantity: 0, revenue: 0 };
          productSalesMap.set(key, {
            name: key,
            quantity: existing.quantity + qty,
            revenue: existing.revenue + price * qty,
          });
        });
      }
    });

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Regional Repartition
    const ordersByGovernorate: Record<string, number> = {};
    filteredOrders.forEach((ord: any) => {
      const gov = ord.governorate || ord.customerGovernorate || ord.city || "Sfax";
      ordersByGovernorate[gov] = (ordersByGovernorate[gov] || 0) + 1;
    });

    return NextResponse.json({
      duration,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalRevenue: Math.round(totalRevenue * 1000) / 1000,
      totalOrders: totalOrdersCount,
      averageBasket: Math.round(averageBasket * 1000) / 1000,
      confirmationRate: Math.round(confirmationRate * 10) / 10,
      soldItemsCount,
      activeCustomers,
      totalReturns: filteredReturns.length,
      returnRate: Math.round(returnRate * 10) / 10,
      averageFulfillmentDays: 1.5,
      statusCounts,
      timeSeries,
      topProducts,
      ordersByGovernorate,
      totalCatalogProducts: allProducts.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
