import { Baby, BookOpen, Frame, Gift, Palette, Stars } from "lucide-react";

const services = [
  {
    title: "Retrato de família",
    text: "Ilustração afetiva com pais, filhos, pets, frases e pequenos detalhes da rotina.",
    icon: Frame,
    bg: "bg-[#ddb8a6]",
  },
  {
    title: "Maternidade",
    text: "Artes delicadas para nascimento, gestação, quarto do bebê e lembranças especiais.",
    icon: Baby,
    bg: "bg-[#ddb8a6]/35",
  },
  {
    title: "Papelaria infantil",
    text: "Capas, páginas, bilhetes e materiais escolares com personagem e identidade própria.",
    icon: BookOpen,
    bg: "bg-[#c68043]/25",
  },
  {
    title: "Maker em linhas",
    text: "A criança desenha, a mãe escolhe cores e frase, e o desenho vira uma arte final.",
    icon: Palette,
    bg: "bg-[#979f8a]",
  },
  {
    title: "Presentes personalizados",
    text: "Quadros e artes para datas especiais, feitos para emocionar sem ficar óbvio.",
    icon: Gift,
    bg: "bg-[#d39a7e]",
  },
  {
    title: "Peças lúdicas",
    text: "Objetos, personagens e ideias pequenas que viram ilustração com cara de brincadeira.",
    icon: Stars,
    bg: "bg-[#7d876d]",
  },
];

export function ServicesSection() {
  return (
    <section className="section-shell relative overflow-hidden bg-[#979f8a] text-white">
      <img src="/image/elementoFlor.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rotate-12 opacity-20 mix-blend-soft-light md:-right-40 md:-top-36 md:h-[34rem] md:w-[34rem]" />
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="font-sans text-xs font-normal uppercase tracking-[0.22em] text-white">O que pode nascer daqui</p>
          <h2 className="mt-2 font-sans text-4xl font-extralight md:text-5xl">Servicos pensados para a delicadeza dos primeiros anos.</h2>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.title} className="rounded-xl border border-white/40 bg-white p-5 text-[#8b4114] shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#ddb8a6] ${service.bg}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-sans text-2xl font-light">{service.title}</h3>
                <p className="mt-3 font-sans text-base font-light leading-7">{service.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
