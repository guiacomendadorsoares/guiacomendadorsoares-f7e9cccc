import type { ReactNode } from "react";

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
        {children}
      </h2>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 px-5 py-10 text-center">
      {icon && <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary">{icon}</div>}
      <p className="font-display text-base font-semibold text-foreground">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
