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
} from "lucide-react";
import { AilysImageEditorModal } from "@/components/admin/AilysImageEditorModal";
import { ImageTransformMetadata } from "@/lib/data";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newAssetUrl, setNewAssetUrl] = useState("");
  const [newAssetName, setNewAssetName] = useState("");

  // Built-in Image Editor modal state
  const [editingMediaAsset, setEditingMediaAsset] = useState<any | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) setMedia(await res.json());
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
          name: newAssetName || `asset-${Date.now()}.webp`,
          dimensions: "1600 x 2000",
          size: "180 KB",
          mimeType: "image/webp",
        }),
      });

      if (res.ok) {
        setUploadModalOpen(false);
        setNewAssetUrl("");
        setNewAssetName("");
        fetchMedia();
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDeleteMedia = async (id: string) => {
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

  const filteredMedia = media.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase())
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
            Stockage haute résolution des photographies de silhouette, textures et packagings.
          </p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-[#F5F3EC] text-xs font-medium uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4 text-[#B79A5B]" />
          <span>Importer un Média</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#E8E6DF] p-3 rounded-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer les fichiers par nom..."
            className="w-full bg-[#FBFBF9] border border-[#D5D2C9] text-xs py-2 pl-9 pr-4 rounded-sm outline-none focus:border-[#B79A5B]"
          />
          <Search className="w-3.5 h-3.5 text-[#7A7770] absolute left-3 top-2.5" />
        </div>
        <span className="text-xs text-[#7A7770]">
          {filteredMedia.length} fichier(s) répertorié(s)
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="group bg-white border border-[#E8E6DF] hover:border-[#B79A5B] rounded-sm overflow-hidden cursor-pointer transition-all flex flex-col justify-between relative"
          >
            <div className="relative aspect-3/4 bg-[#FAF9F5] overflow-hidden">
              <Image
                src={asset.url}
                alt={asset.name}
                fill
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
              {asset.transform && (
                <div className="absolute top-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-[#B79A5B] text-[9px] font-mono px-1.5 py-0.5 rounded border border-[#B79A5B]/30 flex items-center space-x-1">
                  <Crop className="w-2.5 h-2.5" />
                  <span>{asset.transform.aspectRatio || "Cadré"}</span>
                </div>
              )}
            </div>
            <div className="p-2.5 border-t border-[#E8E6DF] bg-white">
              <p className="font-mono text-[10px] text-[#0B0B0B] truncate font-medium">
                {asset.name}
              </p>
              <p className="text-[9px] text-[#7A7770] mt-0.5">
                {asset.dimensions} • {asset.size}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* =================================================================== */}
      {/* ASSET DETAIL DRAWER / MODAL */}
      {/* =================================================================== */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-lg w-full p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <h3 className="font-serif text-lg font-light text-[#0B0B0B] truncate max-w-xs">
                {selectedAsset.name}
              </h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-5">
              <div className="relative w-full sm:w-48 aspect-3/4 bg-[#FAF9F5] rounded-sm overflow-hidden shrink-0 border border-[#E8E6DF]">
                <Image
                  src={selectedAsset.url}
                  alt={selectedAsset.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 space-y-3 text-xs">
                <div>
                  <span className="text-[#7A7770] block">Dimensions:</span>
                  <span className="font-mono font-medium text-[#0B0B0B]">
                    {selectedAsset.dimensions}
                  </span>
                </div>
                <div>
                  <span className="text-[#7A7770] block">Taille du fichier:</span>
                  <span className="font-mono font-medium text-[#0B0B0B]">
                    {selectedAsset.size}
                  </span>
                </div>
                <div>
                  <span className="text-[#7A7770] block">Format:</span>
                  <span className="font-mono font-medium text-[#0B0B0B]">
                    {selectedAsset.mimeType}
                  </span>
                </div>
                <div>
                  <span className="text-[#7A7770] block mb-1">URL Relative:</span>
                  <div className="flex items-center space-x-1.5">
                    <input
                      readOnly
                      value={selectedAsset.url}
                      className="w-full bg-[#F5F3EC] border border-[#D5D2C9] font-mono text-[10px] px-2 py-1.5 rounded outline-none select-all"
                    />
                    <button
                      onClick={() =>
                        handleCopyUrl(selectedAsset.url, selectedAsset.id)
                      }
                      className="p-1.5 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-white rounded shrink-0 cursor-pointer"
                      title="Copier l'URL"
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

            <div className="flex items-center justify-between pt-5 mt-5 border-t border-[#E8E6DF]">
              <button
                onClick={() => handleDeleteMedia(selectedAsset.id)}
                className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800 text-xs font-medium cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer ce média</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingMediaAsset(selectedAsset);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#B79A5B] hover:bg-[#C8AD6D] text-[#0B0B0B] text-xs font-medium rounded-sm cursor-pointer transition-colors"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Studio Éditeur & Cadrage</span>
                </button>

                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-4 py-1.5 border border-[#D5D2C9] text-xs font-medium rounded-sm hover:bg-[#F5F3EC] cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
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
                  URL de l'Image ou du Fichier
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
                  Nom du Fichier (Optionnel)
                </label>
                <input
                  type="text"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  placeholder="Ex: ensemble-tailleur-lin.webp"
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-[#D5D2C9] text-xs uppercase font-medium rounded-sm cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B79A5B] text-[#0B0B0B] text-xs uppercase font-medium tracking-wider rounded-sm hover:bg-[#C8AD6D] cursor-pointer"
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
          imageName={editingMediaAsset.name}
          initialTransform={editingMediaAsset.transform}
          availableMedia={media}
          onSave={handleSaveMediaTransform}
        />
      )}
    </div>
  );
}
