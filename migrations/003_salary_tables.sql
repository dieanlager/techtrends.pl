-- migrations/003_salary_tables.sql

-- 1. Agregowane statystyki (Sercem pSEO - tu uderza Googlebot)
CREATE TABLE IF NOT EXISTS salary_stats (
  tech_slug       text NOT NULL,
  location_slug   text NOT NULL,
  level_slug      text NOT NULL CHECK (level_slug IN ('junior','mid','senior','lead','principal')),

  -- Rozkład (PLN brutto / miesiąc)
  min             int,
  p25             int,
  median          int,
  mean            int,
  p75             int,
  max             int,

  -- Metadane
  sample_size     int  NOT NULL DEFAULT 0,
  contract        text NOT NULL DEFAULT 'both' CHECK (contract IN ('b2b','uop','both')),
  yoy_delta_pct   numeric(5,2),   -- zmiana rok do roku

  -- Timestamps
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (tech_slug, location_slug, level_slug)
);

-- 2. Historia kwartalna dla wykresów trendów
CREATE TABLE IF NOT EXISTS salary_history (
  tech_slug       text NOT NULL,
  location_slug   text NOT NULL,
  level_slug      text NOT NULL,
  year            int  NOT NULL,
  quarter         int  NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  median          int  NOT NULL,
  p25             int,
  p75             int,
  sample_size     int  NOT NULL DEFAULT 0,
  PRIMARY KEY (tech_slug, location_slug, level_slug, year, quarter)
);

-- 3. Raw oferty (Surowe dane ze scraperów - JustJoin IT / NoFluffJobs)
CREATE TABLE IF NOT EXISTS salary_offers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tech_slug       text NOT NULL,
  location_slug   text NOT NULL,
  level_slug      text NOT NULL,
  salary_min      int,
  salary_max      int,
  contract        text NOT NULL DEFAULT 'b2b',
  source          text NOT NULL,   -- 'justjoin' | 'nofluff' | 'manual'
  source_id       text,            -- ID u dostawcy (do deduplikacji)
  scraped_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source, source_id)
);

-- Indeksy dla wydajności przy milionach rekordów
CREATE INDEX idx_salary_stats_tech      ON salary_stats (tech_slug);
CREATE INDEX idx_salary_stats_location  ON salary_stats (location_slug);
CREATE INDEX idx_salary_stats_sample    ON salary_stats (sample_size DESC);
CREATE INDEX idx_salary_history_tech    ON salary_history (tech_slug, year, quarter);
