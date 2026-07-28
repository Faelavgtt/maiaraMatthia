import { motion } from "framer-motion";
import { Heart, Home, Palette, Sparkles, Star } from "lucide-react";

const familyCards = [
  {
    title: "Todo mundo entra",
    text: "Pais, filhos, avos, pets e aqueles detalhes que so a familia entende.",
    icon: Home,
    color: "bg-[#f6c9b8]",
    rotate: "-rotate-[2deg]",
  },
  {
    title: "Traços de afeto",
    text: "A Maiara desenha a mao, mantendo um jeitinho doce, leve e cheio de personalidade.",
    icon: Heart,
    color: "bg-[#dbe3c9]",
    rotate: "rotate-[1.8deg]",
  },
  {
    title: "Cores do seu lar",
    text: "A paleta pode conversar com o quarto, a sala ou a memoria que voce quer guardar.",
    icon: Palette,
    color: "bg-[#f5dfb8]",
    rotate: "-rotate-[1deg]",
  },
];

const familyFrames = [
  {
    src: "/image/desenhos/quadroFamilinha.jpeg",
    alt: "Arte Familinha feita a mao por Maiara Mattia",
    label: "familinha classica",
    className: "sm:translate-y-8 sm:-rotate-[4deg]",
    imageClassName: "object-contain",
  },
  {
    src: "/image/desenhos/quadroFamilinha2.jpeg",
    alt: "Quadro Familinha com membros da familia ilustrados",
    label: "familinha colorida",
    className: "z-10 sm:-translate-y-4 sm:scale-[1.13] sm:rotate-[1.5deg]",
    imageClassName: "object-cover",
  },
  {
    src: "/image/desenhos/quadroFamilinha3.jpeg",
    alt: "Composicao Familinha em arte delicada",
    label: "familinha com carinho",
    className: "sm:translate-y-7 sm:rotate-[4deg]",
    imageClassName: "object-cover",
  },
];

export function FamilinhaSection() {
  return (
    <section id="familinha" className="relative isolate overflow-hidden bg-[#f7e5d2] px-5 pb-24 pt-14 sm:px-8 md:pb-28 md:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-0 top-0 h-28 w-full bg-[linear-gradient(180deg,#f8f1e9_0%,rgba(248,241,233,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(247,229,210,0)_0%,#f8f1e9_88%)]" />
        <div className="absolute -bottom-20 left-1/2 h-40 w-[120vw] -translate-x-1/2 rounded-[50%_50%_0_0] bg-[#f8f1e9]" />
        <Sparkles className="absolute left-[7%] top-16 h-7 w-7 rotate-12 fill-[#c68043] text-[#c68043]" />
        <Star className="absolute bottom-28 right-[8%] h-8 w-8 -rotate-12 fill-[#7d876d] text-[#7d876d]" />
        <svg className="absolute left-[12%] top-[42%] h-20 w-32 text-[#8b4114]/18" viewBox="0 0 130 80" fill="none">
          <path d="M4 42c18-28 32 20 50-6s37 22 72-15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 9" />
        </svg>
      </div>

      <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.58, ease: "easeOut" }}
        >
          <p className="inline-flex items-center gap-2 font-sans text-[0.68rem] font-normal uppercase tracking-[0.2em] text-[#7d876d]">
            <Heart className="h-3.5 w-3.5 fill-[#7d876d]" aria-hidden="true" />
            A Familinha
          </p>
          <h2 className="mt-3 max-w-2xl font-sans text-3xl font-extralight leading-tight text-[#8b4114] sm:text-4xl">
            Uma arte feita a mao para apresentar quem mora no seu coracao.
          </h2>
          <p className="mt-4 max-w-xl font-sans text-sm font-light leading-6 text-[#8b4114]/75 sm:text-base sm:leading-7">
            A Familinha e uma ilustracao autoral da Maiara com os membros da familia em clima de desenho infantil: simples, afetuosa e cheia de pequenas pistas sobre cada pessoa.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {familyCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className={`relative min-h-[10rem] overflow-hidden rounded-[1.6rem_0.9rem_1.9rem_1rem] border border-[#8b4114]/10 bg-white p-4 shadow-[0_14px_32px_rgba(93,51,29,0.09)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 ${card.rotate}`}
                >
                  <span className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${card.color}`} aria-hidden="true" />
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-[44%_56%_48%_52%] bg-[#fff6eb] text-[#8b4114]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-3 font-sans text-sm font-normal leading-tight text-[#8b4114]">{card.title}</h3>
                  <p className="relative mt-2 font-sans text-[0.72rem] font-light leading-5 text-[#8b4114]/72">{card.text}</p>
                </article>
              );
            })}
          </div>
        </motion.div>

        <div className="relative min-h-[31rem] sm:min-h-[34rem]">
          <div className="absolute inset-x-4 bottom-8 h-32 rounded-[50%] bg-[#8b4114]/12 blur-2xl" aria-hidden="true" />
          <div className="absolute inset-0 rounded-[2.4rem_1.4rem_2.8rem_1.6rem] border border-white/55 bg-white/22 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]" aria-hidden="true" />
          <div className="absolute -left-2 top-10 h-16 w-16 rounded-[48%_52%_43%_57%] bg-[#dbe3c9]/70" aria-hidden="true" />
          <div className="absolute -right-1 bottom-14 h-20 w-20 rounded-[55%_45%_52%_48%] bg-[#f6c9b8]/65" aria-hidden="true" />
          <div className="relative grid grid-cols-1 items-center gap-5 p-4 sm:grid-cols-3 sm:gap-5 sm:p-7 lg:p-8">
            {familyFrames.map((frame, index) => (
              <motion.figure
                key={frame.src}
                initial={{ opacity: 0, y: 28, rotate: index === 1 ? 3 : -3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                whileHover={{ y: -10, rotate: index === 1 ? -1 : 1, scale: index === 1 ? 1.16 : 1.03 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.58, delay: index * 0.1, ease: "easeOut" }}
                className={`relative ${frame.className}`}
              >
                <span className="absolute left-1/2 top-[-0.9rem] z-10 h-7 w-24 -translate-x-1/2 rotate-2 bg-[#d6bea1]/75 shadow-[0_4px_12px_rgba(0,0,0,0.08)] backdrop-blur-[1px]" aria-hidden="true" />
                <div className="rounded-[1.25rem] border-[8px] border-[#fffaf5] bg-[#fffaf5] p-2.5 shadow-[0_24px_52px_rgba(93,51,29,0.22)] ring-1 ring-[#8b4114]/8">
                  <div className="overflow-hidden rounded-[0.7rem] bg-[#f7efe7] ring-1 ring-[#d6bea1]/70">
                    <img src={frame.src} alt={frame.alt} className={`aspect-[4/5] w-full ${frame.imageClassName}`} draggable="false" />
                  </div>
                </div>
                <figcaption className="mt-3 text-center font-sans text-[0.62rem] font-normal uppercase tracking-[0.12em] text-[#8b4114]/72">
                  {frame.label}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
