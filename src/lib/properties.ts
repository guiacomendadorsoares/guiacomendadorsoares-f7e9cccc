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

export const sampleProperties: Property[] = [
  {
    id: "1",
    title: "Apartamento de 2 quartos",
    listingType: "aluguel",
    listingLabel: "Aluguel",
    kind: "apartamento",
    kindLabel: "Apartamento",
    price: "R$ 2.200/mês",
    bedrooms: 2,
    bathrooms: 1,
    areaM2: 68,
    address: "Av. Comendador Soares, 1500 — Nova Iguaçu",
    image: "/src/assets/property-1.jpg",
    featured: true,
  },
  {
    id: "2",
    title: "Casa ampla com quintal",
    listingType: "venda",
    listingLabel: "Venda",
    kind: "casa",
    kindLabel: "Casa",
    price: "R$ 450.000",
    bedrooms: 3,
    bathrooms: 2,
    areaM2: 120,
    address: "Rua das Flores, 88 — Nova Iguaçu",
    image: "/src/assets/property-2.jpg",
    featured: true,
  },
  {
    id: "3",
    title: "Sala comercial reformada",
    listingType: "aluguel",
    listingLabel: "Aluguel",
    kind: "comercial",
    kindLabel: "Comercial",
    price: "R$ 3.500/mês",
    bedrooms: 0,
    bathrooms: 1,
    areaM2: 45,
    address: "Av. Brasil, 7200 — Nova Iguaçu",
    image: "/src/assets/property-3.jpg",
  },
  {
    id: "4",
    title: "Terreno plano em avenida",
    listingType: "venda",
    listingLabel: "Venda",
    kind: "terreno",
    kindLabel: "Terreno",
    price: "R$ 180.000",
    areaM2: 250,
    address: "Rua Major Rego, 405 — Nova Iguaçu",
    image: "/src/assets/property-2.jpg",
  },
  {
    id: "5",
    title: "Apartamento novo no centro",
    listingType: "venda",
    listingLabel: "Venda",
    kind: "apartamento",
    kindLabel: "Apartamento",
    price: "R$ 320.000",
    bedrooms: 2,
    bathrooms: 1,
    areaM2: 55,
    address: "Av. Comendador Soares, 2100 — Nova Iguaçu",
    image: "/src/assets/property-1.jpg",
  },
];

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
