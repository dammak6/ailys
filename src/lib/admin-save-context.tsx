"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AdminSaveContextType {
  isSaving: boolean;
  savedSuccess: boolean;
  lastSavedTime: string | null;
  hasPendingChanges: boolean;
  setHasPendingChanges: (pending: boolean) => void;
  saveAll: (activePayload?: any) => Promise<boolean>;
}

const AdminSaveContext = createContext<AdminSaveContextType>({
  isSaving: false,
  savedSuccess: false,
  lastSavedTime: null,
  hasPendingChanges: false,
  setHasPendingChanges: () => {},
  saveAll: async () => false,
});

export function AdminSaveProvider({ children }: { children: React.ReactNode }) {
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  // Fetch initial last saved time
  useEffect(() => {
    async function checkLastSave() {
      try {
        const res = await fetch("/api/admin/save");
        if (res.ok) {
          const data = await res.json();
          if (data.lastSavedAt) {
            const date = new Date(data.lastSavedAt);
            setLastSavedTime(
              date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
            );
          }
        }
      } catch {
        // Silently ignore
      }
    }
    checkLastSave();
  }, []);

  const saveAll = useCallback(
    async (activePayload?: any): Promise<boolean> => {
      if (isSaving) return false;
      setIsSaving(true);
      setSavedSuccess(false);

      try {
        // Broadcast pre-save event so active pages can append their state if needed
        const preSaveEvent = new CustomEvent("ailys:admin-before-save", {
          detail: { payload: activePayload || {} },
        });
        window.dispatchEvent(preSaveEvent);

        const res = await fetch("/api/admin/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activePayload || {}),
        });

        if (!res.ok) {
          throw new Error("Erreur de sauvegarde");
        }

        const data = await res.json();
        const now = new Date(data.lastSavedAt || Date.now());
        const formattedTime = now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        setLastSavedTime(formattedTime);
        setSavedSuccess(true);
        setHasPendingChanges(false);

        // Broadcast save completed event
        window.dispatchEvent(
          new CustomEvent("ailys:admin-save-completed", {
            detail: { savedAt: data.lastSavedAt, stats: data.stats },
          })
        );

        setTimeout(() => {
          setSavedSuccess(false);
        }, 4000);

        return true;
      } catch (err) {
        console.error("Failed to save admin state:", err);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving]
  );

  // Global keyboard shortcut: Ctrl+S or Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveAll]);

  return (
    <AdminSaveContext.Provider
      value={{
        isSaving,
        savedSuccess,
        lastSavedTime,
        hasPendingChanges,
        setHasPendingChanges,
        saveAll,
      }}
    >
      {children}
    </AdminSaveContext.Provider>
  );
}

export function useAdminSave() {
  return useContext(AdminSaveContext);
}
