import { ArrowRight, MessageCircle, Paintbrush, Send, WandSparkles } from "lucide-react";

const steps = [
  {
    title: "Envie o desenho",
    text: "A mãe manda uma foto do desenho da criança e conta a história por trás dele.",
    icon: Send,
  },
  {
    title: "Escolha a composição",
    text: "Cores, frase, nome e estilo são escolhidos no maker antes de ir para o WhatsApp.",
    icon: Paintbrush,
  },
  {
    title: "Receba a prévia",
    text: "A ilustradora organiza o traço, mantém a alma infantil e envia a prévia para aprovação.",
    icon: WandSparkles,
  },
  {
    title: "Finalize pelo WhatsApp",
    text: "Pagamento, ajustes e entrega ficam em uma conversa simples e acolhedora.",
    icon: MessageCircle,
  },
];

export function ProcessSection() {
  return (
    <section className="section-shell relative overflow-hidden bg-[#ddb8a6]">
      
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Como funciona</p>
            <h2 className="mt-2 max-w-2xl font-sans text-4xl font-extralight text-[#8b4114] md:text-5xl">Do rabisco espontâneo ao quadro pronto para guardar.</h2>
          </div>
          <a href="#pedido" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#c68043] px-5 font-sans font-medium text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
            Começar pedido
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="soft-card p-5">
                <span className="font-sans text-sm font-light text-[#7d876d]">0{index + 1}</span>
                <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#ddb8a6] bg-[#ddb8a6]/45 text-[#8b4114]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-sans text-2xl font-light text-[#8b4114]">{step.title}</h3>
                <p className="mt-3 font-sans text-base font-light leading-7 text-[#8b4114]">{step.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
