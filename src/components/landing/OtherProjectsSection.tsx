import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { GalleryModal, type GalleryProject } from "./GalleryModal";
import { useCart } from "@/lib/cart";

const otherProjectsMessage = [
  "Ola! Quero conversar sobre um projeto artistico com a Maiara Mattia.",
  "Vi os outros trabalhos do atelie e tenho uma ideia fora da galeria principal.",
  "Podemos falar sobre formato, prazo e possibilidades?",
].join("\n");

const otherProjectsWhatsappUrl = `https://wa.me/?text=${encodeURIComponent(otherProjectsMessage)}`;

const otherProjects: readonly GalleryProject[] = [
  {
    id: "outros-01",
    number: "01",
    title: "Banquinhos pintados",
    category: "Pintura em objeto",
    price: "R$ 180,00",
    dimensions: "Banquinho ou peca sob consulta",
    includedItems: [
      "Pintura manual personalizada",
      "Paleta criada para combinar com o ambiente",
      "Acabamento protetor conforme o uso da peca",
    ],
    description: "Pecas utilitarias ganham cor, flor, nome ou um pequeno universo visual para entrar na casa com afeto.",
    placeholder: "Banquinho pintado",
    src: "/image/desenhos/desenhos.jpeg",
    hoverSrc: "/image/desenhos/desenhos2.jpeg",
    surface: "#ead4c6",
    width: 300,
    aspectRatio: "4 / 5",
    offset: 0,
    rotate: -1.4,
  },
  {
    id: "outros-02",
    number: "02",
    title: "Objetos afetivos",
    category: "Pecas sob medida",
    price: "R$ 120,00",
    dimensions: "Formato combinado por projeto",
    includedItems: [
      "Conversa inicial sobre tema e uso",
      "Aplicacao de nomes, flores ou pequenos simbolos",
      "Arte ajustada ao objeto escolhido",
    ],
    description: "Caixas, plaquinhas, lembrancas e objetos especiais que nao cabem em uma categoria pronta.",
    placeholder: "Objeto afetivo",
    src: "/image/desenhos/galeria.jpeg",
    hoverSrc: "/image/desenhos/quadroFamilinha.jpeg",
    surface: "#e4e7d9",
    width: 300,
    aspectRatio: "4 / 5",
    offset: 0,
    rotate: 0.9,
  },
  {
    id: "outros-03",
    number: "03",
    title: "Pinturas soltas",
    category: "Experimentacoes",
    price: "R$ 90,00",
    dimensions: "Tamanhos pequenos e medios",
    includedItems: [
      "Pintura ou estudo autoral",
      "Opcao de moldura sob consulta",
      "Peca unica ou pequena serie",
    ],
    description: "Estudos, flores, personagens e composicoes livres que nascem no atelie entre uma encomenda e outra.",
    placeholder: "Pintura solta",
    src: "/image/desenhos/desenhos2.jpeg",
    hoverSrc: "/image/desenhos/galeria.jpeg",
    surface: "#f0dfd4",
    width: 300,
    aspectRatio: "4 / 5",
    offset: 0,
    rotate: -0.6,
  },
  {
    id: "outros-04",
    number: "04",
    title: "Pequenos presentes",
    category: "Datas e memorias",
    price: "R$ 75,00",
    dimensions: "Peca pequena personalizada",
    includedItems: [
      "Personalizacao com nome, data ou frase curta",
      "Formato definido conforme a ocasiao",
      "Embalagem simples para presente",
    ],
    description: "Projetos menores para aniversarios, quarto infantil, mesa posta, festa ou um cantinho especial.",
    placeholder: "Presente pequeno",
    src: "/image/desenhos/quadroFamilinha3.jpeg",
    hoverSrc: "/image/desenhos/quadroFamilinha2.jpeg",
    surface: "#e9d7cb",
    width: 300,
    aspectRatio: "4 / 5",
    offset: 0,
    rotate: 1.2,
  },
];

