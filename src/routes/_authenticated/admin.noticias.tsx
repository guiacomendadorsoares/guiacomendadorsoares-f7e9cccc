import { createFileRoute } from "@tanstack/react-router";
import { ContentCrud } from "@/components/content-crud";
export const Route = createFileRoute("/_authenticated/admin/noticias")({
  component: () => <ContentCrud table="news" />,
});
