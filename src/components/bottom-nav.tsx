import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Map, Briefcase, Building2, User } from "lucide-react";
import type { ComponentType } from "react";

type Item = { to: string; label: string; icon: ComponentType<{ className?: string }> };

const items: Item[] = [
  { to: "/", label: "Início", icon: Home },
  { to: "/guia", label: "Guia", icon: Map },
  { to: "/vagas", label: "Vagas", icon: Briefcase },
  { to: "/imoveis", label: "Imóveis", icon: Building2 },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/85 backdrop-blur-lg safe-bottom"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                className="group flex flex-col items-center justify-center gap-1 px-2 pt-2 pb-1 text-[11px] font-medium text-muted-foreground transition-colors data-[active=true]:text-primary"
                data-active={active}
              >
                <span
                  className="grid h-9 w-9 place-items-center rounded-full transition-all group-data-[active=true]:gradient-brand group-data-[active=true]:text-primary-foreground group-data-[active=true]:shadow-elegant"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
