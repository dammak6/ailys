"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Check,
  Shield,
  Truck,
  Phone,
  Mail,
  MapPin,
  Megaphone,
  Globe,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAdminSave } from "@/lib/admin-save-context";
import { useAdminAuth } from "@/lib/admin-auth-context";

export default function AdminSettingsPage() {
  const { user } = useAdminAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const { saveAll, isSaving: globalSaving, savedSuccess: globalSavedSuccess } = useAdminSave();
  const [settings, setSettings] = useState<any>({
    brandName: "AÏLYS",
    brandTagline: "Maison de Confection Contemporaine Tunisienne",
    contactPhone: "+216 11223344",
    contactWhatsApp: "+216 11223344",
    contactEmail: "concierge@ailys.tn",
    openingHours: "Du lundi au samedi, 9h — 19h",
    atelierAddress: "Sfax, Tunisie",
    instagramUrl: "https://instagram.com/ailys.officiel",
    facebookUrl: "https://www.facebook.com/profile.php?id=61593845134583",
    tiktokUrl: "",
    freeShippingThreshold: 200,
    standardShippingFee: 7,
    deliveryDelayTunis: "24h - 48h",
    deliveryDelayRegions: "24h - 48h",
    announcementBarMessage:
      "Livraison 24h - 48h partout en Tunisie • Expédié depuis Sfax • Paiement à la livraison",
    announcementBarActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Settings error:", err);
      }
    }
    loadSettings();
  }, []);

  // Listen to global save request before it commits
  useEffect(() => {
    const handleBeforeSave = () => {
      fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      }).catch(console.error);
    };

    window.addEventListener("ailys:admin-before-save", handleBeforeSave);
    return () => window.removeEventListener("ailys:admin-before-save", handleBeforeSave);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ok = await saveAll({ settings });
      if (ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="bg-white border border-[#E8E6DF] rounded-sm p-8 max-w-xl mx-auto my-12 text-center animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-[#0B0B0B] mb-2 font-light">
          Accès Restreint aux Super Administrateurs
        </h2>
        <p className="text-xs text-[#7A7770] leading-relaxed mb-6">
          Votre compte dispose du rôle <span className="font-semibold text-[#0B0B0B]">ADMIN</span> (Gestion opérationnelle).
          La modification des paramètres système et politiques de la maison est strictement réservée à la Direction AÏLYS.
        </p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center px-4 py-2.5 bg-[#0B0B0B] text-[#F5F3EC] text-xs font-medium uppercase tracking-wider rounded-sm hover:bg-[#222] transition-colors"
        >
          Retour aux Commandes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#0B0B0B]">
            Paramètres Généraux de la Maison
          </h2>
          <p className="text-xs text-[#7A7770] mt-0.5">
            Tarifs de livraison en Tunisie, seuils de gratuité, coordonnées atelier et bandeau d'annonce.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-sm animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Paramètres enregistrés</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Brand & Atelier */}
        <div className="bg-white border border-[#E8E6DF] p-6 rounded-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#E8E6DF] text-[#0B0B0B]">
            <Shield className="w-4 h-4 text-[#B79A5B]" />
            <h3 className="font-serif text-base font-medium">
              Identité de la Marque & Atelier
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Nom de la Marque
              </label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) =>
                  setSettings({ ...settings, brandName: e.target.value })
                }
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Signature / Slogan
              </label>
              <input
                type="text"
                value={settings.brandTagline}
                onChange={(e) =>
                  setSettings({ ...settings, brandTagline: e.target.value })
                }
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Téléphone Conciergerie
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) =>
                  setSettings({ ...settings, contactPhone: e.target.value })
                }
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                WhatsApp Concierge
              </label>
              <input
                type="text"
                value={settings.contactWhatsApp}
                onChange={(e) =>
                  setSettings({ ...settings, contactWhatsApp: e.target.value })
                }
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Courriel Officiel
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) =>
                  setSettings({ ...settings, contactEmail: e.target.value })
                }
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Adresse de l'Atelier
              </label>
              <input
                type="text"
                value={settings.atelierAddress}
                onChange={(e) =>
                  setSettings({ ...settings, atelierAddress: e.target.value })
                }
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Horaires d'Ouverture & Conciergerie
              </label>
              <input
                type="text"
                value={settings.openingHours || ""}
                onChange={(e) =>
                  setSettings({ ...settings, openingHours: e.target.value })
                }
                placeholder="Du lundi au samedi, 9h — 19h"
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>
          </div>
        </div>

        {/* Section: Social Media & Public Links */}
        <div className="bg-white border border-[#E8E6DF] p-6 rounded-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#E8E6DF] text-[#0B0B0B]">
            <Globe className="w-4 h-4 text-[#B79A5B]" />
            <h3 className="font-serif text-base font-medium">
              Réseaux Sociaux & Présence en Ligne
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Lien Instagram
              </label>
              <input
                type="url"
                value={settings.instagramUrl || ""}
                onChange={(e) =>
                  setSettings({ ...settings, instagramUrl: e.target.value })
                }
                placeholder="https://instagram.com/ailys.officiel"
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Lien Facebook
              </label>
              <input
                type="url"
                value={settings.facebookUrl || ""}
                onChange={(e) =>
                  setSettings({ ...settings, facebookUrl: e.target.value })
                }
                placeholder="https://facebook.com/..."
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Lien TikTok
              </label>
              <input
                type="url"
                value={settings.tiktokUrl || ""}
                onChange={(e) =>
                  setSettings({ ...settings, tiktokUrl: e.target.value })
                }
                placeholder="https://tiktok.com/@..."
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Logistics & Tunisian COD Settings */}
        <div className="bg-white border border-[#E8E6DF] p-6 rounded-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#E8E6DF] text-[#0B0B0B]">
            <Truck className="w-4 h-4 text-[#B79A5B]" />
            <h3 className="font-serif text-base font-medium">
              Logistique & Tarifs de Livraison (Paiement à la Livraison)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Seuil de Livraison Gratuite (TND)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freeShippingThreshold: Number(e.target.value),
                  })
                }
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
              <span className="text-[11px] text-[#888] mt-1 block">
                Offerte automatiquement dès ce montant dans le panier.
              </span>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Frais de Port Standards (TND)
              </label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    standardShippingFee: Number(e.target.value),
                  })
                }
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
              <span className="text-[11px] text-[#888] mt-1 block">
                Tarif appliqué si panier inférieur au seuil gratuit.
              </span>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Délai Estimé Grand Tunis & Nord (depuis Sfax)
              </label>
              <input
                type="text"
                value={settings.deliveryDelayTunis}
                onChange={(e) =>
                  setSettings({ ...settings, deliveryDelayTunis: e.target.value })
                }
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Délai Estimé Centre & Sud (depuis Sfax)
              </label>
              <input
                type="text"
                value={settings.deliveryDelayRegions}
                onChange={(e) =>
                  setSettings({ ...settings, deliveryDelayRegions: e.target.value })
                }
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Announcement Bar */}
        <div className="bg-white border border-[#E8E6DF] p-6 rounded-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#E8E6DF] text-[#0B0B0B]">
            <Megaphone className="w-4 h-4 text-[#B79A5B]" />
            <h3 className="font-serif text-base font-medium">
              Bandeau d'Annonce Supérieur
            </h3>
          </div>

          <div className="text-xs space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A7770] mb-1 font-medium">
                Message Diffusé en Tête de Page
              </label>
              <input
                type="text"
                value={settings.announcementBarMessage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcementBarMessage: e.target.value,
                  })
                }
                className="w-full border border-[#D5D2C9] px-3 py-2 rounded-sm outline-none focus:border-[#B79A5B]"
              />
            </div>

            <label className="flex items-center space-x-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={settings.announcementBarActive}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcementBarActive: e.target.checked,
                  })
                }
                className="rounded text-[#B79A5B]"
              />
              <span className="text-[#0B0B0B] font-medium">
                Afficher le bandeau sur le site client
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#B79A5B] hover:bg-[#C8AD6D] text-[#0B0B0B] font-medium text-xs uppercase tracking-wider rounded-sm transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Enregistrement..." : "Enregistrer les Paramètres"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
