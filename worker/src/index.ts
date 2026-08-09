type R2Bucket = {
  put(key: string, value: ReadableStream | ArrayBuffer | string, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string } } | null>;
  list(options?: { prefix?: string; cursor?: string; limit?: number }): Promise<{
    objects: Array<{ key: string; size: number; uploaded: Date; httpMetadata?: { contentType?: string } }>;
    truncated: boolean;
    cursor?: string;
  }>;
  delete(key: string | string[]): Promise<void>;
};

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
};

type D1Database = {
  prepare(query: string): D1PreparedStatement;
};

type Env = {
  FILES: R2Bucket;
  DB?: D1Database;
  APP_ORIGIN: string;
  ADMIN_EMAILS: string;
  ADMIN_OWNER_USERNAME?: string;
  ADMIN_OWNER_EMAIL?: string;
  ADMIN_OWNER_PASSWORD?: string;
  WHATSAPP_NUMBER: string;
};

type AdminIdentity = {
  id: string;
  username: string;
  email: string;
  role: "owner" | "admin";
};

const allowedContentTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const allowedGalleryImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxUploadBytes = 10 * 1024 * 1024;
const maxGalleryImageBytes = 8 * 1024 * 1024;
const adminSessionCookieName = "maiara_admin_session";
const adminSessionDurationMs = 1000 * 60 * 60 * 24 * 7;
const passwordHashIterations = 120000;

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
        return createOrder(request, env);
      }

      if (request.method === "POST" && url.pathname === "/api/admin/login") {
        return loginAdmin(request, env);
      }

      if (request.method === "POST" && url.pathname === "/api/admin/logout") {
        return logoutAdmin(request, env);
      }

      if (request.method === "GET" && url.pathname === "/api/gallery-products") {
        return listGalleryProducts(env);
      }

      const galleryImageMatch = url.pathname.match(/^\/api\/gallery-images\/(.+)$/);
      if (request.method === "GET" && galleryImageMatch) {
        return getGalleryImage(env, galleryImageMatch[1]);
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
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        return listAdminOrders(env);
      }

      if (request.method === "GET" && url.pathname === "/api/admin/session") {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        return json({ user: admin }, 200, env);
      }

      if (request.method === "GET" && url.pathname === "/api/admin/users") {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        if (admin.role !== "owner") return json({ error: "Somente o admin principal pode gerenciar usuarios." }, 403, env);
        return listAdminUsers(env);
      }

      if (request.method === "POST" && url.pathname === "/api/admin/users") {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        if (admin.role !== "owner") return json({ error: "Somente o admin principal pode cadastrar usuarios." }, 403, env);
        return createAdminUser(request, env, admin);
      }

      if (request.method === "GET" && url.pathname === "/api/admin/gallery-products") {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        return listGalleryProducts(env);
      }

      if (request.method === "POST" && url.pathname === "/api/admin/gallery-products") {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        return createGalleryProduct(request, env);
      }

      const adminGalleryProductMatch = url.pathname.match(/^\/api\/admin\/gallery-products\/([^/]+)$/);
      if (adminGalleryProductMatch && request.method === "PATCH") {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        return updateGalleryProduct(request, env, adminGalleryProductMatch[1]);
      }

      if (adminGalleryProductMatch && request.method === "DELETE") {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        return deleteGalleryProduct(env, adminGalleryProductMatch[1]);
      }

      if (request.method === "PUT" && url.pathname === "/api/admin/gallery-images") {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        return uploadGalleryImage(request, env);
      }

      if (request.method === "GET" && url.pathname === "/api/admin/gallery-images") {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        return listGalleryImages(env, url.searchParams.get("cursor"));
      }

      const adminGalleryImageMatch = url.pathname.match(/^\/api\/admin\/gallery-images\/(.+)$/);
      if (adminGalleryImageMatch && request.method === "DELETE") {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        return deleteGalleryImage(env, adminGalleryImageMatch[1]);
      }

      const adminStatusMatch = url.pathname.match(/^\/api\/admin\/orders\/([^/]+)\/status$/);
      if (request.method === "PATCH" && adminStatusMatch) {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        return updateOrderStatus(request, env, adminStatusMatch[1]);
      }

      const adminFileMatch = url.pathname.match(/^\/api\/admin\/files\/([^/]+)$/);
      if (request.method === "GET" && adminFileMatch) {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        return json({ error: "File lookup is temporarily disabled" }, 503, env);
      }

      return json({ error: "Not found" }, 404, env);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500, env);
    }
  },
};

