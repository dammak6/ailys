"use client";

import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Phone,
  AlertCircle,
  ShieldCheck,
  X,
} from "lucide-react";

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReturn, setSelectedReturn] = useState<any | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const fetchReturns = async () => {
    try {
      const res = await fetch("/api/admin/returns");
      if (res.ok) setReturns(await res.json());
    } catch (err) {
      console.error("Returns error:", err);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleOpenDetail = (ret: any) => {
    setSelectedReturn(ret);
    setAdminNotes(ret.adminNotes || "");
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedReturn) return;
    try {
      const res = await fetch("/api/admin/returns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedReturn.id,
          status,
          adminNotes,
        }),
      });

      if (res.ok) {
        setSelectedReturn({ ...selectedReturn, status, adminNotes });
        fetchReturns();
      }
    } catch (err) {
      console.error("Update return error:", err);
    }
  };

  const filteredReturns = returns.filter((r) => {
    const matchesSearch =
      r.requestCode?.toLowerCase().includes(search.toLowerCase()) ||
      r.orderCode?.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      r.customerPhone?.includes(search);
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] uppercase font-semibold">
            <Clock className="w-3 h-3" />
            <span>En Attente</span>
          </span>
        );
      case "approuve":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[10px] uppercase font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>Approuvé (Collecte)</span>
          </span>
        );
      case "recu":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded text-[10px] uppercase font-semibold">
            <Package className="w-3 h-3" />
            <span>Reçu à l'Atelier</span>
          </span>
        );
      case "resolu":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] uppercase font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>Résolu / Échangé</span>
          </span>
        );
      case "refuse":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded text-[10px] uppercase font-semibold">
            <XCircle className="w-3 h-3" />
            <span>Refusé</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-light text-[#0B0B0B]">
          Portail Retours & Échanges de Tailles
        </h2>
        <p className="text-xs text-[#7A7770] mt-0.5">
          Validation des demandes d'échange, vérification de conformité et coordination coursier.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E8E6DF] p-4 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Code RET, commande ou téléphone..."
            className="w-full bg-[#FBFBF9] border border-[#D5D2C9] text-xs py-2 pl-9 pr-4 rounded-sm outline-none focus:border-[#B79A5B]"
          />
          <Search className="w-3.5 h-3.5 text-[#7A7770] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Type filter */}
          <div className="flex items-center space-x-1">
            {["all", "echange", "retour"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`text-xs px-2.5 py-1.5 rounded-sm capitalize transition-colors ${
                  typeFilter === t
                    ? "bg-[#B79A5B] text-[#0B0B0B] font-semibold"
                    : "bg-[#F5F3EC] text-[#555] hover:bg-[#EAE8E1]"
                }`}
              >
                {t === "all" ? "Tous Types" : t === "echange" ? "Échanges" : "Retours"}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F5F3EC] border border-[#D5D2C9] text-xs px-2.5 py-1.5 rounded-sm outline-none"
          >
            <option value="all">Tous Statuts</option>
            <option value="en_attente">En Attente</option>
            <option value="approuve">Approuvé</option>
            <option value="recu">Reçu</option>
            <option value="resolu">Résolu</option>
            <option value="refuse">Refusé</option>
          </select>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white border border-[#E8E6DF] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E6DF] text-[#7A7770] uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-medium">Référence</th>
                <th className="py-3 px-4 font-medium">Commande Liée</th>
                <th className="py-3 px-4 font-medium">Client</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Motif Déclaré</th>
                <th className="py-3 px-4 font-medium">Statut</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6DF]">
              {filteredReturns.length > 0 ? (
                filteredReturns.map((ret) => (
                  <tr key={ret.id || ret.requestCode} className="hover:bg-[#FBFBF9] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0B0B0B]">
                      {ret.requestCode}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#555]">
                      {ret.orderCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#0B0B0B]">{ret.customerName}</div>
                      <div className="text-[11px] text-[#7A7770] flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-[#B79A5B]" />
                        <span>{ret.customerPhone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                          ret.type === "echange"
                            ? "bg-[#B79A5B]/20 text-[#6B572B]"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {ret.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#555] max-w-xs truncate">
                      {ret.reason}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(ret.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(ret)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#F5F3EC] hover:bg-[#EAE8E1] text-[#0B0B0B] rounded-sm text-xs font-medium cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Traiter</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7A7770]">
                    Aucune demande de retour ou d&apos;échange enregistrée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================================== */}
      {/* RETURN DETAIL MODAL */}
      {/* =================================================================== */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-xl w-full p-6 shadow-2xl animate-fadeIn my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <div>
                <span className="font-mono text-xs font-semibold text-[#B79A5B] block">
                  DEMANDE DE SERVICE APRÈS-VENTE
                </span>
                <h3 className="font-serif text-2xl font-light text-[#0B0B0B]">
                  {selectedReturn.requestCode}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReturn(null)}
                className="p-1 text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-xs">
              {/* Status Header */}
              <div className="flex items-center justify-between bg-[#FAF9F5] p-3.5 border border-[#E8E6DF] rounded-sm">
                <div>
                  <span className="text-[#7A7770] block">Type de Demande:</span>
                  <span className="font-semibold text-sm uppercase text-[#0B0B0B]">
                    {selectedReturn.type === "echange" ? "Échange de Taille" : "Retour & Remboursement"}
                  </span>
                </div>
                <div>{getStatusBadge(selectedReturn.status)}</div>
              </div>

              {/* Tags Intact Check */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Engagement Client Confirmé :</strong> Le client certifie que la pièce est neuve, non portée, avec ses étiquettes et emballage d'origine scellés.
                </span>
              </div>

              {/* Customer & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-[#E8E6DF] rounded-sm">
                  <span className="text-[#7A7770] block">Client:</span>
                  <div className="font-medium text-[#0B0B0B]">{selectedReturn.customerName}</div>
                  <div className="text-[#555]">{selectedReturn.customerPhone}</div>
                </div>
                <div className="p-3 border border-[#E8E6DF] rounded-sm">
                  <span className="text-[#7A7770] block">Commande Associée:</span>
                  <div className="font-mono font-bold text-[#0B0B0B]">
                    {selectedReturn.orderCode}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <span className="text-xs uppercase font-medium tracking-wider text-[#7A7770] block mb-2">
                  Articles Concernés
                </span>
                <div className="border border-[#E8E6DF] rounded-sm divide-y divide-[#E8E6DF]">
                  {selectedReturn.items?.map((it: any, idx: number) => (
                    <div key={it.id || idx} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#0B0B0B]">{it.productName}</div>
                        <div className="text-[#7A7770]">Quantité: {it.quantity}</div>
                      </div>
                      {it.requestedExchangeSize && (
                        <div className="bg-[#B79A5B]/20 px-2.5 py-1 rounded text-right">
                          <span className="text-[10px] text-[#6B572B] block">Taille Souhaitée:</span>
                          <span className="font-bold text-[#0B0B0B]">{it.requestedExchangeSize}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reason & Comments */}
              <div className="p-3 bg-[#FAF9F5] border border-[#E8E6DF] rounded-sm">
                <span className="text-[#7A7770] block font-medium">Motif & Remarques:</span>
                <p className="mt-1 text-[#0B0B0B] leading-relaxed">
                  <strong>{selectedReturn.reason}</strong>
                  {selectedReturn.comments && ` — « ${selectedReturn.comments} »`}
                </p>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  Notes Internes Atelier / Coursier
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ex: Enlèvement planifié le 18/09, nouvelle taille M réservée"
                  className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E8E6DF]">
                <span className="text-[#7A7770] block mb-2 font-medium">Mettre à jour le statut:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("approuve")}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
                  >
                    Approuver (Enlèvement coursier)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("recu")}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium cursor-pointer"
                  >
                    Marquer Reçu à l'Atelier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("resolu")}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-medium cursor-pointer"
                  >
                    Clôturer (Échangé/Remboursé)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("refuse")}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium cursor-pointer"
                  >
                    Rejeter la demande
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 mt-6 border-t border-[#E8E6DF]">
              <button
                onClick={() => setSelectedReturn(null)}
                className="px-4 py-1.5 border border-[#D5D2C9] text-xs font-medium rounded-sm hover:bg-[#F5F3EC] cursor-pointer"
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
