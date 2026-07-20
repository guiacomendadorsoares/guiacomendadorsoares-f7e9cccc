import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { User, LogIn, Settings, HelpCircle, ChevronRight } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useEffect } from "react";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Guia CS" },
      { name: "description", content: "Sua conta no Guia Comendador Soares." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PerfilPage,
});

const items = [
  { label: "Configurações", icon: Settings },
  { label: "Ajuda e suporte", icon: HelpCircle },
];

function PerfilPage() {
  const { user, loading } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/minha-conta", replace: true });
  }, [loading, user, navigate]);

  return (
    <AppShell title="Perfil">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 rounded-2xl border border-border gradient-brand p-5 text-primary-foreground shadow-elegant">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white/15">
              <User className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold">Visitante</p>
              <p className="text-xs opacity-85">Entre para anunciar e favoritar.</p>
            </div>
          </div>
          <Link
            to="/auth"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground shadow-gold"
          >
            <LogIn className="h-4 w-4" />
            Entrar ou criar conta
          </Link>
        </div>

        <ul className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {items.map(({ label, icon: Icon }, i) => (
            <li key={label}>
              <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              {i < items.length - 1 && <div className="ml-16 border-t border-border" />}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Guia Comendador Soares · v0.1
        </p>
      </div>
    </AppShell>
  );
}
