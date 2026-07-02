# Refatoração completa — Guia Comendador Soares

Escopo enorme. Dashboard Master **não** será alterado. Vou entregar em **6 fases**, cada uma utilizável em produção, você aprova uma por vez.

Já concluído nas iterações anteriores (base da Fase 1): nova Home com barra de busca gigante, categorias em destaque, nav inferior/desktop nova (Home · Buscar · Categorias · Favoritos · Perfil), rotas `/buscar` e `/favoritos`, cards secundários compactos.

---

## Fase 0 — Limpeza e padronização (pré-requisito)

- Auditar `src/routes/` e `src/components/` e remover:
  - páginas/arquivos sem referência (rotas órfãs, componentes não importados),
  - dados-mock ainda usados em produção (`sampleRestaurants`, `SAMPLE_BUSINESSES`, `business-profile.ts` fake),
  - botões/menus duplicados (ex.: links de categoria repetidos entre header e bottom-nav),
  - variantes antigas de card substituídas pelas novas.
- Consolidar tokens em `src/styles.css` (sombra, raio, gradiente por categoria, tipografia display).
- Padronizar `AppShell` como único wrapper de página pública.

## Fase 1 — Home reordenada + status "aberto agora" + verificação

- Reordenar Home exatamente como pedido: Busca → Categorias → Destaques → **Abertas agora** → **Próximas** → **Promoções** → Onde Comer → Vagas → Imóveis → Notícias → Eventos → Utilidade Pública.
- Nova seção **Abertas agora**: usa `businesses.opening_hours` (JSON por dia) — filtra no cliente pelo horário atual (America/Sao_Paulo).
- Selo **Empresa Verificada**: coluna `businesses.verified boolean` + badge em card, página da empresa e resultados de busca. Toggle no admin (Empresas).
- Espaços fixos para **Empresa do Dia**, **Profissional da Semana**, **Promoção da Semana** (dados via Fase 3/4).

## Fase 2 — Busca global (`/buscar`)

- Refatorar `src/routes/buscar.tsx` para busca simultânea em empresas, categorias, profissionais, restaurantes, imóveis, vagas, notícias, eventos, serviços públicos (queries paralelas via React Query).
- Filtros: Aberto Agora, Mais Próximo, Melhor Avaliado, Empresa Verificada, Promoções, Plano Ouro.
- Tabs de agrupamento e URL sincronizada (`q`, `filtros`, `tab`) com Zod + `validateSearch`.
- Registro em `search_events` para alimentar rankings.

## Fase 3 — Página da empresa premium + Favoritos + Onde Comer

- Página da empresa: banner + logo, selos (Verificada / Ouro / Destaque), Sobre, Horário, Contato, Galeria, Mapa + Como Chegar, Promoções ativas, Vagas da empresa, Avaliações, Comentários, **Empresas relacionadas**.
- **Favoritos** unificados usando a tabela `favorites` existente (empresas, restaurantes, imóveis, notícias, eventos, vagas). Botão de coração em todos os cards. `/favoritos` autenticado agrupado por tipo.
- **Onde Comer** vira vitrine gastronômica (foto grande, categoria, avaliação, horário, WhatsApp, Como Chegar).

## Fase 4 — Promoções, Próximas (OSM) e Rankings

- Tabela `promotions` (business_id, título, descrição, imagem, desconto, período, status) + admin CRUD + seção Home + `/promocoes`.
- **Empresas Próximas**: `navigator.geolocation` + `businesses.latitude/longitude`, ordenação por distância (Haversine no cliente); mapa OpenStreetMap via `leaflet` para "Como Chegar" e listagem.
- Rankings automáticos derivados de `search_events`, `favorites` e `ratings`: Mais Visualizadas, Mais Avaliadas, Mais Procuradas, Mais Favoritadas — por categoria.
- Seleção automática de **Empresa do Dia** (empresa aprovada com maior score do dia), **Profissional da Semana** e **Promoção da Semana**.

## Fase 5 — Galeria do Bairro + Enquetes

- Módulo **Galeria do Bairro**: tabela `neighborhood_gallery` com categorias (Antigas, Atuais, História, Pontos Turísticos, Memória). Grid tipo masonry + página de item.
- Módulo **Enquetes**: `polls` + `poll_options` + `poll_votes` (1 voto por usuário autenticado). Admin cria; usuários votam; resultados em tempo real.

## Fase 6 — Performance, responsivo e polimento

- Lazy-load de seções da Home (Intersection Observer) e code-splitting por rota.
- Revisão de queries (evitar `select *` onde possível, paginação em listas grandes).
- Micro-animações (Motion for React) em cards e transições da busca.
- Auditoria mobile/tablet/desktop com foco em safe-area e tap targets ≥ 44px.

---

## Detalhes técnicos

- **Novas tabelas** (todas com RLS + GRANTs, admin CRUD): `promotions`, `search_events`, `neighborhood_gallery`, `polls`, `poll_options`, `poll_votes`.
- **Colunas novas em `businesses`**: `verified boolean default false`, `opening_hours jsonb`, `latitude/longitude` (se ausentes).
- **Rotas novas**: `/promocoes`, `/galeria`, `/enquetes`, `/admin/promocoes`, `/admin/galeria`, `/admin/enquetes`.
- **Sem alterações** em `_authenticated/admin.*` além dessas 3 novas telas.

---

## Ordem sugerida

Começamos pela **Fase 0 + Fase 1** juntas (limpeza + Home final com Aberto Agora e selo Verificada). Se preferir priorizar a **Busca Global** (Fase 2) ou os **Favoritos** (parte da Fase 3) antes, me diga que ajusto a ordem.
