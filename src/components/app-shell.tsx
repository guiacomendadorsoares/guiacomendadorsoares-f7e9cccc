import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      {title && (
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 px-5 pb-3 pt-[max(env(safe-area-inset-top),1rem)] backdrop-blur-lg">
          <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </header>
      )}
      <main className="flex-1 px-5 pb-28 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
