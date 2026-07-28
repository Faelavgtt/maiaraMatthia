import type { AdminOrderRow, AdminOrderStatus } from "@/lib/admin-api";
import { CheckCircle2, Clock3, Palette, Truck } from "lucide-react";

export const adminStatuses: Array<{ value: AdminOrderStatus; label: string }> = [
  { value: "received", label: "Recebido" },
  { value: "payment_confirmed", label: "Pagamento confirmado" },
  { value: "in_production", label: "Em producao" },
  { value: "awaiting_approval", label: "Aguardando aprovacao" },
  { value: "finished", label: "Finalizado" },
];

export const statusStyles: Record<AdminOrderStatus, string> = {
  received: "bg-[#f0dfd4] text-[#8b4114]",
  payment_confirmed: "bg-[#e4e7d9] text-[#4f5f50]",
  in_production: "bg-[#d39a7e] text-white",
  awaiting_approval: "bg-[#c68043] text-white",
  finished: "bg-[#76877e] text-white",
};

export const metricConfig = [
  { key: "received", label: "Novos orcamentos", icon: Clock3 },
  { key: "in_production", label: "Em producao", icon: Palette },
  { key: "awaiting_approval", label: "Aguardando aprovacao", icon: CheckCircle2 },
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
    status: "in_production",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-2",
    code: "PED-00124",
    customer_name: "Marina Alves",
    customer_phone: "5565999990002",
    customer_email: null,
    product: "Quadro safari personalizado",
    size: "A3",
    colors: "Verde oliva e areia",
    status: "payment_confirmed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "mock-3",
    code: "PED-00123",
    customer_name: "Juliana Mattos",
    customer_phone: "5565999990003",
    customer_email: "juliana@email.com",
    product: "Papelaria para aniversario",
    size: null,
    colors: "Mostarda e grafite",
    status: "awaiting_approval",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];
