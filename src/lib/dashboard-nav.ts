import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, CheckCircle2, Building2, Briefcase, Home, Newspaper,
  Calendar, Sparkles, Handshake, Users, BarChart3, Settings, Wallet,
  User, Heart, MessageSquare, Bell, FileEdit, Megaphone, KeyRound, Crown, LifeBuoy,
} from "lucide-react";
import type { AppRole } from "@/hooks/use-auth";

export type NavItem = { to: string; label: string; icon: LucideIcon };
export type NavSection = { title: string; items: NavItem[] };

export const adminNav: NavSection[] = [
  {
    title: "Visão geral",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/aprovacoes", label: "Aprovações", icon: CheckCircle2 },
    ],
  },
  {
    title: "Conteúdo",
    items: [
      { to: "/admin/empresas", label: "Empresas", icon: Building2 },
      { to: "/admin/vagas", label: "Vagas", icon: Briefcase },
      { to: "/admin/imoveis", label: "Imóveis", icon: Home },
      { to: "/admin/noticias", label: "Notícias", icon: Newspaper },
      { to: "/admin/eventos", label: "Eventos", icon: Calendar },
      { to: "/admin/curiosidades", label: "Curiosidades", icon: Sparkles },
      { to: "/admin/utilidade-publica", label: "Utilidade Pública", icon: LifeBuoy },
    ],
  },
  {
    title: "Pessoas",
    items: [
      { to: "/admin/parceiros", label: "Parceiros", icon: Handshake },
      { to: "/admin/corretores", label: "Corretores", icon: KeyRound },
      { to: "/admin/influenciadores", label: "Imprensa", icon: Megaphone },
      { to: "/admin/usuarios", label: "Usuários", icon: Users },
    ],
  },
  {
    title: "Sistema",
    items: [
      { to: "/admin/notificacoes", label: "Notificações", icon: Bell },
      { to: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
      { to: "/admin/financeiro", label: "Financeiro", icon: Wallet },
      { to: "/admin/planos", label: "Planos", icon: Crown },
      { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

export const userNav: NavSection[] = [
  {
    title: "Minha conta",
    items: [
      { to: "/minha-conta", label: "Perfil", icon: User },
      { to: "/minha-conta/favoritos", label: "Favoritos", icon: Heart },
      { to: "/minha-conta/avaliacoes", label: "Avaliações", icon: MessageSquare },
      { to: "/minha-conta/notificacoes", label: "Notificações", icon: Bell },
    ],
  },
];

export const partnerNav: NavSection[] = [
  {
    title: "Empresa",
    items: [
      { to: "/painel-empresa", label: "Painel da empresa", icon: LayoutDashboard },
      { to: "/minha-conta", label: "Minha conta", icon: Building2 },
    ],
  },
];

export const brokerNav: NavSection[] = [
  {
    title: "Imobiliário",
    items: [
      { to: "/painel-imoveis", label: "Meus imóveis", icon: Home },
      { to: "/minha-conta", label: "Minha conta", icon: FileEdit },
    ],
  },
];

export const influencerNav: NavSection[] = [
  {
    title: "Imprensa",
    items: [
      { to: "/portal-imprensa", label: "Publicações", icon: FileEdit },
      { to: "/portal-imprensa/nova", label: "Nova publicação", icon: Sparkles },
      { to: "/portal-imprensa/estatisticas", label: "Estatísticas", icon: BarChart3 },
    ],
  },
];

export function navForRole(role: AppRole): NavSection[] {
  switch (role) {
    case "admin":
    case "editor": return adminNav;
    case "partner": return partnerNav;
    case "broker": return brokerNav;
    case "influencer": return influencerNav;
    default: return userNav;
  }
}
