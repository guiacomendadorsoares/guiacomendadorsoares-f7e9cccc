import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin-content-table";
export const Route = createFileRoute("/_authenticated/admin/financeiro")({ component: () => <ComingSoon title="Financeiro (integração futura com Asaas)" /> });