export function OtherProjectsSection() {
  const wallRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const pressedProjectIdRef = useRef<string | null>(null);
  const reduceMotion = useReducedMotion();

  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);
  const { addItem } = useCart();
  const carouselProjects = [...otherProjects, ...otherProjects, ...otherProjects];

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
      left: direction === "next" ? 340 : -340,
      behavior: "smooth",
    });
  };

  const startWallDrag = (event: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    pressedProjectIdRef.current = (event.target as HTMLElement).closest<HTMLElement>("[data-other-project-id]")?.dataset.otherProjectId ?? null;
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = wallRef.current?.scrollLeft ?? 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragWall = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !wallRef.current) return;

    const distance = event.clientX - dragStartXRef.current;
    if (Math.abs(distance) > 6) {
      hasDraggedRef.current = true;
    }

    wallRef.current.scrollLeft = dragStartScrollLeftRef.current - distance;
  };

  const stopWallDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (!hasDraggedRef.current) {
      const project = otherProjects.find((item) => item.id === pressedProjectIdRef.current);

      if (project) {
        setSelectedProject(project);
      }

      pressedProjectIdRef.current = null;
      return;
    }

    pressedProjectIdRef.current = null;
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
    <section id="outros-projetos" className="relative isolate overflow-hidden bg-[#f8f1e9] px-5 py-14 sm:px-8 md:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(#8b4114_0.75px,transparent_0.75px)] [background-size:26px_26px] opacity-[0.045]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 border-b border-[#8b4114]/12 pb-7 lg:grid-cols-[0.9fr_0.7fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="inline-flex items-center gap-2 font-sans text-[0.68rem] font-normal uppercase tracking-[0.2em] text-[#7d876d]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Outros trabalhos do atelie
            </p>
            <h2 className="mt-2 font-sans text-2xl font-extralight leading-tight text-[#8b4114] sm:text-3xl md:text-[2.25rem]">
              Pecas artisticas menores, prontas para vender e presentear.
            </h2>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-6 text-[#8b4114]/72">
              Banquinhos pintados, objetos, experimentos e pecas afetivas aparecem aqui como produtos especiais do atelie, com valores iniciais e possibilidade de personalizacao.
            </p>
          </motion.div>

          <div className="rounded-xl border border-[#8b4114]/10 bg-[#fffaf5] p-4 shadow-[0_14px_30px_rgba(54,67,64,0.07)] sm:rotate-[0.6deg]">
            <p className="font-sans text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[#76877e]">
              Ideia diferente?
            </p>
            <h3 className="mt-1.5 font-sans text-xl font-extralight leading-tight text-[#8b4114]">
              Nem todo trabalho precisa virar uma linha fixa.
            </h3>
            <p className="mt-2 font-sans text-xs font-light leading-5 text-[#8b4114]/72">
              Se voce imaginou uma pintura em objeto, presente ou pequena intervencao, a conversa ajuda a descobrir se faz sentido.
            </p>
            <a
              href={otherProjectsWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#7d876d] px-4 font-sans text-xs font-medium text-white shadow-[0_10px_22px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Conversar sobre ideia
            </a>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="font-sans text-[0.7rem] font-medium uppercase tracking-wider text-[#8b4114]/60">
            Arraste a parede para ver as pecas disponiveis
          </p>

          <div className="flex items-center gap-2.5" aria-label="Controles do carrossel de outros projetos">
            <button
              type="button"
              onClick={() => scrollWall("previous")}
              aria-label="Ver pecas anteriores"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b4114]/15 bg-white text-[#8b4114] shadow-xs transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b4114]/40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollWall("next")}
              aria-label="Ver proximas pecas"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b4114] text-white shadow-xs transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b4114]/40"
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
            className="flex min-h-[31rem] cursor-grab select-none items-start gap-8 overflow-x-auto px-8 pb-8 pt-11 active:cursor-grabbing sm:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {carouselProjects.map((project, index) => (
              <StickerProductCard
                key={`${index}-${project.id}`}
                project={project}
                index={index}
                reduceMotion={Boolean(reduceMotion)}
                onSelect={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#8b4114]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[0.72rem] font-light uppercase tracking-[0.14em] text-[#8b4114]/50">
            Pecas especiais com producao limitada e valores ajustados conforme tamanho, material e personalizacao.
          </p>
          <a
            href="#pedido"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#c68043] px-4 font-sans text-xs font-medium text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5"
          >
            Levar uma ideia
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <GalleryModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onAddToCart={(project) =>
          addItem({
            productId: project.id,
            title: project.title,
            category: project.category,
            price: project.price,
            dimensions: project.dimensions,
            imageUrl: project.src,
          })
        }
      />
    </section>
  );
}

