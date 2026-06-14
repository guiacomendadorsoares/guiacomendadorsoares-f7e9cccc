import { Link } from "@tanstack/react-router";
import type { Category } from "@/lib/guia-taxonomy";

export function CategoryTile({ c, count }: { c: Category; count?: number }) {
  const Icon = c.icon;
  return (
    <Link
      to="/guia/$categoria"
      params={{ categoria: c.slug }}
      className="group flex flex-col items-center gap-2"
    >
      <span
        className="relative grid h-20 w-20 place-items-center rounded-3xl text-white transition-transform group-hover:-translate-y-0.5 group-active:scale-95"
        style={{
          background: `linear-gradient(135deg, ${c.from} 0%, ${c.to} 100%)`,
          boxShadow: `0 14px 28px -12px ${c.from}cc, inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -4px 8px rgba(0,0,0,0.2)`,
        }}
      >
        <span className="pointer-events-none absolute inset-x-2 top-1.5 h-3 rounded-full bg-white/35 blur-[2px]" />
        <Icon className="relative h-8 w-8 drop-shadow" />
        {typeof count === "number" && count > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-foreground shadow">
            {count}
          </span>
        )}
      </span>
      <span className="text-center text-[12px] font-semibold leading-tight text-foreground">
        {c.label}
      </span>
    </Link>
  );
}
