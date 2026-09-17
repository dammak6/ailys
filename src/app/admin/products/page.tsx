"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>({
    id: "",
    name: "",
    subtitle: "",
    category: "femme",
    subCategory: "Tailleurs & Ensembles",
    price: 450,
    salePrice: "",
    collection: "Nouvelle Collection",
    primaryImage: "/images/editorial/03_the_silhouette.png",
    materials: "100% Lin Normand Lavé",
    care: "Nettoyage à sec délicat",
    fit: "Coupe cintrée contemporaine",
    sizes: ["36", "38", "40", "42"],
    isNew: true,
    isCapsule: false,
    isSoldOut: false,
    isPublished: true,
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentProduct({
      id: "",
      name: "",
      subtitle: "",
      category: "femme",
      subCategory: "Tailleurs & Ensembles",
      price: 450,
      salePrice: "",
      collection: "Nouvelle Collection",
      primaryImage: "/images/editorial/03_the_silhouette.png",
      materials: "100% Lin Normand Lavé",
      care: "Nettoyage à sec délicat",
      fit: "Coupe cintrée contemporaine",
      sizes: ["36", "38", "40", "42"],
      isNew: true,
      isCapsule: false,
      isSoldOut: false,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setIsEditing(true);
    setCurrentProduct({
      ...p,
      salePrice: p.salePrice || "",
      sizes: Array.isArray(p.sizes) ? p.sizes : ["36", "38", "40"],
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProduct),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchProducts();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#0B0B0B]">
            Catalogue des Produits
          </h2>
          <p className="text-xs text-[#7A7770] mt-0.5">
            Création, modification, tarification et publication des pièces de confection.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-[#F5F3EC] text-xs font-medium uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#B79A5B]" />
          <span>Ajouter une Pièce</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E8E6DF] p-4 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom de modèle..."
            className="w-full bg-[#FBFBF9] border border-[#D5D2C9] focus:border-[#B79A5B] text-xs py-2 pl-9 pr-4 rounded-sm outline-none"
          />
          <Search className="w-3.5 h-3.5 text-[#7A7770] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#7A7770]" />
          <div className="flex items-center space-x-1">
            {["all", "femme", "homme", "enfant"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-sm capitalize transition-colors ${
                  categoryFilter === cat
                    ? "bg-[#B79A5B] text-[#0B0B0B] font-semibold"
                    : "bg-[#F5F3EC] text-[#555] hover:bg-[#EAE8E1]"
                }`}
              >
                {cat === "all" ? "Toutes" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E8E6DF] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E6DF] text-[#7A7770] uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-medium">Modèle</th>
                <th className="py-3 px-4 font-medium">Catégorie</th>
                <th className="py-3 px-4 font-medium">Prix (TND)</th>
                <th className="py-3 px-4 font-medium">Statut Stock</th>
                <th className="py-3 px-4 font-medium">Publication</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6DF]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FBFBF9] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-16 relative bg-[#EFECE4] rounded-sm overflow-hidden shrink-0">
                          <Image
                            src={p.primaryImage || "/images/editorial/03_the_silhouette.png"}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-serif font-medium text-sm text-[#0B0B0B]">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-[#7A7770]">
                            {p.subtitle || p.collection}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize font-medium text-[#444]">
                        {p.category}
                      </span>
                      <div className="text-[10px] text-[#7A7770]">{p.subCategory}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-serif font-medium text-sm text-[#0B0B0B]">
                        {Number(p.price).toFixed(3)} TND
                      </div>
                      {p.salePrice && (
                        <div className="text-[10px] text-red-600 line-through">
                          {Number(p.salePrice).toFixed(3)} TND
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {p.isSoldOut ? (
                        <span className="inline-block px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] uppercase font-semibold">
                          Épuisé
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] uppercase font-semibold">
                          En Stock ({p.stockQuantity ?? 25})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(p.id)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-semibold cursor-pointer transition-colors ${
                          p.isPublished
                            ? "bg-[#B79A5B]/20 text-[#6B572B] hover:bg-[#B79A5B]/30"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {p.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Publié</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Brouillon</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-[#555] hover:text-[#B79A5B] transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-[#555] hover:text-red-600 transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#7A7770]">
                    Aucun produit enregistré. Utilisez le bouton « Nouveau Produit » pour créer votre première silhouette.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================================== */}
      {/* PRODUCT CREATE / EDIT MODAL */}
      {/* =================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-2xl w-full p-6 my-8 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <h3 className="font-serif text-xl font-light text-[#0B0B0B]">
                {isEditing ? "Modifier le Modèle" : "Ajouter une Nouvelle Pièce"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Nom du Produit
                  </label>
                  <input
                    type="text"
                    required
                    value={currentProduct.name}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, name: e.target.value })
                    }
                    placeholder="Ex: Veste Tailleur Riviera en Lin"
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Sous-titre / Description Courte
                  </label>
                  <input
                    type="text"
                    value={currentProduct.subtitle}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, subtitle: e.target.value })
                    }
                    placeholder="Ex: Lin naturel tissé, boutons corozo"
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Catégorie
                  </label>
                  <select
                    value={currentProduct.category}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, category: e.target.value })
                    }
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  >
                    <option value="femme">Femme</option>
                    <option value="homme">Homme</option>
                    <option value="enfant">Enfant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Prix (TND)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={currentProduct.price}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, price: e.target.value })
                    }
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Prix Soldé (Optionnel)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={currentProduct.salePrice}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, salePrice: e.target.value })
                    }
                    placeholder="Laisser vide si plein tarif"
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  URL de l'Image Principale
                </label>
                <input
                  type="text"
                  required
                  value={currentProduct.primaryImage}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, primaryImage: e.target.value })
                  }
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Matières
                  </label>
                  <input
                    type="text"
                    value={currentProduct.materials}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, materials: e.target.value })
                    }
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Entretien
                  </label>
                  <input
                    type="text"
                    value={currentProduct.care}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, care: e.target.value })
                    }
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProduct.isNew}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, isNew: e.target.checked })
                    }
                    className="rounded text-[#B79A5B] focus:ring-0"
                  />
                  <span>Badge Nouveauté</span>
                </label>

                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProduct.isCapsule}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, isCapsule: e.target.checked })
                    }
                    className="rounded text-[#B79A5B] focus:ring-0"
                  />
                  <span>Pièce Capsule Limitée</span>
                </label>

                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProduct.isSoldOut}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, isSoldOut: e.target.checked })
                    }
                    className="rounded text-[#B79A5B] focus:ring-0"
                  />
                  <span>Marquer comme Épuisé</span>
                </label>

                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProduct.isPublished}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, isPublished: e.target.checked })
                    }
                    className="rounded text-[#B79A5B] focus:ring-0"
                  />
                  <span>Publié sur le site</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#D5D2C9] text-xs uppercase font-medium rounded-sm hover:bg-[#F5F3EC] cursor-pointer"
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

      {/* =================================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* =================================================================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 text-red-600 mb-3">
              <AlertCircle className="w-5 h-5" />
              <h4 className="font-serif text-lg font-medium text-[#0B0B0B]">
                Supprimer le Produit ?
              </h4>
            </div>
            <p className="text-xs text-[#7A7770] leading-relaxed">
              Cette action supprimera définitivement cette pièce du catalogue public.
            </p>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 border border-[#D5D2C9] text-xs rounded-sm hover:bg-[#F5F3EC] cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-sm cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