function StickerProductCard({
  project,
  index,
  reduceMotion,
  onSelect,
}: {
  project: GalleryProject;
  index: number;
  reduceMotion: boolean;
  onSelect: () => void;
}) {
  const tapeColors = ["#ead4c6", "#e4e7d9", "#f0dfd4", "#d6bea1"];
  const tapeColor = tapeColors[index % tapeColors.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -8, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className="group relative shrink-0 snap-center cursor-pointer"
      data-other-project-id={project.id}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      style={{
        width: `min(${project.width}px, 82vw)`,
        marginTop: index % 2 === 0 ? 0 : 26,
        rotate: `${project.rotate}deg`,
      }}
    >
      <span
        className="absolute left-1/2 top-[-1.05rem] z-30 h-9 w-24 -translate-x-1/2 rotate-[-2deg] rounded-[0.35rem] opacity-95 shadow-[0_3px_7px_rgba(54,67,64,0.08)] backdrop-blur-[1px]"
        style={{ backgroundColor: tapeColor }}
        aria-hidden="true"
      />

      <div className="absolute -right-3 top-5 z-30 rounded-full bg-[#c68043] px-2.5 py-1 font-sans text-white shadow-[0_5px_10px_rgba(84,45,26,0.12)] transition-transform group-hover:scale-105">
        <span className="block text-[0.62rem] font-semibold leading-none">{project.price}</span>
      </div>

      <div
        className="relative overflow-hidden rounded-[0.45rem] border border-[#8b4114]/8 bg-[#fffaf5] p-3 shadow-[0_10px_20px_rgba(54,67,64,0.13)] transition-shadow duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(#8b4114_0.7px,transparent_0.7px)] before:[background-size:18px_18px] before:opacity-[0.025] group-hover:shadow-[0_14px_24px_rgba(54,67,64,0.17)]"
      >
        <div className="relative z-20 rounded-[0.35rem] bg-[#fffaf5] p-1.5 shadow-[0_6px_12px_rgba(54,67,64,0.10)]">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[0.25rem]" style={{ backgroundColor: project.surface }}>
            <img
              src={project.src}
              alt={project.title}
              className="h-full w-full object-cover transition-opacity duration-500 ease-out group-hover:opacity-0 group-focus-visible:opacity-0"
              draggable="false"
            />
            {project.hoverSrc && (
              <img
                src={project.hoverSrc}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
                draggable="false"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1713]/28 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-78" />
            <span className="absolute bottom-2 left-2 rounded-full bg-[#fffaf5]/92 px-2 py-0.5 font-sans text-[0.58rem] font-semibold uppercase tracking-wider text-[#7d876d]">
              {project.number} - {project.category}
            </span>
          </div>
        </div>

        <div className="relative z-20 mt-3 grid grid-cols-[1fr_2.35rem] items-end gap-3">
          <div className="min-w-0">
            <h3 className="font-sans text-lg font-medium leading-tight text-[#8b4114]">{project.title}</h3>
            <p className="mt-1 line-clamp-2 font-sans text-[0.75rem] font-light leading-4 text-[#8b4114]/72">
              {project.description}
            </p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7d876d] text-white shadow-[0_5px_10px_rgba(54,67,64,0.10)] transition-transform group-hover:scale-105">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
