import type { AdminOrderRow, AdminOrderStatus } from "@/lib/admin-api";
import { CheckCircle2, Clock3, Palette, Truck } from "lucide-react";

export const adminStatuses: Array<{ value: AdminOrderStatus; label: string }> = [
  { value: "awaiting_payment", label: "Aguardando pagamento" },
  { value: "received", label: "Recebido" },
  { value: "payment_confirmed", label: "Pagamento confirmado" },
  { value: "in_production", label: "Em produção" },
  { value: "awaiting_approval", label: "Aguardando aprovação" },
  { value: "finished", label: "Finalizado" },
];

export const statusConfig: Record<
  AdminOrderStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    pulseClass?: string;
  }
> = {
  awaiting_payment: {
    label: "Aguardando Pagamento",
    badgeClass: "bg-amber-50/90 border border-amber-200 text-amber-900 shadow-2xs",
    dotClass: "bg-amber-500",
    pulseClass: "bg-amber-400",
  },
  received: {
    label: "Recebido",
    badgeClass: "bg-orange-50/90 border border-orange-200 text-orange-950 shadow-2xs",
    dotClass: "bg-orange-500",
    pulseClass: "bg-orange-400",
  },
  payment_confirmed: {
    label: "Pagamento Confirmado",
    badgeClass: "bg-emerald-50/90 border border-emerald-200 text-emerald-950 shadow-2xs",
    dotClass: "bg-emerald-500",
    pulseClass: "bg-emerald-400",
  },
  in_production: {
    label: "Em Produção",
    badgeClass: "bg-[#fbeee7] border border-[#ebd2c3] text-[#8b4114] shadow-2xs",
    dotClass: "bg-[#8b4114]",
    pulseClass: "bg-[#8b4114]",
  },
  awaiting_approval: {
    label: "Aguardando Aprovação",
    badgeClass: "bg-purple-50/90 border border-purple-200 text-purple-950 shadow-2xs",
    dotClass: "bg-purple-500",
    pulseClass: "bg-purple-400",
  },
  finished: {
    label: "Finalizado",
    badgeClass: "bg-slate-100 border border-slate-200 text-slate-800 shadow-2xs",
    dotClass: "bg-slate-500",
  },
};

export const statusStyles: Record<AdminOrderStatus, string> = {
  awaiting_payment: "border-amber-200 bg-amber-50 text-amber-900",
  received: "border-orange-200 bg-orange-50 text-orange-900",
  payment_confirmed: "border-emerald-200 bg-emerald-50 text-emerald-900",
  in_production: "border-[#ebd2c3] bg-[#fbeee7] text-[#8b4114]",
  awaiting_approval: "border-purple-200 bg-purple-50 text-purple-900",
  finished: "border-slate-200 bg-slate-50 text-slate-800",
};

export const metricConfig = [
  { key: "awaiting_payment", label: "Aguardando pagamento", icon: Clock3 },
  { key: "in_production", label: "Em produção", icon: Palette },
  { key: "awaiting_approval", label: "Aguardando aprovação", icon: CheckCircle2 },
  { key: "finished", label: "Finalizados", icon: Truck },
] as const;

export const mockAdminOrders: AdminOrderRow[] = [
  {
    id: "mock-1",
    code: "PED-00125",
    customer_name: "Camila Rocha",
    customer_phone: "5565999990001",
    customer_email: "camila@email.com",
    product: "Line art do desenho da familia",
    size: "A4",
    colors: "Terracota, rosa e azul",
    notes: null,
    order_type: "familinha",
    source: "manual",
    files: [],
    expires_at: null,
    status: "in_production",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
