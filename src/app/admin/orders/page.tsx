"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Eye,
  ShoppingBag,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  X,
  FileText,
  Edit,
  Download,
  Lock,
  History,
  AlertCircle,
  Loader2,
  User,
  List,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

export default function AdminOrdersPage() {
  const { user } = useAdminAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"orders" | "customers" | "products">("orders");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Invoice state for selected order
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any | null>(null);

  // Edit order modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Edit history
  const [editHistory, setEditHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error("Orders error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // When selected order changes, load invoice info and edit history
  useEffect(() => {
    if (!selectedOrder) {
      setInvoiceData(null);
      setEditHistory([]);
      return;
    }

    // Fetch invoice info
    const checkInvoice = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${selectedOrder.id}/invoice`);
        if (res.ok) {
          const json = await res.json();
          setInvoiceData(json.invoice);
        } else {
          setInvoiceData(null);
        }
      } catch {
        setInvoiceData(null);
      }
    };

    // Fetch edit history
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await fetch(`/api/admin/orders/${selectedOrder.id}/edit`);
        if (res.ok) {
          const json = await res.json();
          setEditHistory(json.history || []);
        }
      } catch (err) {
        console.error("Failed to load edit history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    checkInvoice();
    fetchHistory();
  }, [selectedOrder?.id]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (res.ok) {
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        fetchOrders();
      }
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedOrder) return;
    setInvoiceLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceRegenerate: false }),
      });

      if (res.ok) {
        const json = await res.json();
        setInvoiceData(json.invoice);
        // Open download link
        window.open(`/api/admin/orders/${selectedOrder.id}/invoice?download=1`, "_blank");
      } else {
        const json = await res.json();
        alert(json.error || "Erreur lors de la génération de la facture");
      }
    } catch (err: any) {
      alert(err.message || "Erreur réseau");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const openEditModal = () => {
    if (!selectedOrder) return;
    setEditFormData({
      customerName: selectedOrder.customerName || "",
      customerPhone: selectedOrder.customerPhone || "",
      governorate: selectedOrder.governorate || "",
      city: selectedOrder.city || "",
      address: selectedOrder.address || "",
      deliveryNotes: selectedOrder.notes || "",
      courierNotes: selectedOrder.courierNotes || "",
      reason: "Modification opérationnelle",
      items: (selectedOrder.items || []).map((it: any) => ({
        order_item_id: it.id,
        productName: it.productName,
        size: it.size,
        color: it.color,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      })),
    });
    setEditError(null);
    setEditSuccess(null);
    setIsEditModalOpen(true);
  };

  const handleItemQtyChange = (idx: number, delta: number) => {
    const updated = [...editFormData.items];
    const newQty = (updated[idx].quantity || 1) + delta;
    if (newQty < 1) return;
    updated[idx].quantity = newQty;
    setEditFormData({ ...editFormData, items: updated });
  };

  const handleSaveOrderEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: editFormData.customerName,
          customerPhone: editFormData.customerPhone,
          governorate: editFormData.governorate,
          city: editFormData.city,
          address: editFormData.address,
          deliveryNotes: editFormData.deliveryNotes,
          courierNotes: editFormData.courierNotes,
          reason: editFormData.reason,
          items: editFormData.items.map((it: any) => ({
            order_item_id: it.order_item_id,
            quantity: it.quantity,
          })),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Erreur lors de la modification de la commande");
      }

      setEditSuccess("Commande modifiée avec succès !");
      await fetchOrders();

      // Refresh selected order
      setSelectedOrder((prev: any) => ({
        ...prev,
        customerName: editFormData.customerName,
        customerPhone: editFormData.customerPhone,
        governorate: editFormData.governorate,
        city: editFormData.city,
        address: editFormData.address,
        notes: editFormData.deliveryNotes,
        subtotal: json.subtotal ?? prev.subtotal,
        shippingFee: json.shippingFee ?? prev.shippingFee,
        total: json.total ?? prev.total,
        items: prev.items.map((orig: any) => {
          const edited = editFormData.items.find((ei: any) => ei.order_item_id === orig.id);
          return edited ? { ...orig, quantity: edited.quantity } : orig;
        }),
      }));

      // Refresh edit history
      const histRes = await fetch(`/api/admin/orders/${selectedOrder.id}/edit`);
      if (histRes.ok) {
        const hJson = await histRes.json();
        setEditHistory(hJson.history || []);
      }

      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 1200);
    } catch (err: any) {
      setEditError(err.message || "Erreur inattendue");
    } finally {
      setEditLoading(false);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderCode?.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerPhone?.includes(search);
    const matchesStatus =
      statusFilter === "all" || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Grouped by Customer (Safe: financial metrics accessible only to SUPER_ADMIN)
  const customerGroups = React.useMemo(() => {
    const map = new Map<string, {
      key: string;
      name: string;
      phone: string;
      governorate: string;
      city: string;
      orders: any[];
      totalSpent: number;
    }>();

    filteredOrders.forEach((ord) => {
      const key = (ord.customerPhone || ord.customerName || "Inconnu").trim();
      const existing = map.get(key) || {
        key,
        name: ord.customerName || "Client AÏLYS",
        phone: ord.customerPhone || "—",
        governorate: ord.governorate || "—",
        city: ord.city || "—",
        orders: [] as any[],
        totalSpent: 0,
      };
      existing.orders.push(ord);
      if (ord.status !== "annule") {
        existing.totalSpent += Number(ord.total) || 0;
      }
      map.set(key, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.orders.length - a.orders.length);
  }, [filteredOrders]);

  // Grouped by Product (Safe: revenue accessible only to SUPER_ADMIN)
  const productGroups = React.useMemo(() => {
    const map = new Map<string, {
      key: string;
      name: string;
      totalUnits: number;
      totalRevenue: number;
      variants: { size: string; color: string; count: number }[];
      orders: { order: any; quantity: number }[];
    }>();

    filteredOrders.forEach((ord) => {
      if (Array.isArray(ord.items)) {
        ord.items.forEach((it: any) => {
          const key = it.productName || it.name || "Silhouette AÏLYS";
          const existing = map.get(key) || {
            key,
            name: key,
            totalUnits: 0,
            totalRevenue: 0,
            variants: [] as { size: string; color: string; count: number }[],
            orders: [] as { order: any; quantity: number }[],
          };
          const qty = Number(it.quantity) || 1;
          const price = Number(it.price) || 0;
          existing.totalUnits += qty;
          if (ord.status !== "annule") {
            existing.totalRevenue += price * qty;
          }

          const vKey = `${it.size || "—"} / ${it.color || "—"}`;
          const existingV = existing.variants.find((v) => `${v.size} / ${v.color}` === vKey);
          if (existingV) {
            existingV.count += qty;
          } else {
            existing.variants.push({ size: it.size || "—", color: it.color || "—", count: qty });
          }

          existing.orders.push({ order: ord, quantity: qty });
          map.set(key, existing);
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalUnits - a.totalUnits);
  }, [filteredOrders]);

  const isOrderEditable = (status: string) => {
    return ["nouveau", "confirme", "en_preparation"].includes(status);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "nouveau":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] uppercase font-semibold">
            <Clock className="w-3 h-3" />
            <span>Nouveau</span>
          </span>
        );
      case "confirme":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[10px] uppercase font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>Confirmé</span>
          </span>
        );
      case "en_preparation":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded text-[10px] uppercase font-semibold">
            <ShoppingBag className="w-3 h-3" />
            <span>En Préparation</span>
          </span>
        );
      case "en_livraison":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded text-[10px] uppercase font-semibold">
            <Truck className="w-3 h-3" />
            <span>En Livraison</span>
          </span>
        );
      case "livre":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] uppercase font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>Livré (Encaissé)</span>
          </span>
        );
      case "annule":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded text-[10px] uppercase font-semibold">
            <XCircle className="w-3 h-3" />
            <span>Annulé</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="font-serif text-2xl font-light text-[#0B0B0B]">
          Gestion des Commandes & Expéditions
        </h2>
        <p className="text-xs text-[#7A7770] mt-0.5">
          Suivi logistique, coordination des coursiers, facturation officielle et encaissement Cash on Delivery.
        </p>
      </div>

      {/* VIEW MODE SWITCHER TABS */}
      <div className="flex items-center space-x-2 border-b border-[#E8E6DF] pb-3">
        <button
          type="button"
          onClick={() => setViewMode("orders")}
          className={`inline-flex items-center space-x-2 px-3.5 py-2 text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
            viewMode === "orders"
              ? "bg-[#0B0B0B] text-[#F5F3EC] font-medium"
              : "bg-[#F5F3EC] text-[#555] hover:bg-[#EAE8E1]"
          }`}
        >
          <List className="w-3.5 h-3.5 text-[#B79A5B]" />
          <span>Vue par Commande</span>
          <span className="text-[10px] opacity-75 font-mono">({filteredOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode("customers")}
          className={`inline-flex items-center space-x-2 px-3.5 py-2 text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
            viewMode === "customers"
              ? "bg-[#0B0B0B] text-[#F5F3EC] font-medium"
              : "bg-[#F5F3EC] text-[#555] hover:bg-[#EAE8E1]"
          }`}
        >
          <User className="w-3.5 h-3.5 text-[#B79A5B]" />
          <span>Vue par Client</span>
          <span className="text-[10px] opacity-75 font-mono">({customerGroups.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode("products")}
          className={`inline-flex items-center space-x-2 px-3.5 py-2 text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
            viewMode === "products"
              ? "bg-[#0B0B0B] text-[#F5F3EC] font-medium"
              : "bg-[#F5F3EC] text-[#555] hover:bg-[#EAE8E1]"
          }`}
        >
          <Package className="w-3.5 h-3.5 text-[#B79A5B]" />
          <span>Vue par Produit</span>
          <span className="text-[10px] opacity-75 font-mono">({productGroups.length})</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E8E6DF] p-4 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              viewMode === "customers"
                ? "Rechercher par nom de client ou téléphone..."
                : viewMode === "products"
                ? "Rechercher par nom de silhouette..."
                : "Code commande, client ou téléphone..."
            }
            className="w-full bg-[#FBFBF9] border border-[#D5D2C9] text-xs py-2 pl-9 pr-4 rounded-sm outline-none focus:border-[#B79A5B]"
          />
          <Search className="w-3.5 h-3.5 text-[#7A7770] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
          {[
            { key: "all", label: "Toutes" },
            { key: "nouveau", label: "Nouvelles" },
            { key: "confirme", label: "Confirmées" },
            { key: "en_preparation", label: "Préparation" },
            { key: "en_livraison", label: "En Cours" },
            { key: "livre", label: "Livrées" },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key)}
              className={`text-xs px-2.5 py-1.5 rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st.key
                  ? "bg-[#B79A5B] text-[#0B0B0B] font-semibold"
                  : "bg-[#F5F3EC] text-[#555] hover:bg-[#EAE8E1]"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. VUE PAR COMMANDE */}
      {viewMode === "orders" && (
        <div className="bg-white border border-[#E8E6DF] rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E8E6DF] text-[#7A7770] uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-medium">Commande</th>
                  <th className="py-3 px-4 font-medium">Client & Contact</th>
                  <th className="py-3 px-4 font-medium">Destination</th>
                  <th className="py-3 px-4 font-medium">Articles</th>
                  <th className="py-3 px-4 font-medium">Montant COD</th>
                  <th className="py-3 px-4 font-medium">Statut</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6DF]">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id || ord.orderCode} className="hover:bg-[#FBFBF9] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#0B0B0B]">
                        {ord.orderCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#0B0B0B]">{ord.customerName}</div>
                        <div className="text-[11px] text-[#7A7770] flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-[#B79A5B]" />
                          <span>{ord.customerPhone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#444]">{ord.governorate}</div>
                        <div className="text-[11px] text-[#7A7770] truncate max-w-xs">
                          {ord.city}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#555]">
                        {ord.items?.length || 1} pièce(s)
                      </td>
                      <td className="py-3 px-4 font-serif font-medium text-sm text-[#0B0B0B]">
                        {Number(ord.total).toFixed(3)} TND
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(ord.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#F5F3EC] hover:bg-[#EAE8E1] text-[#0B0B0B] rounded-sm text-xs font-medium cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Examiner</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#7A7770]">
                      Aucune commande enregistrée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. VUE PAR CLIENT */}
      {viewMode === "customers" && (
        <div className="bg-white border border-[#E8E6DF] rounded-sm overflow-hidden space-y-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E8E6DF] text-[#7A7770] uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-medium">Client AÏLYS</th>
                  <th className="py-3 px-4 font-medium">Contact</th>
                  <th className="py-3 px-4 font-medium">Gouvernorat</th>
                  <th className="py-3 px-4 font-medium">Commandes</th>
                  {isSuperAdmin && <th className="py-3 px-4 font-medium">Dépense Totale (TND)</th>}
                  <th className="py-3 px-4 font-medium text-right">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6DF]">
                {customerGroups.length > 0 ? (
                  customerGroups.map((c) => (
                    <React.Fragment key={c.key}>
                      <tr className="hover:bg-[#FBFBF9] transition-colors">
                        <td className="py-3 px-4 font-medium text-[#0B0B0B]">
                          {c.name}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-[11px] text-[#7A7770] flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-[#B79A5B]" />
                            <span>{c.phone}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#444]">
                          {c.governorate} {c.city ? `(${c.city})` : ""}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 bg-[#FAF9F5] border border-[#E8E6DF] rounded text-xs font-semibold text-[#0B0B0B]">
                            {c.orders.length} commande(s)
                          </span>
                        </td>
                        {isSuperAdmin && (
                          <td className="py-3 px-4 font-serif font-medium text-sm text-[#0B0B0B]">
                            {Number(c.totalSpent).toFixed(3)} TND
                          </td>
                        )}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setExpandedCustomer(expandedCustomer === c.key ? null : c.key)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#F5F3EC] hover:bg-[#EAE8E1] text-[#0B0B0B] rounded-sm text-xs cursor-pointer"
                          >
                            <span>{expandedCustomer === c.key ? "Masquer" : "Historique"}</span>
                            {expandedCustomer === c.key ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Orders Drawer for this customer */}
                      {expandedCustomer === c.key && (
                        <tr>
                          <td colSpan={isSuperAdmin ? 6 : 5} className="bg-[#FAF9F5] p-4 border-b border-[#E8E6DF]">
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase tracking-wider text-[#7A7770] font-semibold block">
                                Historique des Commandes de {c.name} :
                              </span>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {c.orders.map((ord: any) => (
                                  <div
                                    key={ord.id || ord.orderCode}
                                    onClick={() => setSelectedOrder(ord)}
                                    className="p-3 bg-white border border-[#E8E6DF] rounded hover:border-[#B79A5B] transition-colors cursor-pointer space-y-1"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-mono text-xs font-semibold text-[#0B0B0B]">
                                        {ord.orderCode}
                                      </span>
                                      {getStatusBadge(ord.status)}
                                    </div>
                                    <div className="text-[11px] text-[#7A7770]">
                                      {ord.items?.length || 1} article(s)
                                      {isSuperAdmin ? ` • ${Number(ord.total).toFixed(3)} TND` : ""}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isSuperAdmin ? 6 : 5} className="py-12 text-center text-[#7A7770]">
                      Aucun client trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. VUE PAR PRODUIT */}
      {viewMode === "products" && (
        <div className="bg-white border border-[#E8E6DF] rounded-sm overflow-hidden space-y-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E8E6DF] text-[#7A7770] uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-medium">Silhouette / Modèle</th>
                  <th className="py-3 px-4 font-medium">Unités Commandées</th>
                  <th className="py-3 px-4 font-medium">Répartition Tailles & Couleurs</th>
                  {isSuperAdmin && <th className="py-3 px-4 font-medium">Chiffre d&apos;Affaires (TND)</th>}
                  <th className="py-3 px-4 font-medium text-right">Commandes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6DF]">
                {productGroups.length > 0 ? (
                  productGroups.map((p) => (
                    <React.Fragment key={p.key}>
                      <tr className="hover:bg-[#FBFBF9] transition-colors">
                        <td className="py-3 px-4 font-serif font-medium text-sm text-[#0B0B0B]">
                          {p.name}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-0.5 bg-[#FAF9F5] border border-[#E8E6DF] rounded text-xs font-semibold text-[#0B0B0B]">
                            {p.totalUnits} pièce(s)
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {p.variants.map((v, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-1.5 py-0.5 bg-[#F5F3EC] text-[#0B0B0B] rounded text-[10px]"
                              >
                                T.{v.size} ({v.count})
                              </span>
                            ))}
                          </div>
                        </td>
                        {isSuperAdmin && (
                          <td className="py-3 px-4 font-serif font-medium text-sm text-[#0B0B0B]">
                            {Number(p.totalRevenue).toFixed(3)} TND
                          </td>
                        )}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setExpandedProduct(expandedProduct === p.key ? null : p.key)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#F5F3EC] hover:bg-[#EAE8E1] text-[#0B0B0B] rounded-sm text-xs cursor-pointer"
                          >
                            <span>{expandedProduct === p.key ? "Masquer" : "Voir flux"}</span>
                            {expandedProduct === p.key ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded orders for this product */}
                      {expandedProduct === p.key && (
                        <tr>
                          <td colSpan={isSuperAdmin ? 5 : 4} className="bg-[#FAF9F5] p-4 border-b border-[#E8E6DF]">
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase tracking-wider text-[#7A7770] font-semibold block">
                                Commandes contenant {p.name} :
                              </span>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {p.orders.map((po: any, idx: number) => (
                                  <div
                                    key={idx}
                                    onClick={() => setSelectedOrder(po.order)}
                                    className="p-3 bg-white border border-[#E8E6DF] rounded hover:border-[#B79A5B] transition-colors cursor-pointer space-y-1"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-mono text-xs font-semibold text-[#0B0B0B]">
                                        {po.order.orderCode}
                                      </span>
                                      {getStatusBadge(po.order.status)}
                                    </div>
                                    <div className="text-[11px] text-[#7A7770]">
                                      {po.order.customerName} • Qté: {po.quantity}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isSuperAdmin ? 5 : 4} className="py-12 text-center text-[#7A7770]">
                      Aucun produit commandé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ORDER DETAILS MODAL */}
      {/* =================================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-2xl w-full p-6 shadow-2xl animate-fadeIn my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <div>
                <span className="font-mono text-xs font-semibold text-[#B79A5B] block">
                  COMMANDE CASH ON DELIVERY
                </span>
                <h3 className="font-serif text-2xl font-light text-[#0B0B0B]">
                  {selectedOrder.orderCode}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Quick Status Update Selector & Actions */}
              <div className="bg-[#FAF9F5] border border-[#E8E6DF] p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-[#7A7770] block">État d'avancement actuel:</span>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#7A7770]">Changer:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder.id, e.target.value)
                    }
                    className="bg-white border border-[#D5D2C9] text-xs px-3 py-1.5 rounded-sm outline-none focus:border-[#B79A5B] font-medium"
                  >
                    <option value="nouveau">Nouveau</option>
                    <option value="confirme">Confirmé</option>
                    <option value="en_preparation">En Préparation</option>
                    <option value="en_livraison">En Cours de Livraison</option>
                    <option value="livre">Livré & Encaissé</option>
                    <option value="annule">Annulé</option>
                  </select>
                </div>
              </div>

              {/* ACTION TOOLBAR: EDIT ORDER & INVOICE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Order Edit Button */}
                {isOrderEditable(selectedOrder.status) ? (
                  <button
                    onClick={openEditModal}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-[#B79A5B] text-[#0B0B0B] hover:bg-[#FAF9F5] rounded-sm text-xs font-medium cursor-pointer transition-colors shadow-sm"
                  >
                    <Edit className="w-4 h-4 text-[#B79A5B]" />
                    <span>Modifier la Commande (Avant Expédition)</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-400 rounded-sm text-xs cursor-not-allowed">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span>Verrouillée (Expédiée ou Clôturée)</span>
                  </div>
                )}

                {/* Invoice Button */}
                {invoiceData ? (
                  <a
                    href={`/api/admin/orders/${selectedOrder.id}/invoice?download=1`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#0B0B0B] text-white hover:bg-[#222] rounded-sm text-xs font-medium cursor-pointer transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4 text-[#B79A5B]" />
                    <span>Télécharger Facture ({invoiceData.documentNumber})</span>
                  </a>
                ) : (
                  <button
                    onClick={handleGenerateInvoice}
                    disabled={invoiceLoading}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#B79A5B] text-[#0B0B0B] hover:bg-[#a6894c] rounded-sm text-xs font-semibold cursor-pointer transition-colors shadow-sm disabled:opacity-60"
                  >
                    {invoiceLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span>Générer Facture Officielle (PDF)</span>
                  </button>
                )}
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white border border-[#E8E6DF] rounded-sm space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B79A5B] block">
                    Coordonnées Client
                  </span>
                  <div className="font-medium text-sm text-[#0B0B0B]">
                    {selectedOrder.customerName}
                  </div>
                  <div className="text-[#555]">
                    Téléphone: <strong>{selectedOrder.customerPhone}</strong>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div className="text-[#555]">Email: {selectedOrder.customerEmail}</div>
                  )}
                </div>

                <div className="p-4 bg-white border border-[#E8E6DF] rounded-sm space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B79A5B] block">
                    Adresse de Livraison en Tunisie
                  </span>
                  <div className="font-medium text-[#0B0B0B]">
                    Gouvernorat: {selectedOrder.governorate}
                  </div>
                  <div className="text-[#555] leading-relaxed">
                    {selectedOrder.city} • {selectedOrder.address}
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-2 p-2 bg-[#F5F3EC] text-[11px] text-[#7A7770] rounded">
                      Remarques: « {selectedOrder.notes} »
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div>
                <span className="text-xs uppercase font-medium tracking-wider text-[#7A7770] block mb-2">
                  Articles Commandés
                </span>
                <div className="border border-[#E8E6DF] rounded-sm divide-y divide-[#E8E6DF]">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div
                      key={item.id || idx}
                      className="p-3 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-14 relative bg-[#EAE8E1] rounded overflow-hidden shrink-0">
                          {item.imageUrl && (
                            <Image
                              src={item.imageUrl}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[#0B0B0B]">
                            {item.productName}
                          </div>
                          <div className="text-[#7A7770] text-[11px]">
                            Taille: {item.size} • Teinte: {item.color}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[#555]">
                          Qté: {item.quantity} x {Number(item.unitPrice).toFixed(3)} TND
                        </div>
                        <div className="font-serif font-medium text-sm text-[#0B0B0B]">
                          {(item.quantity * item.unitPrice).toFixed(3)} TND
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="bg-[#FAF9F5] p-4 border border-[#E8E6DF] rounded-sm flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#7A7770] block">
                    Mode de Règlement: Paiement à la livraison (COD)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Montant à percevoir par le livreur en espèces
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-[#7A7770]">
                    Sous-total: {Number(selectedOrder.subtotal).toFixed(3)} TND | Livraison: {Number(selectedOrder.shippingFee).toFixed(3)} TND
                  </div>
                  <div className="font-serif text-xl font-medium text-[#0B0B0B] mt-0.5">
                    {Number(selectedOrder.total).toFixed(3)} TND
                  </div>
                </div>
              </div>

              {/* Edit History Section */}
              {editHistory.length > 0 && (
                <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-sm">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-amber-900 mb-2">
                    <History className="w-3.5 h-3.5 text-amber-700" />
                    <span>Historique des Modifications Opérationnelles ({editHistory.length})</span>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto text-[11px]">
                    {editHistory.map((h, i) => (
                      <div key={h.id || i} className="p-2 bg-white rounded border border-amber-100">
                        <div className="flex justify-between text-[#7A7770]">
                          <span className="font-medium text-[#0B0B0B]">Rôle: {h.actor_role}</span>
                          <span>{new Date(h.created_at).toLocaleString('fr-TN')}</span>
                        </div>
                        <div className="mt-1 text-[#555]">Motif : {h.reason}</div>
                        <div className="text-[10px] text-[#888] font-mono">
                          Champs modifiés : {h.changed_fields?.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-5 mt-6 border-t border-[#E8E6DF]">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-[#D5D2C9] text-xs font-medium rounded-sm hover:bg-[#F5F3EC] cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* OPERATIONAL ORDER EDIT MODAL (Phase 4) */}
      {/* =================================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-xl w-full p-6 shadow-2xl animate-fadeIn my-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#B79A5B] uppercase">
                  Opération Logistique
                </span>
                <h3 className="font-serif text-xl font-light text-[#0B0B0B]">
                  Modifier Commande {selectedOrder?.orderCode}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderEdit} className="mt-4 space-y-4 text-xs">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {editSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{editSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#444] mb-1">Nom Client</label>
                  <input
                    type="text"
                    required
                    value={editFormData.customerName || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, customerName: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#D5D2C9] p-2 rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#444] mb-1">Téléphone</label>
                  <input
                    type="text"
                    required
                    value={editFormData.customerPhone || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, customerPhone: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#D5D2C9] p-2 rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#444] mb-1">Gouvernorat</label>
                  <input
                    type="text"
                    required
                    value={editFormData.governorate || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, governorate: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#D5D2C9] p-2 rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#444] mb-1">Ville</label>
                  <input
                    type="text"
                    required
                    value={editFormData.city || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#D5D2C9] p-2 rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#444] mb-1">Adresse Détaillée</label>
                <input
                  type="text"
                  required
                  value={editFormData.address || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#D5D2C9] p-2 rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              {/* Items Quantities */}
              <div>
                <label className="block text-[11px] font-medium text-[#444] mb-1">
                  Quantités des Pièces Commandées
                </label>
                <div className="border border-[#E8E6DF] rounded-sm divide-y divide-[#E8E6DF] bg-[#FAF9F5]">
                  {editFormData.items?.map((item: any, idx: number) => (
                    <div key={item.order_item_id || idx} className="p-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#0B0B0B]">{item.productName}</div>
                        <div className="text-[10px] text-[#7A7770]">
                          Taille: {item.size} • {Number(item.unitPrice).toFixed(3)} TND / pièce
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleItemQtyChange(idx, -1)}
                          className="w-6 h-6 flex items-center justify-center bg-white border border-[#D5D2C9] rounded text-xs font-bold hover:bg-[#F5F3EC]"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleItemQtyChange(idx, 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white border border-[#D5D2C9] rounded text-xs font-bold hover:bg-[#F5F3EC]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#444] mb-1">Motif de la modification</label>
                <input
                  type="text"
                  required
                  value={editFormData.reason || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
                  placeholder="Ex: Demande de rectification d'adresse par le client..."
                  className="w-full bg-[#FAF9F5] border border-[#D5D2C9] p-2 rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-[#D5D2C9] text-xs font-medium rounded-sm hover:bg-[#F5F3EC] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-[#B79A5B] text-[#0B0B0B] text-xs font-semibold rounded-sm hover:bg-[#a6894c] cursor-pointer disabled:opacity-60 flex items-center space-x-1"
                >
                  {editLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Enregistrer les Modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
