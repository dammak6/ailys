"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  RotateCcw,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Package,
  Calendar,
  Users,
  Percent,
  Truck,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { AdminSaveButton } from "@/components/admin/AdminSaveButton";
import { useAdminAuth } from "@/lib/admin-auth-context";

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [orders, setOrders] = useState<any[]>([]);
  const [returns, setReturns] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [duration, setDuration] = useState<string>("30d");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (dur: string, start?: string, end?: string) => {
    if (!isSuperAdmin) return;
    try {
      let url = `/api/admin/analytics?duration=${dur}`;
      if (dur === "custom" && start && end) {
        url += `&startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`;
      }
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [ordRes, retRes, prodRes] = await Promise.all([
          fetch("/api/admin/orders", { cache: "no-store" }),
          fetch("/api/admin/returns", { cache: "no-store" }),
          fetch("/api/admin/products", { cache: "no-store" }),
        ]);

        if (ordRes.ok) setOrders(await ordRes.json());
        if (retRes.ok) setReturns(await retRes.json());
        if (prodRes.ok) setProducts(await prodRes.json());

        if (isSuperAdmin) {
          await fetchAnalytics("30d");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isSuperAdmin]);

  const handleDurationChange = (newDur: string) => {
    setDuration(newDur);
    if (newDur !== "custom") {
      fetchAnalytics(newDur);
    }
  };

  const handleApplyCustomDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd) {
      fetchAnalytics("custom", customStart, customEnd);
    }
  };

  const totalRevenue = analytics?.totalRevenue ?? orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "nouveau" || o.status === "en_preparation").length;
  const pendingReturns = returns.filter((r) => r.status === "en_attente").length;
  const soldOutProducts = products.filter((p) => p.isSoldOut || p.stockQuantity === 0).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Greeting */}
      <div className="bg-white border border-[#E8E6DF] p-6 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#0B0B0B]">
            {isSuperAdmin ? "Tableau de Bord Exécutif" : "Tableau de Bord Opérationnel"}
          </h2>
          <p className="text-xs text-[#7A7770] mt-1">
            {isSuperAdmin
              ? "Supervision financière, analyse de performance et gestion de la maison AÏLYS."
              : "Supervision des commandes, logistique Cash on Delivery et gestion du catalogue."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminSaveButton variant="banner" />
          <Link
            href="/admin/products"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-[#F5F3EC] text-xs font-medium uppercase tracking-wider rounded-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#B79A5B]" />
            <span>Nouveau Produit</span>
          </Link>
          <Link
            href="/admin/homepage"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white border border-[#D5D2C9] hover:border-[#B79A5B] text-[#0B0B0B] text-xs font-medium uppercase tracking-wider rounded-sm transition-colors"
          >
            <span>Éditer Homepage</span>
          </Link>
        </div>
      </div>

      {/* DURATION SELECTOR (For Super Admin Analytics) */}
      {isSuperAdmin && (
        <div className="bg-white border border-[#E8E6DF] p-4 rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs font-medium text-[#7A7770]">
            <Calendar className="w-4 h-4 text-[#B79A5B]" />
            <span>Période d&apos;analyse :</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "today", label: "Aujourd'hui" },
              { id: "7d", label: "7 jours" },
              { id: "30d", label: "30 jours" },
              { id: "3m", label: "3 mois" },
              { id: "6m", label: "6 mois" },
              { id: "12m", label: "12 mois" },
              { id: "custom", label: "Personnalisé" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleDurationChange(tab.id)}
                className={`px-3 py-1.5 text-xs rounded-sm transition-colors cursor-pointer ${
                  duration === tab.id
                    ? "bg-[#0B0B0B] text-[#F5F3EC] font-medium"
                    : "bg-[#F5F3EC] text-[#555] hover:bg-[#EAE8E1]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {duration === "custom" && (
            <form onSubmit={handleApplyCustomDates} className="flex items-center gap-2 text-xs">
              <input
                type="date"
                required
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="border border-[#D5D2C9] px-2 py-1 rounded-sm bg-[#FAF9F5]"
              />
              <span className="text-[#7A7770]">à</span>
              <input
                type="date"
                required
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="border border-[#D5D2C9] px-2 py-1 rounded-sm bg-[#FAF9F5]"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-[#B79A5B] text-[#0B0B0B] font-medium rounded-sm hover:bg-[#C8AD6D] cursor-pointer"
              >
                Filtrer
              </button>
            </form>
          )}
        </div>
      )}

      {/* KPI Cards Grid */}
      {isSuperAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Chiffre d'Affaires Brut */}
          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Chiffre d&apos;Affaires Brut
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-[#B79A5B]">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-[#0B0B0B]">
                {Number(totalRevenue).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND
              </span>
              <p className="text-[11px] text-[#7A7770] mt-1 font-medium">
                Hors commandes annulées • COD
              </p>
            </div>
          </div>

          {/* Card 2: Panier Moyen */}
          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Panier Moyen
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-[#B79A5B]">
                <ShoppingBag className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-[#0B0B0B]">
                {Number(analytics?.averageBasket || (orders.length > 0 ? totalRevenue / orders.length : 0)).toFixed(3)} TND
              </span>
              <p className="text-[11px] text-[#7A7770] mt-1 font-medium">
                Par commande validée
              </p>
            </div>
          </div>

          {/* Card 3: Commandes Réalisées */}
          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Commandes Réalisées
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-[#B79A5B]">
                <Package className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-[#0B0B0B]">
                {analytics?.totalOrders ?? orders.length}
              </span>
              <p className="text-[11px] text-[#7A7770] mt-1">
                {pendingOrders} en cours de préparation / transit
              </p>
            </div>
          </div>

          {/* Card 4: Taux de Confirmation */}
          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Taux de Confirmation
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-emerald-700">
                <Percent className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-emerald-800">
                {analytics?.confirmationRate ?? 100}%
              </span>
              <p className="text-[11px] text-[#7A7770] mt-1">
                Commandes confirmées sans annulation
              </p>
            </div>
          </div>

          {/* Card 5: Pièces Vendues */}
          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Pièces Confectionnées
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-[#B79A5B]">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-[#0B0B0B]">
                {analytics?.soldItemsCount ?? orders.reduce((s, o) => s + (o.items?.length || 1), 0)}
              </span>
              <p className="text-[11px] text-[#7A7770] mt-1">
                Articles expédiés ou réservés
              </p>
            </div>
          </div>

          {/* Card 6: Clients Actifs */}
          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Clients Actifs
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-[#B79A5B]">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-[#0B0B0B]">
                {analytics?.activeCustomers ?? new Set(orders.map((o) => o.customerPhone || o.customerName)).size}
              </span>
              <p className="text-[11px] text-[#7A7770] mt-1">
                Comptes clients enregistrés
              </p>
            </div>
          </div>

          {/* Card 7: Taux de Retour / Échange */}
          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Taux de Retour / Échange
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-amber-700">
                <RotateCcw className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-[#0B0B0B]">
                {analytics?.returnRate ?? (orders.length > 0 ? ((returns.length / orders.length) * 100).toFixed(1) : 0)}%
              </span>
              <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />
                <span>{pendingReturns} dossier(s) en attente</span>
              </p>
            </div>
          </div>

          {/* Card 8: Délai Moyen d'Expédition */}
          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Délai Expédition Moyen
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-[#B79A5B]">
                <Truck className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-[#0B0B0B]">
                {analytics?.averageFulfillmentDays ?? 1.5} j
              </span>
              <p className="text-[11px] text-emerald-800 mt-1 font-medium">
                Départ atelier de Sfax sous 24-48h
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Operational KPI Cards for ADMIN */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Catalogue Actif
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-[#B79A5B]">
                <Package className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-[#0B0B0B]">
                {products.length}
              </span>
              <p className="text-[11px] text-[#7A7770] mt-1 font-medium">
                Silhouettes en atelier • Mode Opérationnel
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Commandes Actives
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-[#B79A5B]">
                <ShoppingBag className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-[#0B0B0B]">
                {orders.length}
              </span>
              <p className="text-[11px] text-[#7A7770] mt-1">
                {pendingOrders} en cours de préparation ou livraison
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Retours & Échanges
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-[#B79A5B]">
                <RotateCcw className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-[#0B0B0B]">
                {returns.length}
              </span>
              <p className="text-[11px] text-amber-700 mt-1 flex items-center space-x-1 font-medium">
                <Clock className="w-3 h-3" />
                <span>{pendingReturns} en attente d&apos;instruction</span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
                Alertes Réassort
              </span>
              <span className="p-2 bg-[#F5F3EC] rounded text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl font-light text-[#0B0B0B]">
                {soldOutProducts}
              </span>
              <p className="text-[11px] text-[#7A7770] mt-1">
                Pièces avec notifications réassort actives
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RESTRAINED LUXURY SVG CHARTS (For Super Admin) */}
      {isSuperAdmin && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Revenue Evolution Over Time */}
          <div className="bg-white border border-[#E8E6DF] p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-light text-[#0B0B0B]">
                  Évolution du Chiffre d&apos;Affaires
                </h3>
                <p className="text-[11px] text-[#7A7770]">
                  Trajectoire des ventes sur la période sélectionnée ({duration})
                </p>
              </div>
              <span className="text-xs font-semibold text-[#B79A5B]">
                {Number(totalRevenue).toFixed(3)} TND
              </span>
            </div>

            {/* Pure SVG Line Chart */}
            <div className="h-56 w-full pt-4">
              {analytics.timeSeries && analytics.timeSeries.length > 0 ? (
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#B79A5B" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#B79A5B" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 45, 90, 135].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="500"
                      y2={y}
                      stroke="#E8E6DF"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Generate Path Coordinates */}
                  {(() => {
                    const maxVal = Math.max(...analytics.timeSeries.map((p: any) => p.revenue), 100);
                    const pts = analytics.timeSeries.map((p: any, idx: number) => {
                      const x = (idx / (analytics.timeSeries.length - 1 || 1)) * 480 + 10;
                      const y = 140 - (p.revenue / maxVal) * 120;
                      return { x, y, ...p };
                    });

                    const lineD = pts.reduce((acc: string, pt: any, i: number) => {
                      return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
                    }, "");

                    const areaD = `${lineD} L ${pts[pts.length - 1].x},140 L ${pts[0].x},140 Z`;

                    return (
                      <>
                        <path d={areaD} fill="url(#goldGradient)" />
                        <path d={lineD} fill="none" stroke="#B79A5B" strokeWidth="2.5" />
                        {pts.map((pt: any, idx: number) => (
                          <g key={idx}>
                            <circle cx={pt.x} cy={pt.y} r="3.5" fill="#0B0B0B" stroke="#B79A5B" strokeWidth="2" />
                            <text
                              x={pt.x}
                              y="165"
                              textAnchor="middle"
                              fontSize="9"
                              fill="#7A7770"
                              fontFamily="sans-serif"
                            >
                              {pt.label}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-[#7A7770]">
                  Aucune donnée chronologique sur cette période.
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Status Breakdown & Regional Repartition */}
          <div className="bg-white border border-[#E8E6DF] p-6 rounded-sm space-y-5">
            <div>
              <h3 className="font-serif text-base font-light text-[#0B0B0B]">
                Statuts Logistiques & Distribution
              </h3>
              <p className="text-[11px] text-[#7A7770]">
                Répartition des commandes COD par statut et gouvernorat
              </p>
            </div>

            {/* Status Bars */}
            <div className="space-y-3">
              {[
                { key: "nouveau", label: "Nouvelle / À Confirmer", count: analytics.statusCounts?.nouveau || 0, color: "bg-amber-400" },
                { key: "confirme", label: "Confirmée", count: analytics.statusCounts?.confirme || 0, color: "bg-emerald-500" },
                { key: "en_preparation", label: "En Préparation Atelier", count: analytics.statusCounts?.en_preparation || 0, color: "bg-blue-500" },
                { key: "en_transit", label: "En Livraison", count: analytics.statusCounts?.en_transit || 0, color: "bg-purple-500" },
                { key: "livre", label: "Livrée & Encaissée", count: analytics.statusCounts?.livre || 0, color: "bg-emerald-800" },
                { key: "annule", label: "Annulée", count: analytics.statusCounts?.annule || 0, color: "bg-red-400" },
              ].map((st) => {
                const total = analytics.totalOrders || 1;
                const pct = Math.round((st.count / total) * 100);
                return (
                  <div key={st.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#0B0B0B] font-medium">{st.label}</span>
                      <span className="text-[#7A7770]">
                        {st.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F5F3EC] rounded-full overflow-hidden">
                      <div className={`h-full ${st.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Regional breakdown pills */}
            <div className="pt-3 border-t border-[#E8E6DF]">
              <span className="text-[10px] uppercase tracking-wider text-[#7A7770] font-semibold block mb-2">
                Gouvernorats Actifs :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(analytics.ordersByGovernorate || {}).map(([gov, count]: [string, any]) => (
                  <span
                    key={gov}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF9F5] border border-[#E8E6DF] rounded-xs text-xs text-[#0B0B0B]"
                  >
                    <MapPin className="w-3 h-3 text-[#B79A5B]" />
                    <span>{gov} : <strong>{count}</strong></span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Recent Orders & Returns Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E8E6DF] rounded-sm p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
            <div>
              <h3 className="font-serif text-lg font-light text-[#0B0B0B]">
                Commandes Récentes
              </h3>
              <p className="text-xs text-[#7A7770]">
                Livraisons Cash on Delivery avec coordonnées clients tunisiens
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-wider text-[#B79A5B] hover:underline flex items-center space-x-1"
            >
              <span>Voir tout</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E6DF] text-[#7A7770] uppercase tracking-wider text-[11px]">
                  <th className="py-3 font-medium">Code</th>
                  <th className="py-3 font-medium">Client & Gouvernorat</th>
                  <th className="py-3 font-medium">Articles</th>
                  {isSuperAdmin && <th className="py-3 font-medium">Total (TND)</th>}
                  <th className="py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEB]">
                {orders.length > 0 ? (
                  orders.map((ord) => (
                    <tr key={ord.id || ord.orderCode} className="hover:bg-[#FBFBF9] transition-colors">
                      <td className="py-3 font-mono font-medium text-[#0B0B0B]">
                        {ord.orderCode}
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-[#0B0B0B]">{ord.customerName}</div>
                        <div className="text-[11px] text-[#7A7770]">
                          {ord.governorate} • {ord.customerPhone}
                        </div>
                      </td>
                      <td className="py-3 text-[#555]">
                        {ord.items?.length || 1} pièce(s)
                      </td>
                      {isSuperAdmin && (
                        <td className="py-3 font-serif font-medium text-[#0B0B0B]">
                          {Number(ord.total).toFixed(3)} TND
                        </td>
                      )}
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider rounded font-medium ${
                            ord.status === "confirme"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : ord.status === "en_preparation"
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : ord.status === "en_livraison"
                              ? "bg-purple-50 text-purple-800 border border-purple-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#7A7770]">
                      Aucune commande enregistrée pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Returns Review & Operational Status */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E8E6DF] rounded-sm p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <h3 className="font-serif text-lg font-light text-[#0B0B0B]">
                Retours en Attente
              </h3>
              <Link
                href="/admin/returns"
                className="text-xs uppercase tracking-wider text-[#B79A5B] hover:underline"
              >
                Gérer
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {returns.length > 0 ? (
                returns.map((ret) => (
                  <div
                    key={ret.id || ret.requestCode}
                    className="p-3 bg-[#FBFBF9] border border-[#E8E6DF] rounded-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[#0B0B0B]">
                        {ret.requestCode}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-[#EAE8E1] text-[#4A4740] rounded">
                        {ret.type}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#0B0B0B] mt-1">
                      {ret.customerName}
                    </p>
                    <p className="text-[11px] text-[#7A7770]">
                      Raison: {ret.reason}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#7A7770] py-4 text-center">
                  Aucune demande de retour en attente.
                </p>
              )}
            </div>
          </div>

          {/* Quick System Integrity Status */}
          <div className="bg-[#0B0B0B] text-[#F5F3EC] p-6 rounded-sm border border-[#1E1E1E]">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#B79A5B] font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Système Opérationnel</span>
            </div>
            <p className="text-xs text-[#A3A099] mt-2 leading-relaxed">
              Base de données synchronisée. RLS et sécurité par jetons actifs. Les commandes passées sur la boutique sont enregistrées immédiatement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
