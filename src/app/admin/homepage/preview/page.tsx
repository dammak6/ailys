"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Monitor, Tablet, Smartphone, ArrowLeft, CheckCircle2 } from "lucide-react";
import HomePage from "@/app/page";

export default function AdminHomepagePreviewPage() {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });
      if (res.ok) {
        setPublished(true);
        setTimeout(() => setPublished(false), 3000);
      }
    } catch (err) {
      console.error("Publish error:", err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col antialiased">
      {/* Top Preview Bar */}
      <div className="bg-[#0B0B0B] border-b border-[#222] px-6 py-3 flex items-center justify-between text-[#F5F3EC] sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/homepage"
            className="p-1 text-[#A3A099] hover:text-white transition-colors"
            title="Retour à l'éditeur"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-serif text-lg tracking-wide">
            AÏLYS • Prévisualisation du Brouillon
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded">
            Non Publié
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center space-x-1 bg-[#1E1E1E] p-1 rounded border border-[#2E2E2E]">
          <button
            onClick={() => setDevice("desktop")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              device === "desktop"
                ? "bg-[#B79A5B] text-[#0B0B0B] font-semibold"
                : "text-[#A3A099] hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Grand Écran (1440px)</span>
          </button>

          <button
            onClick={() => setDevice("tablet")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              device === "tablet"
                ? "bg-[#B79A5B] text-[#0B0B0B] font-semibold"
                : "text-[#A3A099] hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablette (768px)</span>
          </button>

          <button
            onClick={() => setDevice("mobile")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              device === "mobile"
                ? "bg-[#B79A5B] text-[#0B0B0B] font-semibold"
                : "text-[#A3A099] hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Smartphone (375px)</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {published && (
            <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Publié sur le site</span>
            </span>
          )}
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-4 py-1.5 bg-[#B79A5B] hover:bg-[#C8AD6D] text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {publishing ? "Publication..." : "Publier Maintenant"}
          </button>
        </div>
      </div>

      {/* Frame Canvas */}
      <div className="flex-1 p-4 md:p-8 flex items-start justify-center overflow-y-auto">
        <div
          className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden ${
            device === "desktop"
              ? "w-full max-w-7xl rounded-sm"
              : device === "tablet"
              ? "w-[768px] rounded-lg border-4 border-[#222]"
              : "w-[375px] rounded-3xl border-8 border-[#222]"
          }`}
        >
          <iframe
            src="/?preview=true"
            className="w-full min-h-[90vh] border-0"
            title="Preview Frame"
          />
        </div>
      </div>
    </div>
  );
}
