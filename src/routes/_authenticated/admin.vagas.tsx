import { createFileRoute } from "@tanstack/react-router";
import { ContentTable_ } from "@/components/admin-content-table";
export const Route = createFileRoute("/_authenticated/admin/vagas")({ component: () => <ContentTable_ table="jobs" /> });
