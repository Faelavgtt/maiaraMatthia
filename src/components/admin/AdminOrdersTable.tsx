import { Download, MessageCircle } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { AdminOrderRow } from "@/lib/admin-api";

type AdminOrdersTableProps = {
  orders: AdminOrderRow[];
};

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-[#8b4114]/25 bg-white shadow-[0_14px_34px_rgba(93,51,29,0.08)]">
      <div className="hidden grid-cols-12 border-b border-[#8b4114]/20 bg-[#ddb8a6] px-5 py-3 font-sans text-xs font-light uppercase tracking-[0.12em] text-[#8b4114] md:grid">
        <span className="col-span-2">Pedido</span>
        <span className="col-span-3">Cliente</span>
        <span className="col-span-3">Projeto</span>
        <span className="col-span-2">Status</span>
        <span className="col-span-2 text-right">Acoes</span>
      </div>

      {orders.length === 0 ? (
        <div className="px-5 py-12 text-center font-sans text-sm font-light text-[#8b4114]/70">
          Nenhum orcamento encontrado com os filtros atuais.
        </div>
      ) : (
        orders.map((order) => (
          <article key={order.id} className="grid grid-cols-1 gap-3 border-b border-[#ddb8a6] px-5 py-5 last:border-b-0 md:grid-cols-12 md:items-center">
            <div className="md:col-span-2">
              <strong className="font-sans text-base font-medium text-[#8b4114]">{order.code}</strong>
              <p className="font-sans text-sm font-light text-[#8b4114]/65">{formatDate(order.created_at)}</p>
            </div>
            <div className="md:col-span-3">
              <p className="font-sans font-medium text-[#8b4114]">{order.customer_name}</p>
              <p className="font-sans text-sm font-light text-[#8b4114]/65">{order.customer_phone}</p>
            </div>
            <div className="md:col-span-3">
              <p className="font-sans font-medium text-[#8b4114]">{order.product}</p>
              <p className="font-sans text-sm font-light text-[#8b4114]/65">
                {[order.size, order.colors].filter(Boolean).join(" · ") || "Sem detalhes"}
              </p>
            </div>
            <div className="md:col-span-2">
              <AdminStatusBadge status={order.status} />
            </div>
            <div className="flex justify-start gap-2 md:col-span-2 md:justify-end">
              <button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#8b4114]/25 text-[#8b4114]" aria-label="Baixar arquivo do pedido">
                <Download className="h-4 w-4" />
              </button>
              <a
                href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-[#76877e] text-white"
                aria-label="Chamar cliente no WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
