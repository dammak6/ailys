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
  Ruler,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sizeGuideMode, setSizeGuideMode] = useState<"default" | "custom">("default");
  const [showSizeGuidePreview, setShowSizeGuidePreview] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>({
    id: "",
    name: "",
    subtitle: "",
    category: "femme",
    subCategory: "Tailleurs & Ensembles",
    price: 450,
    salePrice: "",
    collection: "Nouvelle Collection",
    primaryImage: "https://kafyatqatggifedqtctm.supabase.co/storage/v1/object/public/media/editorial/03_the_silhouette.webp",
    materials: "100% Lin Normand Lavé",
    care: "Nettoyage à sec délicat",
    fit: "Coupe cintrée contemporaine",
    sizes: ["36", "38", "40", "42"],
    sizeGuide: null,
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
    setSizeGuideMode("default");
    setShowSizeGuidePreview(false);
    setCurrentProduct({
      id: "",
      name: "",
      subtitle: "",
      category: "femme",
      subCategory: "Tailleurs & Ensembles",
      price: 450,
      salePrice: "",
      collection: "Nouvelle Collection",
      primaryImage: "https://kafyatqatggifedqtctm.supabase.co/storage/v1/object/public/media/editorial/03_the_silhouette.webp",
      materials: "100% Lin Normand Lavé",
      care: "Nettoyage à sec délicat",
      fit: "Coupe cintrée contemporaine",
      sizes: ["36", "38", "40", "42"],
      sizeGuide: null,
      isNew: true,
      isCapsule: false,
      isSoldOut: false,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setIsEditing(true);
    const hasCustomGuide = Boolean(p.sizeGuide && p.sizeGuide.rows && p.sizeGuide.rows.length > 0);
    setSizeGuideMode(hasCustomGuide ? "custom" : "default");
    setShowSizeGuidePreview(false);
    setCurrentProduct({
      ...p,
      salePrice: p.salePrice || "",
      sizes: Array.isArray(p.sizes) ? p.sizes : ["36", "38", "40"],
      sizeGuide: p.sizeGuide || null,
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const payload = {
        ...currentProduct,
        sizeGuide: sizeGuideMode === "custom" ? currentProduct.sizeGuide : null,
      };
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
                            src={p.primaryImage || "https://kafyatqatggifedqtctm.supabase.co/storage/v1/object/public/media/editorial/03_the_silhouette.webp"}
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

              {/* ========================================================================= */}
              {/* GUIDE DES TAILLES (Standard vs Personnalisé) */}
              {/* ========================================================================= */}
              <div className="pt-4 border-t border-[#E8E6DF] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-[#B79A5B]" />
                    <span className="font-serif text-sm font-medium text-[#0B0B0B]">
                      Guide des Tailles
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSizeGuideMode("default");
                        setShowSizeGuidePreview(false);
                      }}
                      className={`px-2.5 py-1 text-[11px] rounded-xs font-sans transition-colors cursor-pointer ${
                        sizeGuideMode === "default"
                          ? "bg-[#0B0B0B] text-[#F5F3EC] font-medium"
                          : "bg-[#F5F3EC] text-[#555] hover:bg-[#EAE8E1]"
                      }`}
                    >
                      Guide Standard Atelier (36-44)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSizeGuideMode("custom");
                        if (!currentProduct.sizeGuide?.rows || currentProduct.sizeGuide.rows.length === 0) {
                          setCurrentProduct({
                            ...currentProduct,
                            sizeGuide: {
                              title: `Guide des Tailles • ${currentProduct.name || "Modèle"}`,
                              description: "Mesures confection atelier spécifiques pour cette silhouette.",
                              headers: ["Taille", "Tour de Poitrine", "Tour de Taille", "Tour de Bassin", "Longueur"],
                              rows: [
                                { size: "36 (XS)", chest: "84 cm", waist: "64 cm", hips: "90 cm", length: "98 cm" },
                                { size: "38 (S)", chest: "88 cm", waist: "68 cm", hips: "94 cm", length: "99 cm" },
                                { size: "40 (M)", chest: "92 cm", waist: "72 cm", hips: "98 cm", length: "100 cm" },
                                { size: "42 (L)", chest: "96 cm", waist: "76 cm", hips: "102 cm", length: "101 cm" },
                                { size: "44 (XL)", chest: "100 cm", waist: "80 cm", hips: "106 cm", length: "102 cm" },
                              ],
                            },
                          });
                        }
                      }}
                      className={`px-2.5 py-1 text-[11px] rounded-xs font-sans transition-colors cursor-pointer ${
                        sizeGuideMode === "custom"
                          ? "bg-[#B79A5B] text-[#0B0B0B] font-semibold"
                          : "bg-[#F5F3EC] text-[#555] hover:bg-[#EAE8E1]"
                      }`}
                    >
                      Guide Personnalisé pour cette Pièce
                    </button>
                  </div>
                </div>

                {sizeGuideMode === "default" ? (
                  <p className="text-[11px] text-[#7A7770] bg-[#FAF9F5] p-3 rounded border border-[#E8E6DF] leading-relaxed">
                    Ce produit utilise le guide standard AÏLYS (36: 82-86/62-66/88-92 cm jusqu&apos;à 44). Aucun paramétrage spécifique n&apos;est requis.
                  </p>
                ) : (
                  <div className="bg-[#FAF9F5] p-4 rounded border border-[#B79A5B]/30 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                          Titre du Guide
                        </label>
                        <input
                          type="text"
                          value={currentProduct.sizeGuide?.title || ""}
                          onChange={(e) =>
                            setCurrentProduct({
                              ...currentProduct,
                              sizeGuide: {
                                ...currentProduct.sizeGuide,
                                title: e.target.value,
                              },
                            })
                          }
                          placeholder="Ex: Guide des Tailles • Veste Tailleur"
                          className="w-full bg-white border border-[#D5D2C9] px-2.5 py-1.5 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                          Note de Coupe / Description
                        </label>
                        <input
                          type="text"
                          value={currentProduct.sizeGuide?.description || ""}
                          onChange={(e) =>
                            setCurrentProduct({
                              ...currentProduct,
                              sizeGuide: {
                                ...currentProduct.sizeGuide,
                                description: e.target.value,
                              },
                            })
                          }
                          placeholder="Ex: Silhouette fluide, prenez votre taille habituelle."
                          className="w-full bg-white border border-[#D5D2C9] px-2.5 py-1.5 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                        />
                      </div>
                    </div>

                    {/* Measurements Table */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider text-[#555] font-semibold">
                          Tableau des Mesures en Atelier
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowSizeGuidePreview(!showSizeGuidePreview)}
                            className="text-[10px] uppercase tracking-wider text-[#B79A5B] hover:underline font-semibold cursor-pointer"
                          >
                            {showSizeGuidePreview ? "Masquer Aperçu" : "Aperçu Rendu Client"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const rows = currentProduct.sizeGuide?.rows || [];
                              const newRow = { size: "46 (XXL)", chest: "104 cm", waist: "84 cm", hips: "110 cm", length: "103 cm" };
                              setCurrentProduct({
                                ...currentProduct,
                                sizeGuide: {
                                  ...currentProduct.sizeGuide,
                                  rows: [...rows, newRow],
                                },
                              });
                            }}
                            className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#0B0B0B] text-[#F5F3EC] rounded cursor-pointer"
                          >
                            + Ajouter une taille
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto border border-[#E8E6DF] bg-white rounded-xs">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-[#F5F3EC] text-[#0B0B0B] uppercase text-[10px] tracking-wider border-b border-[#E8E6DF]">
                              <th className="p-2">Taille</th>
                              <th className="p-2">Poitrine</th>
                              <th className="p-2">Taille</th>
                              <th className="p-2">Bassin</th>
                              <th className="p-2">Longueur</th>
                              <th className="p-2 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E8E6DF]">
                            {(currentProduct.sizeGuide?.rows || []).map((row: any, rIdx: number) => (
                              <tr key={rIdx} className="hover:bg-[#FAF9F5]">
                                <td className="p-1.5">
                                  <input
                                    type="text"
                                    value={row.size || ""}
                                    onChange={(e) => {
                                      const updatedRows = [...currentProduct.sizeGuide.rows];
                                      updatedRows[rIdx] = { ...updatedRows[rIdx], size: e.target.value };
                                      setCurrentProduct({
                                        ...currentProduct,
                                        sizeGuide: { ...currentProduct.sizeGuide, rows: updatedRows },
                                      });
                                    }}
                                    className="w-20 border border-[#D5D2C9] px-1.5 py-1 text-xs rounded-xs"
                                  />
                                </td>
                                <td className="p-1.5">
                                  <input
                                    type="text"
                                    value={row.chest || ""}
                                    onChange={(e) => {
                                      const updatedRows = [...currentProduct.sizeGuide.rows];
                                      updatedRows[rIdx] = { ...updatedRows[rIdx], chest: e.target.value };
                                      setCurrentProduct({
                                        ...currentProduct,
                                        sizeGuide: { ...currentProduct.sizeGuide, rows: updatedRows },
                                      });
                                    }}
                                    className="w-24 border border-[#D5D2C9] px-1.5 py-1 text-xs rounded-xs"
                                  />
                                </td>
                                <td className="p-1.5">
                                  <input
                                    type="text"
                                    value={row.waist || ""}
                                    onChange={(e) => {
                                      const updatedRows = [...currentProduct.sizeGuide.rows];
                                      updatedRows[rIdx] = { ...updatedRows[rIdx], waist: e.target.value };
                                      setCurrentProduct({
                                        ...currentProduct,
                                        sizeGuide: { ...currentProduct.sizeGuide, rows: updatedRows },
                                      });
                                    }}
                                    className="w-24 border border-[#D5D2C9] px-1.5 py-1 text-xs rounded-xs"
                                  />
                                </td>
                                <td className="p-1.5">
                                  <input
                                    type="text"
                                    value={row.hips || ""}
                                    onChange={(e) => {
                                      const updatedRows = [...currentProduct.sizeGuide.rows];
                                      updatedRows[rIdx] = { ...updatedRows[rIdx], hips: e.target.value };
                                      setCurrentProduct({
                                        ...currentProduct,
                                        sizeGuide: { ...currentProduct.sizeGuide, rows: updatedRows },
                                      });
                                    }}
                                    className="w-24 border border-[#D5D2C9] px-1.5 py-1 text-xs rounded-xs"
                                  />
                                </td>
                                <td className="p-1.5">
                                  <input
                                    type="text"
                                    value={row.length || ""}
                                    onChange={(e) => {
                                      const updatedRows = [...currentProduct.sizeGuide.rows];
                                      updatedRows[rIdx] = { ...updatedRows[rIdx], length: e.target.value };
                                      setCurrentProduct({
                                        ...currentProduct,
                                        sizeGuide: { ...currentProduct.sizeGuide, rows: updatedRows },
                                      });
                                    }}
                                    className="w-24 border border-[#D5D2C9] px-1.5 py-1 text-xs rounded-xs"
                                  />
                                </td>
                                <td className="p-1.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedRows = currentProduct.sizeGuide.rows.filter((_: any, idx: number) => idx !== rIdx);
                                      setCurrentProduct({
                                        ...currentProduct,
                                        sizeGuide: { ...currentProduct.sizeGuide, rows: updatedRows },
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Preview box if toggled */}
                    {showSizeGuidePreview && (
                      <div className="p-3 bg-white border border-[#B79A5B] rounded-sm space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-serif font-medium text-[#0B0B0B]">
                          <Ruler className="w-3.5 h-3.5 text-[#B79A5B]" />
                          <span>Aperçu Client : {currentProduct.sizeGuide?.title}</span>
                        </div>
                        <p className="text-[11px] text-[#7A7770] italic">
                          {currentProduct.sizeGuide?.description}
                        </p>
                        <div className="overflow-x-auto text-[11px]">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F5F3EC] border-b">
                                <th className="p-2">Taille</th>
                                <th className="p-2">Poitrine</th>
                                <th className="p-2">Taille</th>
                                <th className="p-2">Bassin</th>
                                <th className="p-2">Longueur</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(currentProduct.sizeGuide?.rows || []).map((r: any, idx: number) => (
                                <tr key={idx} className="border-b">
                                  <td className="p-2 font-medium">{r.size}</td>
                                  <td className="p-2">{r.chest}</td>
                                  <td className="p-2">{r.waist}</td>
                                  <td className="p-2">{r.hips}</td>
                                  <td className="p-2">{r.length}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
