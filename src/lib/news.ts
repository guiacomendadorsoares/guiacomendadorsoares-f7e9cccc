// News types and sample data. Swap with Supabase later.
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import news4 from "@/assets/news-4.jpg";
import news5 from "@/assets/news-5.jpg";

export type NewsCategory =
  | "bairro"
  | "seguranca"
  | "transito"
  | "obras"
  | "saude"
  | "educacao";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: NewsCategory;
  categoryLabel: string;
  publishedAt: string; // ISO
}

export const NEWS_FILTERS: { value: NewsCategory | "todos"; label: string }[] = [
  { value: "todos", label: "Todas" },
  { value: "bairro", label: "Bairro" },
  { value: "seguranca", label: "Segurança" },
  { value: "transito", label: "Trânsito" },
  { value: "obras", label: "Obras" },
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
];

export const sampleNews: NewsItem[] = [
  {
    id: "1",
    title: "Feira cultural movimenta praça central do bairro",
    summary:
      "Edição reuniu artesãos, food trucks e apresentações musicais no último fim de semana.",
    image: news1,
    category: "bairro",
    categoryLabel: "Bairro",
    publishedAt: "2026-06-13T10:00:00Z",
  },
  {
    id: "2",
    title: "Obras de recapeamento começam na Av. Comendador Soares",
    summary: "Trecho entre os números 1200 e 2400 receberá nova pavimentação ao longo do mês.",
    image: news2,
    category: "obras",
    categoryLabel: "Obras",
    publishedAt: "2026-06-12T08:30:00Z",
  },
  {
    id: "3",
    title: "Reforço no policiamento no entorno do comércio",
    summary: "PM amplia rondas noturnas após pedido de associação de lojistas do bairro.",
    image: news3,
    category: "seguranca",
    categoryLabel: "Segurança",
    publishedAt: "2026-06-11T19:15:00Z",
  },
  {
    id: "4",
    title: "Mudança no trânsito da Rua Major Rego começa segunda",
    summary: "Via passa a operar em sentido único para reduzir congestionamentos no horário de pico.",
    image: news4,
    category: "transito",
    categoryLabel: "Trânsito",
    publishedAt: "2026-06-10T14:00:00Z",
  },
  {
    id: "5",
    title: "Escolas do bairro abrem matrículas para reforço escolar",
    summary: "Programa gratuito atende alunos do 1º ao 9º ano com aulas no contraturno.",
    image: news5,
    category: "educacao",
    categoryLabel: "Educação",
    publishedAt: "2026-06-09T09:00:00Z",
  },
];

export function formatNewsDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function getCategoryColor(c: NewsCategory): string {
  switch (c) {
    case "bairro":
      return "bg-primary text-primary-foreground";
    case "seguranca":
      return "bg-destructive text-destructive-foreground";
    case "transito":
      return "bg-gold text-gold-foreground";
    case "obras":
      return "bg-primary-vibrant text-primary-foreground";
    case "saude":
      return "bg-emerald-600 text-white";
    case "educacao":
      return "bg-indigo-600 text-white";
  }
}
