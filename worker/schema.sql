CREATE TABLE IF NOT EXISTS gallery_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  original_price TEXT,
  dimensions TEXT NOT NULL,
  included_items TEXT NOT NULL,
  description TEXT NOT NULL,
  placeholder TEXT NOT NULL,
  static_image_key TEXT NOT NULL,
  hover_image_key TEXT,
  surface TEXT NOT NULL DEFAULT '#ead4c6',
  frame_format TEXT NOT NULL CHECK (frame_format IN ('landscape', 'portrait', 'square', 'wide', 'classic')),
  width REAL NOT NULL,
  aspect_ratio TEXT NOT NULL,
  offset REAL NOT NULL DEFAULT 0,
  rotate REAL NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gallery_products_sort ON gallery_products (sort_order, created_at);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_phone ON customers (phone);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  token TEXT NOT NULL,
  product TEXT NOT NULL,
  size TEXT,
  colors TEXT,
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('awaiting_payment', 'received', 'payment_confirmed', 'in_production', 'awaiting_approval', 'finished')),
  order_type TEXT NOT NULL DEFAULT 'outros' CHECK (order_type IN ('familinha', 'maker', 'galeria', 'outros')),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'cart', 'maker')),
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders (order_type, status);
CREATE INDEX IF NOT EXISTS idx_orders_expires_at ON orders (expires_at);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT,
  title TEXT NOT NULL,
  category TEXT,
  order_type TEXT,
  price TEXT,
  dimensions TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id, sort_order);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin')) DEFAULT 'admin',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_login_at TEXT,
  FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users (role);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions (expires_at);

CREATE TABLE IF NOT EXISTS status_events (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('awaiting_payment', 'received', 'payment_confirmed', 'in_production', 'awaiting_approval', 'finished')),
  note TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_status_events_order_id ON status_events (order_id, created_at);

CREATE TABLE IF NOT EXISTS order_files (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('original', 'preview', 'final')),
  object_key TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_files_order_id ON order_files (order_id, created_at);

CREATE TABLE IF NOT EXISTS other_projects (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  original_price TEXT,
  dimensions TEXT NOT NULL,
  included_items TEXT NOT NULL,
  description TEXT NOT NULL,
  placeholder TEXT NOT NULL,
  static_image_key TEXT NOT NULL,
  hover_image_key TEXT,
  surface TEXT NOT NULL DEFAULT '#ead4c6',
  frame_format TEXT NOT NULL DEFAULT 'portrait' CHECK (frame_format IN ('landscape', 'portrait', 'square', 'wide', 'classic')),
  width REAL NOT NULL,
  aspect_ratio TEXT NOT NULL,
  offset REAL NOT NULL DEFAULT 0,
  rotate REAL NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_other_projects_sort ON other_projects (is_active, sort_order, created_at);

CREATE TABLE IF NOT EXISTS site_images (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  slot TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  image_key TEXT NOT NULL,
  image_url TEXT,
  alt_text TEXT,
  object_key TEXT,
  content_type TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (section, slot)
);

CREATE INDEX IF NOT EXISTS idx_site_images_section ON site_images (section, is_active, sort_order);

CREATE TABLE IF NOT EXISTS feedback_images (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  note TEXT,
  image_key TEXT NOT NULL,
  image_url TEXT,
  alt_text TEXT,
  tape_color TEXT,
  rotate_class TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_feedback_images_sort ON feedback_images (is_active, sort_order, created_at);
