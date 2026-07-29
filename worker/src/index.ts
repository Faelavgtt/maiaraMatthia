type R2Bucket = {
  put(key: string, value: ReadableStream | ArrayBuffer | string, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string } } | null>;
};

type Env = {
  FILES: R2Bucket;
  APP_ORIGIN: string;
  ADMIN_EMAILS: string;
  WHATSAPP_NUMBER: string;
};

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
        return json({ ok: true, storage: "disabled" }, 200, env);
      }

      if (request.method === "POST" && url.pathname === "/api/orders") {
        return createTemporaryOrder(request, env);
      }

      const orderMatch = url.pathname.match(/^\/api\/orders\/([^/]+)$/);
      if (request.method === "GET" && orderMatch) {
        return json({ error: "Order storage is temporarily disabled" }, 503, env);
      }

      const uploadMatch = url.pathname.match(/^\/api\/orders\/([^/]+)\/files\/([^/]+)$/);
      if (request.method === "PUT" && uploadMatch) {
        return uploadTemporaryOrderFile(request, env, uploadMatch[1], uploadMatch[2], url.searchParams.get("token"));
      }

      if (request.method === "GET" && url.pathname === "/api/admin/orders") {
        const admin = requireAdmin(request, env);
        if (admin) return admin;
        return json({ orders: [] }, 200, env);
      }

      const adminStatusMatch = url.pathname.match(/^\/api\/admin\/orders\/([^/]+)\/status$/);
      if (request.method === "PATCH" && adminStatusMatch) {
        const admin = requireAdmin(request, env);
        if (admin) return admin;
        return json({ error: "Order storage is temporarily disabled" }, 503, env);
      }

      const adminFileMatch = url.pathname.match(/^\/api\/admin\/files\/([^/]+)$/);
      if (request.method === "GET" && adminFileMatch) {
        const admin = requireAdmin(request, env);
        if (admin) return admin;
        return json({ error: "File lookup is temporarily disabled" }, 503, env);
      }

      return json({ error: "Not found" }, 404, env);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500, env);
    }
  },
};

async function createTemporaryOrder(request: Request, env: Env) {
  const body = await readJson(request);
  const product = requireString(body.product, "product");
  const code = temporaryOrderCode();
  const token = randomToken();
  const whatsappUrl = buildWhatsAppUrl(env.WHATSAPP_NUMBER, code, product);

  return json({
    code,
    token,
    statusUrl: `/pedido/${code}?token=${token}`,
    uploadUrl: `/api/orders/${code}/files/original?token=${token}`,
    whatsappUrl,
    storage: "disabled",
  }, 201, env);
}

async function uploadTemporaryOrderFile(request: Request, env: Env, code: string, kind: string, token: string | null) {
  if (!token) return json({ error: "Token is required" }, 401, env);
  if (!["original", "preview", "final"].includes(kind)) return json({ error: "Invalid file kind" }, 400, env);

  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  const fileName = request.headers.get("x-file-name") ?? `${kind}`;

  if (!allowedContentTypes.has(contentType)) return json({ error: "Unsupported file type" }, 415, env);
  if (!contentLength || contentLength > maxUploadBytes) return json({ error: "File must be up to 10 MB" }, 413, env);
  if (!request.body) return json({ error: "Missing file body" }, 400, env);

  const fileId = crypto.randomUUID();
  const objectKey = `orders/${safePathPart(code)}/${fileId}-${safeFileName(fileName)}`;

  await env.FILES.put(objectKey, request.body, { httpMetadata: { contentType } });

  return json({ fileId, objectKey, storage: "r2-only" }, 201, env);
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

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function temporaryOrderCode() {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `TEMP-${suffix}`;
}

function safePathPart(value: string) {
  return value.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "temporary";
}

function safeFileName(fileName: string) {
  return fileName.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "upload";
}

function buildWhatsAppUrl(number: string, code: string, product: string) {
  if (!number) return null;
  const message = encodeURIComponent(`Ola! Acabei de criar o pedido temporario ${code} para ${product}.`);
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${message}`;
}

function requireAdmin(request: Request, env: Env) {
  const allowedEmails = env.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (allowedEmails.length === 0) return json({ error: "ADMIN_EMAILS is not configured" }, 500, env);

  const accessEmail = request.headers.get("cf-access-authenticated-user-email")?.toLowerCase();
  if (!accessEmail || !allowedEmails.includes(accessEmail)) {
    return json({ error: "Forbidden" }, 403, env);
  }

  return null;
}

function json(body: unknown, status = 200, env?: Env) {
  return withCors(new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  }), env);
}

function withCors(response: Response, env?: Env) {
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", env?.APP_ORIGIN ?? "*");
  headers.set("access-control-allow-methods", "GET,POST,PUT,PATCH,OPTIONS");
  headers.set("access-control-allow-headers", "content-type,x-file-name");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
