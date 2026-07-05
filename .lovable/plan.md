# Módulo Farmácias — comparador de preços

Escopo grande. Entrego em 4 fases, cada uma utilizável em produção. Sem carrinho/checkout — só conecta morador à farmácia via WhatsApp/telefone.

---

## Fase 1 — Banco de dados e arquitetura

Novas tabelas (com RLS + GRANTs):

- **`pharmacy_products`** — catálogo de produtos por farmácia
  - `business_id` (FK → businesses), `name`, `category`, `brand`, `active_ingredient`, `description`, `image_url`, `price`, `promo_price`, `available bool`, `delivery bool`, `pickup bool`, `updated_at`
- **`pharmacy_product_categories`** — categorias (Medicamentos, Higiene, Beleza, Bebês, Suplementos…)
- **`pharmacy_search_events`** — para ranking de "mais pesquisados"

Arquitetura genérica o suficiente para reaproveitar em outras categorias no futuro (tabela `pharmacy_*` isolada agora, mas com campos que se aplicam a qualquer produto de comparador).

Políticas RLS:
- SELECT público (anon + authenticated) em `pharmacy_products` (com `available=true`) e categorias.
- INSERT/UPDATE/DELETE apenas para o dono da empresa (`businesses.owner_user_id = auth.uid()`) ou admin/editor.

---

## Fase 2 — Rota pública `/farmacias` + busca

Nova rota **`/farmacias`** com:

- Campo de busca (nome, marca, princípio ativo) com sugestões conforme o usuário digita.
- Chips de categorias de produtos.
- Farmácias em destaque (empresas categoria "Farmácia" com `featured=true`).
- Produtos em promoção (`promo_price is not null`).
- Melhores preços (menor `price` por produto/marca).
- Farmácias abertas agora (reusa `isOpenNow` de `src/lib/hours.ts`).

Rota **`/farmacias/buscar`** com resultados ordenados. Cada resultado mostra imagem, preço, farmácia, distância (se lat/lng disponível), disponibilidade, promoção, data da atualização. Botões: WhatsApp, Ligar, Como Chegar, Ver Farmácia.

Filtros (URL sincronizada via Zod + `validateSearch`):
Menor preço · Maior desconto · Mais próxima · Aberta agora · Entrega · Retirada · Empresa Verificada.

Registro em `pharmacy_search_events` a cada busca (fire-and-forget) para alimentar rankings.

---

## Fase 3 — Home + página da farmácia

**Home (`src/routes/index.tsx`)**:
Novo card premium logo abaixo das Categorias:

```text
┌────────────────────────────────────┐
│ 💊  Farmácias                       │
│ Compare preços das farmácias        │
│ de Comendador Soares.               │
│ [ Pesquisar Produtos → ]            │
└────────────────────────────────────┘
```

Nova seção "Ofertas das Farmácias" com carrossel horizontal de produtos em promoção.

**Página da farmácia (`/empresa/$id`)**:
Quando `main_category === 'farmacia'`, adiciona abas/seções:
- Produtos (grid com preços)
- Promoções (produtos com `promo_price`)
- Produtos relacionados (mesma categoria em outras farmácias — cross-sell entre farmácias)

Mantém tudo já existente (horário, contato, mapa, avaliações, comentários).

---

## Fase 4 — Dashboard da farmácia + rankings

**`/painel-empresa`** ganha um módulo "Farmácia" quando a empresa é dessa categoria:

- **Produtos**: listagem com busca e filtros.
- **Cadastrar/Editar Produto**: formulário com todos os campos (nome, categoria, marca, princípio ativo, descrição, imagem via `image-uploader`, preço, preço promocional, disponível, entrega, retirada).
- **Promoções**: atalho para editar `promo_price`.
- **Preços**: bulk edit de preços.
- **Estatísticas**: acessos, produtos mais vistos (do `pharmacy_search_events`).

**Admin** (`/admin/farmacias-produtos`): moderação global de produtos.

**Rankings automáticos** (views ou queries agregadas em `pharmacy_search_events`):
- Produtos mais pesquisados
- Farmácias mais acessadas
- Melhores preços por produto

---

## Detalhes técnicos

- **Sem vendas**: nenhum carrinho, checkout ou gateway. Todos os CTAs abrem WhatsApp / telefone / mapa.
- **Storage**: imagens de produto no bucket `uploads` existente, pasta `pharmacy-products/`.
- **Distância**: reusa `navigator.geolocation` + Haversine (já previsto na Fase 4 do plano geral).
- **Performance**: lazy-load das seções da Home via Intersection Observer, paginação nos resultados de busca.
- **Responsivo**: mobile-first, tap targets ≥ 44px, safe-area respeitada.
- **Novas rotas**: `/farmacias`, `/farmacias/buscar`, `/farmacias/produto/$id`, `/admin/farmacias-produtos`.

---

## Ordem de execução

Começo por **Fase 1 + Fase 2** (banco + rota pública com busca funcional) — assim você já vê o comparador rodando com dados reais. Depois Fase 3 (Home + página) e Fase 4 (dashboard + rankings).

Se preferir priorizar o **dashboard da farmácia** antes da busca pública (para popular o catálogo primeiro), me diga que inverto Fase 2 ↔ Fase 4.
