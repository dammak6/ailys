"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Copy,
  Trash2,
  Check,
  Search,
  ExternalLink,
  X,
  FileImage,
  Sliders,
  Crop,
  Edit2,
  Tag,
  MapPin,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { AilysImageEditorModal } from "@/components/admin/AilysImageEditorModal";
import { ImageTransformMetadata } from "@/lib/data";

export interface MediaAsset {
  id: string;
  name: string;
  displayName: string;
  filename: string;
  usageTag: string;
  usageLocations: string[];
  url: string;
  dimensions: string;
  size: string;
  mimeType: string;
  createdAt: string;
  transform?: ImageTransformMetadata;
}

const PRESET_TAGS = [
  "Tous",
  "Produit",
  "Accueil",
  "Collection",
  "Savoir-Faire",
  "Packaging",
  "Boutique",
  "Campagne & Lookbook",
  "À Propos",
  "Identité",
  "Non assigné",
];

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("Tous");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inline editing of display name in details modal
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  // Upload modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newAssetUrl, setNewAssetUrl] = useState("");
  const [newAssetDisplayName, setNewAssetDisplayName] = useState("");
  const [newAssetTechnicalName, setNewAssetTechnicalName] = useState("");
  const [newAssetUsageTag, setNewAssetUsageTag] = useState("Non assigné");

  // Built-in Image Editor modal state
  const [editingMediaAsset, setEditingMediaAsset] = useState<MediaAsset | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (err) {
      console.error("Media fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetUrl) return;

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newAssetUrl,
          displayName: newAssetDisplayName.trim() || newAssetTechnicalName.trim() || `Image AÏLYS`,
          name: newAssetTechnicalName.trim() || `asset-${Date.now()}.webp`,
          usageTag: newAssetUsageTag,
          usageLocations: newAssetUsageTag !== "Non assigné" ? [newAssetDisplayName.trim() || "Usage personnalisé"] : [],
          dimensions: "1600 x 2000",
          size: "180 KB",
          mimeType: "image/webp",
        }),
      });

      if (res.ok) {
        setUploadModalOpen(false);
        setNewAssetUrl("");
        setNewAssetDisplayName("");
        setNewAssetTechnicalName("");
        setNewAssetUsageTag("Non assigné");
        fetchMedia();
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer définitivement cette image ?")) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSelectedAsset(null);
        fetchMedia();
      }
    } catch (err) {
      console.error("Delete media error:", err);
    }
  };

  const handleSaveDisplayName = async () => {
    if (!selectedAsset || !editedName.trim()) return;
    setIsSavingName(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedAsset.id,
          displayName: editedName.trim(),
        }),
      });
      if (res.ok) {
        const updated = { ...selectedAsset, displayName: editedName.trim() };
        setSelectedAsset(updated);
        setIsEditingName(false);
        fetchMedia();
      }
    } catch (err) {
      console.error("Error updating display name:", err);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSaveMediaTransform = async (newUrl: string, transform: ImageTransformMetadata) => {
    if (!editingMediaAsset) return;
    try {
      const res = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingMediaAsset.id,
          transform,
        }),
      });
      if (res.ok) {
        setEditingMediaAsset(null);
        fetchMedia();
      }
    } catch (err) {
      console.error("Save media transform error:", err);
    }
  };

  // Filtering by Tag & Search query
  const filteredMedia = media.filter((m) => {
    const matchesTag =
      activeTag === "Tous"
        ? true
        : activeTag === "Non assigné"
        ? !m.usageTag || m.usageTag === "Non assigné"
        : m.usageTag === activeTag;

    if (!matchesTag) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const nameMatch = m.name?.toLowerCase().includes(q);
    const displayNameMatch = m.displayName?.toLowerCase().includes(q);
    const filenameMatch = m.filename?.toLowerCase().includes(q);
    const tagMatch = m.usageTag?.toLowerCase().includes(q);
    const locationsMatch = m.usageLocations?.some((loc: string) => loc.toLowerCase().includes(q));

    return nameMatch || displayNameMatch || filenameMatch || tagMatch || locationsMatch;
  });

  const getTagCount = (tag: string) => {
    if (tag === "Tous") return media.length;
    if (tag === "Non assigné") {
      return media.filter((m) => !m.usageTag || m.usageTag === "Non assigné").length;
    }
    return media.filter((m) => m.usageTag === tag).length;
  };

  // Only show preset tags that either have count > 0 or are default
  const visibleTags = PRESET_TAGS.filter(
    (tag) => tag === "Tous" || getTagCount(tag) > 0 || tag === "Non assigné"
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#0B0B0B]">
            Médiathèque de Campagne & Produits
          </h2>
          <p className="text-xs text-[#7A7770] mt-0.5">
            Organisation intuitive par emplacement d'usage réel sur le site (Accueil, Produits, Collections, Savoir-Faire).
          </p>
        </div>
        <button
          onClick={() => {
            setNewAssetUrl("");
            setNewAssetDisplayName("");
            setNewAssetTechnicalName("");
            setNewAssetUsageTag("Non assigné");
            setUploadModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-[#F5F3EC] text-xs font-medium uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
        >
          <Upload className="w-4 h-4 text-[#B79A5B]" />
          <span>Importer un Média</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white border border-[#E8E6DF] p-4 rounded-sm space-y-3.5 shadow-xs">
        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom d'usage, produit, page ou fichier..."
              className="w-full bg-[#FBFBF9] border border-[#D5D2C9] text-xs py-2 pl-9 pr-8 rounded-sm outline-none focus:border-[#B79A5B] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#7A7770] absolute left-3 top-2.5" />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-[#7A7770] hover:text-[#0B0B0B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="text-xs text-[#7A7770] flex items-center space-x-2 shrink-0">
            <span>
              <strong className="text-[#0B0B0B] font-medium">{filteredMedia.length}</strong> média(s) affiché(s)
            </span>
            <span className="text-[#D5D2C9]">•</span>
            <span>{media.length} au total</span>
          </div>
        </div>

        {/* Category Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {visibleTags.map((tag) => {
            const count = getTagCount(tag);
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 rounded-sm text-xs transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 border ${
                  isActive
                    ? "bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-xs"
                    : "bg-[#FAF9F5] text-[#55534E] border-[#E8E6DF] hover:border-[#B79A5B] hover:text-[#0B0B0B]"
                }`}
              >
                <span>{tag}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#E8E6DF] text-[#7A7770]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white border border-[#E8E6DF] rounded-sm p-12 text-center">
          <p className="font-serif text-base text-[#0B0B0B]">Aucun média correspondant</p>
          <p className="text-xs text-[#7A7770] mt-1">
            Essayez de réinitialiser la recherche ou de sélectionner une autre catégorie.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveTag("Tous");
            }}
            className="mt-4 px-4 py-1.5 border border-[#D5D2C9] text-xs font-medium rounded-sm hover:bg-[#F5F3EC] cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.map((asset) => {
            const hasMultipleUsages = asset.usageLocations && asset.usageLocations.length > 1;
            const primaryName = asset.displayName || asset.name;
            const technicalName = asset.filename || asset.name;

            return (
              <div
                key={asset.id}
                onClick={() => {
                  setSelectedAsset(asset);
                  setEditedName(asset.displayName || asset.name);
                  setIsEditingName(false);
                }}
                className="group bg-white border border-[#E8E6DF] hover:border-[#B79A5B] rounded-sm overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between relative shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md"
              >
                {/* Image Container */}
                <div className="relative aspect-3/4 bg-[#FAF9F5] overflow-hidden">
                  <Image
                    src={asset.url}
                    alt={primaryName}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    style={
                      asset.transform
                        ? {
                            objectPosition: `${asset.transform.focalPoint?.x ?? 50}% ${asset.transform.focalPoint?.y ?? 50}%`,
                            transform: `scale(${asset.transform.zoom ?? 1}) rotate(${asset.transform.rotate ?? 0}deg)`,
                          }
                        : undefined
                    }
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Usage Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start max-w-[85%] z-10">
                    <span className="px-2 py-0.5 text-[9px] font-medium tracking-wide uppercase bg-white/95 backdrop-blur-xs text-[#0B0B0B] border border-[#E8E6DF] rounded-xs shadow-xs truncate max-w-full">
                      {asset.usageTag || "Non assigné"}
                    </span>
                    {hasMultipleUsages && (
                      <span className="px-1.5 py-0.5 text-[8px] font-mono font-medium bg-[#B79A5B] text-white rounded-xs shadow-xs">
                        +{asset.usageLocations.length - 1} autre{asset.usageLocations.length > 2 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Crop indicator */}
                  {asset.transform && (
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-xs text-[#B79A5B] text-[9px] font-mono px-1.5 py-0.5 rounded-xs border border-[#B79A5B]/30 flex items-center space-x-1 z-10">
                      <Crop className="w-2.5 h-2.5" />
                      <span>{asset.transform.aspectRatio || "Cadré"}</span>
                    </div>
                  )}
                </div>

                {/* Card Meta Content */}
                <div className="p-3 border-t border-[#E8E6DF] bg-white flex flex-col justify-between flex-1">
                  <div>
                    {/* Primary Human-Readable Name */}
                    <h4
                      className="font-serif text-[12px] leading-snug font-medium text-[#0B0B0B] line-clamp-2"
                      title={primaryName}
                    >
                      {primaryName}
                    </h4>

                    {/* Subtle Technical Original Filename */}
                    <p
                      className="font-mono text-[9px] text-[#A3A099] truncate mt-1 tracking-tight"
                      title={technicalName}
                    >
                      {technicalName}
                    </p>
                  </div>

                  {/* Dimensions & Size */}
                  <div className="pt-2 mt-2 border-t border-[#F5F3EC] flex items-center justify-between text-[9px] text-[#7A7770]">
                    <span>{asset.dimensions}</span>
                    <span>{asset.size}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* ASSET DETAIL MODAL */}
      {/* =================================================================== */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-2xl w-full p-6 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E8E6DF] gap-4">
              <div className="flex-1 min-w-0">
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 border border-[#B79A5B] px-3 py-1 text-sm font-serif outline-none rounded-sm bg-[#FAF9F5]"
                      placeholder="Nom lisible de l'emplacement..."
                      autoFocus
                    />
                    <button
                      onClick={handleSaveDisplayName}
                      disabled={isSavingName}
                      className="px-3 py-1 bg-[#0B0B0B] text-white text-xs font-medium rounded-sm hover:bg-[#1E1E1E] cursor-pointer"
                    >
                      {isSavingName ? "..." : "Enregistrer"}
                    </button>
                    <button
                      onClick={() => {
                        setEditedName(selectedAsset.displayName || selectedAsset.name);
                        setIsEditingName(false);
                      }}
                      className="px-2 py-1 text-xs text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-lg font-normal text-[#0B0B0B] truncate">
                      {selectedAsset.displayName || selectedAsset.name}
                    </h3>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-[#7A7770] hover:text-[#B79A5B] p-1 cursor-pointer transition-colors"
                      title="Modifier le nom lisible"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-mono text-[10px] text-[#A3A099]">
                    Fichier: {selectedAsset.filename || selectedAsset.name}
                  </span>
                  <span className="text-[#D5D2C9]">•</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.2 bg-[#FAF9F5] border border-[#E8E6DF] text-[#7A7770] rounded-xs font-medium">
                    {selectedAsset.usageTag || "Non assigné"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 flex flex-col md:flex-row gap-6">
              {/* Image Preview */}
              <div className="relative w-full md:w-56 aspect-3/4 bg-[#FAF9F5] rounded-sm overflow-hidden shrink-0 border border-[#E8E6DF]">
                <Image
                  src={selectedAsset.url}
                  alt={selectedAsset.displayName || selectedAsset.name}
                  fill
                  style={
                    selectedAsset.transform
                      ? {
                          objectPosition: `${selectedAsset.transform.focalPoint?.x ?? 50}% ${selectedAsset.transform.focalPoint?.y ?? 50}%`,
                          transform: `scale(${selectedAsset.transform.zoom ?? 1}) rotate(${selectedAsset.transform.rotate ?? 0}deg)`,
                        }
                      : undefined
                  }
                  className="object-cover"
                />
              </div>

              {/* Information & Usages Column */}
              <div className="flex-1 space-y-4 text-xs">
                {/* Real Website Usage Locations */}
                <div className="bg-[#FAF9F5] border border-[#E8E6DF] p-3.5 rounded-sm">
                  <div className="flex items-center space-x-1.5 text-[#0B0B0B] font-medium uppercase tracking-wider text-[10px] mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#B79A5B]" />
                    <span>Emplacements réels sur le site</span>
                  </div>

                  {selectedAsset.usageLocations && selectedAsset.usageLocations.length > 0 ? (
                    <ul className="space-y-1.5">
                      {selectedAsset.usageLocations.map((loc, idx) => (
                        <li
                          key={idx}
                          className="flex items-center space-x-2 text-[11px] text-[#0B0B0B] bg-white border border-[#E8E6DF] px-2.5 py-1.5 rounded-xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B79A5B] shrink-0" />
                          <span className="font-serif">{loc}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-[11px] text-[#7A7770] italic py-1">
                      Non assigné actuellement (conservé dans la médiathèque pour future utilisation).
                    </div>
                  )}
                </div>

                {/* Technical Specs */}
                <div className="grid grid-cols-2 gap-3 bg-[#FBFBF9] border border-[#E8E6DF] p-3 rounded-sm">
                  <div>
                    <span className="text-[#7A7770] text-[10px] block uppercase tracking-wider">Dimensions</span>
                    <span className="font-mono font-medium text-[#0B0B0B]">{selectedAsset.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-[#7A7770] text-[10px] block uppercase tracking-wider">Taille</span>
                    <span className="font-mono font-medium text-[#0B0B0B]">{selectedAsset.size}</span>
                  </div>
                  <div>
                    <span className="text-[#7A7770] text-[10px] block uppercase tracking-wider">Format MIME</span>
                    <span className="font-mono font-medium text-[#0B0B0B]">{selectedAsset.mimeType}</span>
                  </div>
                  <div>
                    <span className="text-[#7A7770] text-[10px] block uppercase tracking-wider">Date d'ajout</span>
                    <span className="font-mono font-medium text-[#0B0B0B]">{selectedAsset.createdAt}</span>
                  </div>
                </div>

                {/* Supabase Storage Public URL */}
                <div>
                  <span className="text-[#7A7770] text-[10px] block uppercase tracking-wider mb-1">
                    URL Supabase Storage
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <input
                      readOnly
                      value={selectedAsset.url}
                      className="w-full bg-[#F5F3EC] border border-[#D5D2C9] font-mono text-[10px] px-2.5 py-1.5 rounded outline-none select-all text-[#0B0B0B]"
                    />
                    <button
                      onClick={() => handleCopyUrl(selectedAsset.url, selectedAsset.id)}
                      className="p-1.5 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-white rounded shrink-0 cursor-pointer transition-colors"
                      title="Copier l'URL Supabase Storage"
                    >
                      {copiedId === selectedAsset.id ? (
                        <Check className="w-3.5 h-3.5 text-[#B79A5B]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-5 mt-6 border-t border-[#E8E6DF] gap-3">
              <button
                onClick={() => handleDeleteMedia(selectedAsset.id)}
                className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800 text-xs font-medium cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer ce média</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingMediaAsset(selectedAsset);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#B79A5B] hover:bg-[#C8AD6D] text-[#0B0B0B] text-xs font-medium rounded-sm cursor-pointer transition-colors shadow-xs"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Studio Éditeur & Cadrage</span>
                </button>

                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-4 py-2 border border-[#D5D2C9] text-xs font-medium rounded-sm hover:bg-[#F5F3EC] cursor-pointer transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* UPLOAD MODAL */}
      {/* =================================================================== */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-md w-full p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <h3 className="font-serif text-lg font-light text-[#0B0B0B]">
                Importer un Nouveau Visuel
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  URL Supabase Storage *
                </label>
                <input
                  type="text"
                  required
                  value={newAssetUrl}
                  onChange={(e) => setNewAssetUrl(e.target.value)}
                  placeholder="https://...supabase.co/storage/v1/object/public/media/..."
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  Nom d'Usage Lisible *
                </label>
                <input
                  type="text"
                  required
                  value={newAssetDisplayName}
                  onChange={(e) => setNewAssetDisplayName(e.target.value)}
                  placeholder="Ex: Accueil — Hero Campagne Été ou Produit — Nom — Principal"
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Catégorie d'Usage
                  </label>
                  <select
                    value={newAssetUsageTag}
                    onChange={(e) => setNewAssetUsageTag(e.target.value)}
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B] bg-white"
                  >
                    <option value="Non assigné">Non assigné</option>
                    <option value="Accueil">Accueil</option>
                    <option value="Produit">Produit</option>
                    <option value="Collection">Collection</option>
                    <option value="Savoir-Faire">Savoir-Faire</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Boutique">Boutique</option>
                    <option value="Campagne & Lookbook">Campagne & Lookbook</option>
                    <option value="À Propos">À Propos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Nom Technique Fichier
                  </label>
                  <input
                    type="text"
                    value={newAssetTechnicalName}
                    onChange={(e) => setNewAssetTechnicalName(e.target.value)}
                    placeholder="Ex: robe-lin-01.webp"
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-[#D5D2C9] text-xs uppercase font-medium rounded-sm cursor-pointer hover:bg-[#F5F3EC]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B79A5B] text-[#0B0B0B] text-xs uppercase font-medium tracking-wider rounded-sm hover:bg-[#C8AD6D] cursor-pointer shadow-xs"
                >
                  Enregistrer dans la médiathèque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* AILYS BUILT-IN IMAGE EDITOR MODAL */}
      {/* =================================================================== */}
      {editingMediaAsset && (
        <AilysImageEditorModal
          isOpen={!!editingMediaAsset}
          onClose={() => setEditingMediaAsset(null)}
          imageUrl={editingMediaAsset.url}
          imageName={editingMediaAsset.displayName || editingMediaAsset.name}
          initialTransform={editingMediaAsset.transform}
          availableMedia={media}
          onSave={handleSaveMediaTransform}
        />
      )}
    </div>
  );
}
