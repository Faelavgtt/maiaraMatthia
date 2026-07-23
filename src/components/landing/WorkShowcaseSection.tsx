import { useEffect, useRef, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Image as ImageIcon, MessageCircle, Sparkles } from "lucide-react";

const budgetMessage = [
  "Olá! Quero pedir um orçamento com a Maiara Mattia.",
  "Tenho interesse em um projeto, desenho personalizado ou arte de aniversário.",
  "Podemos conversar sobre ideias, valores e prazos?",
].join("\n");

const budgetWhatsappUrl = `https://wa.me/?text=${encodeURIComponent(budgetMessage)}`;

const projects = [
  {
    number: "01",
    title: "Desenho infantil transformado",
    category: "Arte em linhas",
    description: "Rabiscos e personagens da criança ganham acabamento delicado para virar quadro, presente ou lembrança.",
    placeholder: "Arte do desenho",
    src: "",
    surface: "#ead4c6",
    width: 270,
    aspectRatio: "4 / 5",
    offset: 44,
    rotate: -1.2,
  },
  {
    number: "02",
    title: "Personagem autoral",
    category: "Projeto sob medida",
    description: "Ilustrações criadas a partir de uma história, fase da infância ou ideia afetiva da família.",
    placeholder: "Projeto autoral",
    src: "",
    surface: "#e4e7d9",
    width: 230,
    aspectRatio: "1 / 1",
    offset: 4,
    rotate: 1.3,
  },
  {
    number: "03",
    title: "Arte para aniversário",
    category: "Celebrações",
    description: "Elementos visuais para convites, papelaria, lembranças e detalhes de uma festa com identidade própria.",
    placeholder: "Arte de festa",
    src: "",
    surface: "#f0dfd4",
    width: 350,
    aspectRatio: "16 / 9",
    offset: 78,
    rotate: -0.4,
  },
  {
    number: "04",
    title: "Composição afetiva",
    category: "Quadro personalizado",
    description: "Cenas, nomes, frases e pequenos símbolos organizados em uma arte feita para guardar.",
    placeholder: "Quadro final",
    src: "",
    surface: "#e1d7c8",
    width: 250,
    aspectRatio: "3 / 4",
    offset: 28,
    rotate: 1.6,
  },
  {
    number: "05",
    title: "Universo visual",
    category: "Projeto especial",
    description: "Uma direção delicada para coleções, presentes, papelaria e peças que precisam conversar entre si.",
    placeholder: "Coleção visual",
    src: "",
    surface: "#e6d8cf",
    width: 310,
    aspectRatio: "5 / 4",
    offset: 92,
    rotate: -1.5,
  },
] as const;

