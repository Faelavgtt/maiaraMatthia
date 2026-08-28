PRAGMA foreign_keys = off;

CREATE TABLE IF NOT EXISTS other_projects_next (
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

INSERT INTO other_projects_next (
  id, number, name, title, category, price, original_price, dimensions, included_items,
  description, placeholder, static_image_key, hover_image_key, surface, frame_format,
  width, aspect_ratio, offset, rotate, sort_order, is_active, created_at, updated_at
)
SELECT
  id,
  number,
  title,
  title,
  category,
  price,
  NULL,
  dimensions,
  included_items,
  description,
  placeholder,
  static_image_key,
  hover_image_key,
  surface,
  CASE
    WHEN aspect_ratio = '16 / 9' THEN 'landscape'
    WHEN aspect_ratio = '1 / 1' THEN 'square'
    WHEN aspect_ratio = '5 / 3' THEN 'wide'
    WHEN aspect_ratio = '5 / 4' THEN 'classic'
    ELSE 'portrait'
  END,
  width,
  aspect_ratio,
  offset,
  rotate,
  sort_order,
  is_active,
  created_at,
  updated_at
FROM other_projects
WHERE EXISTS (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'other_projects');

DROP TABLE IF EXISTS other_projects;
ALTER TABLE other_projects_next RENAME TO other_projects;

CREATE INDEX IF NOT EXISTS idx_other_projects_sort
  ON other_projects (is_active, sort_order, created_at);

PRAGMA foreign_keys = on;
