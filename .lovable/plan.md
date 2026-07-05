# Gerenciamento Manual de Planos — Dashboard Master

Feature paralela ao Asaas: o Admin define plano, status, validade e origem manualmente para qualquer parceiro (empresa, farmácia, corretor, imobiliária). Permissões refletem imediatamente em todo o app.

## 1. Banco de dados (migração única)

Estender `profiles` (fonte da verdade do plano do parceiro):

- `plan_status` enum: `active | suspended | canceled | trial` (default `active`)
- `plan_source` enum: `manual_admin | asaas | promotion | courtesy | migration` (default `manual_admin`)
- `plan_started_at timestamptz`
- `plan_expires_at timestamptz null` (null = sem vencimento)
- `plan_notes text null`

Nova tabela `plan_audit_log`:
- `id, profile_user_id, changed_by (admin uuid), previous_plan, new_plan, previous_status, new_status, previous_expires_at, new_expires_at, reason text, created_at`
- RLS: apenas admin lê/insere. GRANT para authenticated + service_role.

Trigger `log_plan_change` em `profiles`: quando `current_plan/plan_status/plan_expires_at` mudam, insere linha em `plan_audit_log` com `auth.uid()` como `changed_by`.

Função `public.effective_plan(_user_id uuid)` retorna slug do plano considerando status e validade:
- Se `plan_status in ('suspended','canceled')` → `free`
- Se `plan_expires_at is not null and plan_expires_at < now()` → `free`
- Senão → `current_plan`

## 2. Server functions (`src/lib/admin.functions.ts`)

Substituir/expandir `setUserPlan` por `updateUserPlan` (admin-only):
- Input: `{ userId, plan, status?, source?, expiresAt? | null, reason? }`
- Atualiza `profiles`; trigger cuida da auditoria.

Ações rápidas (wrappers finos que chamam `updateUserPlan`):
- `promoteUserPlan({ userId, plan: 'destaque' | 'ouro' })`
- `demoteUserPlan({ userId })` → free
- `suspendUserPlan({ userId, reason })`
- `reactivateUserPlan({ userId })`
- `grantTrial({ userId, plan, days })` → status `trial`, expira em N dias
- `renewUserPlan({ userId, days })` → soma dias ao vencimento

Adicionar `fetchPlanAudit({ userId })` para exibir histórico.

## 3. Cliente — leitura efetiva

`src/lib/plans.ts` e `src/lib/plan-limits.ts`:
- `useCurrentPlan` e `useOwnerPlan` passam a chamar RPC `effective_plan` (fallback: computar no cliente com os novos campos).
- Adicionar `usePlanMeta(userId)` retornando `{ slug, status, source, startedAt, expiresAt }` para exibir no dashboard do parceiro e página pública.

## 4. UI — Dashboard Master

Novo módulo em `/admin/gerenciar-planos` (rota `admin.gerenciar-planos.tsx`) + item no menu `dashboard-nav.ts`:

- Lista de parceiros (busca por email/nome, filtro por role, plano, status).
- Cada linha: avatar, nome, roles, plano atual (badge), status, vencimento.
- Ações rápidas em dropdown: Promover Destaque / Promover Ouro / Rebaixar Free / Suspender / Reativar / Conceder Teste (7/15/30 dias) / Renovar (+30/+90/+365).
- Modal "Editar plano": plano, status, origem, data início, data vencimento (com checkbox "Sem vencimento"), motivo. Salvar chama `updateUserPlan`.
- Aba/dialog "Histórico" mostrando `plan_audit_log`.

Integrar seletor de plano nos formulários existentes de cadastro admin (empresas, farmácias via businesses, corretores, imobiliárias). Como plano vive em `profiles` (owner), o seletor no cadastro de conteúdo apenas aparece quando o admin também está definindo/alterando o dono; caso contrário, o fluxo canônico é editar o parceiro em Gerenciar Planos. Adicionar link rápido "Editar plano do dono" nos CRUDs.

## 5. Propagação imediata

- Server functions invalidam consulta via retorno; cliente usa `queryClient.invalidateQueries({ queryKey: ['profile-plan'] })` e `['owner-plan']` após mutação.
- Dashboards do parceiro já leem `useCurrentPlan`, então refletem no próximo refetch (sem novo login). Adicionar `refetchOnWindowFocus` já é padrão.

## Detalhes técnicos

- Enums criados via `CREATE TYPE`; migração idempotente com `DO $$ ... IF NOT EXISTS`.
- `updated_at` trigger já existe em `profiles`.
- Audit trigger usa `SECURITY DEFINER` e `SET search_path = public`.
- Novo item de menu apenas para role `admin` (não editor).
- Sem alterações no fluxo Asaas atual: quando webhook Asaas rodar, ele passará `plan_source = 'asaas'` — coexistência garantida.

## Fora de escopo

- Integração real com Asaas (permanece como está).
- Cobrança automática, emails de vencimento (pode entrar em fase seguinte).
