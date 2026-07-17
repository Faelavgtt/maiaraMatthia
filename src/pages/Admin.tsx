import { CheckCircle2, Clock3, Download, MessageCircle, Palette, Search, Truck } from "lucide-react";

const orders = [
  {
    code: "PED-00125",
    customer: "Camila Rocha",
    child: "Lia, 5 anos",
    product: "Line art do desenho da família",
    status: "Em produção",
    color: "Terracota, rosa e azul",
    price: "R$ 129,00",
    date: "Hoje, 14:10",
  },
  {
    code: "PED-00124",
    customer: "Marina Alves",
    child: "Theo, 4 anos",
    product: "Quadro safari personalizado",
    status: "Pagamento confirmado",
    color: "Verde oliva e areia",
    price: "R$ 129,00",
    date: "Hoje, 10:42",
  },
  {
    code: "PED-00123",
    customer: "Juliana Mattos",
    child: "Bento, 6 anos",
    product: "Line art com frase",
    status: "Aguardando aprovação",
    color: "Mostarda e grafite",
    price: "R$ 129,00",
    date: "Ontem, 18:25",
  },
];

const metrics = [
  { label: "Novos pedidos", value: "08", icon: Clock3 },
  { label: "Em produção", value: "12", icon: Palette },
  { label: "Aguardando aprovação", value: "05", icon: CheckCircle2 },
  { label: "Finalizados", value: "31", icon: Truck },
];

const Admin = () => {
  return (
    <main className="min-h-screen bg-[#f9e7d6] text-[#8b4114]">
      <section className="border-b border-[#8b4114] bg-[#ddb8a6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-sans text-sm font-light uppercase tracking-[0.18em] text-[#76877e]">Painel administrativo</p>
            <h1 className="font-sans text-3xl font-extralight text-[#8b4114] md:text-4xl">Pedidos da semana</h1>
          </div>
          <div className="flex h-11 min-w-0 items-center gap-2 rounded-md border border-[#8b4114] bg-white px-3 md:w-80">
            <Search className="h-4 w-4 text-[#76877e]" />
            <input
              className="w-full bg-transparent font-sans text-sm font-light outline-none placeholder:text-[#76877e]"
              placeholder="Buscar por pedido, cliente ou status"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-3 md:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article key={metric.label} className="rounded-md border border-[#8b4114] bg-white p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#d39a7e] text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-sans text-sm font-light text-[#8b4114]">{metric.label}</p>
                <strong className="font-sans text-3xl font-extralight text-[#8b4114]">{metric.value}</strong>
              </article>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-md border border-[#8b4114] bg-white">
          <div className="grid grid-cols-12 border-b border-[#8b4114] bg-[#ddb8a6] px-5 py-3 font-sans text-xs font-light uppercase tracking-[0.12em] text-[#8b4114]">
            <span className="col-span-2">Pedido</span>
            <span className="col-span-3">Cliente</span>
            <span className="col-span-3">Produto</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-2 text-right">Ações</span>
          </div>
          {orders.map((order) => (
            <article key={order.code} className="grid grid-cols-1 gap-3 border-b border-[#ddb8a6] px-5 py-5 last:border-b-0 md:grid-cols-12 md:items-center">
              <div className="md:col-span-2">
                <strong className="font-sans text-base font-medium text-[#8b4114]">{order.code}</strong>
                <p className="font-sans text-sm font-light text-[#8b4114]">{order.date}</p>
              </div>
              <div className="md:col-span-3">
                <p className="font-sans font-medium text-[#8b4114]">{order.customer}</p>
                <p className="font-sans text-sm font-light text-[#8b4114]">{order.child}</p>
              </div>
              <div className="md:col-span-3">
                <p className="font-sans font-medium text-[#8b4114]">{order.product}</p>
                <p className="font-sans text-sm font-light text-[#8b4114]">{order.color} · {order.price}</p>
              </div>
              <div className="md:col-span-2">
                <span className="inline-flex rounded-md bg-[#76877e] px-3 py-1 font-sans text-sm font-light text-white">{order.status}</span>
              </div>
              <div className="flex justify-start gap-2 md:col-span-2 md:justify-end">
                <button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#8b4114] text-[#8b4114]" aria-label="Baixar arquivo do pedido">
                  <Download className="h-4 w-4" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-md bg-[#76877e] text-white" aria-label="Chamar cliente no WhatsApp">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Admin;

