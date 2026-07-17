const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  email?: string;
  product: string;
  size?: string;
  colors?: string;
  notes?: string;
};

export type CreateOrderResponse = {
  code: string;
  token: string;
  statusUrl: string;
  uploadUrl: string;
  whatsappUrl: string | null;
};

export async function createOrder(input: CreateOrderInput) {
  const response = await fetch(`${apiBaseUrl}/api/orders`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<CreateOrderResponse>;
}

export async function uploadOrderFile(uploadUrl: string, file: File) {
  const response = await fetch(`${apiBaseUrl}${uploadUrl}`, {
    method: "PUT",
    headers: {
      "content-type": file.type,
      "x-file-name": file.name,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ fileId: string; objectKey: string }>;
}

async function readApiError(response: Response) {
  try {
    const body = await response.json();
    return typeof body.error === "string" ? body.error : "Erro na API";
  } catch {
    return "Erro na API";
  }
}

