import { FormEvent } from "react";
import { MessageCircle } from "lucide-react";

type OrderSectionProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const projectTypes = [
  "Desenho personalizado",
  "Arte para aniversário",
  "Papelaria infantil",
  "Quadro afetivo",
  "Identidade visual lúdica",
  "Outro projeto",
];

export function OrderSection({ onSubmit }: OrderSectionProps) {
  return (
    <section id="pedido" className="section-shell relative overflow-hidden bg-[#ddb8a6]">
      <img src="/image/flor.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -left-8 bottom-8 h-36 w-36 -rotate-12 opacity-55 md:h-52 md:w-52" />
      <div className="mx-auto grid max-w-7xl gap-7 md:gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div>
          <p className="eyebrow">Orçamento</p>
          <h2 className="mt-2 font-sans text-[1.9rem] font-extralight leading-tight text-[#8b4114] sm:text-4xl md:text-[2.7rem] xl:text-5xl">
            Conte sua ideia para criarmos um projeto com calma.
          </h2>
          <p className="mt-4 font-sans text-sm font-light leading-6 text-[#8b4114] sm:text-base sm:leading-7 md:mt-5 md:text-lg md:leading-8 xl:text-xl">
            Este espaço é para desenhos personalizados, papelaria, festas, quadros afetivos e projetos visuais em geral. Preencha o básico e eu já abro o WhatsApp com uma mensagem organizada para começarmos o orçamento.
          </p>
          <div className="mt-5 grid gap-2.5 font-sans text-xs font-light text-[#8b4114]/78 sm:grid-cols-2 sm:text-sm md:mt-6">
            {projectTypes.slice(0, 4).map((type) => (
              <span key={type} className="rounded-full border border-[#8b4114]/15 bg-white/55 px-4 py-2">
                {type}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-xl border border-[#8b4114]/20 bg-white p-4 shadow-[0_18px_48px_rgba(0,0,0,0.10)] md:p-6 xl:p-7">
          <div className="grid gap-3 md:grid-cols-2 md:gap-4">
            <label className="font-sans text-sm font-light text-[#8b4114]">
              Seu nome
              <input name="name" required className="mt-2 h-11 w-full rounded-full border border-[#ddb8a6] px-4 font-sans font-light outline-none focus:border-[#c68043] md:h-12" />
            </label>
            <label className="font-sans text-sm font-light text-[#8b4114]">
              WhatsApp
              <input name="phone" required className="mt-2 h-11 w-full rounded-full border border-[#ddb8a6] px-4 font-sans font-light outline-none focus:border-[#c68043] md:h-12" />
            </label>
          </div>

          <label className="mt-4 block font-sans text-sm font-light text-[#8b4114]">
            Tipo de projeto
            <select name="projectType" className="mt-2 h-11 w-full rounded-full border border-[#ddb8a6] bg-white px-4 font-sans font-light outline-none focus:border-[#c68043] md:h-12">
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
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-[#ddb8a6] p-3 font-sans font-light outline-none focus:border-[#c68043] md:min-h-28"
              placeholder="Conte o que você imaginou: tema, pessoa presenteada, uso da arte, estilo ou qualquer detalhe importante."
            />
          </label>

          <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
            <label className="font-sans text-sm font-light text-[#8b4114]">
              Prazo ou data
              <input name="deadline" className="mt-2 h-11 w-full rounded-full border border-[#ddb8a6] px-4 font-sans font-light outline-none focus:border-[#c68043] md:h-12" placeholder="Ex: aniversário em outubro" />
            </label>
            <label className="font-sans text-sm font-light text-[#8b4114]">
              Referências
              <input name="references" className="mt-2 h-11 w-full rounded-full border border-[#ddb8a6] px-4 font-sans font-light outline-none focus:border-[#c68043] md:h-12" placeholder="Fotos, tema ou arquivo a enviar" />
            </label>
          </div>

          <button type="submit" className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#7d876d] px-5 font-sans text-sm font-medium text-white md:h-12 md:text-base xl:text-lg">
            Preparar orçamento no WhatsApp
            <MessageCircle className="h-5 w-5" />
          </button>
        </form>
      </div>
    </section>
  );
}
