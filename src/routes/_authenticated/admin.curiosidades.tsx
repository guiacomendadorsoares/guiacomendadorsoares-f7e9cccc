import { createFileRoute } from "@tanstack/react-router";
import { ContentTable_ } from "@/components/admin-content-table";
export const Route = createFileRoute("/_authenticated/admin/curiosidades")({ component: () => <ContentTable_ table="curiosities" /> });
