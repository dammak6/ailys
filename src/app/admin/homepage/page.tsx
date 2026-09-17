"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  Edit3,
  Eye,
  EyeOff,
  CheckCircle2,
  Save,
  RotateCcw,
  ExternalLink,
  X,
  Plus,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Tablet,
  Check,
  AlertTriangle,
  Sparkles,
  Crop,
  Sliders,
} from "lucide-react";
import { AilysImageEditorModal } from "@/components/admin/AilysImageEditorModal";
import { ImageTransformMetadata } from "@/lib/data";

export default function AdminHomepageCMSPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [meta, setMeta] = useState<{
    lastPublishedAt: string;
    hasUnpublishedChanges: boolean;
  }>({
    lastPublishedAt: "",
    hasUnpublishedChanges: false,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Status feedback
  const [saveDraftFeedback, setSaveDraftFeedback] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState(false);
  const [discardFeedback, setDiscardFeedback] = useState(false);

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Edit Drawer Modal state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any | null>(null);

  // Media Picker sub-modal state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<"desktop" | "mobile">("desktop");

  // Built-in AÏLYS Image Editor modal state
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [imageEditorField, setImageEditorField] = useState<"desktop" | "mobile">("desktop");

  // In-Page Device Preview Modal state
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const fetchData = async () => {
    try {
      const [cmsRes, prodRes, mediaRes] = await Promise.all([
        fetch("/api/admin/homepage"),
        fetch("/api/admin/products"),
        fetch("/api/admin/media"),
      ]);

      if (cmsRes.ok) {
        const data = await cmsRes.json();
        setSections(data.sections || []);
        if (data.meta) setMeta(data.meta);
      }
      if (prodRes.ok) setProducts(await prodRes.json());
      if (mediaRes.ok) setMediaList(await mediaRes.json());
    } catch (err) {
      console.error("Fetch CMS error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------------------------------------------------------------------
  // DRAG AND DROP REORDERING
  // ---------------------------------------------------------------------------
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...sections];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, movedItem);

    const updated = reordered.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(updated);
    setMeta((prev) => ({ ...prev, hasUnpublishedChanges: true }));
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updated = reordered.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(updated);
    setMeta((prev) => ({ ...prev, hasUnpublishedChanges: true }));
  };

  // ---------------------------------------------------------------------------
  // SAVE DRAFT / PUBLISH / DISCARD ACTIONS
  // ---------------------------------------------------------------------------
  const handleSaveDraft = async () => {
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_draft", sections }),
      });

      if (res.ok) {
        setSaveDraftFeedback(true);
        setMeta((prev) => ({ ...prev, hasUnpublishedChanges: true }));
        setTimeout(() => setSaveDraftFeedback(false), 3000);
      }
    } catch (err) {
      console.error("Save draft error:", err);
    }
  };

  const handlePublish = async () => {
    try {
      // Save draft first, then publish
      await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_draft", sections }),
      });

      const res = await fetch("/api/admin/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });

      if (res.ok) {
        const data = await res.json();
        setPublishFeedback(true);
        setMeta({
          lastPublishedAt: data.publishedAt || new Date().toISOString(),
          hasUnpublishedChanges: false,
        });
        setTimeout(() => setPublishFeedback(false), 4000);
      }
    } catch (err) {
      console.error("Publish error:", err);
    }
  };

  const handleDiscard = async () => {
    if (!confirm("Voulez-vous annuler toutes les modifications du brouillon et restaurer la version publiée ?")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "discard" }),
      });

      if (res.ok) {
        const data = await res.json();
        setSections(data.sections || []);
        setMeta({
          lastPublishedAt: data.meta?.lastPublishedAt || meta.lastPublishedAt,
          hasUnpublishedChanges: false,
        });
        setDiscardFeedback(true);
        setTimeout(() => setDiscardFeedback(false), 3000);
      }
    } catch (err) {
      console.error("Discard error:", err);
    }
  };

  // ---------------------------------------------------------------------------
  // SECTION EDITING
  // ---------------------------------------------------------------------------
  const handleOpenEdit = (sec: any) => {
    setEditingSection(JSON.parse(JSON.stringify(sec)));
    setDrawerOpen(true);
  };

  const handleSaveSectionEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    setSections((prev) =>
      prev.map((s) => (s.id === editingSection.id ? { ...editingSection } : s))
    );
    setMeta((prev) => ({ ...prev, hasUnpublishedChanges: true }));
    setDrawerOpen(false);
  };

  const handleToggleEnable = (secId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === secId ? { ...s, isEnabled: !s.isEnabled } : s))
    );
    setMeta((prev) => ({ ...prev, hasUnpublishedChanges: true }));
  };

  // ---------------------------------------------------------------------------
  // MEDIA PICKER HANDLERS
  // ---------------------------------------------------------------------------
  const openMediaPicker = (target: "desktop" | "mobile") => {
    setMediaTargetField(target);
    setMediaPickerOpen(true);
  };

  const selectMediaAsset = (url: string) => {
    if (editingSection) {
      if (mediaTargetField === "desktop") {
        setEditingSection({ ...editingSection, desktopImage: url });
      } else {
        setEditingSection({ ...editingSection, mobileImage: url });
      }
    }
    setMediaPickerOpen(false);
  };

  // ---------------------------------------------------------------------------
  // BUILT-IN IMAGE EDITOR HANDLERS
  // ---------------------------------------------------------------------------
  const openImageEditor = (target: "desktop" | "mobile") => {
    setImageEditorField(target);
    setImageEditorOpen(true);
  };

  const handleSaveSectionImageTransform = (newUrl: string, transform: ImageTransformMetadata) => {
    if (!editingSection) return;
    if (imageEditorField === "desktop") {
      setEditingSection({
        ...editingSection,
        desktopImage: newUrl,
        desktopImageTransform: transform,
      });
    } else {
      setEditingSection({
        ...editingSection,
        mobileImage: newUrl,
        mobileImageTransform: transform,
      });
    }
    setImageEditorOpen(false);
  };

  // ---------------------------------------------------------------------------
  // PRODUCT SELECTION HANDLER
  // ---------------------------------------------------------------------------
  const toggleProductSelection = (slug: string) => {
    if (!editingSection) return;
    const current = editingSection.selectedProductSlugs || [];
    let updated = [];
    if (current.includes(slug)) {
      updated = current.filter((s: string) => s !== slug);
    } else {
      updated = [...current, slug];
    }
    setEditingSection({ ...editingSection, selectedProductSlugs: updated });
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* HEADER & DRAFT/PUBLISHED STATUS BAR */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white border border-[#E8E6DF] p-6 rounded-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="font-serif text-2xl font-light text-[#0B0B0B]">
                Éditeur Visuel de la Page d'Accueil
              </h2>
              {meta.hasUnpublishedChanges ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-full text-[11px] font-semibold">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Brouillon non publié</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-[11px] font-semibold">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Version en ligne synchronisée</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#7A7770] mt-1">
              Gérez les sections par glisser-déposer, remplacez les visuels et testez en prévisualisation avant de publier.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-[#D5D2C9] hover:border-[#0B0B0B] text-[#0B0B0B] text-xs uppercase font-medium tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer Brouillon</span>
            </button>

            <button
              onClick={() => setPreviewModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#F5F3EC] hover:bg-[#EAE8E1] text-[#0B0B0B] text-xs uppercase font-medium tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#B79A5B]" />
              <span>Prévisualiser</span>
            </button>

            {meta.hasUnpublishedChanges && (
              <button
                onClick={handleDiscard}
                className="inline-flex items-center space-x-1 px-3 py-2 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-sm transition-colors cursor-pointer"
                title="Annuler les modifications"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurer Publié</span>
              </button>
            )}

            <button
              onClick={handlePublish}
              className="inline-flex items-center space-x-2 px-5 py-2 bg-[#B79A5B] hover:bg-[#C8AD6D] text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider rounded-sm transition-all shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publier sur la Boutique</span>
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {publishFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Succès !</strong> Votre nouvelle page d'accueil est maintenant publiée et active sur la boutique en ligne.
            </span>
          </div>
        )}

        {saveDraftFeedback && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs flex items-center space-x-2 animate-fadeIn">
            <Check className="w-4 h-4 text-blue-600" />
            <span>Brouillon enregistré en toute sécurité. La version en ligne reste inchangée.</span>
          </div>
        )}

        {discardFeedback && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded text-xs flex items-center space-x-2 animate-fadeIn">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Le brouillon a été réinitialisé à l'état de la version publiée.</span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SECTIONS LIST WITH DRAG AND DROP */}
      {/* ------------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#7A7770] px-1">
          <span>Glissez-déposez les sections à l'aide de la poignée pour réorganiser leur ordre d'affichage :</span>
          <span>{sections.filter((s) => s.isEnabled).length} / {sections.length} active(s)</span>
        </div>

        {sections.map((section, idx) => (
          <div
            key={section.id || section.key}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            className={`bg-white border rounded-sm transition-all p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              draggedIndex === idx ? "opacity-40 scale-[0.99] border-dashed border-[#B79A5B]" : ""
            } ${
              dragOverIndex === idx && draggedIndex !== idx
                ? "border-t-2 border-t-[#B79A5B] bg-[#FBFBF9]"
                : "border-[#E8E6DF]"
            } ${!section.isEnabled ? "opacity-60 bg-gray-50" : ""}`}
          >
            {/* Left: Drag Handle, Order, and Media Thumbnails */}
            <div className="flex items-center space-x-4">
              {/* Drag Handle */}
              <div
                className="cursor-grab active:cursor-grabbing p-1.5 text-[#A3A099] hover:text-[#0B0B0B] hover:bg-[#F5F3EC] rounded transition-colors"
                title="Glisser pour réorganiser"
              >
                <GripVertical className="w-5 h-5" />
              </div>

              {/* Step Movement fallback buttons */}
              <div className="flex flex-col space-y-0.5">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMoveStep(idx, "up")}
                  className="p-1 text-[#7A7770] hover:text-[#0B0B0B] disabled:opacity-20 cursor-pointer"
                  title="Monter"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={idx === sections.length - 1}
                  onClick={() => handleMoveStep(idx, "down")}
                  className="p-1 text-[#7A7770] hover:text-[#0B0B0B] disabled:opacity-20 cursor-pointer"
                  title="Descendre"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Order Number Badge */}
              <div className="w-7 h-7 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-center font-mono text-xs font-semibold text-[#B79A5B] shrink-0">
                {idx + 1}
              </div>

              {/* Dual Visual Preview (Desktop 16:9 + Mobile 3:4) */}
              <div className="flex items-center space-x-1.5 shrink-0">
                <div
                  className="w-16 h-12 relative bg-[#EFECE4] rounded overflow-hidden border border-[#E8E6DF]"
                  title="Image Desktop"
                >
                  {section.desktopImage && (
                    <Image
                      src={section.desktopImage}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div
                  className="w-8 h-12 relative bg-[#EFECE4] rounded overflow-hidden border border-[#E8E6DF]"
                  title="Image Mobile Dédiée"
                >
                  {section.mobileImage && (
                    <Image
                      src={section.mobileImage}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-medium text-sm text-[#0B0B0B]">
                    {section.title}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#8E8B82] bg-[#F5F3EC] px-1.5 py-0.5 rounded">
                    {section.key}
                  </span>
                  {section.badge && (
                    <span className="text-[10px] text-[#B79A5B] font-medium hidden sm:inline-block">
                      • {section.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7A7770] mt-0.5 line-clamp-1 max-w-md">
                  {section.subtitle}
                </p>
                {section.ctaText && (
                  <span className="text-[10px] text-[#8E8B82] block mt-0.5">
                    Action: « {section.ctaText} » → {section.ctaLink}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Toggle & Edit Button */}
            <div className="flex items-center space-x-3 self-end md:self-center shrink-0">
              <button
                onClick={() => handleToggleEnable(section.id)}
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                  section.isEnabled
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
              >
                {section.isEnabled ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Activé</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Désactivé</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleOpenEdit(section)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-[#F5F3EC] rounded text-xs font-medium uppercase tracking-wider cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#B79A5B]" />
                <span>Modifier</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =================================================================== */}
      {/* SECTION EDIT DRAWER / MODAL */}
      {/* =================================================================== */}
      {drawerOpen && editingSection && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-2xl w-full p-6 shadow-2xl animate-fadeIn my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <div>
                <span className="font-mono text-xs uppercase text-[#B79A5B] font-semibold">
                  SECTION : {editingSection.key}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#0B0B0B]">
                  Modifier le Contenu
                </h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSectionEdits} className="space-y-5 mt-5">
              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Titre Principal de la Section
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSection.title}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, title: e.target.value })
                    }
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Surtitre / Badge
                  </label>
                  <input
                    type="text"
                    value={editingSection.badge || ""}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, badge: e.target.value })
                    }
                    placeholder="Ex: Saison 2026"
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  Sous-Titre / Énoncé
                </label>
                <input
                  type="text"
                  value={editingSection.subtitle || ""}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, subtitle: e.target.value })
                  }
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                  Description Longue / Paragraphe de Confection
                </label>
                <textarea
                  rows={3}
                  value={editingSection.description || ""}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                />
              </div>

              {/* CTA Customization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F0EFEB]">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Intitulé du Bouton (CTA)
                  </label>
                  <input
                    type="text"
                    value={editingSection.ctaText || ""}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, ctaText: e.target.value })
                    }
                    placeholder="Ex: Découvrir la collection"
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                    Lien de Destination
                  </label>
                  <input
                    type="text"
                    value={editingSection.ctaLink || ""}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, ctaLink: e.target.value })
                    }
                    placeholder="Ex: /collections/lumiere-d-ete ou /shop"
                    className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                  />
                </div>
              </div>

              {/* Desktop & Mobile Images with Media Picker & Image Editor Buttons */}
              <div className="space-y-4 pt-2 border-t border-[#F0EFEB]">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs uppercase tracking-wider text-[#7A7770] font-medium">
                      Visuel Desktop (Format Large / Paysage)
                    </label>
                    {editingSection.desktopImageTransform && (
                      <span className="text-[10px] font-mono text-[#B79A5B] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E8E6DF]">
                        Focal: {editingSection.desktopImageTransform.focalPoint?.x ?? 50}%, {editingSection.desktopImageTransform.focalPoint?.y ?? 50}% • Ratio: {editingSection.desktopImageTransform.aspectRatio || "16:9"} • Zoom: {editingSection.desktopImageTransform.zoom ?? 1}x
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingSection.desktopImage || ""}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          desktopImage: e.target.value,
                        })
                      }
                      className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker("desktop")}
                      className="px-3 py-2 bg-[#F5F3EC] hover:bg-[#EAE8E1] text-[#0B0B0B] rounded-sm text-xs font-medium whitespace-nowrap cursor-pointer flex items-center space-x-1"
                      title="Choisir depuis la médiathèque"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#B79A5B]" />
                      <span>Médiathèque</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openImageEditor("desktop")}
                      className="px-3 py-2 bg-[#0B0B0B] hover:bg-[#222] text-[#F5F3EC] rounded-sm text-xs font-medium whitespace-nowrap cursor-pointer flex items-center space-x-1 shadow-sm"
                      title="Ouvrir le Studio Éditeur d'Image"
                    >
                      <Crop className="w-3.5 h-3.5 text-[#B79A5B]" />
                      <span>Éditer l'Image</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs uppercase tracking-wider text-[#7A7770] font-medium">
                      Visuel Mobile Spécifique (Format Portrait / Gros Plan)
                    </label>
                    {editingSection.mobileImageTransform && (
                      <span className="text-[10px] font-mono text-[#B79A5B] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E8E6DF]">
                        Focal: {editingSection.mobileImageTransform.focalPoint?.x ?? 50}%, {editingSection.mobileImageTransform.focalPoint?.y ?? 50}% • Ratio: {editingSection.mobileImageTransform.aspectRatio || "3:4"} • Zoom: {editingSection.mobileImageTransform.zoom ?? 1}x
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingSection.mobileImage || ""}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          mobileImage: e.target.value,
                        })
                      }
                      className="w-full border border-[#D5D2C9] px-3 py-2 text-xs rounded-sm outline-none focus:border-[#B79A5B]"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker("mobile")}
                      className="px-3 py-2 bg-[#F5F3EC] hover:bg-[#EAE8E1] text-[#0B0B0B] rounded-sm text-xs font-medium whitespace-nowrap cursor-pointer flex items-center space-x-1"
                      title="Choisir depuis la médiathèque"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#B79A5B]" />
                      <span>Médiathèque</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openImageEditor("mobile")}
                      className="px-3 py-2 bg-[#0B0B0B] hover:bg-[#222] text-[#F5F3EC] rounded-sm text-xs font-medium whitespace-nowrap cursor-pointer flex items-center space-x-1 shadow-sm"
                      title="Ouvrir le Studio Éditeur d'Image"
                    >
                      <Crop className="w-3.5 h-3.5 text-[#B79A5B]" />
                      <span>Éditer l'Image</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Picker (for collection showcase sections) */}
              {editingSection.key === "new_collection" && (
                <div className="pt-2 border-t border-[#F0EFEB]">
                  <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-2 font-medium">
                    Sélection des Pièces Présentées (3 recommandées)
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-[#D5D2C9] rounded-sm p-3 space-y-2 bg-[#FAF9F5]">
                    {products.map((p) => {
                      const isSelected = (
                        editingSection.selectedProductSlugs || []
                      ).includes(p.slug);
                      return (
                        <label
                          key={p.id}
                          className="flex items-center justify-between p-2 rounded bg-white border border-[#E8E6DF] cursor-pointer hover:border-[#B79A5B]"
                        >
                          <div className="flex items-center space-x-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleProductSelection(p.slug)}
                              className="rounded text-[#B79A5B]"
                            />
                            <span className="text-xs font-medium text-[#0B0B0B]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-[#7A7770] capitalize">
                              ({p.category})
                            </span>
                          </div>
                          <span className="font-serif text-xs font-medium text-[#0B0B0B]">
                            {Number(p.price).toFixed(3)} TND
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Enable / Disable toggle */}
              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sectionEnabled"
                  checked={editingSection.isEnabled}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      isEnabled: e.target.checked,
                    })
                  }
                  className="rounded text-[#B79A5B]"
                />
                <label
                  htmlFor="sectionEnabled"
                  className="text-xs font-medium text-[#0B0B0B] cursor-pointer"
                >
                  Afficher cette section sur la page d'accueil
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2 border border-[#D5D2C9] text-xs uppercase font-medium rounded-sm cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B79A5B] text-[#0B0B0B] text-xs uppercase font-semibold tracking-wider rounded-sm hover:bg-[#C8AD6D] cursor-pointer"
                >
                  Mettre à Jour le Brouillon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MEDIA PICKER MODAL */}
      {/* =================================================================== */}
      {mediaPickerOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-2xl w-full p-6 shadow-2xl animate-fadeIn max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <h3 className="font-serif text-lg font-light text-[#0B0B0B]">
                Choisir depuis la Médiathèque
              </h3>
              <button
                onClick={() => setMediaPickerOpen(false)}
                className="p-1 text-[#7A7770] hover:text-[#0B0B0B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {mediaList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => selectMediaAsset(m.url)}
                  className="group bg-[#FBFBF9] border border-[#E8E6DF] hover:border-[#B79A5B] rounded p-1 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-3/4 w-full bg-[#EFECE4] rounded overflow-hidden">
                    <Image
                      src={m.url}
                      alt={m.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="font-mono text-[9px] text-[#555] truncate mt-1">
                    {m.name}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#E8E6DF]">
              <button
                onClick={() => setMediaPickerOpen(false)}
                className="px-4 py-1.5 border border-[#D5D2C9] text-xs rounded-sm cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* INTERACTIVE PREVIEW MODAL WITH DEVICE SWITCHER */}
      {/* =================================================================== */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex flex-col backdrop-blur-xs">
          {/* Preview Topbar Controls */}
          <div className="bg-[#0B0B0B] border-b border-[#222] px-6 py-3.5 flex items-center justify-between text-[#F5F3EC] shrink-0">
            <div className="flex items-center space-x-3">
              <span className="font-serif text-lg text-[#F5F3EC]">
                AÏLYS • Prévisualisation
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded">
                Brouillon Actif
              </span>
            </div>

            {/* Device Switcher Pills */}
            <div className="flex items-center space-x-1 bg-[#1A1A1A] p-1 rounded border border-[#2E2E2E]">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs transition-colors ${
                  previewDevice === "desktop"
                    ? "bg-[#B79A5B] text-[#0B0B0B] font-semibold"
                    : "text-[#A3A099] hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (1440px)</span>
              </button>

              <button
                onClick={() => setPreviewDevice("tablet")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs transition-colors ${
                  previewDevice === "tablet"
                    ? "bg-[#B79A5B] text-[#0B0B0B] font-semibold"
                    : "text-[#A3A099] hover:text-white"
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablette (768px)</span>
              </button>

              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs transition-colors ${
                  previewDevice === "mobile"
                    ? "bg-[#B79A5B] text-[#0B0B0B] font-semibold"
                    : "text-[#A3A099] hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (375px)</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setPreviewModalOpen(false);
                  handlePublish();
                }}
                className="px-4 py-1.5 bg-[#B79A5B] hover:bg-[#C8AD6D] text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Publier Maintenant
              </button>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1.5 text-[#A3A099] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Device Frame Viewport Container */}
          <div className="flex-1 overflow-y-auto p-4 flex items-start justify-center bg-[#141414]">
            <div
              className={`bg-[#F5F3EC] shadow-2xl transition-all duration-300 rounded-sm overflow-hidden my-4 ${
                previewDevice === "desktop"
                  ? "w-full max-w-6xl"
                  : previewDevice === "tablet"
                  ? "w-[768px] border-4 border-[#2E2E2E]"
                  : "w-[375px] border-8 border-[#2E2E2E] rounded-2xl"
              }`}
            >
              {/* Render dynamic preview of sections */}
              <div className="w-full text-[#0B0B0B]">
                {sections.map((sec) => {
                  if (!sec.isEnabled) return null;
                  return (
                    <div
                      key={sec.id}
                      className="border-b border-black/10 relative group"
                    >
                      {sec.key === "hero" && (() => {
                        const heroImg =
                          previewDevice === "mobile"
                            ? sec.mobileImage || sec.desktopImage
                            : sec.desktopImage;
                        const heroTransform =
                          previewDevice === "mobile"
                            ? sec.mobileImageTransform?.mobile || sec.mobileImageTransform || sec.desktopImageTransform
                            : sec.desktopImageTransform?.desktop || sec.desktopImageTransform;
                        return (
                          <div className="relative min-h-[450px] bg-[#0B0B0B] text-[#F5F3EC] flex items-end p-8 overflow-hidden">
                            <Image
                              src={heroImg}
                              alt={sec.title}
                              fill
                              style={
                                heroTransform
                                  ? {
                                      objectPosition: `${heroTransform.focalPoint?.x ?? 50}% ${heroTransform.focalPoint?.y ?? 50}%`,
                                      transform: `scale(${heroTransform.zoom ?? 1}) rotate(${heroTransform.rotate ?? 0}deg)`,
                                      transformOrigin: `${heroTransform.focalPoint?.x ?? 50}% ${heroTransform.focalPoint?.y ?? 50}%`,
                                    }
                                  : undefined
                              }
                              className="object-cover opacity-75"
                            />
                            <div className="relative z-10 space-y-3 max-w-xl">
                              <span className="text-[10px] text-[#B79A5B] uppercase tracking-widest font-semibold block">
                                {sec.badge || "Nouvelle Collection"}
                              </span>
                              <h2 className="font-serif text-3xl sm:text-5xl leading-tight">
                                {sec.title}
                              </h2>
                              <p className="text-xs text-[#F5F3EC]/80 leading-relaxed font-light">
                                {sec.subtitle}
                              </p>
                              {sec.ctaText && (
                                <div className="pt-2">
                                  <span className="inline-block px-4 py-2 bg-[#B79A5B] text-[#0B0B0B] text-xs uppercase font-medium tracking-wider">
                                    {sec.ctaText}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {sec.key === "new_collection" && (
                        <div className="p-8 bg-[#F5F3EC] space-y-6">
                          <div className="text-center space-y-2">
                            <span className="text-[10px] text-[#B79A5B] uppercase tracking-widest font-medium">
                              {sec.badge || "Collection"}
                            </span>
                            <h3 className="font-serif text-2xl font-light text-[#0B0B0B]">
                              {sec.title}
                            </h3>
                            <p className="text-xs text-[#7A7770]">
                              {sec.subtitle}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {products.slice(0, 3).map((p) => (
                              <div key={p.id} className="bg-white p-2 rounded border border-[#E8E6DF]">
                                <div className="aspect-3/4 relative bg-[#EFECE4] rounded overflow-hidden">
                                  <Image
                                    src={p.primaryImage || "/images/editorial/03_the_silhouette.png"}
                                    alt={p.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="mt-2 text-xs font-medium">{p.name}</div>
                                <div className="font-serif text-xs text-[#B79A5B]">
                                  {Number(p.price).toFixed(3)} TND
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.key === "philosophy" && (
                        <div className="p-10 bg-[#0B0B0B] text-[#F5F3EC] text-center space-y-4">
                          <span className="text-[10px] text-[#B79A5B] uppercase tracking-widest block">
                            {sec.badge || "Philosophie"}
                          </span>
                          <h3 className="font-serif text-3xl font-light">
                            {sec.title}
                          </h3>
                          <blockquote className="font-serif italic text-sm text-[#B79A5B] max-w-md mx-auto">
                            {sec.subtitle}
                          </blockquote>
                          <p className="text-xs text-[#A3A099] max-w-md mx-auto leading-relaxed">
                            {sec.description}
                          </p>
                        </div>
                      )}

                      {sec.key === "craftsmanship" && (
                        <div className="p-8 bg-[#F5F3EC] text-center space-y-4">
                          <span className="text-[10px] text-[#B79A5B] uppercase tracking-widest block">
                            {sec.badge || "Savoir-Faire"}
                          </span>
                          <h3 className="font-serif text-2xl font-light text-[#0B0B0B]">
                            {sec.title}
                          </h3>
                          <p className="text-xs text-[#7A7770]">{sec.subtitle}</p>
                        </div>
                      )}

                      {sec.key === "about" && (() => {
                        const aboutTransform =
                          previewDevice === "mobile"
                            ? sec.mobileImageTransform?.mobile || sec.mobileImageTransform || sec.desktopImageTransform
                            : sec.desktopImageTransform?.desktop || sec.desktopImageTransform;
                        return (
                          <div className="p-8 bg-[#EFECE4] flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-full sm:w-48 aspect-3/4 relative rounded overflow-hidden shrink-0">
                              <Image
                                src={sec.desktopImage || "/images/editorial/07_minimal_studio.png"}
                                alt="About"
                                fill
                                style={
                                  aboutTransform
                                    ? {
                                        objectPosition: `${aboutTransform.focalPoint?.x ?? 50}% ${aboutTransform.focalPoint?.y ?? 50}%`,
                                        transform: `scale(${aboutTransform.zoom ?? 1}) rotate(${aboutTransform.rotate ?? 0}deg)`,
                                        transformOrigin: `${aboutTransform.focalPoint?.x ?? 50}% ${aboutTransform.focalPoint?.y ?? 50}%`,
                                      }
                                    : undefined
                                }
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-2">
                              <span className="text-[10px] text-[#B79A5B] uppercase tracking-widest">
                                {sec.badge || "Histoire"}
                              </span>
                              <h3 className="font-serif text-2xl font-light text-[#0B0B0B]">
                                {sec.title}
                              </h3>
                              <p className="text-xs text-[#555] leading-relaxed">
                                {sec.description}
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      {sec.key === "final_cta" && (
                        <div className="p-10 bg-[#0B0B0B] text-[#F5F3EC] text-center space-y-4">
                          <h3 className="font-serif text-3xl font-light">
                            {sec.title}
                          </h3>
                          <p className="text-xs text-[#A3A099] max-w-sm mx-auto">
                            {sec.subtitle}
                          </p>
                          {sec.ctaText && (
                            <span className="inline-block px-5 py-2.5 bg-[#B79A5B] text-[#0B0B0B] text-xs uppercase font-semibold tracking-wider">
                              {sec.ctaText}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* BUILT-IN AÏLYS IMAGE EDITOR MODAL */}
      {/* =================================================================== */}
      {imageEditorOpen && editingSection && (
        <AilysImageEditorModal
          isOpen={imageEditorOpen}
          onClose={() => setImageEditorOpen(false)}
          imageUrl={
            imageEditorField === "desktop"
              ? editingSection.desktopImage || "/images/editorial/01_ailys_hero.png"
              : editingSection.mobileImage || "/images/editorial/02_ailys_portrait.png"
          }
          imageName={`${editingSection.title} — Visuel ${
            imageEditorField === "desktop" ? "Desktop" : "Mobile"
          }`}
          initialTransform={
            imageEditorField === "desktop"
              ? editingSection.desktopImageTransform
              : editingSection.mobileImageTransform
          }
          availableMedia={mediaList}
          onSave={handleSaveSectionImageTransform}
          onPreviewHomepage={() => {
            setImageEditorOpen(false);
            setPreviewModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
