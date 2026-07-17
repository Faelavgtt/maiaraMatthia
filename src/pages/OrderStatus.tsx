import { Link, useParams, useSearchParams } from "react-router-dom";
import { Check, Circle, Home, MessageCircle } from "lucide-react";

const steps = [
  { label: "Pedido recebido", done: true },
  { label: "Pagamento confirmado", done: true },
  { label: "Em produção", done: true },
  { label: "Aguardando aprovação", done: false },
  { label: "Finalizado", done: false },
];

const OrderStatus = () => {
  const { code } = useParams();
  const [params] = useSearchParams();
  const hasToken = Boolean(params.get("token"));

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#d19c88] px-5 py-10 text-[#8b4114]">
      <section className="w-full max-w-2xl rounded-md border border-[#8b4114] bg-white p-6 shadow-sm md:p-8">
        <p className="font-sans text-sm font-light uppercase tracking-[0.18em] text-[#76877e]">Acompanhamento</p>
        <h1 className="mt-2 font-sans text-4xl font-extralight">Pedido {code}</h1>
        <p className="mt-3 font-sans text-lg font-light text-[#8b4114]">
          {hasToken
            ? "Seu desenho já está no ateliê digital. Aqui fica o andamento da produção."
            : "Para proteger o pedido, use o link completo enviado após a compra."}
        </p>

        <div className="mt-8 space-y-4">
          {steps.map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${step.done ? "bg-[#76877e] text-white" : "bg-[#ddb8a6] text-[#8b4114]"}`}>
                {step.done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </span>
              <span className="font-sans text-lg font-light">{step.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://wa.me/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#76877e] px-5 font-sans font-medium text-white"
          >
            <MessageCircle className="h-4 w-4" />
            Falar no WhatsApp
          </a>
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[#8b4114] px-5 font-sans font-light text-[#8b4114]"
          >
            <Home className="h-4 w-4" />
            Voltar ao site
          </Link>
        </div>
      </section>
    </main>
  );
};

export default OrderStatus;

