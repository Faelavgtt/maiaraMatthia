type D1Result<T = unknown> = {
  results?: T[];
  success: boolean;
};

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
};

type D1Database = {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
};

type R2Bucket = {
  put(key: string, value: ReadableStream | ArrayBuffer | string, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string } } | null>;
};

type Env = {
  DB: D1Database;
  FILES: R2Bucket;
  APP_ORIGIN: string;
  ADMIN_EMAILS: string;
  WHATSAPP_NUMBER: string;
};

type Order = {
  id: string;
  code: string;
  private_token: string;
  customer_id: string;
  product: string;
  size: string | null;
  colors: string | null;
  notes: string | null;
  status: string;
  whatsapp_url: string | null;
  created_at: string;
  updated_at: string;
};

const statuses = ["received", "payment_confirmed", "in_production", "awaiting_approval", "finished"] as const;
const allowedContentTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);
const maxUploadBytes = 10 * 1024 * 1024;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }), env);
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === "/health") {
        return json({ ok: true });
      }

      if (request.method === "POST" && url.pathname === "/api/orders") {
        return createOrder(request, env);
      }

      const orderMatch = url.pathname.match(/^\/api\/orders\/([^/]+)$/);
      if (request.method === "GET" && orderMatch) {
        return getOrder(orderMatch[1], url.searchParams.get("token"), env);
      }

      const uploadMatch = url.pathname.match(/^\/api\/orders\/([^/]+)\/files\/([^/]+)$/);
      if (request.method === "PUT" && uploadMatch) {
        return uploadOrderFile(request, env, uploadMatch[1], uploadMatch[2], url.searchParams.get("token"));
      }

      if (request.method === "GET" && url.pathname === "/api/admin/orders") {
        const admin = requireAdmin(request, env);
        if (admin) return admin;
        return listAdminOrders(env);
      }

      const adminStatusMatch = url.pathname.match(/^\/api\/admin\/orders\/([^/]+)\/status$/);
      if (request.method === "PATCH" && adminStatusMatch) {
        const admin = requireAdmin(request, env);
        if (admin) return admin;
        return updateOrderStatus(request, env, adminStatusMatch[1]);
      }

      const adminFileMatch = url.pathname.match(/^\/api\/admin\/files\/([^/]+)$/);
      if (request.method === "GET" && adminFileMatch) {
        const admin = requireAdmin(request, env);
        if (admin) return admin;
        return getAdminFile(env, adminFileMatch[1]);
      }

      return json({ error: "Not found" }, 404);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
    }
  },
};

