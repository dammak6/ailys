"use client";

import React from "react";
import { Save, Check, Loader2 } from "lucide-react";
import { useAdminSave } from "@/lib/admin-save-context";

interface AdminSaveButtonProps {
  variant?: "header" | "mobile" | "banner";
  className?: string;
}

export function AdminSaveButton({
  variant = "header",
  className = "",
}: AdminSaveButtonProps) {
  const { isSaving, savedSuccess, lastSavedTime, saveAll } = useAdminSave();

  if (variant === "mobile") {
    return (
      <button
        onClick={() => saveAll()}
        disabled={isSaving}
        title="Enregistrer les modifications (Ctrl+S)"
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
          savedSuccess
            ? "bg-emerald-600 text-white"
            : isSaving
            ? "bg-[#1E1E1E] text-[#B79A5B] opacity-80"
            : "bg-[#B79A5B] text-[#0B0B0B] hover:bg-[#c4a969] active:scale-95"
        } ${className}`}
      >
        {isSaving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : savedSuccess ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Save className="w-3.5 h-3.5" />
        )}
        <span className="text-[11px] font-semibold">
          {isSaving ? "Sauvegarde..." : savedSuccess ? "Enregistré" : "Sauvegarder"}
        </span>
      </button>
    );
  }

  if (variant === "banner") {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => saveAll()}
          disabled={isSaving}
          className={`inline-flex items-center space-x-2 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-sm transition-all shadow-xs cursor-pointer ${
            savedSuccess
              ? "bg-emerald-600 text-white"
              : isSaving
              ? "bg-[#1E1E1E] text-[#B79A5B] cursor-wait"
              : "bg-[#B79A5B] hover:bg-[#A88B4A] text-[#0B0B0B] font-semibold active:scale-[0.98]"
          } ${className}`}
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B79A5B]" />
          ) : savedSuccess ? (
            <Check className="w-3.5 h-3.5 text-white" />
          ) : (
            <Save className="w-3.5 h-3.5 text-[#0B0B0B]" />
          )}
          <span>
            {isSaving
              ? "Enregistrement..."
              : savedSuccess
              ? "Modifications Enregistrées"
              : "Enregistrer les modifications"}
          </span>
        </button>
        {lastSavedTime && (
          <span className="text-[11px] text-[#7A7770] hidden lg:inline">
            Dernière sauvegarde : {lastSavedTime}
          </span>
        )}
      </div>
    );
  }

  // Default "header" variant
  return (
    <div className="flex items-center space-x-2.5">
      {lastSavedTime && (
        <span className="hidden xl:inline text-[11px] text-[#8C887B]">
          Dernière sauvegarde : <strong className="text-[#4A473E] font-medium">{lastSavedTime}</strong>
        </span>
      )}
      <button
        onClick={() => saveAll()}
        disabled={isSaving}
        title="Enregistrer toutes les modifications dans la base (Ctrl+S)"
        className={`group relative inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-sm text-xs font-medium tracking-wide transition-all shadow-xs cursor-pointer ${
          savedSuccess
            ? "bg-emerald-600 text-white border border-emerald-600"
            : isSaving
            ? "bg-[#1C1C1C] text-[#B79A5B] border border-[#333] cursor-wait"
            : "bg-[#0B0B0B] hover:bg-[#1E1E1E] text-[#F5F3EC] border border-[#1E1E1E] hover:border-[#B79A5B] active:scale-[0.98]"
        } ${className}`}
      >
        {isSaving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B79A5B]" />
        ) : savedSuccess ? (
          <Check className="w-3.5 h-3.5 text-white" />
        ) : (
          <Save className="w-3.5 h-3.5 text-[#B79A5B] group-hover:scale-110 transition-transform" />
        )}

        <span className="font-semibold">
          {isSaving
            ? "Enregistrement..."
            : savedSuccess
            ? "Enregistré !"
            : "Enregistrer"}
        </span>

        {/* Keyboard shortcut hint */}
        {!isSaving && !savedSuccess && (
          <span className="hidden sm:inline-block ml-1 text-[10px] px-1.5 py-0.2 bg-[#222] text-[#B79A5B] rounded border border-[#333]">
            Ctrl+S
          </span>
        )}
      </button>
    </div>
  );
}
