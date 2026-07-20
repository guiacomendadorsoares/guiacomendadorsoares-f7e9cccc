-- RPC to transfer business ownership atomically
CREATE OR REPLACE FUNCTION public.transfer_business_ownership(
  _business_id uuid,
  _new_owner_user_id uuid,
  _reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _caller uuid := auth.uid();
  _current_owner uuid;
  _new_member_id uuid;
BEGIN
  IF _caller IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- Only current primary owner or admin can transfer
  SELECT user_id INTO _current_owner
  FROM public.business_members
  WHERE business_id = _business_id
    AND is_primary_owner = true
    AND status = 'active'
    AND deleted_at IS NULL
  LIMIT 1;

  IF NOT (public.has_role(_caller, 'admin') OR _caller = _current_owner) THEN
    RAISE EXCEPTION 'only the current owner can transfer ownership';
  END IF;

  -- Target must be an active member
  SELECT id INTO _new_member_id
  FROM public.business_members
  WHERE business_id = _business_id
    AND user_id = _new_owner_user_id
    AND status = 'active'
    AND deleted_at IS NULL
  LIMIT 1;

  IF _new_member_id IS NULL THEN
    RAISE EXCEPTION 'new owner must already be an active team member';
  END IF;

  IF _new_owner_user_id = _current_owner THEN
    RAISE EXCEPTION 'user is already the primary owner';
  END IF;

  -- Demote old owner first (unique index requires this)
  UPDATE public.business_members
  SET is_primary_owner = false, role = 'gerente'
  WHERE business_id = _business_id AND is_primary_owner = true AND deleted_at IS NULL;

  -- Promote new owner
  UPDATE public.business_members
  SET is_primary_owner = true, role = 'proprietario'
  WHERE id = _new_member_id;

  -- Audit
  INSERT INTO public.business_audit_log(
    business_id, actor_user_id, entity_type, entity_id, action, previous_value, new_value, metadata
  ) VALUES (
    _business_id, _caller, 'business_members', _new_member_id, 'ownership_transferred',
    jsonb_build_object('user_id', _current_owner),
    jsonb_build_object('user_id', _new_owner_user_id),
    jsonb_build_object('reason', _reason)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.transfer_business_ownership(uuid, uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.transfer_business_ownership(uuid, uuid, text) TO authenticated;