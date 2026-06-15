import { Link } from "@tanstack/react-router";
import {
  Scale,
  Dumbbell,
  UtensilsCrossed,
  Building2,
  Briefcase,
  HeartPulse,
  GraduationCap,
  Dog,
  Scissors,
  Wrench,
  LifeBuoy,
} from "lucide-react";
import type { ComponentType } from "react";

type Cat = {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  /** Two-color gradient stops for the 3D tile face */
  from: string;
  to2: string;
};

const cats: Cat[] = [
  { label: "Advogados", to: "/guia", icon: Scale, from: "#1f3a2e", to2: "#3b6b54" },
  { label: "Academias", to: "/guia", icon: Dumbbell, from: "#1a4d3a", to2: "#34c781" },
  { label: "Restaurantes", to: "/guia", icon: UtensilsCrossed, from: "#b8842b", to2: "#f0c068" },
  { label: "Imóveis", to: "/imoveis", icon: Building2, from: "#1f3a2e", to2: "#4a8a6b" },
  { label: "Empregos", to: "/vagas", icon: Briefcase, from: "#0f1a14", to2: "#3a5a48" },
  { label: "Saúde", to: "/guia", icon: HeartPulse, from: "#1a4d3a", to2: "#5dd6a1" },
  { label: "Educação", to: "/guia", icon: GraduationCap, from: "#b8842b", to2: "#e8b85a" },
  { label: "Pet Shop", to: "/guia", icon: Dog, from: "#2a5444", to2: "#6ec79a" },
  { label: "Beleza", to: "/guia", icon: Scissors, from: "#8a5e1f", to2: "#e8b85a" },
  { label: "Serviços", to: "/guia", icon: Wrench, from: "#1f3a2e", to2: "#4a8a6b" },
  { label: "Utilidade Pública", to: "/utilidade-publica", icon: LifeBuoy, from: "#7a1f1f", to2: "#d64545" },
];

export function CategoriesGrid() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {cats.map(({ label, to, icon: Icon, from, to2 }) => (
        <Link
          key={label}
          to={to}
          className="group flex flex-col items-center gap-1.5"
        >
          <span
            className="relative grid h-14 w-14 place-items-center rounded-2xl text-white transition-transform group-active:scale-90"
            style={{
              background: `linear-gradient(135deg, ${from} 0%, ${to2} 100%)`,
              boxShadow: `0 8px 18px -8px ${from}cc, inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.18)`,
            }}
          >
            {/* gloss */}
            <span className="pointer-events-none absolute inset-x-1.5 top-1 h-2.5 rounded-full bg-white/35 blur-[2px]" />
            <Icon className="relative h-6 w-6 drop-shadow" />
          </span>
          <span className="text-center text-[10.5px] font-medium leading-tight text-foreground">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
