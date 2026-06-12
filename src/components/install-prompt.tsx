import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("pwa-install-dismissed") === "1") setDismissed(true);
    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!evt || dismissed) return null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border gradient-brand p-4 text-primary-foreground shadow-elegant">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
        <Download className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Instale o Guia CS</p>
        <p className="text-xs opacity-80">Acesso rápido, igual a um app.</p>
      </div>
      <button
        onClick={async () => {
          await evt.prompt();
          setEvt(null);
        }}
        className="rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-gold-foreground shadow-gold"
      >
        Instalar
      </button>
      <button
        aria-label="Dispensar"
        onClick={() => {
          localStorage.setItem("pwa-install-dismissed", "1");
          setDismissed(true);
        }}
        className="grid h-7 w-7 place-items-center rounded-full text-primary-foreground/80 hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
