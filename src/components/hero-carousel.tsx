import { useEffect, useState } from "react";
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";
import banner3 from "@/assets/banner-3.jpg";

type Slide = {
  src: string;
  eyebrow: string;
  title: string;
  cta: string;
};

const slides: Slide[] = [
  {
    src: banner1,
    eyebrow: "Comendador Soares",
    title: "O bairro que conecta gente, comércio e oportunidade.",
    cta: "Explorar guia",
  },
  {
    src: banner2,
    eyebrow: "Apoie o local",
    title: "Conheça os negócios que fazem o bairro acontecer.",
    cta: "Ver empresas",
  },
  {
    src: banner3,
    eyebrow: "Onde comer",
    title: "Os melhores sabores estão pertinho de você.",
    cta: "Ver restaurantes",
  },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative -mx-5 -mt-4 mb-6 overflow-hidden">
      <div className="relative h-[260px] w-full">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={idx !== i}
          >
            <img
              src={s.src}
              alt=""
              loading={idx === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 pb-8 text-white">
              <span className="inline-block rounded-full bg-gold/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">
                {s.eyebrow}
              </span>
              <h2 className="mt-2 font-display text-xl font-bold leading-tight drop-shadow">
                {s.title}
              </h2>
              <button className="mt-3 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-primary shadow-card backdrop-blur">
                {s.cta} →
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === i ? "w-6 bg-gold" : "w-1.5 bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
