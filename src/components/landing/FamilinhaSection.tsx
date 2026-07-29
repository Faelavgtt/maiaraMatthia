import { motion } from "framer-motion";
import { Heart, Home, Palette, Sparkles, Star } from "lucide-react";

const familyCards = [
  {
    title: "Todo mundo entra",
    text: "Pais, filhos, avós, pets e aqueles detalhes que só a família entende.",
    icon: Home,
    bgStyle: "bg-[#fff9f2] border-2 border-dashed border-[#e6c29c]",
    rotate: "-rotate-2",
    badgeColor: "bg-[#f6c9b8]",
  },
  {
    title: "Traços de afeto",
    text: "A Maiara desenha à mão, mantendo um jeitinho doce, leve e cheio de personalidade.",
    icon: Heart,
    bgStyle: "bg-[#f2f6eb] border-2 border-[#c3d1ab]",
    rotate: "rotate-3",
    badgeColor: "bg-[#dbe3c9]",
  },
  {
    title: "Cores do seu lar",
    text: "A paleta pode conversar com o quarto, a sala ou a memória que você quer guardar.",
    icon: Palette,
    bgStyle: "bg-[#fdf8ec] border-2 border-dashed border-[#edd39d]",
    rotate: "-rotate-1",
    badgeColor: "bg-[#f5dfb8]",
  },
];

const familyFrames = [
  {
    src: "/image/desenhos/quadroFamilinha.jpeg",
    alt: "Arte Familinha feita a mão por Maiara Mattia",
    label: "familinha clássica",
    positionClass: "sm:col-span-1 sm:translate-y-4",
    rotate: -4,
    tapeColor: "bg-[#e8cbb0]/80",
    frameBorder: "border-[#f4e3d3]",
    imageClassName: "object-contain", // Evita distorção mantendo proporções da arte
  },
  {
    src: "/image/desenhos/quadroFamilinha2.jpeg",
    alt: "Quadro Familinha com membros da família ilustrados",
    label: "familinha colorida",
    positionClass: "sm:col-span-1 sm:-translate-y-6 sm:scale-105 z-10",
    rotate: 2,
    tapeColor: "bg-[#c3d1ab]/80",
    frameBorder: "border-[#e3ebd5]",
    imageClassName: "object-contain",
  },
  {
    src: "/image/desenhos/quadroFamilinha3.jpeg",
    alt: "Composição Familinha em arte delicada",
    label: "familinha com carinho",
    positionClass: "sm:col-span-1 sm:translate-y-8",
    rotate: 3,
    tapeColor: "bg-[#f3cbbe]/80",
    frameBorder: "border-[#fce8e1]",
    imageClassName: "object-contain",
  },
];

export function FamilinhaSection() {
  return (
    <section id="familinha" className="relative isolate overflow-hidden bg-[#faf4ed] px-5 pb-24 pt-14 sm:px-8 md:pb-28 md:pt-16">
      
      {/* Background Ilustrado Estilo Infância */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(#8b4114_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.07]" />
        
        <svg className="absolute top-10 left-0 w-full text-[#8b4114]/15" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
          <path d="M0,30 C320,90 420,10 720,60 C1020,110 1120,20 1440,50" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
        </svg>

        <div className="absolute -left-16 top-1/4 h-72 w-72 rounded-full bg-[#f6c9b8]/30 blur-3xl" />
        <div className="absolute right-[-10%] top-1/3 h-80 w-80 rounded-full bg-[#dbe3c9]/35 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-[#f5dfb8]/40 blur-3xl" />

        <Star className="absolute bottom-16 right-[6%] h-9 w-9 -rotate-12 fill-[#7d876d] text-[#7d876d]/80" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        
        {/* Coluna de Texto e Cards Informativos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e8efda] px-3.5 py-1 font-sans text-xs font-semibold tracking-wider text-[#5f6850] shadow-sm">
            <Heart className="h-3.5 w-3.5 fill-[#7d876d]" aria-hidden="true" />
            A FAMILINHA
          </div>

          <h2 className="mt-8 max-w-2xl font-sans text-3xl font-light leading-tight text-[#8b4114] sm:text-4xl md:text-[2.6rem]">
            Uma arte feita à mão para apresentar quem mora no seu coração.
          </h2>

          <p className="mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-[#8b4114]/80 sm:text-base">
            A Familinha é uma ilustração autoral da Maiara com os membros da família em clima de desenho infantil: simples, afetuosa e cheia de pequenas pistas sobre cada pessoa.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {familyCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
                  className={`relative min-h-[10.5rem] rounded-2xl p-4 shadow-sm transition-all duration-300 ${card.bgStyle} ${card.rotate}`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.badgeColor} text-[#8b4114] shadow-xs`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 font-sans text-sm font-medium text-[#8b4114]">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 font-sans text-[0.75rem] font-light leading-relaxed text-[#8b4114]/75">
                    {card.text}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </motion.div>

        {/* Galeria de Fotos Assimétrica (Varal / Scrapbook) */}
        <div className="relative pt-6 sm:pt-0">
          
          

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4 lg:gap-6">
            {familyFrames.map((frame, index) => (
              <motion.figure
                key={frame.src}
                initial={{ opacity: 0, y: 35, rotate: frame.rotate * 1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: frame.rotate }}
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{
                  y: -12,
                  rotate: 0,
                  scale: 1.05,
                  zIndex: 20,
                  transition: { type: "spring", stiffness: 300, damping: 18 }
                }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative group ${frame.positionClass}`}
              >
                {/* Pregador / Fita Adesiva decorativa no topo */}
                <div className={`absolute -top-3 left-1/2 z-20 h-5 w-16 -translate-x-1/2 rounded-sm ${frame.tapeColor} shadow-xs backdrop-blur-xs border border-white/40`} aria-hidden="true" />

                {/* Card Moldura Estilo Foto Polaroid Infantil */}
                <div className={`rounded-[1.8rem_1rem_1.6rem_1.2rem] border-4 ${frame.frameBorder} bg-white p-2 pb-3.5 shadow-[0_10px_25px_rgba(139,65,20,0.07)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(139,65,20,0.14)]`}>
                  
                  {/* Container da Imagem */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.2rem_0.8rem_1rem_0.8rem] bg-[#fdfaf6] ring-1 ring-[#8b4114]/5">
                    <motion.img
                      src={frame.src}
                      alt={frame.alt}
                      className={`h-full w-full object-cover ${frame.imageClassName} transition-transform duration-500 ease-out group-hover:scale-[1.03]`}
                      draggable="false"
                    />
                  </div>

                  
                </div>
              </motion.figure>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}