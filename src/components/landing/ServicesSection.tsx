import { Baby, BookOpen, Brush, Flower2, Frame, Gift, Heart, Palette, Sparkles, Star } from "lucide-react";

const services = [
  {
    number: "01",
    title: "Retrato de família",
    eyebrow: "memória para emoldurar",
    text: "Uma composição com gente querida, pets, objetos da casa e frases que só aquela família reconhece.",
    details: ["nomes e datas", "pets e pequenas pistas", "arquivo para imprimir"],
    icon: Frame,
  },
  {
    number: "02",
    title: "Maternidade",
    eyebrow: "gestação, chegada e quarto",
    text: "Artes delicadas para anunciar, decorar ou guardar uma fase que passa rápido demais.",
    details: ["chá de bebê", "quadro de nascimento", "lembrança afetiva"],
    icon: Baby,
  },
  {
    number: "03",
    title: "Papelaria infantil",
    eyebrow: "identidade para brincar",
    text: "Capas, bilhetes, convites e peças escolares com personagem, cor e uma história própria.",
    details: ["convites", "capas e etiquetas", "kit visual"],
    icon: BookOpen,
  },
  {
    number: "04",
    title: "Maker em linhas",
    eyebrow: "desenho da criança",
    text: "O rabisco original continua sendo o protagonista; eu cuido da cor, composição e acabamento.",
    details: ["desenho enviado", "paleta escolhida", "arte final personalizada"],
    icon: Palette,
  },
  {
    number: "05",
    title: "Presentes personalizados",
    eyebrow: "para datas com nome",
    text: "Quadros e artes feitos a partir de uma história real, sem cara de presente comprado na pressa.",
    details: ["aniversário", "dia das mães", "lembranças de família"],
    icon: Gift,
  },
  {
    number: "06",
    title: "Peças lúdicas",
    eyebrow: "personagens e objetos",
    text: "Pequenos universos visuais para marcas, festas, coleções ou ideias que precisam ganhar corpo.",
    details: ["mascotes", "elementos de festa", "coleções visuais"],
    icon: Sparkles,
  },
];

const processNotes = [
  "uma conversa curta sobre a ideia",
  "referências, nomes e pequenos símbolos",
  "rascunho, ajustes e arte final pronta",
];

const cardStyles = [
  {
    card: "sm:translate-y-2 sm:-rotate-[1.5deg] lg:translate-x-1",
    color: "bg-[#ddb8a6]",
    icon: "bg-[#f0dfd4]",
    detail: "bg-[#fffaf5]",
  },
  {
    card: "sm:-translate-y-2 sm:rotate-[1.25deg] lg:-translate-x-1",
    color: "bg-[#c68043]",
    icon: "bg-[#f9e7d6]",
    detail: "bg-[#fffaf5]",
  },
  {
    card: "sm:translate-y-3 sm:rotate-[1deg] lg:translate-x-1",
    color: "bg-[#7d876d]",
    icon: "bg-[#e4e7d9]",
    detail: "bg-[#fffaf5]",
  },
  {
    card: "sm:-translate-y-1 sm:-rotate-[1.75deg] lg:translate-x-1",
    color: "bg-[#d39a7e]",
    icon: "bg-[#ead4c6]",
    detail: "bg-[#fffaf5]",
  },
  {
    card: "sm:translate-y-3 sm:-rotate-[1deg] lg:-translate-x-1",
    color: "bg-[#d19c88]",
    icon: "bg-[#f0dfd4]",
    detail: "bg-[#fffaf5]",
  },
  {
    card: "sm:translate-y-1 sm:rotate-[1.5deg]",
    color: "bg-[#76877e]",
    icon: "bg-[#e4e7d9]",
    detail: "bg-[#fffaf5]",
  },
];

