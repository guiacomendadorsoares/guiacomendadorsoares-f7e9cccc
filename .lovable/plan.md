# CRM Comercial — Dashboard Master

Módulo completo de gestão comercial integrado aos planos e cadastros existentes. Acessível **somente** pelo perfil `admin`.

## 1. Banco de Dados (1 migration)

Novas tabelas em `public` (todas com RLS + GRANT + policies via `has_role(auth.uid(),'admin')`):

- **`crm_leads`** — pipeline comercial
  - `user_id` (nullable, FK profiles.user_id — vira cliente ao converter)
  - `company_name`, `category`, `partner_type` (empresa/farmacia/corretor/imobiliaria/lead)
  - `contact_name`, `phone`, `whatsapp`, `email`, `address`, `neighborhood`
  - `stage` (enum: `lead`, `contato`, `visita`, `proposta`, `negociacao`, `teste`, `ativo`, `renovacao`, `cancelado`)
  - `plan_slug`, `plan_source`, `monthly_value`, `next_action`, `next_action_at`, `renewal_at`
  - `notes`, `created_by`
- **`crm_activities`** — timeline (ligação, visita, whatsapp, email, proposta, reunião, observação) com `type`, `content`, `created_by`, `created_at`
- **`crm_reminders`** — lembretes com `title`, `due_at`, `done`, `lead_id`
- **`crm_audit_log`** — histórico (aproveita padrão do `plan_audit_log`) para mudanças de stage/plan/status

Trigger `set_updated_at` reutilizado. Trigger de auditoria em `crm_leads`.

## 2. Server Functions (`src/lib/crm.functions.ts`)

Todas com `.middleware([requireSupabaseAuth])` + verificação `has_role admin`:

- `listCrmLeads({ filters })`, `getCrmLead({ id })`, `upsertCrmLead(...)`, `deleteCrmLead({ id })`
- `moveCrmLeadStage({ id, stage })` — usado pelo Kanban
- `addCrmActivity({ leadId, type, content })`, `listCrmActivities({ leadId })`
- `addCrmReminder(...)`, `toggleCrmReminder(...)`, `listCrmReminders(...)`
- `crmDashboardStats()` — retorna contagens dos indicadores
- `crmRenewalBuckets()` — vence hoje/7d/15d/30d/atrasado

Reutiliza `updateUserPlan` / `grantTrial` já existentes para operações de plano.

## 3. UI — Nova Área `/admin/crm`

Layout com sub-abas dentro do Dashboard Master:

- **`admin.crm.tsx`** — layout com tabs (Dashboard, Funil, Renovações, Relatórios) + `<Outlet />`
- **`admin.crm.index.tsx`** — Dashboard com cards de indicadores em tempo real + gráfico simples (recharts já disponível) de evolução por stage/plano
- **`admin.crm.funil.tsx`** — Kanban drag-and-drop (`@dnd-kit/core` + `@dnd-kit/sortable`) com 9 colunas coloridas conforme especificação. Cada card mostra logo, nome, categoria, responsável, telefone, plano, status, próxima ação, renovação. Clique abre Sheet lateral com Ficha Completa
- **Ficha Completa** (Sheet) — abas: Dados / Plano / Timeline / Lembretes / Auditoria. Botões: WhatsApp, Email, Editar Empresa (abre link), Alterar Plano (usa server fns existentes), Conceder Teste, Suspender, Cancelar, Reativar
- **`admin.crm.renovacoes.tsx`** — painel com buckets (Hoje / 7d / 15d / 30d / Atrasados)
- **`admin.crm.relatorios.tsx`** — relatórios: por plano, categoria, bairro, novos, conversão, renovações, cancelamentos
- **Busca + filtros globais** — plano, categoria, tipo, status, data, bairro; busca por nome/telefone/responsável/email/categoria

Componentes reutilizáveis:
- `<CrmLeadCard />`, `<CrmKanban />`, `<CrmLeadSheet />` (ficha), `<CrmTimeline />`, `<CrmRemindersList />`, `<CrmStatCard />`

## 4. Cores por Status

Tokens Tailwind semânticos:
`lead` cinza, `contato` azul, `visita` laranja, `proposta` roxo, `negociacao` laranja, `teste` roxo, `ativo` verde, `renovacao` amarelo, `cancelado` vermelho.

## 5. Notificações

Reutiliza tabela `notifications` existente. Server fn `notifyAdminsCrmAlerts()` chamada por cron `pg_cron` (job diário) que gera alertas: teste vencendo (3d), plano vencendo (7d), renovação, novo cadastro, sem movimentação (>30d sem activity).

## 6. Painel Financeiro (Preparação)

Aba visual dentro da Ficha Completa mostrando `plan_slug`, `monthly_value`, `plan_status`, "Forma de pagamento: —", "Último pagamento: —", "Próximo vencimento: renewal_at". Somente leitura — estrutura pronta para Asaas.

## 7. Navegação

- Adicionar item **"CRM Comercial"** em `src/lib/dashboard-nav.ts` (seção admin).
- Rotas todas sob `_authenticated/admin/crm/*`, protegidas pelo `AdminLayout` existente (`useRequireAnyRole(["admin","editor"])`) + checagem extra `admin only` no componente CRM.

## 8. Fora de escopo (fase futura)

- Integração real Asaas (webhook já existe; só exibimos preparação)
- Envio real de WhatsApp/Email (botões apenas abrem `wa.me` / `mailto:`)
- Não altera Dashboards de Empresa, Imprensa, Imóveis.

---

**Dependência nova:** `@dnd-kit/core` + `@dnd-kit/sortable` (Kanban).

Confirma para eu implementar?
