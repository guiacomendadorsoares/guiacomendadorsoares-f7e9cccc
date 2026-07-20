
-- Notify claimant when their claim status changes
CREATE OR REPLACE FUNCTION public.notify_claim_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bname text;
  title text;
  body text;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    SELECT name INTO bname FROM public.businesses WHERE id = NEW.business_id;
    IF NEW.status = 'approved' THEN
      title := 'Reivindicação aprovada';
      body := 'Sua reivindicação de ' || COALESCE(bname,'empresa') || ' foi aprovada. Acesse o Painel da Empresa.';
    ELSIF NEW.status = 'rejected' THEN
      title := 'Reivindicação recusada';
      body := COALESCE('Motivo: ' || NEW.rejection_reason, 'Sua reivindicação foi recusada.');
    ELSIF NEW.status = 'awaiting_docs' THEN
      title := 'Documentos adicionais necessários';
      body := 'Envie novos documentos para prosseguir com a reivindicação de ' || COALESCE(bname,'sua empresa') || '.';
    ELSIF NEW.status = 'in_review' THEN
      title := 'Reivindicação em análise';
      body := 'Sua reivindicação de ' || COALESCE(bname,'empresa') || ' está sendo analisada.';
    ELSIF NEW.status = 'already_claimed' THEN
      title := 'Empresa já reivindicada';
      body := 'A empresa ' || COALESCE(bname,'') || ' já possui um proprietário vinculado.';
    ELSE
      RETURN NEW;
    END IF;
    INSERT INTO public.notifications(user_id, title, body, link)
    VALUES (NEW.claimant_user_id, title, body, '/minha-conta');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_claim_status_change ON public.business_claims;
CREATE TRIGGER trg_notify_claim_status_change
AFTER UPDATE ON public.business_claims
FOR EACH ROW EXECUTE FUNCTION public.notify_claim_status_change();

-- Notify admins on new claim
CREATE OR REPLACE FUNCTION public.notify_admins_new_claim()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bname text;
  admin_id uuid;
BEGIN
  SELECT name INTO bname FROM public.businesses WHERE id = NEW.business_id;
  FOR admin_id IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    INSERT INTO public.notifications(user_id, title, body, link)
    VALUES (admin_id, 'Nova reivindicação de empresa',
      COALESCE(NEW.full_name,'Usuário') || ' solicitou ' || COALESCE(bname,'uma empresa') || '.',
      '/admin/reivindicacoes');
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_new_claim ON public.business_claims;
CREATE TRIGGER trg_notify_admins_new_claim
AFTER INSERT ON public.business_claims
FOR EACH ROW EXECUTE FUNCTION public.notify_admins_new_claim();