async function createOrder(request: Request, env: Env) {
  const db = requireDb(env);
  if (db instanceof Response) return db;

  const body = await readJson(request);
  const customerName = requireString(body.customerName, "customerName");
  const phone = requireString(body.phone, "phone");
  const email = optionalString(body.email);
  const notes = optionalString(body.notes);
  const colors = optionalString(body.colors);
  const size = optionalString(body.size);
  const items = normalizeOrderItems(body.items, body);
  const product = summarizeOrderItems(items);
  const now = new Date().toISOString();
  const customerId = crypto.randomUUID();
  const orderId = crypto.randomUUID();
  const code = orderCode();
  const token = randomToken();

  const existingCustomer = await db.prepare("SELECT id FROM customers WHERE phone = ? LIMIT 1")
    .bind(normalizePhone(phone))
    .first<{ id: string }>();

  const finalCustomerId = existingCustomer?.id ?? customerId;

  if (existingCustomer) {
    await db.prepare("UPDATE customers SET name = ?, email = COALESCE(?, email), updated_at = ? WHERE id = ?")
      .bind(customerName, email, now, finalCustomerId)
      .run();
  } else {
    await db.prepare("INSERT INTO customers (id, name, phone, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(finalCustomerId, customerName, normalizePhone(phone), email, now, now)
      .run();
  }

  await db.prepare(
    `INSERT INTO orders (id, code, customer_id, token, product, size, colors, notes, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(orderId, code, finalCustomerId, token, product, size, colors, notes, "received", now, now)
    .run();

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    await db.prepare(
      `INSERT INTO order_items
        (id, order_id, product_id, title, category, price, dimensions, quantity, notes, image_url, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        orderId,
        item.productId,
        item.title,
        item.category,
        item.price,
        item.dimensions,
        item.quantity,
        item.notes,
        item.imageUrl,
        index,
        now,
      )
      .run();
  }

  const whatsappUrl = buildWhatsAppUrl(env.WHATSAPP_NUMBER, code, product);

  return json({
    code,
    token,
    statusUrl: `/pedido/${code}?token=${token}`,
    uploadUrl: `/api/orders/${code}/files/original?token=${token}`,
    whatsappUrl,
    storage: "d1",
  }, 201, env);
}

async function listAdminOrders(env: Env) {
  const db = requireDb(env);
  if (db instanceof Response) return db;

  const { results } = await db.prepare(
    `SELECT orders.id, orders.code, orders.product, orders.size, orders.colors, orders.status, orders.created_at, orders.updated_at,
            customers.name AS customer_name, customers.phone AS customer_phone, customers.email AS customer_email
     FROM orders
     INNER JOIN customers ON customers.id = orders.customer_id
     ORDER BY orders.created_at DESC
     LIMIT 100`,
  ).all<AdminOrderRow>();

  return json({ orders: results }, 200, env);
}

async function updateOrderStatus(request: Request, env: Env, code: string) {
  const db = requireDb(env);
  if (db instanceof Response) return db;

  const body = await readJson(request);
  const status = requireEnum(body.status, "status", ["received", "payment_confirmed", "in_production", "awaiting_approval", "finished"]);
  const now = new Date().toISOString();

  await db.prepare("UPDATE orders SET status = ?, updated_at = ? WHERE code = ?")
    .bind(status, now, code)
    .run();

  return json({ code, status }, 200, env);
}

async function loginAdmin(request: Request, env: Env) {
  const db = requireDb(env);
  if (db instanceof Response) return db;

  await ensureBootstrapAdmin(env, request);

  const body = await readJson(request);
  const login = requireString(body.login, "login").toLowerCase();
  const password = requireString(body.password, "password");

  const user = await db.prepare(
    `SELECT id, username, email, password_hash, role, is_active, created_at, updated_at, last_login_at
     FROM admin_users
     WHERE lower(username) = ? OR lower(email) = ?
     LIMIT 1`,
  )
    .bind(login, login)
    .first<AdminUserWithPasswordRow>();

  if (!user || user.is_active !== 1) {
    return json({ error: "Usuario ou senha invalidos." }, 401, env);
  }

  const passwordMatches = await verifyPassword(password, user.password_hash);
  if (!passwordMatches) {
    return json({ error: "Usuario ou senha invalidos." }, 401, env);
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + adminSessionDurationMs);
  const token = randomToken();
  const tokenHash = await sha256Hex(token);

  await db.prepare(
    "INSERT INTO admin_sessions (id, user_id, token_hash, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(crypto.randomUUID(), user.id, tokenHash, expiresAt.toISOString(), now.toISOString(), now.toISOString())
    .run();

  await db.prepare("UPDATE admin_users SET last_login_at = ?, updated_at = ? WHERE id = ?")
    .bind(now.toISOString(), now.toISOString(), user.id)
    .run();

  const response = json({ user: toAdminUserIdentity(user) }, 200, env);
  response.headers.append("set-cookie", buildAdminSessionCookie(token, expiresAt, request, env));
  return response;
}

async function logoutAdmin(request: Request, env: Env) {
  const db = requireDb(env);

  if (!(db instanceof Response)) {
    const token = getCookie(request, adminSessionCookieName);
    if (token) {
      await db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?")
        .bind(await sha256Hex(token))
        .run()
        .catch(() => undefined);
    }
  }

  const response = json({ ok: true }, 200, env);
  response.headers.append("set-cookie", clearAdminSessionCookie(request, env));
  return response;
}

async function listAdminUsers(env: Env) {
  const db = requireDb(env);
  if (db instanceof Response) return db;

  await ensureBootstrapAdmin(env);

  const { results } = await db.prepare(
    `SELECT id, username, email, role, is_active, created_at, updated_at, last_login_at
     FROM admin_users
     ORDER BY role DESC, created_at ASC`,
  ).all<AdminUserRow>();

  return json({ users: results.map(toAdminUserResponse) }, 200, env);
}

async function createAdminUser(request: Request, env: Env, admin: AdminIdentity) {
  const db = requireDb(env);
  if (db instanceof Response) return db;

  const body = await readJson(request);
  const username = normalizeUsername(requireString(body.username, "username"));
  const email = requireString(body.email, "email").toLowerCase();
  const password = requireString(body.password, "password");
  const role = requireEnum(body.role ?? "admin", "role", ["owner", "admin"]);

  if (password.length < 8) {
    return json({ error: "A senha precisa ter pelo menos 8 caracteres." }, 400, env);
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  await db.prepare(
    `INSERT INTO admin_users (id, username, email, password_hash, role, is_active, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)`,
  )
    .bind(id, username, email, passwordHash, role, admin.id, now, now)
    .run();

  const user = await db.prepare(
    `SELECT id, username, email, role, is_active, created_at, updated_at, last_login_at
     FROM admin_users
     WHERE id = ?`,
  )
    .bind(id)
    .first<AdminUserRow>();

  return json({ user: user ? toAdminUserResponse(user) : null }, 201, env);
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

async function listGalleryProducts(env: Env) {
  const db = requireDb(env);
  if (db instanceof Response) return db;

  const { results } = await db.prepare(
    `SELECT id, name, title, category, price, original_price, dimensions, included_items, description, placeholder,
            static_image, hover_image, surface, frame_format, width, aspect_ratio, offset, rotate, sort_order, created_at, updated_at
     FROM gallery_products
     ORDER BY sort_order ASC, created_at ASC`,
  ).all<GalleryProductRow>();

  return json({ products: results.map(toGalleryProductResponse) }, 200, env);
}

async function createGalleryProduct(request: Request, env: Env) {
  const db = requireDb(env);
  if (db instanceof Response) return db;

  const body = await readJson(request);
  const id = crypto.randomUUID();
  const name = requireString(body.name, "name");
  const title = requireString(body.title, "title");
  const category = requireString(body.category, "category");
  const price = requireString(body.price, "price");
  const originalPrice = optionalString(body.originalPrice);
  const dimensions = requireString(body.dimensions, "dimensions");
  const includedItems = requireStringArray(body.includedItems, "includedItems");
  const description = requireString(body.description, "description");
  const placeholder = optionalString(body.placeholder) ?? title;
  const staticImage = requireString(body.staticImage, "staticImage");
  const hoverImage = optionalString(body.hoverImage);
  const surface = optionalString(body.surface) ?? "#ead4c6";
  const frameFormat = requireEnum(body.frameFormat, "frameFormat", ["landscape", "portrait", "square", "wide", "classic"]);
  const width = requireNumber(body.width, "width");
  const aspectRatio = requireString(body.aspectRatio, "aspectRatio");
  const offset = requireNumber(body.offset, "offset");
  const rotate = requireNumber(body.rotate, "rotate");
  const sortOrder = Number(body.sortOrder ?? Date.now());
  const now = new Date().toISOString();

  await db.prepare(
    `INSERT INTO gallery_products
      (id, name, title, category, price, original_price, dimensions, included_items, description, placeholder,
       static_image, hover_image, surface, frame_format, width, aspect_ratio, offset, rotate, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      name,
      title,
      category,
      price,
      originalPrice,
      dimensions,
      JSON.stringify(includedItems),
      description,
      placeholder,
      staticImage,
      hoverImage,
      surface,
      frameFormat,
      width,
      aspectRatio,
      offset,
      rotate,
      sortOrder,
      now,
      now,
    )
    .run();

  const row = await db.prepare(
    `SELECT id, name, title, category, price, original_price, dimensions, included_items, description, placeholder,
            static_image, hover_image, surface, frame_format, width, aspect_ratio, offset, rotate, sort_order, created_at, updated_at
     FROM gallery_products
     WHERE id = ?`,
  )
    .bind(id)
    .first<GalleryProductRow>();

  return json({ product: row ? toGalleryProductResponse(row) : null }, 201, env);
}

async function updateGalleryProduct(request: Request, env: Env, id: string) {
  const db = requireDb(env);
  if (db instanceof Response) return db;

  const body = await readJson(request);
  const name = requireString(body.name, "name");
  const title = requireString(body.title, "title");
  const category = requireString(body.category, "category");
  const price = requireString(body.price, "price");
  const originalPrice = optionalString(body.originalPrice);
  const dimensions = requireString(body.dimensions, "dimensions");
  const includedItems = requireStringArray(body.includedItems, "includedItems");
  const description = requireString(body.description, "description");
  const placeholder = optionalString(body.placeholder) ?? title;
  const staticImage = requireString(body.staticImage, "staticImage");
  const hoverImage = optionalString(body.hoverImage);
  const surface = optionalString(body.surface) ?? "#ead4c6";
  const frameFormat = requireEnum(body.frameFormat, "frameFormat", ["landscape", "portrait", "square", "wide", "classic"]);
  const width = requireNumber(body.width, "width");
  const aspectRatio = requireString(body.aspectRatio, "aspectRatio");
  const offset = requireNumber(body.offset, "offset");
  const rotate = requireNumber(body.rotate, "rotate");
  const sortOrder = Number(body.sortOrder ?? Date.now());
  const now = new Date().toISOString();

  await db.prepare(
    `UPDATE gallery_products
     SET name = ?, title = ?, category = ?, price = ?, original_price = ?, dimensions = ?,
         included_items = ?, description = ?, placeholder = ?, static_image = ?, hover_image = ?,
         surface = ?, frame_format = ?, width = ?, aspect_ratio = ?, offset = ?, rotate = ?,
         sort_order = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(
      name,
      title,
      category,
      price,
      originalPrice,
      dimensions,
      JSON.stringify(includedItems),
      description,
      placeholder,
      staticImage,
      hoverImage,
      surface,
      frameFormat,
      width,
      aspectRatio,
      offset,
      rotate,
      sortOrder,
      now,
      id,
    )
    .run();

  const row = await db.prepare(
    `SELECT id, name, title, category, price, original_price, dimensions, included_items, description, placeholder,
            static_image, hover_image, surface, frame_format, width, aspect_ratio, offset, rotate, sort_order, created_at, updated_at
     FROM gallery_products
     WHERE id = ?`,
  )
    .bind(id)
    .first<GalleryProductRow>();

  if (!row) return json({ error: "Gallery product not found" }, 404, env);
  return json({ product: toGalleryProductResponse(row) }, 200, env);
}

async function deleteGalleryProduct(env: Env, id: string) {
  const db = requireDb(env);
  if (db instanceof Response) return db;

  await db.prepare("DELETE FROM gallery_products WHERE id = ?").bind(id).run();
  return json({ id }, 200, env);
}

async function uploadGalleryImage(request: Request, env: Env) {
  const contentType = request.headers.get("content-type") ?? "";
  const fileName = request.headers.get("x-file-name") ?? "gallery-image";

  if (!allowedGalleryImageTypes.has(contentType)) return json({ error: "Unsupported gallery image type" }, 415, env);
  if (!request.body) return json({ error: "Missing image body" }, 400, env);

  const fileBuffer = await request.arrayBuffer();
  if (fileBuffer.byteLength === 0 || fileBuffer.byteLength > maxGalleryImageBytes) {
    return json({ error: "Gallery image must be up to 8 MB" }, 413, env);
  }

  const fileId = crypto.randomUUID();
  const objectKey = `gallery/${fileId}-${safeFileName(fileName)}`;

  await env.FILES.put(objectKey, fileBuffer, { httpMetadata: { contentType } });

  return json({ fileId, objectKey, url: `/api/gallery-images/${objectKey}` }, 201, env);
}

async function listGalleryImages(env: Env, cursor: string | null) {
  const listed = await env.FILES.list({
    prefix: "gallery/",
    cursor: cursor ?? undefined,
    limit: 100,
  });

  return json({
    images: listed.objects.map((object) => ({
      key: object.key,
      url: `/api/gallery-images/${object.key}`,
      size: object.size,
      uploaded: object.uploaded.toISOString(),
      contentType: object.httpMetadata?.contentType ?? null,
    })),
    cursor: listed.cursor ?? null,
    truncated: listed.truncated,
  }, 200, env);
}

async function deleteGalleryImage(env: Env, objectKey: string) {
  const safeKey = decodeURIComponent(objectKey);
  if (!safeKey.startsWith("gallery/")) return json({ error: "Invalid gallery image key" }, 400, env);

  await env.FILES.delete(safeKey);

  return json({ key: safeKey }, 200, env);
}

async function getGalleryImage(env: Env, objectKey: string) {
  const safeKey = decodeURIComponent(objectKey);
  if (!safeKey.startsWith("gallery/")) return json({ error: "Invalid gallery image key" }, 400, env);

  const object = await env.FILES.get(safeKey);
  if (!object) return json({ error: "Gallery image not found" }, 404, env);

  return withCors(new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
    },
  }), env);
}

async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

type GalleryProductRow = {
  id: string;
  name: string;
  title: string;
  category: string;
  price: string;
  original_price: string | null;
  dimensions: string;
  included_items: string;
  description: string;
  placeholder: string;
  static_image: string;
  hover_image: string | null;
  surface: string;
  frame_format: string;
  width: number;
  aspect_ratio: string;
  offset: number;
  rotate: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type AdminOrderRow = {
  id: string;
  code: string;
  product: string;
  size: string | null;
  colors: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
};

type AdminUserRow = {
  id: string;
  username: string;
  email: string;
  role: "owner" | "admin";
  is_active: number;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
};

type AdminUserWithPasswordRow = AdminUserRow & {
  password_hash: string;
};

type AdminSessionRow = AdminUserWithPasswordRow & {
  session_id: string;
  expires_at: string;
};

type OrderItemInput = {
  productId: string | null;
  title: string;
  category: string | null;
  price: string | null;
  dimensions: string | null;
  quantity: number;
  notes: string | null;
  imageUrl: string | null;
};

function toGalleryProductResponse(row: GalleryProductRow) {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    category: row.category,
    price: row.price,
    originalPrice: row.original_price,
    dimensions: row.dimensions,
    includedItems: parseStringArray(row.included_items),
    description: row.description,
    placeholder: row.placeholder,
    staticImage: row.static_image,
    hoverImage: row.hover_image,
    surface: row.surface,
    frameFormat: row.frame_format,
    width: row.width,
    aspectRatio: row.aspect_ratio,
    offset: row.offset,
    rotate: row.rotate,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeOrderItems(value: unknown, fallbackBody: Record<string, unknown>): OrderItemInput[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [{
      productId: null,
      title: requireString(fallbackBody.product, "product"),
      category: null,
      price: null,
      dimensions: optionalString(fallbackBody.size),
      quantity: 1,
      notes: optionalString(fallbackBody.notes),
      imageUrl: null,
    }];
  }

  return value.slice(0, 20).map((item, index) => {
    if (!isRecord(item)) throw new Error(`items.${index} is invalid`);

    const quantity = Number(item.quantity ?? 1);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error(`items.${index}.quantity is invalid`);
    }

    return {
      productId: optionalString(item.productId),
      title: requireString(item.title, `items.${index}.title`),
      category: optionalString(item.category),
      price: optionalString(item.price),
      dimensions: optionalString(item.dimensions),
      quantity,
      notes: optionalString(item.notes),
      imageUrl: optionalString(item.imageUrl),
    };
  });
}

function summarizeOrderItems(items: OrderItemInput[]) {
  if (items.length === 1) {
    const item = items[0];
    return item.quantity > 1 ? `${item.quantity}x ${item.title}` : item.title;
  }

  return `${items.length} itens: ${items.slice(0, 3).map((item) => item.title).join(", ")}${items.length > 3 ? "..." : ""}`;
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "") || value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function requireStringArray(value: unknown, field: string) {
  if (!Array.isArray(value)) {
    throw new Error(`${field} is required`);
  }

  const items = value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  if (items.length === 0) {
    throw new Error(`${field} is required`);
  }

  return items;
}

function requireNumber(value: unknown, field: string) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(`${field} is invalid`);
  }

  return number;
}

