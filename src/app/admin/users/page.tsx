"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  Users,
  UserPlus,
  Shield,
  Crown,
  CheckCircle2,
  XCircle,
  Key,
  Clock,
  AlertCircle,
  AlertTriangle,
  Trash2,
  X,
  Lock,
  Mail,
  User as UserIcon,
} from "lucide-react";

interface AdminUserRecord {
  id: string;
  email: string;
  full_name: string;
  role_name: "SUPER_ADMIN" | "ADMIN";
  is_active: boolean;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function AdminUsersPage() {
  const { user } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resetModalAdmin, setResetModalAdmin] = useState<AdminUserRecord | null>(null);
  const [deleteModalAdmin, setDeleteModalAdmin] = useState<AdminUserRecord | null>(null);

  // Form states for creation
  const [newEmail, setNewEmail] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Form states for password reset
  const [resetPasswordVal, setResetPasswordVal] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // States for deletion
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Impossible de charger les utilisateurs.");
      }
      const data = await res.json();
      setAdmins(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadAdmins();
    }
  }, [isSuperAdmin]);

  const handleToggleActive = async (admin: AdminUserRecord) => {
    if (admin.id === user?.id) {
      setError("Action impossible : vous ne pouvez pas désactiver votre propre compte.");
      return;
    }

    if (admin.role_name === "SUPER_ADMIN") {
      setError("Action impossible : un Super Administrateur ne peut pas être désactivé.");
      return;
    }

    const actionText = admin.is_active ? "désactiver" : "activer";
    if (!confirm(`Voulez-vous vraiment ${actionText} l'accès pour ${admin.full_name} (${admin.email}) ?`)) {
      return;
    }

    try {
      setError(null);
      setSuccessMsg(null);
      const res = await fetch(`/api/admin/users/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_active",
          isActive: !admin.is_active,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Échec de la modification du statut.");
      }

      setSuccessMsg(`Statut mis à jour pour ${admin.full_name}.`);
      await loadAdmins();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim(),
          fullName: newFullName.trim(),
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Échec de la création du compte administrateur.");
      }

      setSuccessMsg(`Le compte opérationnel ADMIN pour ${newEmail} a été créé avec succès.`);
      setCreateModalOpen(false);
      setNewEmail("");
      setNewFullName("");
      setNewPassword("");
      await loadAdmins();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalAdmin) return;
    setResetError(null);
    setResetting(true);

    try {
      const res = await fetch(`/api/admin/users/${resetModalAdmin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_password",
          newPassword: resetPasswordVal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Échec de la réinitialisation du mot de passe.");
      }

      setSuccessMsg(`Mot de passe réinitialisé pour ${resetModalAdmin.email}.`);
      setResetModalAdmin(null);
      setResetPasswordVal("");
    } catch (err: any) {
      setResetError(err.message);
    } finally {
      setResetting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalAdmin) return;
    setDeleteError(null);
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/users/${deleteModalAdmin.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Échec de la suppression de l'administrateur.");
      }

      setSuccessMsg(data.message || `L'administrateur ${deleteModalAdmin.email} a été définitivement supprimé.`);
      setDeleteModalAdmin(null);
      await loadAdmins();
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // If user is not SUPER_ADMIN, display access forbidden guard
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
          La gestion des comptes d'accès, permissions et privilèges système est strictement réservée à la Direction AÏLYS.
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
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white border border-[#E8E6DF] p-6 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#B79A5B] uppercase tracking-wider font-medium mb-1">
            <Shield className="w-4 h-4" />
            <span>Sécurité & Gouvernance AÏLYS</span>
          </div>
          <h2 className="font-serif text-2xl font-light text-[#0B0B0B]">
            Gestion des Utilisateurs Administrateurs
          </h2>
          <p className="text-xs text-[#7A7770] mt-1">
            Contrôle d'accès RBAC : attribution des rôles opérationnels et révocation immédiate des sessions.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-[#F5F3EC] text-xs font-medium uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5 text-[#B79A5B]" />
          <span>Nouvel Administrateur</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Administrators List Table */}
      <div className="bg-white border border-[#E8E6DF] rounded-sm overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#E8E6DF] flex items-center justify-between bg-[#FCFCFA]">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#B79A5B]" />
            <h3 className="font-serif text-base font-light text-[#0B0B0B]">
              Comptes Administrateurs Configurés ({admins.length})
            </h3>
          </div>
          <span className="text-[11px] text-[#7A7770]">
            RBAC Enforced • Auth Supabase Sécurisée
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#7A7770] font-serif">
            Chargement des privilèges et comptes...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E6DF] text-[#7A7770] uppercase tracking-wider text-[11px] bg-[#FAF9F5]">
                  <th className="py-3 px-6 font-medium">Administrateur</th>
                  <th className="py-3 px-6 font-medium">Rôle Attribué</th>
                  <th className="py-3 px-6 font-medium">Statut d'Accès</th>
                  <th className="py-3 px-6 font-medium">Création</th>
                  <th className="py-3 px-6 font-medium">Dernière Connexion</th>
                  <th className="py-3 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEB]">
                {admins.map((adm) => {
                  const isCurrent = adm.id === user?.id;
                  const isSuper = adm.role_name === "SUPER_ADMIN";

                  return (
                    <tr key={adm.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-xs shrink-0 ${
                            isSuper ? "bg-[#B79A5B]/15 text-[#B79A5B] border border-[#B79A5B]/30" : "bg-[#F0EFEB] text-[#4A4740]"
                          }`}>
                            {adm.full_name?.charAt(0) || "A"}
                          </div>
                          <div>
                            <p className="font-medium text-[#0B0B0B] flex items-center space-x-1.5">
                              <span>{adm.full_name}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-[#F0EFEB] text-[#7A7770] rounded">
                                  Vous
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-[#7A7770]">{adm.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {isSuper ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-sm font-medium text-[11px]">
                            <Crown className="w-3 h-3 text-[#B79A5B]" />
                            <span>SUPER_ADMIN</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded-sm font-medium text-[11px]">
                            <Shield className="w-3 h-3 text-slate-500" />
                            <span>ADMIN (Opérationnel)</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {adm.is_active ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Actif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-red-700 text-[11px] font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Désactivé</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-[#7A7770]">
                        {new Date(adm.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-4 px-6 text-[#7A7770]">
                        {adm.last_sign_in_at ? (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-[#999]" />
                            <span>
                              {new Date(adm.last_sign_in_at).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </span>
                        ) : (
                          <span className="text-[#999] italic">Jamais connecté</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center space-x-2">
                          {/* Toggle Active Button (cannot deactivate self or other SUPER_ADMIN) */}
                          {!isSuper && !isCurrent && (
                            <button
                              onClick={() => handleToggleActive(adm)}
                              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer border ${
                                adm.is_active
                                  ? "border-red-200 text-red-700 hover:bg-red-50"
                                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                            >
                              {adm.is_active ? "Désactiver" : "Activer"}
                            </button>
                          )}

                          {/* Password Reset Button */}
                          <button
                            onClick={() => {
                              setResetModalAdmin(adm);
                              setResetPasswordVal("");
                              setResetError(null);
                            }}
                            title="Réinitialiser le mot de passe"
                            className="p-1.5 text-[#7A7770] hover:text-[#0B0B0B] border border-[#E8E6DF] rounded hover:border-[#B79A5B] transition-colors cursor-pointer"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Admin Button (SUPER_ADMIN only, cannot delete self) */}
                          {isSuperAdmin && !isCurrent && (
                            <button
                              onClick={() => {
                                setDeleteModalAdmin(adm);
                                setDeleteError(null);
                              }}
                              title="Supprimer définitivement cet administrateur"
                              className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 border border-red-200 rounded hover:border-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Operational Admin */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <div className="flex items-center space-x-2 text-[#0B0B0B]">
                <UserPlus className="w-4 h-4 text-[#B79A5B]" />
                <h3 className="font-serif text-lg font-light">Inviter un Administrateur</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-[#999] hover:text-[#0B0B0B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] mb-1.5 font-medium">
                  Nom Complet
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="Ex: Sarah Ben Mahmoud"
                    className="w-full border border-[#D5D2C9] rounded-sm pl-9 pr-3 py-2 text-xs text-[#0B0B0B] outline-none focus:border-[#B79A5B]"
                  />
                  <UserIcon className="w-3.5 h-3.5 text-[#999] absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] mb-1.5 font-medium">
                  Adresse Email AÏLYS
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="sarah@ailys.tn"
                    className="w-full border border-[#D5D2C9] rounded-sm pl-9 pr-3 py-2 text-xs text-[#0B0B0B] outline-none focus:border-[#B79A5B]"
                  />
                  <Mail className="w-3.5 h-3.5 text-[#999] absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] mb-1.5 font-medium">
                  Mot de Passe Initial (min. 8 caractères)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full border border-[#D5D2C9] rounded-sm pl-9 pr-3 py-2 text-xs text-[#0B0B0B] outline-none focus:border-[#B79A5B]"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#999] absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F5] border border-[#E8E6DF] rounded-sm">
                <p className="text-[11px] text-[#7A7770] leading-relaxed">
                  <span className="font-semibold text-[#0B0B0B]">Rôle attribué : ADMIN</span>.
                  Ce compte aura un accès opérationnel restreint (Commandes, Produits, Retours, Réassort, Homepage, Médias).
                  Les statistiques financières et la gestion d'administrateurs lui seront inaccessibles.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#D5D2C9] text-[#7A7770] hover:text-[#0B0B0B] rounded-sm cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-[#0B0B0B] text-[#F5F3EC] hover:bg-[#1E1E1E] rounded-sm font-medium uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {creating ? "Création..." : "Créer le compte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {resetModalAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <div className="flex items-center space-x-2 text-[#0B0B0B]">
                <Key className="w-4 h-4 text-[#B79A5B]" />
                <h3 className="font-serif text-lg font-light">Réinitialiser le Mot de Passe</h3>
              </div>
              <button
                onClick={() => setResetModalAdmin(null)}
                className="text-[#999] hover:text-[#0B0B0B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#7A7770] mt-3">
              Définir un nouveau mot de passe sécurisé pour{" "}
              <span className="font-medium text-[#0B0B0B]">{resetModalAdmin.email}</span>.
            </p>

            {resetError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                {resetError}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] mb-1.5 font-medium">
                  Nouveau Mot de Passe (min. 8 caractères)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={resetPasswordVal}
                    onChange={(e) => setResetPasswordVal(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full border border-[#D5D2C9] rounded-sm pl-9 pr-3 py-2 text-xs text-[#0B0B0B] outline-none focus:border-[#B79A5B]"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#999] absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setResetModalAdmin(null)}
                  className="px-4 py-2 border border-[#D5D2C9] text-[#7A7770] hover:text-[#0B0B0B] rounded-sm cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={resetting}
                  className="px-5 py-2 bg-[#0B0B0B] text-[#F5F3EC] hover:bg-[#1E1E1E] rounded-sm font-medium uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {resetting ? "Mise à jour..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Permanent Deletion */}
      {deleteModalAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E8E6DF] rounded-sm max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <h3 className="font-serif text-lg font-medium text-[#0B0B0B]">
                  Supprimer l&apos;Administrateur
                </h3>
              </div>
              <button
                onClick={() => {
                  if (!deleting) {
                    setDeleteModalAdmin(null);
                    setDeleteError(null);
                  }
                }}
                disabled={deleting}
                className="text-[#999] hover:text-[#0B0B0B] disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-[#4A4740] leading-relaxed">
                Êtes-vous absolument certain de vouloir supprimer définitivement le compte de{" "}
                <span className="font-semibold text-[#0B0B0B]">{deleteModalAdmin.full_name}</span>{" "}
                (<span className="font-mono text-[#0B0B0B]">{deleteModalAdmin.email}</span>) ?
              </p>

              <div className="p-3 bg-red-50/80 border border-red-200 rounded-sm space-y-1.5">
                <p className="text-[11px] font-semibold text-red-900 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  Action irréversible et immédiate
                </p>
                <ul className="text-[11px] text-red-800 list-disc list-inside space-y-1">
                  <li>L&apos;accès au panneau d&apos;administration sera immédiatement révoqué.</li>
                  <li>Le compte d&apos;authentification Supabase Auth et la fiche administrateur seront supprimés définitivement.</li>
                  <li>L&apos;historique des commandes et logs du site reste préservé et intègre.</li>
                </ul>
              </div>

              {deleteError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                  {deleteError}
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#E8E6DF] flex items-center justify-end space-x-3 text-xs">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setDeleteModalAdmin(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 border border-[#D5D2C9] text-[#7A7770] hover:text-[#0B0B0B] rounded-sm cursor-pointer disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-sm font-medium uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-xs"
              >
                {deleting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Suppression en cours...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirmer la suppression</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
