import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const notes = ["1 a 5 anos", "giz", "aquarela", "família", "memórias"];

const slides = [
  {
    title: "Flores do ateliê",
    src: "/image/desenhos/desenhos.jpeg",
  },
  {
    title: "Maternidade",
    src: "/image/desenhos/desenhos2.jpeg",
  },
] as const;

export function StudioSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = slides[activeSlide];

  const previousSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  return (
    <section className="section-shell relative overflow-hidden bg-[#ddb8a6]">
      <img src="/image/flor.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -left-8 top-10 h-36 w-36 opacity-60 md:h-56 md:w-56" />
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <div className="soft-card relative p-4">
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#979f8a]/45 p-4">
              <div className="relative flex h-full items-center justify-center overflow-hidden rounded-lg bg-[#ddb8a6]/30">
                <div className="flex h-full w-full items-center justify-center p-3">
                  <div className="h-full max-h-[360px] w-auto overflow-hidden rounded-md border border-[#ddb8a6]/70 bg-white p-3 shadow-[0_12px_28px_rgba(0,0,0,0.10)]">
                    <img
                      key={currentSlide.src}
                      src={currentSlide.src}
                      alt={currentSlide.title}
                      className="h-full w-auto animate-[studio-slide_520ms_ease-out] object-contain"
                    />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 rounded-full border border-[#ddb8a6] bg-white/90 px-3 py-2 font-sans text-xs font-light uppercase tracking-[0.12em] text-[#8b4114]">
                  {currentSlide.title}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={previousSlide}
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#ddb8a6] bg-white text-[#8b4114]"
              aria-label="Ver ilustração anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#ddb8a6] bg-white text-[#8b4114]"
              aria-label="Ver próxima ilustração"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full border border-[#ddb8a6] transition-all ${activeSlide === index ? "w-8 bg-[#c68043]" : "w-2.5 bg-white"}`}
                aria-label={`Ver ${slide.title}`}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Ateliê ilustrado</p>
          <h2 className="mt-2 max-w-2xl font-sans text-4xl font-extralight leading-tight text-[#8b4114] md:text-5xl">
            Um universo de criança pequena, com pintura macia e detalhe feito à mão.
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-lg font-light leading-8 text-[#8b4114]/85">
            A identidade fica mais próxima da pintura da Maiara: bochechas rosadas, folhas soltas, florzinhas, letras orgânicas e fundos claros para o desenho respirar.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {notes.map((note) => (
              <span key={note} className="inline-flex items-center gap-2 rounded-full border border-[#ddb8a6] bg-white px-4 py-2 font-sans text-sm font-light text-[#8b4114]">
                <Sparkles className="h-3.5 w-3.5 text-[#c68043]" />
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
