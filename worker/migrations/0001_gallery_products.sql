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
  static_image TEXT NOT NULL,
  hover_image TEXT,
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

CREATE INDEX IF NOT EXISTS idx_gallery_products_sort
  ON gallery_products (sort_order, created_at);