async function createOrder(request: Request, env: Env) {
  const body = await readJson(request);
  const customerName = requireString(body.customerName, "customerName");
  const phone = requireString(body.phone, "phone");
  const product = requireString(body.product, "product");
  const email = optionalString(body.email);
  const size = optionalString(body.size);
  const colors = optionalString(body.colors);
  const notes = optionalString(body.notes);

  const customerId = crypto.randomUUID();
  const orderId = crypto.randomUUID();
  const statusEventId = crypto.randomUUID();
  const code = await nextOrderCode(env);
  const token = randomToken();
  const whatsappUrl = buildWhatsAppUrl(env.WHATSAPP_NUMBER, code);

  await env.DB.batch([
    env.DB.prepare("INSERT INTO customers (id, name, phone, email) VALUES (?, ?, ?, ?)").bind(customerId, customerName, phone, email),
    env.DB.prepare(
      "INSERT INTO orders (id, code, private_token, customer_id, product, size, colors, notes, whatsapp_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    ).bind(orderId, code, token, customerId, product, size, colors, notes, whatsappUrl),
    env.DB.prepare("INSERT INTO status_events (id, order_id, status, note) VALUES (?, ?, ?, ?)").bind(
      statusEventId,
      orderId,
      "received",
      "Pedido criado pelo site",
    ),
  ]);

  return json({
    code,
    token,
    statusUrl: `/pedido/${code}?token=${token}`,
    uploadUrl: `/api/orders/${code}/files/original?token=${token}`,
    whatsappUrl,
  }, 201);
}

async function getOrder(code: string, token: string | null, env: Env) {
  if (!token) return json({ error: "Token is required" }, 401);

  const order = await findOrderByCode(code, env);
  if (!order || order.private_token !== token) return json({ error: "Order not found" }, 404);

  const events = await env.DB.prepare(
    "SELECT status, note, created_at FROM status_events WHERE order_id = ? ORDER BY created_at ASC",
  ).bind(order.id).all();

  return json({
    code: order.code,
    product: order.product,
    size: order.size,
    colors: order.colors,
    status: order.status,
    whatsappUrl: order.whatsapp_url,
    createdAt: order.created_at,
    events: events.results ?? [],
  });
}

async function uploadOrderFile(request: Request, env: Env, code: string, kind: string, token: string | null) {
  if (!token) return json({ error: "Token is required" }, 401);
  if (!["original", "preview", "final"].includes(kind)) return json({ error: "Invalid file kind" }, 400);

  const order = await findOrderByCode(code, env);
  if (!order || order.private_token !== token) return json({ error: "Order not found" }, 404);

  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  const fileName = request.headers.get("x-file-name") ?? `${kind}`;

  if (!allowedContentTypes.has(contentType)) return json({ error: "Unsupported file type" }, 415);
  if (!contentLength || contentLength > maxUploadBytes) return json({ error: "File must be up to 10 MB" }, 413);
  if (!request.body) return json({ error: "Missing file body" }, 400);

  const fileId = crypto.randomUUID();
  const objectKey = `orders/${order.code}/${fileId}-${safeFileName(fileName)}`;

  await env.FILES.put(objectKey, request.body, { httpMetadata: { contentType } });
  await env.DB.prepare(
    "INSERT INTO order_files (id, order_id, kind, object_key, file_name, content_type, size_bytes) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).bind(fileId, order.id, kind, objectKey, fileName, contentType, contentLength).run();

  return json({ fileId, objectKey }, 201);
}

async function listAdminOrders(env: Env) {
  const result = await env.DB.prepare(
    `SELECT o.id, o.code, o.product, o.size, o.colors, o.status, o.created_at, o.updated_at,
      c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email
     FROM orders o
     INNER JOIN customers c ON c.id = o.customer_id
     ORDER BY o.created_at DESC
     LIMIT 100`,
  ).all();

  return json({ orders: result.results ?? [] });
}

async function updateOrderStatus(request: Request, env: Env, code: string) {
  const body = await readJson(request);
  const status = requireString(body.status, "status");
  const note = optionalString(body.note);

  if (!statuses.includes(status as (typeof statuses)[number])) {
    return json({ error: "Invalid status" }, 400);
  }

  const order = await findOrderByCode(code, env);
  if (!order) return json({ error: "Order not found" }, 404);

  await env.DB.batch([
    env.DB.prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(status, order.id),
    env.DB.prepare("INSERT INTO status_events (id, order_id, status, note) VALUES (?, ?, ?, ?)").bind(
      crypto.randomUUID(),
      order.id,
      status,
      note,
    ),
  ]);

  return json({ code, status });
}

async function getAdminFile(env: Env, fileId: string) {
  const file = await env.DB.prepare("SELECT object_key, file_name, content_type FROM order_files WHERE id = ?").bind(fileId).first<{
    object_key: string;
    file_name: string;
    content_type: string;
  }>();

  if (!file) return json({ error: "File not found" }, 404);

  const object = await env.FILES.get(file.object_key);
  if (!object) return json({ error: "File object not found" }, 404);

  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType ?? file.content_type,
      "content-disposition": `attachment; filename="${file.file_name.replaceAll('"', "")}"`,
    },
  });
}

async function findOrderByCode(code: string, env: Env) {
  return env.DB.prepare("SELECT * FROM orders WHERE code = ?").bind(code).first<Order>();
}

async function nextOrderCode(env: Env) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS total FROM orders").first<{ total: number }>();
  return `PED-${String((row?.total ?? 0) + 1).padStart(5, "0")}`;
}

async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }

  return value.trim();
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeFileName(fileName: string) {
  return fileName.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "upload";
}

function buildWhatsAppUrl(number: string, code: string) {
  if (!number) return null;
  const message = encodeURIComponent(`Olá! Acabei de criar o pedido ${code}.`);
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${message}`;
}

function requireAdmin(request: Request, env: Env) {
  const allowedEmails = env.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (allowedEmails.length === 0) return json({ error: "ADMIN_EMAILS is not configured" }, 500);

  const accessEmail = request.headers.get("cf-access-authenticated-user-email")?.toLowerCase();
  if (!accessEmail || !allowedEmails.includes(accessEmail)) {
    return json({ error: "Forbidden" }, 403);
  }

  return null;
}

function json(body: unknown, status = 200) {
  return withCors(new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  }));
}

function withCors(response: Response, env?: Env) {
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", env?.APP_ORIGIN ?? "*");
  headers.set("access-control-allow-methods", "GET,POST,PUT,PATCH,OPTIONS");
  headers.set("access-control-allow-headers", "content-type,x-file-name");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

