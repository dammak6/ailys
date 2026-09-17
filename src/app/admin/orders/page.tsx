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
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error("Orders error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderCode?.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerPhone?.includes(search);
    const matchesStatus =
      statusFilter === "all" || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          Suivi logistique, coordination des coursiers et encaissement Cash on Delivery.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E8E6DF] p-4 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Code commande, client ou téléphone..."
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
              className={`text-xs px-2.5 py-1.5 rounded-sm whitespace-nowrap transition-colors ${
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

      {/* Orders Table */}
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
                <th className="py-3 px-4 font-medium text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6DF]">
              {filteredOrders.map((ord) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
              {/* Quick Status Update Selector */}
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
                  <span className="text-xs text-[#7A7770]">Total Net:</span>
                  <div className="font-serif text-xl font-medium text-[#0B0B0B]">
                    {Number(selectedOrder.total).toFixed(3)} TND
                  </div>
                </div>
              </div>
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
    </div>
  );
}
