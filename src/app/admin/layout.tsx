"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "@/lib/admin-auth-context";
import { AdminSaveProvider } from "@/lib/admin-save-context";
import { AdminSaveButton } from "@/components/admin/AdminSaveButton";
import {
  LayoutDashboard,
  Shirt,
  Layers,
  Percent,
  SlidersHorizontal,
  Image as ImageIcon,
  ShoppingBag,
  RotateCcw,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Users,
} from "lucide-react";

const BASE_NAV_ITEMS = [
  { href: "/admin", label: "Tableau de Bord", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Shirt },
  { href: "/admin/collections", label: "Collections", icon: Layers },
  { href: "/admin/promotions", label: "Promotions", icon: Percent },
  { href: "/admin/homepage", label: "Page d'Accueil", icon: SlidersHorizontal },
  { href: "/admin/media", label: "Médiathèque", icon: ImageIcon },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/returns", label: "Retours & Échanges", icon: RotateCcw },
];

const SUPER_ADMIN_NAV_ITEMS = [
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // When on login page, render full screen without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems =
    user?.role === "SUPER_ADMIN"
      ? [...BASE_NAV_ITEMS, ...SUPER_ADMIN_NAV_ITEMS]
      : BASE_NAV_ITEMS;

  const currentNav =
    navItems.find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href)
    ) || navItems[0];

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#0B0B0B] flex flex-col md:flex-row antialiased">
      {/* ------------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR */}
      {/* ------------------------------------------------------------------- */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0B0B0B] text-[#F5F3EC] border-r border-[#1E1E1E] shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1E1E1E]">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 relative shrink-0">
              <Image
                src="/logo.svg"
                alt="AÏLYS"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <div>
              <span className="font-serif text-xl tracking-wider text-[#F5F3EC] block">
                AÏLYS
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#B79A5B] block -mt-0.5">
                Atelier Privé
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-sm text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? "bg-[#B79A5B] text-[#0B0B0B] font-semibold shadow-sm"
                    : "text-[#A3A099] hover:bg-[#161616] hover:text-[#F5F3EC]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#0B0B0B]" : "text-[#B79A5B]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-[#1E1E1E] bg-[#0E0E0E]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#B79A5B]/30 flex items-center justify-center text-xs font-serif text-[#B79A5B] shrink-0">
                {user?.fullName?.charAt(0) || "A"}
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-[#F5F3EC] truncate">
                  {user?.fullName || "Direction Atelier"}
                </p>
                <p className="text-[10px] text-[#7A7770] truncate">
                  {user?.role || "super_admin"}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Déconnexion"
              className="p-1.5 text-[#A3A099] hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------- */}
      {/* MOBILE TOPBAR */}
      {/* ------------------------------------------------------------------- */}
      <header className="md:hidden bg-[#0B0B0B] text-[#F5F3EC] px-4 py-3 flex items-center justify-between border-b border-[#1E1E1E] sticky top-0 z-40">
        <Link href="/admin" className="flex items-center space-x-2.5">
          <div className="w-6 h-6 relative">
            <Image
              src="/logo.svg"
              alt="AÏLYS"
              fill
              className="object-contain brightness-0 invert"
            />
          </div>
          <span className="font-serif text-lg tracking-wider text-[#F5F3EC]">
            AÏLYS
          </span>
        </Link>
        <div className="flex items-center space-x-2.5">
          <AdminSaveButton variant="mobile" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#F5F3EC] hover:text-[#B79A5B]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[53px] bg-[#0B0B0B]/95 backdrop-blur-md z-30 p-6 flex flex-col justify-between">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded text-sm font-medium ${
                    isActive
                      ? "bg-[#B79A5B] text-[#0B0B0B]"
                      : "text-[#A3A099] hover:text-[#F5F3EC]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-6 border-t border-[#222]">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-[#1C1C1C] text-red-300 text-xs font-medium uppercase tracking-wider rounded"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTENT WORKSPACE */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="hidden md:flex bg-white border-b border-[#E8E6DF] px-8 py-3.5 items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center space-x-3">
            <h1 className="font-serif text-xl font-light text-[#0B0B0B]">
              {currentNav.label}
            </h1>
            <span className="text-xs px-2 py-0.5 bg-[#F5F3EC] text-[#8C7A4F] border border-[#E8E6DF] rounded-full font-medium">
              Atelier AÏLYS
            </span>
          </div>

          <div className="flex items-center space-x-3.5">
            {/* Global Save Button */}
            <AdminSaveButton variant="header" />

            <div className="h-4 w-[1px] bg-[#E8E6DF]" />

            <div className="flex items-center space-x-1.5 text-xs text-[#6B6860] bg-[#F5F3EC] px-3 py-1.5 rounded-full border border-[#E8E6DF]">
              <Shield className="w-3.5 h-3.5 text-[#B79A5B]" />
              <span>Session Chiffrée</span>
            </div>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider font-medium text-[#0B0B0B] hover:text-[#B79A5B] transition-colors border border-[#D5D2C9] hover:border-[#B79A5B] px-3 py-1.5 rounded-sm"
            >
              <span>Voir la boutique</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminSaveProvider>
        <AdminShell>{children}</AdminShell>
      </AdminSaveProvider>
    </AdminAuthProvider>
  );
}
