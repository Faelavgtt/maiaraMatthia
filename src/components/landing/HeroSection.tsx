import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";

type HeroSectionProps = {
  phrase: string;
};

const textParent: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function HeroSection({ phrase }: HeroSectionProps) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-[#d19c88]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src="/image/elementosFloral/floral7.png"
          alt=""
          className="garden-sway-slow absolute left-0 top-0 z-[2] h-52 w-auto opacity-95 md:left-0 md:-top-5 md:h-80"
          style={{ "--garden-rotate": "0deg" } as CSSProperties}
        />
        <img
          src="/image/elementosFloral/floral1.png"
          alt=""
          className="garden-sway absolute -bottom-20 -left-20 h-[25rem] w-auto opacity-90 md:-bottom-28 md:-left-24 md:h-[38rem]"
          style={{ "--garden-rotate": "-7deg" } as CSSProperties}
        />
        <img
          src="/image/elementosFloral/floral5.png"
          alt=""
          className="garden-sway-slow absolute -right-28 bottom-0 h-[23rem] w-auto opacity-90 md:-right-20 md:h-[34rem]"
          style={{ "--garden-rotate": "-12deg" } as CSSProperties}
        />
        <img
          src="/image/elementosFloral/floral3.png"
          alt=""
          className="garden-sway absolute -left-16 top-[34%] h-56 w-auto opacity-75 md:-left-20 md:h-80"
          style={{ "--garden-rotate": "8deg" } as CSSProperties}
        />
        <img
          src="/image/elementosFloral/floral2.png"
          alt=""
          className="garden-sway-slow absolute -right-16 top-[21%] h-52 w-auto opacity-75 md:-right-12 md:h-72"
          style={{ "--garden-rotate": "-16deg" } as CSSProperties}
        />
        <div className="garden-bee-path absolute left-0 top-[58%] h-12 w-12 md:h-16 md:w-16">
          <img src="/image/elementosFloral/abelha.png" alt="" className="garden-bee h-full w-auto" />
        </div>
        <div className="garden-insect-path absolute left-0 top-[22%] h-10 w-10 md:h-14 md:w-14">
          <img src="/image/elementosFloral/inseto.png" alt="" className="garden-insect h-full w-auto" />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl gap-10 px-5 py-20 md:grid-cols-[0.98fr_1.02fr] md:items-center md:py-24">
        <motion.div className="relative z-10" variants={textParent} initial="hidden" animate="show">
          <motion.p variants={textItem} className="eyebrow text-white">
            Maiara Matthia · artista visual
          </motion.p>
          <motion.h1 variants={textItem} className="mt-5 max-w-3xl font-sans text-5xl font-extralight leading-[1.03] text-[#8b4114] sm:text-6xl lg:text-7xl">
            Ilustrações que parecem ter sempre morado ali.
          </motion.h1>
          <motion.p variants={textItem} className="mt-6 max-w-2xl font-sans text-xl font-light leading-8 text-[#8b4114]/85">
            Publicitária, artista visual, ilustradora e diretora de arte. Maiara cria uma linguagem afetiva entre infância, natureza e memórias delicadas.
          </motion.p>
          <motion.div variants={textItem} className="mt-7 grid max-w-2xl gap-3 font-sans text-base font-light leading-7 text-[#8b4114]/80 sm:grid-cols-3">
            <span className="border-l border-white/45 pl-4">flores, folhas e animais</span>
            <span className="border-l border-white/45 pl-4">objetos feitos para durar</span>
            <span className="border-l border-white/45 pl-4">arte que desacelera o olhar</span>
          </motion.div>
          <motion.div variants={textItem} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.a
              href="#portfolio"
              whileHover={{ y: -3, rotate: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#8b4114] px-6 font-sans text-lg font-medium text-white shadow-[0_12px_26px_rgba(0,0,0,0.16)]"
            >
              Conhecer o universo
              <ArrowRight className="h-4 w-4" />
            </motion.a>
            <motion.a
              href="#pedido"
              whileHover={{ y: -3, rotate: 1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#8b4114]/25 bg-white px-6 font-sans text-lg font-light text-[#8b4114]"
            >
              Criar comigo
            </motion.a>
          </motion.div>
        </motion.div>

        <div className="relative min-h-[560px] md:min-h-[620px]">
          <motion.div
            className="relative mx-auto mt-4 max-w-[470px]"
            initial={{ opacity: 0, y: 34, rotate: -3, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, rotate: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 95, damping: 15, delay: 0.25 }}
            whileHover={{ rotate: -1, y: -6 }}
          >
            <div className="absolute -left-5 top-9 z-10 hidden rounded-full bg-white/90 px-5 py-3 font-sans text-xs font-normal uppercase tracking-[0.16em] text-[#7d876d] shadow-[0_14px_32px_rgba(0,0,0,0.08)] sm:block">
              conforto visual
            </div>
            <div className="absolute -right-4 bottom-24 z-10 max-w-[210px] rounded-lg border border-white/60 bg-[#f7eadf]/95 px-5 py-4 font-sans text-sm font-light leading-6 text-[#8b4114] shadow-[0_18px_38px_rgba(0,0,0,0.1)]">
              "A arte pode despertar lembranças e acolher o olhar."
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-white/45 bg-white/35 p-3 shadow-[0_24px_60px_rgba(93,51,29,0.18)] backdrop-blur-sm">
              <img
                src="/image/maiara.jpeg"
                alt="Retrato de Maiara Matthia cercada por ilustrações florais"
                className="aspect-[4/5] w-full rounded-[1.45rem] object-cover object-center"
              />
            </div>
            <div className="mx-auto mt-4 max-w-[390px] rounded-lg border border-white/45 bg-white/55 px-6 py-5 text-center backdrop-blur-sm">
              <p className="font-sans text-[11px] font-light uppercase tracking-[0.18em] text-[#7d876d]">
                infância · natureza · memória afetiva
              </p>
              <p className="mt-2 font-sans text-lg font-light leading-7 text-[#8b4114]">
                Uma direção de arte feita de presença, madeira, tons empoeirados e delicadezas do cotidiano.
              </p>
              <p className="mt-2 font-sans text-[10px] font-light uppercase tracking-[0.16em] text-[#8b4114]/60">
                {phrase || "peças com alma"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
