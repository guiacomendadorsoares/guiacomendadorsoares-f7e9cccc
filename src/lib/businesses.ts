// Types and sample data for the commercial guide.
// Ready to be swapped by a Supabase query: `supabase.from('businesses').select('*')`.

export type BusinessCategory =
  | "all"
  | "food"
  | "beauty"
  | "health"
  | "services"
  | "shops"
  | "fitness"
  | "education"
  | "pet";

export type Business = {
  id: string;
  name: string;
  category: Exclude<BusinessCategory, "all">;
  categoryLabel: string;
  address: string;
  whatsapp: string;
  rating: number;
  reviews: number;
  initials: string;
  from: string;
  to: string;
  verified?: boolean;
  distanceKm?: number;
  // Campos da taxonomia escalável (Supabase)
  main_category?: string | null;
  subcategory?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  description?: string | null;
  featured?: boolean | null;
};

export const SAMPLE_BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Padaria Pão de Ouro",
    category: "food",
    categoryLabel: "Padaria & Café",
    address: "Av. Comendador Soares, 1234",
    whatsapp: "5521999990001",
    rating: 4.8,
    reviews: 213,
    initials: "PO",
    from: "#b8842b",
    to: "#f0c068",
    verified: true,
    distanceKm: 0.4,
  },
  {
    id: "2",
    name: "Studio Bella Hair",
    category: "beauty",
    categoryLabel: "Salão de Beleza",
    address: "Rua das Flores, 88",
    whatsapp: "5521999990002",
    rating: 4.9,
    reviews: 156,
    initials: "BH",
    from: "#8a5e1f",
    to: "#e8b85a",
    distanceKm: 0.9,
  },
  {
    id: "3",
    name: "Clínica Vida Plena",
    category: "health",
    categoryLabel: "Clínica Médica",
    address: "Rua Major Rego, 405",
    whatsapp: "5521999990003",
    rating: 4.7,
    reviews: 98,
    initials: "VP",
    from: "#1a4d3a",
    to: "#5dd6a1",
    verified: true,
    distanceKm: 1.2,
  },
  {
    id: "4",
    name: "FitZone Academia",
    category: "fitness",
    categoryLabel: "Academia",
    address: "Av. Brasil, 7200",
    whatsapp: "5521999990004",
    rating: 4.6,
    reviews: 342,
    initials: "FZ",
    from: "#1a4d3a",
    to: "#34c781",
    distanceKm: 1.7,
  },
];

export const CATEGORY_FILTERS: { id: BusinessCategory; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "food", label: "Alimentação" },
  { id: "beauty", label: "Beleza" },
  { id: "health", label: "Saúde" },
  { id: "fitness", label: "Academias" },
  { id: "services", label: "Serviços" },
  { id: "shops", label: "Lojas" },
  { id: "education", label: "Educação" },
  { id: "pet", label: "Pet" },
];
