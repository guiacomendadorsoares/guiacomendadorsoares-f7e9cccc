
CREATE TABLE IF NOT EXISTS public.public_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  phone text,
  phones text[] DEFAULT '{}',
  email text,
  website text,
  address text,
  hours text,
  description text,
  latitude numeric,
  longitude numeric,
  source text,
  is_emergency boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.public_services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.public_services TO authenticated;
GRANT ALL ON public.public_services TO service_role;

ALTER TABLE public.public_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active public services"
  ON public.public_services FOR SELECT
  USING (active = true OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

CREATE POLICY "Admins manage public services"
  ON public.public_services FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

CREATE TRIGGER public_services_set_updated_at
  BEFORE UPDATE ON public.public_services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS public_services_category_idx ON public.public_services(category);
CREATE INDEX IF NOT EXISTS public_services_active_idx ON public.public_services(active);

-- Seed data
INSERT INTO public.public_services (name, category, phones, email, website, address, description, is_emergency, source) VALUES
  ('Prefeitura de Nova Iguaçu','Prefeitura', '{}', NULL, 'https://novaiguacu.rj.gov.br','Rua Athaide Pimenta de Moraes, 528 - Centro, Nova Iguaçu - RJ','Sede administrativa da Prefeitura Municipal de Nova Iguaçu.', false, 'https://novaiguacu.rj.gov.br'),
  ('Ouvidoria Municipal','Ouvidoria', ARRAY['2666-4910'], 'ouvidoria@novaiguacu.rj.gov.br', 'https://novaiguacu.rj.gov.br', NULL,'Canal oficial de atendimento ao cidadão. Horário: 09h às 17h.', false, 'https://novaiguacu.rj.gov.br'),
  ('Defesa Civil de Nova Iguaçu','Defesa Civil', ARRAY['199','2667-5751','98160-9740'],'defesacivil@novaiguacu.rj.gov.br','https://novaiguacu.rj.gov.br', NULL,'Atendimento emergencial e prevenção de riscos.', true, 'https://novaiguacu.rj.gov.br'),
  -- Emergências
  ('Polícia Militar','Emergência', ARRAY['190'], NULL, NULL, NULL, 'Emergências policiais.', true, 'https://novaiguacu.rj.gov.br'),
  ('SAMU','Emergência', ARRAY['192'], NULL, NULL, NULL, 'Atendimento médico de urgência.', true, 'https://novaiguacu.rj.gov.br'),
  ('Bombeiros','Emergência', ARRAY['193'], NULL, NULL, NULL, 'Corpo de Bombeiros.', true, 'https://novaiguacu.rj.gov.br'),
  ('Polícia Civil','Emergência', ARRAY['197'], NULL, NULL, NULL, 'Polícia Civil.', true, 'https://novaiguacu.rj.gov.br'),
  ('Disque Direitos Humanos','Emergência', ARRAY['100'], NULL, NULL, NULL, 'Denúncias de violações de direitos humanos.', true, 'https://novaiguacu.rj.gov.br'),
  ('Central da Mulher','Emergência', ARRAY['180'], NULL, NULL, NULL, 'Atendimento à mulher em situação de violência.', true, 'https://novaiguacu.rj.gov.br'),
  -- Secretarias
  ('Secretaria de Administração','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Agricultura e Meio Ambiente','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Assistência Social','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Atendimento Geral e Ouvidoria','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Cultura','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Defesa Civil','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Desenvolvimento Econômico, Trabalho e Turismo','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Desenvolvimento Urbano','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Educação','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Esporte e Lazer','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Fazenda e Fiscalização Tributária','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Governo','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Infraestrutura','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria da Mulher','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Ordem Pública','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Planejamento','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Saúde','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Serviços Delegados','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Serviços Públicos','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Transporte, Trânsito e Mobilidade Urbana','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  ('Secretaria de Defesa e Proteção dos Animais','Secretarias Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br'),
  -- Órgãos
  ('CODENI','Órgãos Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, 'Companhia de Desenvolvimento de Nova Iguaçu.', false,'https://novaiguacu.rj.gov.br'),
  ('FENIG','Órgãos Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, 'Fundação Educacional de Nova Iguaçu.', false,'https://novaiguacu.rj.gov.br'),
  ('PREVINI','Órgãos Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, 'Instituto de Previdência dos Servidores de Nova Iguaçu.', false,'https://novaiguacu.rj.gov.br'),
  ('Procuradoria Geral do Município','Órgãos Municipais', '{}', NULL,'https://novaiguacu.rj.gov.br', NULL, NULL, false,'https://novaiguacu.rj.gov.br');
