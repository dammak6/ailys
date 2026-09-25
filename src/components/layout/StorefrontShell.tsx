"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { SiteSettingsProvider } from "@/lib/site-settings-context";

interface StorefrontShellProps {
  children: React.ReactNode;
}

export function StorefrontShell({ children }: StorefrontShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <SiteSettingsProvider>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </SiteSettingsProvider>
  );
}