export function WorkShowcaseSection() {
  const wallRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const carouselProjects = [...projects, ...projects, ...projects];

  const getLoopSegmentWidth = () => {
    const wall = wallRef.current;
    if (!wall) return 0;

    return wall.scrollWidth / 3;
  };

  const syncLoopPosition = () => {
    const wall = wallRef.current;
    const segmentWidth = getLoopSegmentWidth();
    if (!wall || !segmentWidth) return;

    if (wall.scrollLeft < segmentWidth * 0.45) {
      wall.scrollLeft += segmentWidth;
    }

    if (wall.scrollLeft > segmentWidth * 1.55) {
      wall.scrollLeft -= segmentWidth;
    }
  };

  const scrollWall = (direction: "previous" | "next") => {
    const wall = wallRef.current;
    if (!wall) return;

    wall.scrollBy({
      left: direction === "next" ? 380 : -380,
      behavior: "smooth",
    });
  };

  const startWallDrag = (event: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = wallRef.current?.scrollLeft ?? 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragWall = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !wallRef.current) return;

    const distance = event.clientX - dragStartXRef.current;
    wallRef.current.scrollLeft = dragStartScrollLeftRef.current - distance;
  };

  const stopWallDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    syncLoopPosition();
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const wall = wallRef.current;
      const segmentWidth = getLoopSegmentWidth();
      if (!wall || !segmentWidth) return;

      wall.scrollLeft = segmentWidth;
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section id="portfolio" className="relative overflow-hidden bg-[#f8f1e9] px-5 py-12 sm:px-8 md:py-14 lg:py-16">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 border-b border-[#8b4114]/15 pb-6 lg:grid-cols-[1fr_0.74fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="inline-flex items-center gap-2 font-sans text-[0.68rem] font-normal uppercase tracking-[0.2em] text-[#7d876d]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Artes e projetos
            </p>
            <h2 className="mt-2 font-sans text-2xl font-extralight leading-tight text-[#8b4114] sm:text-3xl md:text-[2.25rem]">
              Uma parede de quadros com ideias que já viraram arte.
            </h2>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-6 text-[#8b4114]/70">
              Projetos personalizados, desenhos infantis, artes de aniversário e pequenos universos visuais criados com afeto.
            </p>
          </motion.div>

          <div className="rounded-xl border border-[#8b4114]/10 bg-[#d39a7e] p-4 text-white shadow-[0_14px_34px_rgba(102,61,36,0.12)] [&_h3]:mt-1.5 [&_h3]:text-xl">
            <p className="font-sans text-[0.68rem] font-normal uppercase tracking-[0.18em] text-white">Quer algo nesse estilo?</p>
            <h3 className="mt-2 font-sans text-2xl font-extralight leading-tight">Peça um orçamento pelo WhatsApp.</h3>
            <p className="mt-1.5 font-sans text-xs font-light leading-5 text-white/78">
              Envie sua ideia, tema, prazo e formato. A conversa começa simples e vai ganhando forma junto.
            </p>
            <a
              href={budgetWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#7d876d] px-4 font-sans text-xs font-medium text-white shadow-[0_10px_22px_rgba(0,0,0,0.14)] transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Pedir orçamento
            </a>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="font-sans text-[0.68rem] font-light uppercase tracking-[0.14em] text-[#8b4114]/50">
            Arraste a parede para explorar
          </p>

          <div className="flex items-center gap-3" aria-label="Controles do carrossel">
            <button
              type="button"
              onClick={() => scrollWall("previous")}
              aria-label="Ver projetos anteriores"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b4114]/20 bg-white text-[#8b4114] shadow-[0_8px_20px_rgba(102,61,36,0.07)] transition-colors hover:bg-[#ead4c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b4114]/40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollWall("next")}
              aria-label="Ver próximos projetos"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b4114] text-white shadow-[0_8px_20px_rgba(102,61,36,0.14)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b4114]/40 focus-visible:ring-offset-2"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[#979f8a] shadow-inner">
          <div
            ref={wallRef}
            onPointerDown={startWallDrag}
            onPointerMove={dragWall}
            onPointerUp={stopWallDrag}
            onPointerCancel={stopWallDrag}
            onPointerLeave={stopWallDrag}
            onScroll={syncLoopPosition}
            className="flex min-h-[30rem] cursor-grab select-none items-start gap-9 overflow-x-auto px-10 pb-9 pt-12 active:cursor-grabbing sm:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {carouselProjects.map((project, index) => (
              <GalleryFrame key={`${index}-${project.number}`} project={project} index={index} reduceMotion={Boolean(reduceMotion)} />
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-[#8b4114]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={budgetWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#c68043] px-4 font-sans text-xs font-medium text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Quero uma arte assim
          </a>
        </div>
      </div>
    </section>
  );
}

function GalleryFrame({
  project,
  index,
  reduceMotion,
}: {
  project: (typeof projects)[number];
  index: number;
  reduceMotion: boolean;
}) {
  const frameWidth = `min(${Math.round(project.width * 0.96)}px, 74vw)`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -6, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.52, delay: index * 0.05, ease: "easeOut" }}
      className="group relative shrink-0 snap-center"
      style={{
        width: frameWidth,
        marginTop: Math.round(project.offset * 0.45),
        rotate: `${project.rotate}deg`,
      }}
    >
      <span className="absolute left-1/2 top-[-1.35rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#f0dfd4] shadow-[0_2px_6px_rgba(0,0,0,0.2)]" />
      <span className="absolute left-1/2 top-[-1rem] h-6 w-px -translate-x-1/2 bg-[#f0dfd4]/85" />

      <div className="relative border-[6px] border-[#f0dfd4] bg-[#fffaf5] p-2.5 shadow-[0_14px_28px_rgba(54,67,64,0.24)]">
        <div
          className="relative overflow-hidden border border-[#d6bea1]"
          style={{
            aspectRatio: project.aspectRatio,
            backgroundColor: project.surface,
          }}
        >
          {project.src ? (
            <img src={project.src} alt={project.title} className="h-full w-full object-cover" draggable="false" />
          ) : (
            <div className="absolute inset-4 flex flex-col items-center justify-center bg-[#fffaf5]/78 px-5 text-center text-[#8b4114]">
              <ImageIcon className="h-8 w-8" aria-hidden="true" />
              <p className="mt-3 font-sans text-xs font-normal uppercase tracking-[0.16em] text-[#8b4114]/70">{project.placeholder}</p>
              <p className="mt-1 font-sans text-[0.68rem] font-light leading-4 text-[#8b4114]/45">imagem será adicionada depois</p>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-[#1f1713]/72 p-3 text-center text-[#8b4114] opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <div className="flex max-h-full w-full flex-col items-center justify-center bg-[#fffaf5]/88 px-3 py-4 backdrop-blur-sm">
            <p className="font-sans text-[0.56rem] font-normal uppercase leading-3 tracking-[0.14em] text-[#8b4114]/70">
              {project.number} · {project.category}
            </p>
            <h3 className="mt-1.5 font-sans text-base font-normal leading-tight">{project.title}</h3>
            <p className="mt-1.5 font-sans text-[0.72rem] font-light leading-4 text-[#8b4114]/78">{project.description}</p>
            </div>
          </div>
        </div>
      </div>

        <div className="mt-2 text-center text-[#ffffff]">
        <p className="font-sans text-[0.6rem] font-normal uppercase tracking-[0.16em] text-[#8b4114]/72">
          {project.number} · {project.category}
        </p>
        <h3 className="mt-0.5 font-sans text-xs font-normal leading-tight">{project.title}</h3>
      </div>
    </motion.article>
  );
}
