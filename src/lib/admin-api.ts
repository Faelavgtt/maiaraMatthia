const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

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

export type GalleryProductInput = {
  name: string;
  title: string;
  category: string;
  price: string;
  originalPrice?: string;
  dimensions: string;
  includedItems: string[];
  description: string;
  placeholder: string;
  staticImage: string;
  hoverImage?: string;
  surface: string;
  frameFormat: string;
  width: number;
  aspectRatio: string;
  offset: number;
  rotate: number;
  sortOrder?: number;
};

export type GalleryImageAsset = {
  key: string;
  url: string;
  size: number;
  uploaded: string;
  contentType: string | null;
};

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

export type AdminUserRole = "owner" | "admin";

export type AdminUserRow = {
  id: string;
  username: string;
  email: string;
  role: AdminUserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

export type AdminUserInput = {
  username: string;
  email: string;
  password: string;
  role: AdminUserRole;
};

export async function listAdminOrders() {
  const response = await fetch(`${apiBaseUrl}/api/admin/orders`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<AdminOrdersResponse>;
}

export async function updateAdminOrderStatus(code: string, status: AdminOrderStatus, note?: string) {
  const response = await fetch(`${apiBaseUrl}/api/admin/orders/${code}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status, note }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ code: string; status: AdminOrderStatus }>;
}

export async function listAdminGalleryProducts() {
  const response = await fetch(`${apiBaseUrl}/api/admin/gallery-products`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ products: GalleryProductApiRow[] }>;
}

export async function createAdminGalleryProduct(input: GalleryProductInput) {
  const response = await fetch(`${apiBaseUrl}/api/admin/gallery-products`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ product: GalleryProductApiRow }>;
}

export async function updateAdminGalleryProduct(id: string, input: GalleryProductInput) {
  const response = await fetch(`${apiBaseUrl}/api/admin/gallery-products/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ product: GalleryProductApiRow }>;
}

export async function deleteAdminGalleryProduct(id: string) {
  const response = await fetch(`${apiBaseUrl}/api/admin/gallery-products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ id: string }>;
}

export async function uploadAdminGalleryImage(file: File) {
  const response = await fetch(`${apiBaseUrl}/api/admin/gallery-images`, {
    method: "PUT",
    headers: {
      "content-type": file.type,
      "x-file-name": file.name,
    },
    credentials: "include",
    body: file,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ fileId: string; objectKey: string; url: string }>;
}

export async function listAdminGalleryImages(cursor?: string) {
  const params = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
  const response = await fetch(`${apiBaseUrl}/api/admin/gallery-images${params}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ images: GalleryImageAsset[]; cursor: string | null; truncated: boolean }>;
}

export async function deleteAdminGalleryImage(key: string) {
  const response = await fetch(`${apiBaseUrl}/api/admin/gallery-images/${encodeURIComponent(key)}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ key: string }>;
}

export async function listAdminUsers() {
  const response = await fetch(`${apiBaseUrl}/api/admin/users`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ users: AdminUserRow[] }>;
}

export async function createAdminUser(input: AdminUserInput) {
  const response = await fetch(`${apiBaseUrl}/api/admin/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json() as Promise<{ user: AdminUserRow }>;
}

async function readApiError(response: Response) {
  try {
    const body = await response.json();
    return typeof body.error === "string" ? body.error : "Erro na API";
  } catch {
    return "Erro na API";
  }
}
