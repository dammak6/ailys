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
} from "lucide-react";
import { AdminSaveButton } from "@/components/admin/AdminSaveButton";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [returns, setReturns] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "nouveau" || o.status === "en_preparation").length;
  const pendingReturns = returns.filter((r) => r.status === "en_attente").length;
  const soldOutProducts = products.filter((p) => p.isSoldOut || p.stockQuantity === 0).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Greeting */}
      <div className="bg-white border border-[#E8E6DF] p-6 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#0B0B0B]">
            Tableau de Bord Exécutif
          </h2>
          <p className="text-xs text-[#7A7770] mt-1">
            Supervision des ventes, logistique Cash on Delivery et gestion des pièces de collection.
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white border border-[#E8E6DF] p-5 rounded-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#7A7770]">
              Chiffre d'Affaires COD
            </span>
            <span className="p-2 bg-[#F5F3EC] rounded text-[#B79A5B]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <span className="font-serif text-3xl font-light text-[#0B0B0B]">
              {totalRevenue.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND
            </span>
            <p className="text-[11px] text-[#7A7770] mt-1 flex items-center space-x-1 font-medium">
              <span>{orders.length} commande(s)</span>
              <span>• Toutes livraisons COD</span>
            </p>
          </div>
        </div>

        {/* Orders in Fulfillment */}
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

        {/* Pending Returns & Exchanges */}
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
              <span>{pendingReturns} en attente d'instruction</span>
            </p>
          </div>
        </div>

        {/* Sold Out / Low Stock */}
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
                  <th className="py-3 font-medium">Total (TND)</th>
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
                      <td className="py-3 font-serif font-medium text-[#0B0B0B]">
                        {Number(ord.total).toFixed(3)} TND
                      </td>
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
