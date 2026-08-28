PRAGMA foreign_keys = off;

CREATE TABLE IF NOT EXISTS orders_next (
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

INSERT INTO orders_next (
  id, code, customer_id, token, product, size, colors, notes, status,
  order_type, source, expires_at, created_at, updated_at
)
SELECT
  id,
  code,
  customer_id,
  token,
  product,
  size,
  colors,
  notes,
  status,
  'outros',
  'manual',
  NULL,
  created_at,
  updated_at
FROM orders;

DROP TABLE orders;
ALTER TABLE orders_next RENAME TO orders;

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders (order_type, status);
CREATE INDEX IF NOT EXISTS idx_orders_expires_at ON orders (expires_at);

CREATE TABLE IF NOT EXISTS status_events_next (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('awaiting_payment', 'received', 'payment_confirmed', 'in_production', 'awaiting_approval', 'finished')),
  note TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

INSERT INTO status_events_next (id, order_id, status, note, created_at)
SELECT id, order_id, status, note, created_at
FROM status_events;

DROP TABLE status_events;
ALTER TABLE status_events_next RENAME TO status_events;

CREATE INDEX IF NOT EXISTS idx_status_events_order_id ON status_events (order_id, created_at);

PRAGMA foreign_keys = on;