function requireEnum<T extends string>(value: unknown, field: string, allowed: readonly T[]) {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new Error(`${field} is invalid`);
  }

  return value as T;
}

function parseStringArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    return [];
  }

  return [];
}

function requireDb(env: Env) {
  if (!env.DB) {
    return json({ error: "DB is not configured" }, 503, env);
  }

  return env.DB;
}

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function orderCode() {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `PED-${suffix}`;
}

function safePathPart(value: string) {
  return value.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "temporary";
}

function safeFileName(fileName: string) {
  return fileName.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "upload";
}

function buildWhatsAppUrl(number: string, code: string, product: string) {
  if (!number) return null;
  const message = encodeURIComponent(`Ola! Acabei de enviar o pedido ${code}: ${product}.`);
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${message}`;
}

async function ensureBootstrapAdmin(env: Env, request?: Request) {
  const db = requireDb(env);
  if (db instanceof Response) return;

  const existing = await db.prepare("SELECT id FROM admin_users LIMIT 1").first<{ id: string }>();
  if (existing) return;

  const isLocalRequest = request ? ["localhost", "127.0.0.1"].includes(new URL(request.url).hostname) : false;
  const username = normalizeUsername(optionalString(env.ADMIN_OWNER_USERNAME) ?? "admin");
  const email = (optionalString(env.ADMIN_OWNER_EMAIL) ?? (isLocalRequest ? "admin@local.test" : null))?.toLowerCase();
  const password = optionalString(env.ADMIN_OWNER_PASSWORD) ?? (isLocalRequest ? "admin123456" : null);

  if (!email || !password) return;

  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO admin_users (id, username, email, password_hash, role, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'owner', 1, ?, ?)`,
  )
    .bind(crypto.randomUUID(), username, email, await hashPassword(password), now, now)
    .run();
}

