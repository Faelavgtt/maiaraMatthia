ALTER TABLE order_items ADD COLUMN order_type TEXT;

UPDATE order_items
SET order_type = CASE
  WHEN lower(coalesce(category, '') || ' ' || coalesce(title, '') || ' ' || coalesce(product_id, '')) LIKE '%maker%' THEN 'maker'
  WHEN lower(coalesce(category, '') || ' ' || coalesce(title, '') || ' ' || coalesce(product_id, '')) LIKE '%galeria%' THEN 'galeria'
  WHEN lower(coalesce(category, '') || ' ' || coalesce(title, '') || ' ' || coalesce(product_id, '')) LIKE '%familinha%' THEN 'familinha'
  ELSE 'outros'
END
WHERE order_type IS NULL;
