import { FormEvent } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";

type OrderSectionProps = {
  title: string;
  subtitle: string;
  makerSummary: string;
  whatsappUrl: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function OrderSection({ title, subtitle, makerSummary, whatsappUrl, onSubmit }: OrderSectionProps) {
  return (
    <section id="pedido" className="section-shell relative overflow-hidden bg-[#ddb8a6]">
      <img src="/image/flor.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -left-8 bottom-8 h-36 w-36 -rotate-12 opacity-55 md:h-52 md:w-52" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Pedido rápido</p>
          <h2 className="mt-2 font-sans text-4xl font-extralight text-[#8b4114] md:text-5xl">Finalize a encomenda em poucos passos.</h2>
          <p className="mt-5 font-sans text-xl font-light leading-8 text-[#8b4114]">
            O maker prepara o resumo do pedido e leva a conversa para o WhatsApp, onde combinamos prazo, pequenos ajustes e envio do arquivo final.
          </p>
          <div className="mt-6 rounded-xl border border-[#8b4114]/25 bg-white/80 p-4 font-sans font-light text-[#8b4114] shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
            <strong className="block font-medium text-[#8b4114]">Resumo do maker</strong>
            Título: {title || "sem título"} · Subtítulo: {subtitle || "sem subtítulo"}
            <span className="mt-2 block">{makerSummary}</span>
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
            Observações finais
            <textarea name="notes" rows={4} className="mt-2 w-full resize-none rounded-xl border border-[#ddb8a6] p-3 font-sans font-light outline-none focus:border-[#c68043]" placeholder="Prazo, presente, tema do quarto ou qualquer detalhe importante." />
          </label>
          <button className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#7d876d] px-5 font-sans text-lg font-medium text-white">
            Preparar mensagem
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
