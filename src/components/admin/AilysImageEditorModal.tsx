"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Target,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Eye,
  Check,
  Sparkles,
  Grid3X3,
  FolderOpen,
} from "lucide-react";
import { ImageTransformMetadata, DEFAULT_IMAGE_TRANSFORM } from "@/lib/data";
import { BotanicalEmblem } from "@/components/brand/BotanicalEmblem";

export interface AilysImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageName?: string;
  initialTransform?: ImageTransformMetadata;
  availableMedia?: Array<{ id: string; name: string; url: string }>;
  onSave: (newUrl: string, transform: ImageTransformMetadata) => void;
  onPreviewHomepage?: () => void;
}

const ASPECT_RATIOS = [
  { id: "16:9", label: "16:9", desc: "Hero / Paysage Large", width: 16, height: 9 },
  { id: "21:9", label: "21:9", desc: "Cinématique Bannière", width: 21, height: 9 },
  { id: "16:10", label: "16:10", desc: "Éditorial Paysage", width: 16, height: 10 },
  { id: "4:3", label: "4:3", desc: "Standard Photo", width: 4, height: 3 },
  { id: "1:1", label: "1:1", desc: "Carré / Détails", width: 1, height: 1 },
  { id: "3:4", label: "3:4", desc: "Silhouette AÏLYS", width: 3, height: 4 },
  { id: "2:3", label: "2:3", desc: "Lookbook Vertical", width: 2, height: 3 },
  { id: "9:16", label: "9:16", desc: "Mobile Plein Écran", width: 9, height: 16 },
  { id: "original", label: "Libre", desc: "Format d'origine", width: 0, height: 0 },
];

const POSITION_PRESETS = [
  { label: "↖", pos: "top-left", x: 20, y: 20, title: "Haut Gauche" },
  { label: "↑", pos: "top", x: 50, y: 15, title: "Haut Centre" },
  { label: "↗", pos: "top-right", x: 80, y: 20, title: "Haut Droite" },
  { label: "←", pos: "left", x: 15, y: 50, title: "Milieu Gauche" },
  { label: "•", pos: "center", x: 50, y: 50, title: "Centré" },
  { label: "→", pos: "right", x: 85, y: 50, title: "Milieu Droite" },
  { label: "↙", pos: "bottom-left", x: 20, y: 80, title: "Bas Gauche" },
  { label: "↓", pos: "bottom", x: 50, y: 85, title: "Bas Centre" },
  { label: "↘", pos: "bottom-right", x: 80, y: 80, title: "Bas Droite" },
];

