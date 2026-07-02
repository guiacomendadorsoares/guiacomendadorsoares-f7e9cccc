
# Reposicionamento do Guia Comendador Soares

Objetivo: fazer o **Guia Comercial** virar o centro da experiência ("Google de Comendador Soares"), com Vagas, Imóveis, Notícias, Eventos e Utilidade Pública como complementos. Dashboard Master não será alterado.

O escopo é enorme, então proponho entregar em **5 fases**. Cada fase é utilizável em produção; você aprova uma por vez.

---

## Fase 1 — Nova Home + Barra de Busca + Navegação

- Redesenhar `src/routes/index.tsx`:
  - Header novo com logo + headline "Tudo o que você procura em Comendador Soares, em um só lugar."
  - **Barra de busca gigante** com placeholder animado ciclando entre: Academia, Advogado, Restaurante, Farmácia, Dentista, Eletricista, Pizzaria, Mercado, Pet Shop.
  - Ao digitar/submeter → navega para `/buscar?q=...`.
  - Grid das 12 categorias principais com ícones 3D premium (usando gradientes fortes + sombras — já temos o padrão em `category-tile.tsx`, vou elevar para "3D").
  - Botão "Ver todas as categorias" → `/guia`.
  - Reordenar seções: Destaques Ouro → Próximas → Promoções → Onde Comer → Vagas (recentes) → Imóveis (destaque) → Notícias (5) → Eventos → Utilidade Pública (card destaque).
- Redesenhar `src/components/bottom-nav.tsx` com 5 itens: **Home, Buscar, Categorias, Favoritos, Perfil**.
- Ajustar `desktop-nav.tsx` para refletir a mesma IA.

## Fase 2 — Tela de Busca Global (`/buscar`)

- Nova rota `src/routes/buscar.tsx` estilo Google Maps.
- Busca simultânea em: empresas, categorias, profissionais, serviços, vagas, imóveis, restaurantes, eventos, notícias (queries paralelas via React Query).
- Chips de filtro rápido: Aberto Agora, Mais Bem Avaliados, Mais Próximos, Promoções, Plano Ouro, Entrega, Acessibilidade.
- Resultado agrupado por tipo, com tabs "Tudo / Empresas / Serviços / Vagas / Imóveis / Eventos / Notícias".
- Search params sincronizados na URL (`q`, `filtros`, `tab`) via `validateSearch` + Zod.

## Fase 3 — Página da Empresa Premium + Selos + Favoritos

- Refatorar `src/routes/empresa.$id.tsx`:
  - Hero com banner + logo sobreposto, badges **Verificada / Destaque / Ouro**.
  - Blocos: Sobre, Horário, Contato (Tel/WhatsApp/Site/Instagram), Galeria, Mapa + "Como Chegar", Promoções ativas, Vagas da empresa, Avaliações e Comentários, "Empresas relacionadas" (mesma subcategoria).
- Favoritos:
  - Aproveitar tabela `favorites` já existente; expor botão de coração em cards de empresa, imóvel, vaga, evento e notícia.
  - Nova rota `src/routes/_authenticated/favoritos.tsx`.

## Fase 4 — Empresas Próximas + Promoções + Rankings

- **Próximas**: usar `navigator.geolocation` + coordenadas já salvas em `businesses` (lat/lng); calcular distância no cliente. Preparar hook `useNearbyBusinesses` isolado para trocar depois por OpenStreetMap/PostGIS.
- **Promoções do Bairro**: nova tabela `promotions` (business_id, title, description, image_url, discount, starts_at, ends_at, status) + admin CRUD + seção na home + tela `/promocoes`.
- **Rankings automáticos**:
  - Tabela `search_events` (query, category, business_id, viewed_at) alimentada pela barra de busca e page views de empresa.
  - Seções na home: **Empresa do Dia**, **Profissional da Semana**, **Promoção da Semana**, **Mais Procurados**, **Novidades** — todas derivadas dessa tabela + `featured`/plano.

## Fase 5 — Polimento visual, performance e responsivo

- Micro-animações (Motion for React) em cards, chips, transições da busca.
- Lazy-load das seções da home (Intersection Observer / route splitting).
- Auditoria mobile e desktop (grid responsivo + safe-area).
- Revisão de tokens em `src/styles.css` para consolidar o visual "premium" (Airbnb/iFood/Maps): novos shadows, gradientes de categoria, tipografia display refinada.

---

## Detalhes técnicos

- **Banco (novos objetos, todos com RLS + GRANTs)**:
  - `promotions` (pública para leitura de aprovadas; escrita por dono da empresa/admin).
  - `search_events` (insert anônimo permitido, select só admin; usada para rankings via views materializadas ou agregações on-demand).
  - Colunas em `businesses`: `verified boolean default false`, garantir `latitude/longitude` (já existem em `properties`, checar para `businesses`).
- **Rotas novas**: `/buscar`, `/promocoes`, `/favoritos` (auth), `/admin/promocoes`.
- **Componentes novos**: `SearchHero`, `SearchOverlay`, `NearbyBusinesses`, `PromotionCard`, `FavoriteButton`, `EmpresaPremiumHeader`, `RankingSection`.
- **Sem mudanças no Dashboard Master** além da adição de "Promoções" no menu de admin.

---

## Ordem de aprovação

Sugiro começarmos pela **Fase 1** (impacto visual imediato na home + nova navegação) e evoluir. Me confirma se topa esse fatiamento ou se quer reordenar algo (ex.: priorizar a Tela de Busca antes da Home, ou juntar Favoritos com Fase 1).
