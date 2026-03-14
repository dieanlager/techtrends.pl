-- migrations/004_trend_snapshots_update.sql
-- Dodaj kolumnę so_questions jeśli nie istnieje
-- (001_base_schema.sql już ją ma — ten plik to safety migration dla istniejących DB)

ALTER TABLE trend_snapshots
  ADD COLUMN IF NOT EXISTS so_questions int NOT NULL DEFAULT 0;

-- Indeks dla szybkiego grupowania per rok
CREATE INDEX IF NOT EXISTS idx_trend_year
  ON trend_snapshots (tech_id, year, quarter);
