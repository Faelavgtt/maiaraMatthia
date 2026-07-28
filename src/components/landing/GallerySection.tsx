import { useEffect, useRef, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Frame, Image as ImageIcon, MessageCircle, Sparkles } from "lucide-react";

const customGalleryMessage = [
  "Ola! Quero orcar uma galeria personalizada com a Maiara Mattia.",
  "Tenho interesse em 3 quadros que se conversam + 1 Familinha.",
  "Podemos conversar sobre tema, cores e medidas?",
].join("\n");

const readyGalleryMessage = [
  "Ola! Quero saber mais sobre as galerias prontas da Maiara Mattia.",
  "Tenho interesse em escolher uma arte pronta e customizar as cores.",
].join("\n");

const customGalleryUrl = `https://wa.me/?text=${encodeURIComponent(customGalleryMessage)}`;
const readyGalleryUrl = `https://wa.me/?text=${encodeURIComponent(readyGalleryMessage)}`;

const galleryProjects = [
  {
    number: "01",
    title: "Jardim de casa",
    category: "Galeria pronta",
    description: "Tres quadros florais que conversam entre si, com uma Familinha para deixar a parede com memoria.",
    placeholder: "Galeria pronta",
    src: "/image/desenhos/galeria.jpeg",
    surface: "#ead4c6",
    width: 350,
    aspectRatio: "16 / 9",
    offset: 78,
    rotate: -0.4,
  },
  {
    number: "02",
    title: "Brincadeira suave",
    category: "Cores customizaveis",
    description: "Uma base pronta que pode ganhar outra paleta para combinar com quarto, sala ou brinquedoteca.",
    placeholder: "Galeria customizavel",
    src: "/image/desenhos/desenhos.jpeg",
    surface: "#e4e7d9",
    width: 270,
    aspectRatio: "4 / 5",
    offset: 44,
    rotate: -1.2,
  },
  {
    number: "03",
    title: "Pequeno universo",
    category: "Kit decorativo",
    description: "Artes prontas com clima infantil, pensadas como conjunto para criar ritmo na parede.",
    placeholder: "Kit de quadros",
    src: "/image/desenhos/desenhos2.jpeg",
    surface: "#f0dfd4",
    width: 310,
    aspectRatio: "5 / 4",
    offset: 92,
    rotate: -1.5,
  },
  {
    number: "04",
    title: "Familinha central",
    category: "Retrato afetivo",
    description: "A Familinha entra como quarto quadro do conjunto, trazendo os personagens reais da casa.",
    placeholder: "Familinha",
    src: "/image/desenhos/quadroFamilinha2.jpeg",
    surface: "#e1d7c8",
    width: 250,
    aspectRatio: "3 / 4",
    offset: 28,
    rotate: 1.6,
  },
  {
    number: "05",
    title: "Galeria personalizada",
    category: "Projeto sob medida",
    description: "Para quem quer uma composicao criada do zero: tema, cores, nomes e simbolos especiais.",
    placeholder: "Orcar do zero",
    src: "/image/desenhos/quadroFamilinha3.jpeg",
    surface: "#e6d8cf",
    width: 230,
    aspectRatio: "1 / 1",
    offset: 4,
    rotate: 1.3,
  },
] as const;

export function GallerySection() {
  const wallRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const carouselProjects = [...galleryProjects, ...galleryProjects, ...galleryProjects];

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
    <section id="galeria" className="relative overflow-hidden bg-[#f8f1e9] px-5 pb-14 pt-8 sm:px-8 md:pb-16 md:pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,#f8f1e9_0%,rgba(248,241,233,0)_100%)]" aria-hidden="true" />
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
              <Frame className="h-3.5 w-3.5" aria-hidden="true" />
              Galerias prontas
            </p>
            <h2 className="mt-2 font-sans text-2xl font-extralight leading-tight text-[#8b4114] sm:text-3xl md:text-[2.25rem]">
              Tres quadros que se conversam, mais uma Familinha para fechar a historia.
            </h2>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-6 text-[#8b4114]/70">
              A galeria e um conjunto pensado para parede: tres artes decorativas com a mesma linguagem visual e uma Familinha feita para trazer nome, afeto e memoria ao centro da composicao.
            </p>
          </motion.div>

          <div className="rounded-xl border border-[#8b4114]/10 bg-[#d39a7e] p-4 text-white shadow-[0_14px_34px_rgba(102,61,36,0.12)] [&_h3]:mt-1.5 [&_h3]:text-xl">
            <p className="font-sans text-[0.68rem] font-normal uppercase tracking-[0.18em] text-white">Pronta ou sob medida?</p>
            <h3 className="mt-2 font-sans text-2xl font-extralight leading-tight">Escolha uma arte pronta ou peca uma personalizada.</h3>
            <p className="mt-1.5 font-sans text-xs font-light leading-5 text-white/78">
              As galerias prontas podem ter cores ajustadas. Se a ideia pedir outro tema, a Maiara cria do zero.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <a
                href={readyGalleryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#7d876d] px-4 font-sans text-xs font-medium text-white shadow-[0_10px_22px_rgba(0,0,0,0.14)] transition-transform hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Ver prontas
              </a>
              <a
                href={customGalleryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white px-4 font-sans text-xs font-medium text-[#8b4114] shadow-[0_10px_22px_rgba(0,0,0,0.10)] transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Orcar personalizada
              </a>
            </div>
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
              aria-label="Ver galerias anteriores"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b4114]/20 bg-white text-[#8b4114] shadow-[0_8px_20px_rgba(102,61,36,0.07)] transition-colors hover:bg-[#ead4c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b4114]/40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollWall("next")}
              aria-label="Ver proximas galerias"
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
            href={customGalleryUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#c68043] px-4 font-sans text-xs font-medium text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Quero uma galeria personalizada
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
  project: (typeof galleryProjects)[number];
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
              <p className="mt-1 font-sans text-[0.68rem] font-light leading-4 text-[#8b4114]/45">imagem sera adicionada depois</p>
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
