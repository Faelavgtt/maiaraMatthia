const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export type AdminOrderStatus =
  | "received"
  | "payment_confirmed"
  | "in_production"
  | "awaiting_approval"
  | "finished";

export type AdminOrderRow = {
  id: string;
  code: string;
  product: string;
  size: string | null;
  colors: string | null;
  status: AdminOrderStatus;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
};

export type AdminOrdersResponse = {
  orders: AdminOrderRow[];
};

export async function listAdminOrders() {
  const response = await fetch(`${apiBaseUrl}/api/admin/orders`);

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<AdminOrdersResponse>;
}

export async function updateAdminOrderStatus(code: string, status: AdminOrderStatus, note?: string) {
  const response = await fetch(`${apiBaseUrl}/api/admin/orders/${code}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status, note }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ code: string; status: AdminOrderStatus }>;
}

async function readApiError(response: Response) {
  try {
    const body = await response.json();
    return typeof body.error === "string" ? body.error : "Erro na API";
  } catch {
    return "Erro na API";
  }
}
