import type { AdminOrderRow, AdminOrderStatus } from "@/lib/admin-api";
import { CheckCircle2, Clock3, Palette, Truck } from "lucide-react";

export const adminStatuses: Array<{ value: AdminOrderStatus; label: string }> = [
  { value: "awaiting_payment", label: "Aguardando pagamento" },
  { value: "received", label: "Recebido" },
  { value: "payment_confirmed", label: "Pagamento confirmado" },
  { value: "in_production", label: "Em producao" },
  { value: "awaiting_approval", label: "Aguardando aprovacao" },
  { value: "finished", label: "Finalizado" },
];

export const statusStyles: Record<AdminOrderStatus, string> = {
  awaiting_payment: "border-[#c68043]/35 bg-[#fff1cf] text-[#8b4114] shadow-[0_8px_18px_rgba(198,128,67,0.14)] [&>span]:bg-[#c68043]",
  received: "border-[#ddb8a6] bg-[#f0dfd4] text-[#8b4114] shadow-[0_8px_18px_rgba(139,65,20,0.1)] [&>span]:bg-[#8b4114]",
  payment_confirmed: "border-[#76877e]/30 bg-[#e4e7d9] text-[#4f5f50] shadow-[0_8px_18px_rgba(118,135,126,0.14)] [&>span]:bg-[#76877e]",
  in_production: "border-[#d39a7e] bg-[#d39a7e] text-white shadow-[0_8px_18px_rgba(211,154,126,0.2)] [&>span]:bg-white",
  awaiting_approval: "border-[#c68043] bg-[#c68043] text-white shadow-[0_8px_18px_rgba(198,128,67,0.22)] [&>span]:bg-white",
  finished: "border-[#76877e] bg-[#76877e] text-white shadow-[0_8px_18px_rgba(118,135,126,0.2)] [&>span]:bg-white",
};

export const metricConfig = [
  { key: "awaiting_payment", label: "Aguardando pagamento", icon: Clock3 },
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
    notes: null,
    order_type: "familinha",
    source: "manual",
    files: [],
    expires_at: null,
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
    notes: null,
    order_type: "galeria",
    source: "cart",
    files: [],
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 40).toISOString(),
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
    notes: null,
    order_type: "outros",
    source: "manual",
    files: [],
    expires_at: null,
    status: "awaiting_approval",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];
