-- Migration: Add delete_admin_user RPC function
-- Allows a SUPER_ADMIN to permanently delete an administrator from both admin_users and auth.users,
-- with protections against self-deletion and deleting the last remaining SuperAdmin.

CREATE OR REPLACE FUNCTION public.delete_admin_user(p_admin_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_caller_auth_id UUID := auth.uid();
    v_caller_is_super BOOLEAN;
    v_target RECORD;
    v_super_admin_role_id UUID;
    v_super_admin_count INT;
BEGIN
    SELECT public.is_super_admin() INTO v_caller_is_super;
    IF NOT v_caller_is_super THEN
        RAISE EXCEPTION 'Accès refusé. Privilèges SUPER_ADMIN requis.';
    END IF;

    SELECT id INTO v_super_admin_role_id FROM public.roles WHERE name = 'SUPER_ADMIN';

    SELECT * INTO v_target FROM public.admin_users WHERE id = p_admin_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Administrateur introuvable.';
    END IF;

    -- Prevent self-deletion
    IF v_target.auth_user_id = v_caller_auth_id THEN
        RAISE EXCEPTION 'Action interdite : vous ne pouvez pas supprimer votre propre compte.';
    END IF;

    -- Count active super admins
    SELECT COUNT(*) INTO v_super_admin_count
    FROM public.admin_users
    WHERE role_id = v_super_admin_role_id AND is_active = true;

    IF v_target.role_id = v_super_admin_role_id AND v_super_admin_count <= 1 THEN
        RAISE EXCEPTION 'Action interdite : impossible de supprimer le dernier Super Administrateur.';
    END IF;

    -- Delete from admin_users
    DELETE FROM public.admin_users WHERE id = p_admin_id;

    -- Delete identities and user from auth schema
    IF v_target.auth_user_id IS NOT NULL THEN
        DELETE FROM auth.identities WHERE user_id = v_target.auth_user_id;
        DELETE FROM auth.users WHERE id = v_target.auth_user_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'deleted_id', p_admin_id,
        'email', v_target.email
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_admin_user(UUID) TO authenticated, service_role;