function toAdminUserIdentity(user: AdminUserRow): AdminIdentity {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

function toAdminUserResponse(user: AdminUserRow) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.is_active === 1,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    lastLoginAt: user.last_login_at,
  };
}

function normalizeUsername(value: string) {
  const username = value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  if (username.length < 3) throw new Error("username is invalid");
  return username;
}

async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: passwordHashIterations },
    key,
    256,
  );

  return `pbkdf2-sha256:${passwordHashIterations}:${bytesToBase64Url(salt)}:${bytesToBase64Url(new Uint8Array(bits))}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, iterationsText, saltText, hashText] = storedHash.split(":");
  const iterations = Number(iterationsText);
  if (algorithm !== "pbkdf2-sha256" || !Number.isInteger(iterations) || !saltText || !hashText) return false;

  const salt = base64UrlToBytes(saltText);
  const expectedHash = base64UrlToBytes(hashText);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    expectedHash.byteLength * 8,
  );

  return timingSafeEqual(new Uint8Array(bits), expectedHash);
}

async function sha256Hex(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.byteLength !== right.byteLength) return false;

  let diff = 0;
  for (let index = 0; index < left.byteLength; index += 1) {
    diff |= left[index] ^ right[index];
  }

  return diff === 0;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function getCookie(request: Request, name: string) {
  const cookies = request.headers.get("cookie") ?? "";
  const match = cookies.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function buildAdminSessionCookie(token: string, expiresAt: Date, request: Request, env: Env) {
  const secure = isSecureRequest(request, env) ? "; Secure" : "";
  return `${adminSessionCookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Max-Age=${Math.floor(adminSessionDurationMs / 1000)}${secure}`;
}

function clearAdminSessionCookie(request: Request, env: Env) {
  const secure = isSecureRequest(request, env) ? "; Secure" : "";
  return `${adminSessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0${secure}`;
}

function isSecureRequest(request: Request, env: Env) {
  const url = new URL(request.url);
  return url.protocol === "https:" || (env.APP_ORIGIN ?? "").startsWith("https://");
}

async function requireAdmin(request: Request, env: Env): Promise<AdminIdentity | Response> {
  const db = requireDb(env);
  if (db instanceof Response) return db;

  await ensureBootstrapAdmin(env);

  const token = getCookie(request, adminSessionCookieName);
  if (!token) return json({ error: "Acesso nao autenticado." }, 401, env);

  const tokenHash = await sha256Hex(token);
  const session = await db.prepare(
    `SELECT admin_users.id, admin_users.username, admin_users.email, admin_users.password_hash,
            admin_users.role, admin_users.is_active, admin_users.created_at, admin_users.updated_at,
            admin_users.last_login_at, admin_sessions.id AS session_id, admin_sessions.expires_at
     FROM admin_sessions
     INNER JOIN admin_users ON admin_users.id = admin_sessions.user_id
     WHERE admin_sessions.token_hash = ?
     LIMIT 1`,
  )
    .bind(tokenHash)
    .first<AdminSessionRow>();

  if (!session || session.is_active !== 1 || new Date(session.expires_at).getTime() <= Date.now()) {
    await db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").bind(tokenHash).run().catch(() => undefined);
    return json({ error: "Sessao expirada." }, 401, env);
  }

  await db.prepare("UPDATE admin_sessions SET last_seen_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), session.session_id)
    .run();

  return toAdminUserIdentity(session);
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
  headers.set("access-control-allow-methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  headers.set("access-control-allow-headers", "content-type,x-file-name");
  if (env?.APP_ORIGIN) {
    headers.set("access-control-allow-credentials", "true");
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
