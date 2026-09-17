"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Percent,
  X,
  Sparkles,
} from "lucide-react";

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPromo, setCurrentPromo] = useState<any>({
    id: "",
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 150,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "2026-12-31",
    isActive: true,
  });

  const fetchPromotions = async () => {
    try {
      const res = await fetch("/api/admin/promotions");
      if (res.ok) setPromotions(await res.json());
    } catch (err) {
      console.error("Promotions error:", err);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentPromo({
      id: "",
      code: `AILYS${Math.floor(10 + Math.random() * 90)}`,
      description: "Remise exclusive privilège client",
      discountType: "percentage",
      discountValue: 15,
      minOrderAmount: 200,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setIsEditing(true);
    setCurrentPromo(p);
    setModalOpen(true);
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/promotions", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPromo),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchPromotions();
      }
    } catch (err) {
      console.error("Save promo error:", err);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchPromotions();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleDeletePromo = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/promotions?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchPromotions();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#0B0B0B]">
            Codes Privilèges & Promotions
          </h2>
          <p className="text-xs text-[#7A7770] mt-0.5">
            Gestion des remises exceptionnelles, seuils minimaux et validités.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-[#F5F3EC] text-xs font-medium uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#B79A5B]" />
          <span>Créer un Code Promo</span>
        </button>
      </div>

      {/* Promotions Table */}
      <div className="bg-white border border-[#E8E6DF] rounded-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF9F5] border-b border-[#E8E6DF] text-[#7A7770] uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 font-medium">Code</th>
              <th className="py-3 px-4 font-medium">Description</th>
              <th className="py-3 px-4 font-medium">Valeur</th>
              <th className="py-3 px-4 font-medium">Panier Minimum</th>
              <th className="py-3 px-4 font-medium">Validité</th>
              <th className="py-3 px-4 font-medium">Utilisations</th>
              <th className="py-3 px-4 font-medium">État</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E6DF]">
            {promotions.map((promo) => (
              <tr key={promo.id} className="hover:bg-[#FBFBF9] transition-colors">
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-sm bg-[#F5F3EC] px-2.5 py-1 rounded text-[#0B0B0B] border border-[#E8E6DF]">
                    {promo.code}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#555] max-w-xs truncate">
                  {promo.description}
                </td>
                <td className="py-3 px-4 font-semibold text-[#0B0B0B]">
                  {promo.discountType === "percentage"
                    ? `-${promo.discountValue}%`
                    : `-${promo.discountValue} TND`}
                </td>
                <td className="py-3 px-4 text-[#555]">
                  {promo.minOrderAmount ? `${promo.minOrderAmount} TND` : "Aucun"}
                </td>
                <td className="py-3 px-4 text-[#7A7770]">
                  {promo.startDate} au {promo.endDate}
                </td>
                <td className="py-3 px-4 font-medium text-[#444]">
                  {promo.usageCount || 0} fois
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleActive(promo.id)}
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-[10px] uppercase font-semibold cursor-pointer transition-colors ${
                      promo.isActive
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {promo.isActive ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        <span>Actif</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Désactivé</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEdit(promo)}
                      className="p-1.5 text-[#555] hover:text-[#B79A5B] cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="p-1.5 text-[#555] hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-md w-full p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <h3 className="font-serif text-xl font-light text-[#0B0B0B]">
                {isEditing ? "Modifier la Promotion" : "Nouveau Code Privilège"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  Code Privilège
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={currentPromo.code}
                    onChange={(e) =>
                      setCurrentPromo({ ...currentPromo, code: e.target.value.toUpperCase() })
                    }
                    className="w-full font-mono uppercase font-semibold border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                  <Sparkles className="w-4 h-4 text-[#B79A5B] absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  Description Interne
                </label>
                <input
                  type="text"
                  value={currentPromo.description}
                  onChange={(e) =>
                    setCurrentPromo({ ...currentPromo, description: e.target.value })
                  }
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Type de Remise
                  </label>
                  <select
                    value={currentPromo.discountType}
                    onChange={(e) =>
                      setCurrentPromo({ ...currentPromo, discountType: e.target.value })
                    }
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant Fixe (TND)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Valeur
                  </label>
                  <input
                    type="number"
                    required
                    value={currentPromo.discountValue}
                    onChange={(e) =>
                      setCurrentPromo({ ...currentPromo, discountValue: e.target.value })
                    }
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  Panier Minimum (TND)
                </label>
                <input
                  type="number"
                  value={currentPromo.minOrderAmount}
                  onChange={(e) =>
                    setCurrentPromo({ ...currentPromo, minOrderAmount: e.target.value })
                  }
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Date de Début
                  </label>
                  <input
                    type="date"
                    value={currentPromo.startDate}
                    onChange={(e) =>
                      setCurrentPromo({ ...currentPromo, startDate: e.target.value })
                    }
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Date d'Expiration
                  </label>
                  <input
                    type="date"
                    value={currentPromo.endDate}
                    onChange={(e) =>
                      setCurrentPromo({ ...currentPromo, endDate: e.target.value })
                    }
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="promoActive"
                  checked={currentPromo.isActive}
                  onChange={(e) =>
                    setCurrentPromo({ ...currentPromo, isActive: e.target.checked })
                  }
                  className="rounded text-[#B79A5B]"
                />
                <label htmlFor="promoActive" className="text-xs text-[#0B0B0B] font-medium cursor-pointer">
                  Code promotionnel actif immédiatement
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#D5D2C9] text-xs uppercase font-medium rounded-sm cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B79A5B] text-[#0B0B0B] text-xs uppercase font-medium tracking-wider rounded-sm hover:bg-[#C8AD6D] cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
