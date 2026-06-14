import {
  HeartPulse, Scale, GraduationCap, Dumbbell, UtensilsCrossed, Scissors,
  Dog, Car, Home, Wrench, ShoppingBag, Landmark, Building2, Church,
  PartyPopper, Truck, Megaphone, type LucideIcon,
} from "lucide-react";

export type Subcategory = { slug: string; label: string };

export type Category = {
  slug: string;
  label: string;
  emoji: string;
  icon: LucideIcon;
  from: string;
  to: string;
  description: string;
  showOnHome: boolean;
  subcategories: Subcategory[];
};

const sub = (label: string): Subcategory => ({
  slug: label
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  label,
});

export const CATEGORIES: Category[] = [
  {
    slug: "alimentacao", label: "Alimentação", emoji: "🍔", icon: UtensilsCrossed,
    from: "#b8842b", to: "#f0c068", showOnHome: true,
    description: "Restaurantes, lanchonetes, padarias e muito mais.",
    subcategories: ["Restaurantes","Pizzarias","Hamburguerias","Lanchonetes","Padarias","Confeitarias","Açaí","Sorveterias","Churrascarias","Comida Japonesa","Marmitarias"].map(sub),
  },
  {
    slug: "saude", label: "Saúde", emoji: "🏥", icon: HeartPulse,
    from: "#1a4d3a", to: "#5dd6a1", showOnHome: true,
    description: "Clínicas, profissionais e farmácias do bairro.",
    subcategories: ["Clínicas Médicas","Dentistas","Psicólogos","Fisioterapeutas","Nutricionistas","Farmácias","Laboratórios","Clínicas Veterinárias"].map(sub),
  },
  {
    slug: "beleza-estetica", label: "Beleza e Estética", emoji: "💄", icon: Scissors,
    from: "#8a5e1f", to: "#e8b85a", showOnHome: true,
    description: "Salões, barbearias e estúdios de estética.",
    subcategories: ["Salões de Beleza","Barbearias","Manicure","Estética Facial","Estética Corporal","Maquiagem"].map(sub),
  },
  {
    slug: "esportes-bem-estar", label: "Esportes e Bem-estar", emoji: "🏋️", icon: Dumbbell,
    from: "#1a4d3a", to: "#34c781", showOnHome: true,
    description: "Academias, estúdios e práticas esportivas.",
    subcategories: ["Academias","Crossfit","Artes Marciais","Escolinhas de Futebol","Dança","Yoga","Pilates"].map(sub),
  },
  {
    slug: "automotivo", label: "Automotivo", emoji: "🚗", icon: Car,
    from: "#1f3a2e", to: "#4a8a6b", showOnHome: true,
    description: "Oficinas, peças e serviços para o seu veículo.",
    subcategories: ["Oficinas Mecânicas","Auto Elétricas","Borracharias","Lava Jato","Auto Peças","Guinchos","Despachantes Veiculares"].map(sub),
  },
  {
    slug: "casa-construcao", label: "Casa e Construção", emoji: "🏠", icon: Home,
    from: "#2a5444", to: "#6ec79a", showOnHome: true,
    description: "Materiais, profissionais e reformas.",
    subcategories: ["Material de Construção","Vidraçarias","Marmorarias","Marcenarias","Serralherias","Pintores","Pedreiros","Eletricistas","Encanadores","Gesso e Drywall"].map(sub),
  },
  {
    slug: "pets", label: "Pets", emoji: "🐶", icon: Dog,
    from: "#2a5444", to: "#6ec79a", showOnHome: true,
    description: "Tudo para o seu melhor amigo.",
    subcategories: ["Pet Shops","Banho e Tosa","Veterinários","Adestramento"].map(sub),
  },
  {
    slug: "educacao", label: "Educação", emoji: "🎓", icon: GraduationCap,
    from: "#b8842b", to: "#e8b85a", showOnHome: true,
    description: "Escolas, cursos e reforço escolar.",
    subcategories: ["Escolas","Creches","Cursos Profissionalizantes","Cursos de Idiomas","Reforço Escolar","Informática"].map(sub),
  },
  {
    slug: "juridico-profissional", label: "Jurídico e Profissional", emoji: "⚖️", icon: Scale,
    from: "#1f3a2e", to: "#3b6b54", showOnHome: true,
    description: "Advogados, contadores e consultores.",
    subcategories: ["Advogados","Contadores","Despachantes","Consultores","Corretores de Seguros","Peritos"].map(sub),
  },
  {
    slug: "imobiliario", label: "Imobiliário", emoji: "🏢", icon: Building2,
    from: "#1f3a2e", to: "#4a8a6b", showOnHome: true,
    description: "Corretores e imobiliárias do bairro.",
    subcategories: ["Corretores","Imobiliárias","Administração de Condomínios"].map(sub),
  },
  {
    slug: "comercio", label: "Comércio", emoji: "🛒", icon: ShoppingBag,
    from: "#b8842b", to: "#f0c068", showOnHome: true,
    description: "Lojas, mercados e variedades.",
    subcategories: ["Mercados","Hortifrúti","Lojas de Roupas","Calçados","Papelarias","Presentes","Utilidades Domésticas","Informática","Celulares"].map(sub),
  },
  {
    slug: "servicos-gerais", label: "Serviços Gerais", emoji: "🔧", icon: Wrench,
    from: "#1f3a2e", to: "#4a8a6b", showOnHome: true,
    description: "Profissionais para todo tipo de demanda.",
    subcategories: ["Chaveiros","Assistência Técnica","Segurança Eletrônica","Câmeras","Dedetização","Limpeza","Mudanças e Fretes"].map(sub),
  },
  {
    slug: "financeiro", label: "Financeiro", emoji: "🏦", icon: Landmark,
    from: "#1a4d3a", to: "#34c781", showOnHome: false,
    description: "Bancos, cooperativas e seguros.",
    subcategories: ["Bancos","Correspondentes Bancários","Cooperativas de Crédito","Seguros"].map(sub),
  },
  {
    slug: "comunidade", label: "Comunidade", emoji: "⛪", icon: Church,
    from: "#1f3a2e", to: "#3b6b54", showOnHome: false,
    description: "Igrejas, ONGs e projetos sociais.",
    subcategories: ["Igrejas","ONGs","Associações","Projetos Sociais"].map(sub),
  },
  {
    slug: "eventos-entretenimento", label: "Eventos e Entretenimento", emoji: "🎉", icon: PartyPopper,
    from: "#8a5e1f", to: "#e8b85a", showOnHome: false,
    description: "Tudo para a sua festa ou evento.",
    subcategories: ["Casas de Festa","Decoração","Fotógrafos","Filmagem","DJs","Sonorização","Buffet"].map(sub),
  },
  {
    slug: "transporte-logistica", label: "Transporte e Logística", emoji: "🚚", icon: Truck,
    from: "#1f3a2e", to: "#4a8a6b", showOnHome: false,
    description: "Mototáxi, fretes, mudanças e transportadoras.",
    subcategories: ["Mototáxi","Táxi","Transportadoras","Fretes","Mudanças"].map(sub),
  },
  {
    slug: "marketing-publicidade", label: "Marketing e Publicidade", emoji: "📣", icon: Megaphone,
    from: "#8a5e1f", to: "#e8b85a", showOnHome: false,
    description: "Agências, social media, design e publicidade.",
    subcategories: ["Agências de Marketing","Social Media","Design Gráfico","Produção de Conteúdo","Tráfego Pago","Sites e E-commerce","Gráficas","Comunicação Visual"].map(sub),
  },
];

export const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c.slug, label: `${c.emoji} ${c.label}` }));

export function findCategory(slug: string | undefined): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function findSubcategory(catSlug: string | undefined, subSlug: string | undefined): Subcategory | undefined {
  return findCategory(catSlug)?.subcategories.find((s) => s.slug === subSlug);
}
