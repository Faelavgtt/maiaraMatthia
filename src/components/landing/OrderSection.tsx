import { FormEvent } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";

type OrderSectionProps = {
  whatsappUrl: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const projectTypes = [
  "Desenho personalizado",
  "Arte para aniversario",
  "Papelaria infantil",
  "Quadro afetivo",
  "Identidade visual ludica",
  "Outro projeto",
];

export function OrderSection({ whatsappUrl, onSubmit }: OrderSectionProps) {
  return (
    <section id="pedido" className="section-shell relative overflow-hidden bg-[#ddb8a6]">
      <img src="/image/flor.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -left-8 bottom-8 h-36 w-36 -rotate-12 opacity-55 md:h-52 md:w-52" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Orcamento</p>
          <h2 className="mt-2 font-sans text-4xl font-extralight text-[#8b4114] md:text-5xl">
            Conte sua ideia para criarmos um projeto com calma.
          </h2>
          <p className="mt-5 font-sans text-xl font-light leading-8 text-[#8b4114]">
            Este espaco e para desenhos personalizados, papelaria, festas, quadros afetivos e projetos visuais em geral. A mensagem vai para o WhatsApp para alinharmos formato, prazo e valores.
          </p>
          <div className="mt-6 grid gap-3 font-sans text-sm font-light text-[#8b4114]/78 sm:grid-cols-2">
            {projectTypes.slice(0, 4).map((type) => (
              <span key={type} className="rounded-full border border-[#8b4114]/15 bg-white/55 px-4 py-2">
                {type}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-xl border border-[#8b4114]/20 bg-white p-5 shadow-[0_18px_48px_rgba(0,0,0,0.10)] md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="font-sans text-sm font-light text-[#8b4114]">
              Seu nome
              <input name="name" required className="mt-2 h-12 w-full rounded-full border border-[#ddb8a6] px-4 font-sans font-light outline-none focus:border-[#c68043]" />
            </label>
            <label className="font-sans text-sm font-light text-[#8b4114]">
              WhatsApp
              <input name="phone" required className="mt-2 h-12 w-full rounded-full border border-[#ddb8a6] px-4 font-sans font-light outline-none focus:border-[#c68043]" />
            </label>
          </div>

          <label className="mt-4 block font-sans text-sm font-light text-[#8b4114]">
            Tipo de projeto
            <select name="projectType" className="mt-2 h-12 w-full rounded-full border border-[#ddb8a6] bg-white px-4 font-sans font-light outline-none focus:border-[#c68043]">
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block font-sans text-sm font-light text-[#8b4114]">
            Ideia inicial
            <textarea
              name="projectIdea"
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-[#ddb8a6] p-3 font-sans font-light outline-none focus:border-[#c68043]"
              placeholder="Conte o que voce imaginou: tema, pessoa presenteada, uso da arte, estilo ou qualquer detalhe importante."
            />
          </label>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="font-sans text-sm font-light text-[#8b4114]">
              Prazo ou data
              <input name="deadline" className="mt-2 h-12 w-full rounded-full border border-[#ddb8a6] px-4 font-sans font-light outline-none focus:border-[#c68043]" placeholder="Ex: aniversario em outubro" />
            </label>
            <label className="font-sans text-sm font-light text-[#8b4114]">
              Referencias
              <input name="references" className="mt-2 h-12 w-full rounded-full border border-[#ddb8a6] px-4 font-sans font-light outline-none focus:border-[#c68043]" placeholder="Fotos, tema ou arquivo a enviar" />
            </label>
          </div>

          <button className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#7d876d] px-5 font-sans text-lg font-medium text-white">
            Preparar orcamento
            <MessageCircle className="h-5 w-5" />
          </button>
          {whatsappUrl && (
            <a href={whatsappUrl} className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8b4114] px-5 font-sans text-lg font-medium text-white">
              Abrir WhatsApp
              <ArrowRight className="h-5 w-5" />
            </a>
          )}
        </form>
      </div>
    </section>
  );
}
