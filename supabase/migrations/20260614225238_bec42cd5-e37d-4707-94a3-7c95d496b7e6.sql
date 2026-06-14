CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested text;
  mapped public.app_role;
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;

  requested := NEW.raw_user_meta_data->>'requested_profile';
  IF requested IN ('partner','broker','influencer','editor') THEN
    mapped := requested::public.app_role;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, mapped)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END $$;