CREATE TABLE IF NOT EXISTS other_projects (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  dimensions TEXT NOT NULL,
  included_items TEXT NOT NULL,
  description TEXT NOT NULL,
  placeholder TEXT NOT NULL,
  static_image_key TEXT NOT NULL,
  hover_image_key TEXT,
  surface TEXT NOT NULL DEFAULT '#ead4c6',
  width REAL NOT NULL,
  aspect_ratio TEXT NOT NULL,
  offset REAL NOT NULL DEFAULT 0,
  rotate REAL NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_other_projects_sort
  ON other_projects (is_active, sort_order, created_at);

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

CREATE INDEX IF NOT EXISTS idx_site_images_section
  ON site_images (section, is_active, sort_order);

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

CREATE INDEX IF NOT EXISTS idx_feedback_images_sort
  ON feedback_images (is_active, sort_order, created_at);