export function AilysImageEditorModal({
  isOpen,
  onClose,
  imageUrl: initialImageUrl,
  imageName = "Image AÏLYS",
  initialTransform,
  availableMedia = [],
  onSave,
  onPreviewHomepage,
}: AilysImageEditorModalProps) {
  const [currentUrl, setCurrentUrl] = useState(initialImageUrl);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [viewTab, setViewTab] = useState<"edit" | "preview">("edit");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showGrid, setShowGrid] = useState(true);

  // Replace media selector modal
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Transform states for Desktop
  const [desktopTransform, setDesktopTransform] = useState<ImageTransformMetadata>(() => {
    return {
      ...DEFAULT_IMAGE_TRANSFORM,
      ...(initialTransform?.desktop || initialTransform || {}),
      aspectRatio: initialTransform?.desktop?.aspectRatio || initialTransform?.aspectRatio || "16:9",
    };
  });

  // Transform states for Mobile
  const [mobileTransform, setMobileTransform] = useState<ImageTransformMetadata>(() => {
    return {
      ...DEFAULT_IMAGE_TRANSFORM,
      ...(initialTransform?.mobile || initialTransform || {}),
      aspectRatio: initialTransform?.mobile?.aspectRatio || initialTransform?.aspectRatio || "3:4",
    };
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUrl(initialImageUrl);
    if (initialTransform) {
      setDesktopTransform({
        ...DEFAULT_IMAGE_TRANSFORM,
        ...(initialTransform.desktop || initialTransform),
        aspectRatio: initialTransform.desktop?.aspectRatio || initialTransform.aspectRatio || "16:9",
      });
      setMobileTransform({
        ...DEFAULT_IMAGE_TRANSFORM,
        ...(initialTransform.mobile || initialTransform),
        aspectRatio: initialTransform.mobile?.aspectRatio || initialTransform.aspectRatio || "3:4",
      });
    }
  }, [initialImageUrl, initialTransform]);

  if (!isOpen) return null;

  // Active transform based on selected mode
  const activeTransform = deviceMode === "desktop" ? desktopTransform : mobileTransform;
  const setActiveTransform = (updates: Partial<ImageTransformMetadata>) => {
    if (deviceMode === "desktop") {
      setDesktopTransform((prev) => ({ ...prev, ...updates }));
    } else {
      setMobileTransform((prev) => ({ ...prev, ...updates }));
    }
  };

  // Click on stage to set Focal Point
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)));
    const yPercent = Math.max(0, Math.min(100, Math.round((clickY / rect.height) * 100)));

    setActiveTransform({
      focalPoint: { x: xPercent, y: yPercent },
      objectPosition: `${xPercent}% ${yPercent}%`,
    });
  };

  // Rotation helpers
  const handleRotateStep = (delta: number) => {
    const nextAngle = (activeTransform.rotate + delta + 360) % 360;
    setActiveTransform({ rotate: nextAngle });
  };

  // Position Preset helper
  const handlePresetSelect = (preset: (typeof POSITION_PRESETS)[0]) => {
    setActiveTransform({
      focalPoint: { x: preset.x, y: preset.y },
      objectPosition: `${preset.x}% ${preset.y}%`,
    });
  };

  // Reset helper
  const handleReset = () => {
    const defaultForMode =
      deviceMode === "desktop"
        ? { ...DEFAULT_IMAGE_TRANSFORM, aspectRatio: "16:9" }
        : { ...DEFAULT_IMAGE_TRANSFORM, aspectRatio: "3:4" };
    setActiveTransform(defaultForMode);
  };

  // Save changes
  const handleSave = () => {
    const combinedTransform: ImageTransformMetadata = {
      zoom: desktopTransform.zoom,
      rotate: desktopTransform.rotate,
      focalPoint: desktopTransform.focalPoint,
      objectPosition: desktopTransform.objectPosition,
      aspectRatio: desktopTransform.aspectRatio,
      desktop: {
        zoom: desktopTransform.zoom,
        rotate: desktopTransform.rotate,
        focalPoint: desktopTransform.focalPoint,
        objectPosition: desktopTransform.objectPosition,
        aspectRatio: desktopTransform.aspectRatio,
      },
      mobile: {
        zoom: mobileTransform.zoom,
        rotate: mobileTransform.rotate,
        focalPoint: mobileTransform.focalPoint,
        objectPosition: mobileTransform.objectPosition,
        aspectRatio: mobileTransform.aspectRatio,
      },
    };

    onSave(currentUrl, combinedTransform);
    onClose();
  };

  // Calculate aspect ratio frame style for Editor stage
  const selectedRatioObj = ASPECT_RATIOS.find((r) => r.id === activeTransform.aspectRatio);
  let stageAspectStyle: React.CSSProperties = { aspectRatio: "16/9" };
  if (selectedRatioObj && selectedRatioObj.width > 0) {
    stageAspectStyle = { aspectRatio: `${selectedRatioObj.width}/${selectedRatioObj.height}` };
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#121212] border border-[#2D2B28] rounded-md max-w-6xl w-full h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#FAF9F5]">
        {/* =================================================================== */}
        {/* MODAL HEADER */}
        {/* =================================================================== */}
        <div className="px-6 py-4 bg-[#181818] border-b border-[#2D2B28] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3">
            <BotanicalEmblem size={22} variant="gold" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-lg font-light text-[#F5F3EC] tracking-wide">
                  Studio Éditeur d'Image AÏLYS
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B79A5B] bg-[#221F1A] px-2 py-0.5 rounded border border-[#B79A5B]/30">
                  Non-Destructif
                </span>
              </div>
              <p className="text-[11px] text-[#A3A099] font-sans truncate max-w-md mt-0.5">
                {imageName} • Cadrage, zoom, point focal et harmonisation responsive
              </p>
            </div>
          </div>

          {/* Mode Switcher: Desktop Mode vs. Mobile Mode */}
          <div className="flex items-center space-x-2 bg-[#0E0E0E] p-1 rounded border border-[#2D2B28]">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                deviceMode === "desktop"
                  ? "bg-[#B79A5B] text-[#0B0B0B] shadow"
                  : "text-[#A3A099] hover:text-[#FAF9F5]"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Cadrage Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                deviceMode === "mobile"
                  ? "bg-[#B79A5B] text-[#0B0B0B] shadow"
                  : "text-[#A3A099] hover:text-[#FAF9F5]"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Cadrage Mobile</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#A3A099] hover:text-white rounded hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =================================================================== */}
        {/* MODAL BODY (CANVAS STAGE + CONTROLS) */}
        {/* =================================================================== */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT/CENTER: INTERACTIVE STAGE */}
          <div className="flex-1 bg-[#090909] p-4 sm:p-6 flex flex-col justify-between overflow-hidden relative">
            {/* View Subtabs: Editor Canvas vs. Multi-Device Simulation */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#222]">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewTab("edit")}
                  className={`px-3 py-1 text-xs rounded font-medium cursor-pointer ${
                    viewTab === "edit"
                      ? "bg-[#2A2A2A] text-white border border-[#444]"
                      : "text-[#888] hover:text-white"
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <Crop className="w-3 h-3 text-[#B79A5B]" />
                    <span>Scène d'Édition</span>
                  </span>
                </button>
                <button
                  onClick={() => setViewTab("preview")}
                  className={`px-3 py-1 text-xs rounded font-medium cursor-pointer ${
                    viewTab === "preview"
                      ? "bg-[#2A2A2A] text-white border border-[#444]"
                      : "text-[#888] hover:text-white"
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <Eye className="w-3 h-3 text-[#B79A5B]" />
                    <span>Aperçu Responsive</span>
                  </span>
                </button>
              </div>

              {viewTab === "edit" ? (
                <div className="flex items-center space-x-3 text-xs text-[#888]">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="rounded text-[#B79A5B]"
                    />
                    <Grid3X3 className="w-3.5 h-3.5" />
                    <span>Grille des tiers</span>
                  </label>
                  <span className="text-[#444]">|</span>
                  <span className="text-[#B79A5B] font-mono text-[11px]">
                    Focal: X {activeTransform.focalPoint.x}% • Y {activeTransform.focalPoint.y}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 bg-[#181818] p-0.5 rounded border border-[#2D2B28]">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`px-2 py-1 rounded text-[11px] flex items-center space-x-1 ${
                      previewDevice === "desktop" ? "bg-[#B79A5B] text-black" : "text-[#888]"
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>1440px</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice("tablet")}
                    className={`px-2 py-1 rounded text-[11px] flex items-center space-x-1 ${
                      previewDevice === "tablet" ? "bg-[#B79A5B] text-black" : "text-[#888]"
                    }`}
                  >
                    <Tablet className="w-3 h-3" />
                    <span>768px</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`px-2 py-1 rounded text-[11px] flex items-center space-x-1 ${
                      previewDevice === "mobile" ? "bg-[#B79A5B] text-black" : "text-[#888]"
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>375px</span>
                  </button>
                </div>
              )}
            </div>

            {/* STAGE AREA */}
            <div className="flex-1 flex items-center justify-center overflow-hidden p-2 relative">
              {viewTab === "edit" ? (
                /* EDIT VIEW */
                <div
                  ref={canvasRef}
                  onClick={handleStageClick}
                  style={stageAspectStyle}
                  className="relative w-full max-w-2xl max-h-[56vh] border-2 border-[#B79A5B]/80 rounded-sm overflow-hidden bg-[#161616] cursor-crosshair shadow-2xl select-none group"
                >
                  {/* Master Image with zoom, rotate, and focal point */}
                  <Image
                    src={currentUrl}
                    alt={imageName}
                    fill
                    priority
                    sizes="100vw"
                    style={{
                      objectPosition: `${activeTransform.focalPoint.x}% ${activeTransform.focalPoint.y}%`,
                      transform: `scale(${activeTransform.zoom}) rotate(${activeTransform.rotate}deg)`,
                      transformOrigin: `${activeTransform.focalPoint.x}% ${activeTransform.focalPoint.y}%`,
                      transition: "transform 0.15s ease-out, object-position 0.15s ease-out",
                    }}
                    className="object-cover pointer-events-none"
                  />

                  {/* Rule of thirds grid overlay */}
                  {showGrid && (
                    <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/10">
                      <div className="border-r border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-b border-white/20" />
                      <div className="border-r border-white/20" />
                      <div className="border-r border-white/20" />
                      <div />
                    </div>
                  )}

                  {/* Interactive Golden Focal Point Marker */}
                  <div
                    style={{
                      left: `${activeTransform.focalPoint.x}%`,
                      top: `${activeTransform.focalPoint.y}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-[#B79A5B] bg-black/40 backdrop-blur-xs flex items-center justify-center shadow-lg shadow-black/80 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-[#B79A5B]" />
                    </div>
                    <div className="absolute top-9 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-[#B79A5B] whitespace-nowrap border border-[#B79A5B]/40">
                      Point Focal ({activeTransform.focalPoint.x}%, {activeTransform.focalPoint.y}%)
                    </div>
                  </div>

                  {/* Canvas helper badge */}
                  <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-[#A3A099] border border-white/10 pointer-events-none">
                    Cliquez n'importe où pour déplacer le point focal • Format: {activeTransform.aspectRatio}
                  </div>
                </div>
              ) : (
                /* PREVIEW SIMULATION VIEW */
                <div className="w-full h-full flex items-center justify-center p-4">
                  {previewDevice === "desktop" && (
                    <div className="w-full max-w-2xl bg-[#141414] border border-[#333] rounded-sm p-3 shadow-2xl flex flex-col items-center">
                      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#222] text-[10px] text-[#888]">
                        <span className="font-mono">Desktop Viewport (1440 × 900)</span>
                        <span>Mode: {desktopTransform.aspectRatio}</span>
                      </div>
                      <div className="relative w-full aspect-16/9 bg-black rounded overflow-hidden">
                        <Image
                          src={currentUrl}
                          alt="Preview Desktop"
                          fill
                          sizes="100vw"
                          style={{
                            objectPosition: `${desktopTransform.focalPoint.x}% ${desktopTransform.focalPoint.y}%`,
                            transform: `scale(${desktopTransform.zoom}) rotate(${desktopTransform.rotate}deg)`,
                            transformOrigin: `${desktopTransform.focalPoint.x}% ${desktopTransform.focalPoint.y}%`,
                          }}
                          className="object-cover"
                        />
                        <div className="absolute bottom-4 left-6 text-white text-shadow">
                          <p className="text-[10px] uppercase tracking-widest text-[#B79A5B]">AÏLYS ÉDITORIAL</p>
                          <h4 className="font-serif text-lg">Cadrage Plein Écran Desktop</h4>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewDevice === "tablet" && (
                    <div className="w-full max-w-md bg-[#141414] border border-[#333] rounded-sm p-3 shadow-2xl flex flex-col items-center">
                      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#222] text-[10px] text-[#888]">
                        <span className="font-mono">Tablette Viewport (768 × 1024)</span>
                        <span>Mode: Adaptatif</span>
                      </div>
                      <div className="relative w-full aspect-4/3 bg-black rounded overflow-hidden">
                        <Image
                          src={currentUrl}
                          alt="Preview Tablet"
                          fill
                          sizes="100vw"
                          style={{
                            objectPosition: `${desktopTransform.focalPoint.x}% ${desktopTransform.focalPoint.y}%`,
                            transform: `scale(${desktopTransform.zoom}) rotate(${desktopTransform.rotate}deg)`,
                            transformOrigin: `${desktopTransform.focalPoint.x}% ${desktopTransform.focalPoint.y}%`,
                          }}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {previewDevice === "mobile" && (
                    <div className="w-full max-w-xs bg-[#141414] border border-[#333] rounded-2xl p-3 shadow-2xl flex flex-col items-center">
                      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#222] text-[10px] text-[#888]">
                        <span className="font-mono">Mobile Viewport (375 × 667)</span>
                        <span>Mode: {mobileTransform.aspectRatio}</span>
                      </div>
                      <div className="relative w-full aspect-3/4 bg-black rounded-lg overflow-hidden border border-white/10">
                        <Image
                          src={currentUrl}
                          alt="Preview Mobile"
                          fill
                          sizes="100vw"
                          style={{
                            objectPosition: `${mobileTransform.focalPoint.x}% ${mobileTransform.focalPoint.y}%`,
                            transform: `scale(${mobileTransform.zoom}) rotate(${mobileTransform.rotate}deg)`,
                            transformOrigin: `${mobileTransform.focalPoint.x}% ${mobileTransform.focalPoint.y}%`,
                          }}
                          className="object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                          <p className="text-[9px] uppercase tracking-widest text-[#B79A5B]">AÏLYS MOBILE</p>
                          <h4 className="font-serif text-xs">Silhouette Portrait Dédiée</h4>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom info bar */}
            <div className="pt-2 border-t border-[#222] flex items-center justify-between text-xs text-[#777]">
              <span className="truncate">
                Source : <code className="text-[#A3A099] font-mono">{currentUrl}</code>
              </span>
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="text-xs text-[#B79A5B] hover:text-[#C8AD6D] font-medium flex items-center space-x-1 cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Remplacer l'image source</span>
              </button>
            </div>
          </div>

          {/* RIGHT: CONTROL PANELS */}
          <div className="w-full lg:w-80 bg-[#161616] border-t lg:border-t-0 lg:border-l border-[#2D2B28] p-5 overflow-y-auto space-y-6 shrink-0">
            {/* 1. ASPECT RATIO SELECTOR */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs uppercase tracking-wider text-[#A3A099] font-medium flex items-center space-x-1.5">
                  <Crop className="w-3.5 h-3.5 text-[#B79A5B]" />
                  <span>Proportions & Ratio ({deviceMode})</span>
                </span>
                <span className="font-mono text-[10px] text-[#B79A5B] font-semibold">
                  {activeTransform.aspectRatio}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {ASPECT_RATIOS.map((ratio) => {
                  const isSelected = activeTransform.aspectRatio === ratio.id;
                  return (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setActiveTransform({ aspectRatio: ratio.id })}
                      className={`p-2 rounded text-left transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#221F1A] border-[#B79A5B] text-[#F5F3EC]"
                          : "bg-[#1E1E1E] border-[#2A2A2A] text-[#888] hover:text-[#FAF9F5] hover:border-[#444]"
                      }`}
                    >
                      <span className="font-mono text-xs font-semibold block">{ratio.label}</span>
                      <span className="text-[9px] text-[#777] block leading-tight truncate">
                        {ratio.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. ZOOM CONTROLS */}
            <div className="pt-4 border-t border-[#222]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-[#A3A099] font-medium flex items-center space-x-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-[#B79A5B]" />
                  <span>Zoom / Échelle</span>
                </span>
                <span className="font-mono text-xs text-[#B79A5B] font-semibold">
                  {activeTransform.zoom.toFixed(2)}x
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveTransform({ zoom: Math.max(1, Number((activeTransform.zoom - 0.1).toFixed(2))) })
                  }
                  className="p-1.5 bg-[#222] hover:bg-[#333] text-white rounded cursor-pointer"
                  title="Dézoomer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={activeTransform.zoom}
                  onChange={(e) => setActiveTransform({ zoom: parseFloat(e.target.value) })}
                  className="w-full accent-[#B79A5B] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() =>
                    setActiveTransform({ zoom: Math.min(3, Number((activeTransform.zoom + 0.1).toFixed(2))) })
                  }
                  className="p-1.5 bg-[#222] hover:bg-[#333] text-white rounded cursor-pointer"
                  title="Zoomer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. ROTATION CONTROLS */}
            <div className="pt-4 border-t border-[#222]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-[#A3A099] font-medium flex items-center space-x-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-[#B79A5B]" />
                  <span>Rotation</span>
                </span>
                <span className="font-mono text-xs text-[#B79A5B] font-semibold">
                  {activeTransform.rotate}°
                </span>
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <button
                  type="button"
                  onClick={() => handleRotateStep(-90)}
                  className="flex-1 py-1.5 bg-[#222] hover:bg-[#333] text-xs text-[#FAF9F5] rounded cursor-pointer flex items-center justify-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3 text-[#B79A5B]" />
                  <span>-90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRotateStep(90)}
                  className="flex-1 py-1.5 bg-[#222] hover:bg-[#333] text-xs text-[#FAF9F5] rounded cursor-pointer flex items-center justify-center space-x-1"
                >
                  <RotateCw className="w-3 h-3 text-[#B79A5B]" />
                  <span>+90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTransform({ rotate: 0 })}
                  className="px-2 py-1.5 bg-[#222] hover:bg-[#333] text-[10px] text-[#A3A099] rounded cursor-pointer"
                  title="Réinitialiser l'angle"
                >
                  0°
                </button>
              </div>

              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={activeTransform.rotate}
                onChange={(e) => setActiveTransform({ rotate: parseInt(e.target.value) })}
                className="w-full accent-[#B79A5B] cursor-pointer"
              />
            </div>

            {/* 4. POINT FOCAL & POSITIONNEMENT RAPIDE */}
            <div className="pt-4 border-t border-[#222]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-[#A3A099] font-medium flex items-center space-x-1.5">
                  <Target className="w-3.5 h-3.5 text-[#B79A5B]" />
                  <span>Point Focal & Position</span>
                </span>
                <span className="font-mono text-[10px] text-[#A3A099]">
                  {activeTransform.focalPoint.x}%, {activeTransform.focalPoint.y}%
                </span>
              </div>

              <p className="text-[11px] text-[#777] mb-3 leading-snug">
                Placez l'ancre sur la zone essentielle (visage, texture lin, zip laiton) pour préserver
                le sujet au redimensionnement.
              </p>

              {/* 9-Point Alignment Grid */}
              <div className="grid grid-cols-3 gap-1 max-w-[150px] mx-auto mb-3">
                {POSITION_PRESETS.map((p) => {
                  const isNear =
                    Math.abs(activeTransform.focalPoint.x - p.x) < 15 &&
                    Math.abs(activeTransform.focalPoint.y - p.y) < 15;
                  return (
                    <button
                      key={p.pos}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      title={p.title}
                      className={`h-8 rounded font-mono text-sm flex items-center justify-center transition-colors cursor-pointer border ${
                        isNear
                          ? "bg-[#B79A5B] text-black font-bold border-[#B79A5B]"
                          : "bg-[#222] border-[#333] text-[#888] hover:text-white hover:bg-[#2a2a2a]"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. RESET ACTIONS */}
            <div className="pt-4 border-t border-[#222] space-y-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 bg-[#222] hover:bg-[#2a2a2a] text-[#FAF9F5] border border-[#333] rounded text-xs font-medium flex items-center justify-center space-x-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#A3A099]" />
                <span>Réinitialiser les transformations ({deviceMode})</span>
              </button>

              {onPreviewHomepage && (
                <button
                  type="button"
                  onClick={onPreviewHomepage}
                  className="w-full py-2 bg-[#1A1814] hover:bg-[#221F1A] text-[#B79A5B] border border-[#B79A5B]/30 rounded text-xs font-medium flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#B79A5B]" />
                  <span>Aperçu Page d'Accueil Complète</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* MODAL FOOTER */}
        {/* =================================================================== */}
        <div className="px-6 py-4 bg-[#181818] border-t border-[#2D2B28] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-[11px] text-[#A3A099]">
            <Sparkles className="w-3.5 h-3.5 text-[#B79A5B]" />
            <span>Fichier original préservé intact. Rendu hardware CSS instantané.</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#333] hover:border-[#555] text-xs uppercase tracking-wider text-[#FAF9F5] rounded-sm cursor-pointer transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-[#B79A5B] hover:bg-[#C8AD6D] text-[#0B0B0B] text-xs uppercase font-medium tracking-wider rounded-sm cursor-pointer transition-colors flex items-center space-x-2 shadow-lg shadow-[#B79A5B]/10"
            >
              <Check className="w-4 h-4 text-[#0B0B0B]" />
              <span>Appliquer et Enregistrer</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MEDIA REPLACEMENT SUB-MODAL */}
      {/* =================================================================== */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#181818] border border-[#333] rounded-md max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <h4 className="font-serif text-base text-white">Remplacer par un Média AÏLYS</h4>
              <button
                onClick={() => setShowMediaPicker(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A3A099] mb-1 font-medium">
                URL directe d'image :
              </label>
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                placeholder="/images/campaign/..."
                className="w-full bg-[#111] border border-[#333] text-xs text-white px-3 py-2 rounded outline-none focus:border-[#B79A5B]"
              />
            </div>

            {availableMedia.length > 0 && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A099] mb-2 font-medium">
                  Ou choisir dans la médiathèque :
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-[#111] rounded border border-[#222]">
                  {availableMedia.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setCurrentUrl(m.url);
                        setShowMediaPicker(false);
                      }}
                      className={`relative aspect-3/4 rounded overflow-hidden cursor-pointer border hover:border-[#B79A5B] ${
                        currentUrl === m.url ? "border-[#B79A5B] ring-2 ring-[#B79A5B]" : "border-[#333]"
                      }`}
                    >
                      <Image src={m.url} alt={m.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-[#2A2A2A]">
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="px-4 py-1.5 bg-[#B79A5B] text-black text-xs uppercase font-medium rounded cursor-pointer"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
