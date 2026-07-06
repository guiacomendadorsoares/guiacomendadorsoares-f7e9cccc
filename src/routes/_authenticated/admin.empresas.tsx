import { createFileRoute } from "@tanstack/react-router";
import { ContentCrud } from "@/components/content-crud";
import { BusinessesCsvImport } from "@/components/businesses-csv-import";

export const Route = createFileRoute("/_authenticated/admin/empresas")({
  component: () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <BusinessesCsvImport />
      </div>
      <ContentCrud table="businesses" />
    </div>
  ),
});
