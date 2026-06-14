// Types and sample data for real estate listings.
// Ready to be swapped by a Supabase query: `supabase.from('properties').select('*')`.

export type ListingType = "venda" | "aluguel";

export type PropertyKind = "casa" | "apartamento" | "terreno" | "comercial";

export interface Property {
  id: string;
  title: string;
  listingType: ListingType;
  listingLabel: string;
  kind: PropertyKind;
  kindLabel: string;
  price: string; // e.g. "R$ 450.000" or "R$ 2.200/mês"
  bedrooms?: number;
  bathrooms?: number;
  areaM2?: number;
  address: string;
  image: string;
  featured?: boolean;
}

export const LISTING_FILTERS: { value: ListingType | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "venda", label: "Venda" },
  { value: "aluguel", label: "Aluguel" },
];

export const KIND_FILTERS: { value: PropertyKind | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "casa", label: "Casa" },
  { value: "apartamento", label: "Apartamento" },
  { value: "terreno", label: "Terreno" },
  { value: "comercial", label: "Comercial" },
];

export const sampleProperties: Property[] = [];

export function getListingBadgeColor(listingType: ListingType): string {
  switch (listingType) {
    case "venda":
      return "bg-primary text-primary-foreground";
    case "aluguel":
      return "bg-primary-vibrant text-primary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}
