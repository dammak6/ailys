"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { AilysLogo } from "@/components/brand/AilysLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/admin";
  const { login } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push(returnTo);
    } else {
      setError(result.error || "Identifiants invalides ou mot de passe incorrect.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F3EC] flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle Background Lighting Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B79A5B]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AilysLogo variant="light" size="xl" href="/admin/login" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#B79A5B] mt-1 font-sans">
            Portail d'Administration Privée
          </p>
          <div className="w-12 h-[1px] bg-[#B79A5B]/30 mx-auto mt-4" />
        </div>

        {/* Login Form Container */}
        <div className="bg-[#141414] border border-[#262626] rounded-sm p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-xs text-[#8E8B82] uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4 text-[#B79A5B]" />
            <span>Accès Restreint • Authentification Supabase Sécurisée</span>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-800/60 rounded-sm flex items-start space-x-2.5 text-xs text-red-200 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider text-[#A6A29A] mb-2 font-medium"
              >
                Adresse Email Administrateur
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ailys.tn"
                  className="w-full bg-[#0D0D0D] border border-[#2E2E2E] focus:border-[#B79A5B] text-sm text-[#F5F3EC] pl-10 pr-4 py-3 rounded-sm transition-colors outline-none placeholder:text-[#525252]"
                />
                <Mail className="w-4 h-4 text-[#6E6B65] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-wider text-[#A6A29A] mb-2 font-medium"
              >
                Mot de Passe d'Accès
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0D0D0D] border border-[#2E2E2E] focus:border-[#B79A5B] text-sm text-[#F5F3EC] pl-10 pr-4 py-3 rounded-sm transition-colors outline-none placeholder:text-[#525252]"
                />
                <Lock className="w-4 h-4 text-[#6E6B65] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B79A5B] hover:bg-[#C8AD6D] text-[#0B0B0B] font-medium text-xs uppercase tracking-[0.2em] py-3.5 rounded-sm transition-all duration-300 flex items-center justify-center space-x-2 mt-6 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Vérification en cours...</span>
              ) : (
                <>
                  <span>Accéder à l'Administration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Guarantee */}
        <p className="text-center text-[11px] text-[#555] mt-8 tracking-wide">
          AÏLYS Maison de Confection • Accès réservé au personnel autorisé
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0B0B] text-[#F5F3EC] flex items-center justify-center font-serif">
          Chargement de l'atelier AÏLYS...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