export function ServicesSection() {
  return (
    <section id="servicos" className="relative isolate overflow-hidden bg-[#f8f1e9] px-5 py-14 sm:px-8 md:py-16 lg:py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-16 top-16 h-44 w-44 rounded-full bg-[#ddb8a6]/35 blur-2xl" />
        <div className="absolute -right-10 top-[38%] h-56 w-56 rounded-full bg-[#7d876d]/20 blur-3xl" />
        <div className="absolute bottom-6 left-[42%] h-48 w-48 rounded-full bg-[#f0dfd4]/45 blur-3xl" />
        <Star className="services-float absolute left-[7%] top-12 h-7 w-7 rotate-12 fill-[#c68043] text-[#c68043]" />
        <Heart className="services-float absolute bottom-16 left-[5%] hidden h-8 w-8 -rotate-12 fill-[#ddb8a6] text-[#ddb8a6] md:block" />
        <svg className="absolute bottom-10 right-[4%] h-20 w-32 text-[#8b4114]/20" viewBox="0 0 130 80" fill="none">
          <path d="M4 55c25-49 37 29 61-14s38 33 61-17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 8" />
        </svg>
      </div>

      <div className="mx-auto grid max-w-[88rem] gap-8 lg:grid-cols-[0.28fr_0.72fr] lg:items-start lg:gap-8">
        <div className="relative rounded-[2.5rem_1.25rem_2.75rem_1.5rem] border border-[#8b4114]/10 bg-white p-5 text-[#8b4114] shadow-[0_18px_45px_rgba(54,67,64,0.10)] sm:-rotate-[1deg] sm:p-6 lg:sticky lg:top-20">
          <span className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-2 bg-[#d6bea1]/55 backdrop-blur-[1px]" aria-hidden="true" />
          <span className="absolute -right-3 top-24 h-5 w-5 rounded-full bg-[#7d876d]" aria-hidden="true" />
          <span className="absolute -right-7 top-16 h-3 w-3 rounded-full bg-[#ddb8a6]" aria-hidden="true" />
          <p className="inline-flex items-center gap-2 font-sans text-[0.68rem] font-normal uppercase tracking-[0.2em] text-[#76877e]">
            <Brush className="h-3.5 w-3.5" aria-hidden="true" />
            Serviços do ateliê
          </p>
          <h2 className="mt-3 max-w-xl font-sans text-[1.85rem] font-extralight leading-[1.15] text-[#8b4114] sm:text-[2rem]">
            Encomendas com pista, história e um tantinho de{" "}
            <span className="relative inline-block whitespace-nowrap">
              brincadeira.
              <svg className="absolute -bottom-2 left-0 h-3 w-full text-[#c68043]" viewBox="0 0 180 12" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 7c40-7 88 5 176-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="mt-4 max-w-md font-sans text-[0.82rem] font-light leading-6 text-[#8b4114]/75">
            Cada pedido começa no detalhe: um desenho da criança, uma frase da família, uma flor do jardim, uma lembrança que merece ficar visível.
          </p>

          <div className="mt-6 rounded-[1.5rem_0.8rem_1.5rem_0.8rem] bg-[#f8f1e9] p-4">
            <p className="font-sans text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[#76877e]">
              Como nasce
            </p>
            <ol className="mt-3 space-y-2.5">
              {processNotes.map((note, index) => (
                <li key={note} className="grid grid-cols-[2rem_1fr] items-start gap-2.5 font-sans text-[0.78rem] font-light leading-5 text-[#8b4114]/75">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[0.68rem] font-medium text-[#8b4114] ${index === 0 ? "rotate-[-6deg] bg-[#ddb8a6]" : index === 1 ? "rotate-[5deg] bg-[#f9e7d6]" : "rotate-[-3deg] bg-[#e4e7d9]"}`}>
                    {index + 1}
                  </span>
                  <span className="pt-1">{note}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div>
          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              const style = cardStyles[index];

              return (
                <article
                  key={service.title}
                  className={`group relative min-w-[82vw] snap-center overflow-hidden rounded-[2rem_1.2rem_2.3rem_1.35rem] border border-[#8b4114]/10 bg-white p-5 shadow-[0_16px_35px_rgba(54,67,64,0.09)] transition-[transform,box-shadow] duration-300 hover:z-10 hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(54,67,64,0.14)] sm:min-w-0 lg:h-[250px] ${style.card}`}
                >
                  <span className={`absolute -right-9 -top-10 h-28 w-28 rounded-full opacity-35 transition-transform duration-500 group-hover:scale-125 ${style.color}`} aria-hidden="true" />
                  <span className={`absolute bottom-5 right-5 h-2.5 w-2.5 rounded-full ${style.color}`} aria-hidden="true" />
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="font-sans text-[0.62rem] font-normal uppercase leading-5 tracking-[0.14em] text-[#76877e]">
                        <span className={`mr-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.58rem] font-medium text-[#8b4114] ${style.color}`}>{service.number}</span>
                        {service.eyebrow}
                      </p>
                      <h3 className="mt-2 font-sans text-lg font-light leading-tight text-[#8b4114] xl:text-xl">{service.title}</h3>
                    </div>
                    <span className={`relative flex h-10 w-10 shrink-0 rotate-3 items-center justify-center rounded-[45%_55%_42%_58%] text-[#8b4114] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${style.icon}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>

                  <p className={`mt-3 font-sans text-[0.76rem] font-light leading-5 text-[#8b4114]/75 ${index === 0 ? "lg:line-clamp-2" : "lg:line-clamp-3"}`}>{service.text}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {service.details.map((detail, detailIndex) => (
                      <span
                        key={detail}
                        className={`rounded-full border border-[#8b4114]/10 px-2.5 py-1 font-sans text-[0.61rem] font-light leading-4 text-[#8b4114]/75 ${detailIndex === 2 ? "lg:hidden 2xl:inline-flex" : ""} ${style.detail}`}
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="relative mt-5 overflow-hidden rounded-[1.3rem_2.5rem_1.5rem_2.2rem] border border-[#8b4114]/10 bg-[#fffaf5] px-5 py-3 text-[#8b4114] shadow-[0_14px_30px_rgba(54,67,64,0.07)] sm:flex sm:items-center sm:justify-between sm:gap-5 sm:rotate-[0.5deg]">
            <Sparkles className="absolute -left-2 -top-2 h-10 w-10 rotate-12 text-[#c68043]/50" aria-hidden="true" />
            <p className="font-sans text-[0.78rem] font-light leading-5 text-[#8b4114]/75">
              Não precisa chegar com tudo decidido. Uma foto, um desenho ou uma memória já bastam para começar.
            </p>
            <a
              href="#pedido"
              className="mt-3 inline-flex h-10 shrink-0 -rotate-1 items-center justify-center rounded-full bg-[#8b4114] px-4 font-sans text-xs font-medium text-white transition-transform hover:rotate-0 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b4114]/40 focus-visible:ring-offset-2 sm:mt-0"
            >
              Começar pedido
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
