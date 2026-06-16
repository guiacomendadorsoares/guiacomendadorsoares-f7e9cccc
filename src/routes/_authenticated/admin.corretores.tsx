import { createFileRoute } from "@tanstack/react-router";
import { RoleUsersList } from "@/components/role-users-list";

export const Route = createFileRoute("/_authenticated/admin/corretores")({
  component: () => <RoleUsersList role="broker" title="Corretores" />,
});
