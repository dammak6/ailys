"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SiteSettings {
  brandName: string;
  brandTagline: string;
  atelierAddress: string;
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  openingHours: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  shippingCurrency: string;
  deliveryDelayTunis: string;
  deliveryDelayRegions: string;
  announcementBarMessage: string;
  announcementBarActive: boolean;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: "AÏLYS",
  brandTagline: "Maison de Confection Contemporaine Tunisienne",
  atelierAddress: "Sfax, Tunisie",
  contactPhone: "+216 11223344",
  contactWhatsApp: "+216 11223344",
  contactEmail: "concierge@ailys.tn",
  openingHours: "Du lundi au samedi, 9h — 19h",
  instagramUrl: "https://instagram.com/ailys.officiel",
  facebookUrl: "https://www.facebook.com/profile.php?id=61593845134583",
  tiktokUrl: "",
  freeShippingThreshold: 200,
  standardShippingFee: 7,
  shippingCurrency: "TND",
  deliveryDelayTunis: "24h - 48h",
  deliveryDelayRegions: "24h - 48h",
  announcementBarMessage:
    "Livraison 24h - 48h partout en Tunisie • Expédié depuis Sfax • Paiement à la livraison",
  announcementBarActive: true,
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SITE_SETTINGS,
  loading: false,
  refreshSettings: async () => {},
});

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: Partial<SiteSettings>;
}) {
  const [settings, setSettings] = useState<SiteSettings>({
    ...DEFAULT_SITE_SETTINGS,
    ...(initialSettings || {}),
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Failed to load site settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
