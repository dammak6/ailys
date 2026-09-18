"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  X,
  AlertCircle,
} from "lucide-react";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<any>({
    id: "",
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    heroDesktopImage: "/images/editorial/08_mediterranean_street.webp",
    heroMobileImage: "/images/editorial/03_the_silhouette.webp",
    isCapsule: false,
    isPublished: true,
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/admin/collections");
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch (err) {
      console.error("Collections error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentCollection({
      id: "",
      title: "",
      slug: "",
      subtitle: "",
      description: "",
      heroDesktopImage: "/images/editorial/08_mediterranean_street.webp",
      heroMobileImage: "/images/editorial/03_the_silhouette.webp",
      isCapsule: false,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setIsEditing(true);
    setCurrentCollection(c);
    setModalOpen(true);
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/collections", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentCollection),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchCollections();
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch("/api/admin/collections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchCollections();
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/collections?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchCollections();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#0B0B0B]">
            Collections & Lookbooks
          </h2>
          <p className="text-xs text-[#7A7770] mt-0.5">
            Organisation éditoriale des récits de saison et capsules limitées.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-[#F5F3EC] text-xs font-medium uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#B79A5B]" />
          <span>Nouvelle Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-white border border-[#E8E6DF] rounded-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-48 w-full bg-[#EAE8E1]">
                  <Image
                    src={col.heroDesktopImage || "/images/editorial/08_mediterranean_street.webp"}
                    alt={col.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleTogglePublish(col.id)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[10px] uppercase font-semibold cursor-pointer backdrop-blur-xs ${
                        col.isPublished
                          ? "bg-[#0B0B0B]/80 text-[#B79A5B] border border-[#B79A5B]/40"
                          : "bg-white/90 text-gray-700"
                      }`}
                    >
                      {col.isPublished ? (
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
                  </div>
                  {col.isCapsule && (
                    <div className="absolute top-3 left-3 bg-[#B79A5B] text-[#0B0B0B] text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded">
                      Capsule Limitée
                    </div>
                  )}
                </div>

                {/* Information */}
                <div className="p-5">
                  <h3 className="font-serif text-lg font-medium text-[#0B0B0B]">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#B79A5B] font-serif italic mt-0.5">
                    {col.subtitle}
                  </p>
                  <p className="text-xs text-[#7A7770] mt-2 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#F0EFEB] flex items-center text-[11px] text-[#888]">
                    <Layers className="w-3.5 h-3.5 mr-1.5 text-[#B79A5B]" />
                    <span>{col.productCount || col.products?.length || 0} pièces associées</span>
                  </div>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="p-4 bg-[#FAF9F5] border-t border-[#E8E6DF] flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#7A7770]">
                  /{col.slug}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(col)}
                    className="p-1.5 text-[#555] hover:text-[#B79A5B] cursor-pointer"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(col.id)}
                    className="p-1.5 text-[#555] hover:text-red-600 cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E8E6DF] rounded-sm p-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#F5F3EC] flex items-center justify-center mx-auto text-[#B79A5B]">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl text-[#0B0B0B]">
              Centre des Collections vide
            </h3>
            <p className="text-xs text-[#7A7770] max-w-md mx-auto">
              Aucune collection n&apos;est actuellement enregistrée. Cliquez sur le bouton ci-dessous pour créer votre première collection ou capsule.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-[#F5F3EC] text-xs font-medium uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#B79A5B]" />
            <span>Créer une Collection</span>
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* COLLECTION MODAL */}
      {/* =================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-lg w-full p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <h3 className="font-serif text-xl font-light text-[#0B0B0B]">
                {isEditing ? "Modifier la Collection" : "Nouvelle Collection"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  Titre de la Collection
                </label>
                <input
                  type="text"
                  required
                  value={currentCollection.title}
                  onChange={(e) =>
                    setCurrentCollection({
                      ...currentCollection,
                      title: e.target.value,
                    })
                  }
                  placeholder="Ex: Lumière d'Été"
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  Sous-titre / Thématique
                </label>
                <input
                  type="text"
                  value={currentCollection.subtitle}
                  onChange={(e) =>
                    setCurrentCollection({
                      ...currentCollection,
                      subtitle: e.target.value,
                    })
                  }
                  placeholder="Ex: Silhouettes sport-chic sculptées par la lumière"
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  Description Éditoriale
                </label>
                <textarea
                  rows={3}
                  value={currentCollection.description}
                  onChange={(e) =>
                    setCurrentCollection({
                      ...currentCollection,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  Image de Couverture Desktop (URL)
                </label>
                <input
                  type="text"
                  value={currentCollection.heroDesktopImage}
                  onChange={(e) =>
                    setCurrentCollection({
                      ...currentCollection,
                      heroDesktopImage: e.target.value,
                    })
                  }
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentCollection.isCapsule}
                    onChange={(e) =>
                      setCurrentCollection({
                        ...currentCollection,
                        isCapsule: e.target.checked,
                      })
                    }
                    className="rounded text-[#B79A5B]"
                  />
                  <span>Capsule Limitée</span>
                </label>

                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentCollection.isPublished}
                    onChange={(e) =>
                      setCurrentCollection({
                        ...currentCollection,
                        isPublished: e.target.checked,
                      })
                    }
                    className="rounded text-[#B79A5B]"
                  />
                  <span>Publier sur le site</span>
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

      {/* DELETE CONFIRM */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 text-red-600 mb-3">
              <AlertCircle className="w-5 h-5" />
              <h4 className="font-serif text-lg font-medium text-[#0B0B0B]">
                Supprimer la Collection ?
              </h4>
            </div>
            <p className="text-xs text-[#7A7770] leading-relaxed">
              Les produits associés ne seront pas supprimés, mais ne seront plus liés à cette collection.
            </p>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 border border-[#D5D2C9] text-xs rounded-sm cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteCollection(deleteConfirmId)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-sm cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
