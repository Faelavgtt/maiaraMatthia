const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export type OrderType = "familinha" | "maker" | "galeria" | "outros";
export type OrderSource = "cart" | "maker";

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  email?: string;
  orderType?: OrderType;
  source?: OrderSource;
  product?: string;
  size?: string;
  colors?: string;
  notes?: string;
  items?: Array<{
    productId?: string;
    title: string;
    category?: string;
    orderType?: OrderType;
    price?: string;
    dimensions?: string;
    quantity: number;
    notes?: string;
    imageUrl?: string;
  }>;
};

export type CreateOrderResponse = {
  code: string;
  token: string;
  statusUrl: string;
  uploadUrl: string;
  whatsappUrl: string | null;
};

export type GalleryProductApiRow = {
  id: string;
  name: string;
  title: string;
  category: string;
  price: string;
  originalPrice: string | null;
  dimensions: string;
  includedItems: string[];
  description: string;
  placeholder: string;
  staticImage: string;
  hoverImage: string | null;
  surface: string;
  frameFormat: string;
  width: number;
  aspectRatio: string;
  offset: number;
  rotate: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type OtherProjectApiRow = GalleryProductApiRow & {
  number: string;
  isActive: boolean;
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

export async function listGalleryProducts() {
  const response = await fetch(`${apiBaseUrl}/api/gallery-products`);

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ products: GalleryProductApiRow[] }>;
}

export async function listOtherProjects() {
  const response = await fetch(`${apiBaseUrl}/api/other-projects`);

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ products: OtherProjectApiRow[] }>;
}

async function readApiError(response: Response) {
  try {
    const body = await response.json();
    return typeof body.error === "string" ? body.error : "Erro na API";
  } catch {
    return "Erro na API";
  }
}
