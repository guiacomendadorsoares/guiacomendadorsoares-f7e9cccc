// Sample business profile details. Swap with Supabase later.
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";

export interface BusinessReview {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string; // ISO
  comment: string;
}

export interface BusinessHours {
  day: string;
  hours: string;
}

export interface BusinessProfile {
  id: string;
  description: string;
  cover: string;
  instagram?: string; // handle without @
  hours: BusinessHours[];
  gallery: string[];
  reviews: BusinessReview[];
}

const defaultGallery = [food1, food2, food3];

const defaultHours: BusinessHours[] = [
  { day: "Seg — Sex", hours: "08:00 — 19:00" },
  { day: "Sábado", hours: "08:00 — 14:00" },
  { day: "Domingo", hours: "Fechado" },
];

const defaultReviews: BusinessReview[] = [
  {
    id: "r1",
    author: "Marina S.",
    initials: "MS",
    rating: 5,
    date: "2026-06-08T10:00:00Z",
    comment: "Atendimento impecável e produtos de altíssima qualidade. Super recomendo!",
  },
  {
    id: "r2",
    author: "Rafael L.",
    initials: "RL",
    rating: 4,
    date: "2026-05-22T15:30:00Z",
    comment: "Bom custo-benefício e equipe atenciosa. Voltarei sem dúvida.",
  },
  {
    id: "r3",
    author: "Júlia P.",
    initials: "JP",
    rating: 5,
    date: "2026-05-14T19:10:00Z",
    comment: "Ambiente acolhedor e muito profissional. Virou meu lugar favorito no bairro.",
  },
];

export const businessProfiles: Record<string, BusinessProfile> = {
  "1": {
    id: "1",
    description:
      "Padaria tradicional do bairro com mais de 20 anos servindo pães artesanais, cafés especiais e doces que são patrimônio local.",
    cover: food2,
    instagram: "padariapaodeouro",
    hours: defaultHours,
    gallery: defaultGallery,
    reviews: defaultReviews,
  },
};

export function getBusinessProfile(id: string): BusinessProfile {
  return (
    businessProfiles[id] ?? {
      id,
      description:
        "Empresa parceira do Guia Comendador Soares. Em breve mais informações por aqui.",
      cover: food1,
      hours: defaultHours,
      gallery: defaultGallery,
      reviews: defaultReviews,
    }
  );
}

export function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
