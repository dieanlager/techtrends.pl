-- migrations/001_base_schema.sql
-- Uruchom PRZED seed scriptem

-- ─── Extensions ───────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- trigram search dla LIKE queries

-- ─── Categories ───────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  name        text        NOT NULL,
  description text        NOT NULL DEFAULT '',
  icon        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── Technologies ─────────────────────────
CREATE TABLE IF NOT EXISTS technologies (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  text        UNIQUE NOT NULL,
  name                  text        NOT NULL,
  tagline               text        NOT NULL DEFAULT '',
  description           text,
  category_id           uuid        NOT NULL REFERENCES categories(id),
  subcategory_id        uuid,       -- opcjonalny drugi poziom
  ecosystem             text[]      NOT NULL DEFAULT '{}',
  tags                  text[]      NOT NULL DEFAULT '{}',
  license               text,
  language              text,       -- primary language
  website_url           text,
  repo_url              text,
  gh_stars              int,
  gh_forks              int,
  npm_weekly_downloads  bigint,
  so_questions          int,
  tiobe_rank            int,
  pypl_rank             int,
  first_release         timestamptz,
  latest_version        text,
  is_published          boolean     NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ─── Trend Snapshots ──────────────────────
CREATE TABLE IF NOT EXISTS trend_snapshots (
  tech_id      uuid        NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  year         int         NOT NULL,
  quarter      int         NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  gh_stars     int         NOT NULL DEFAULT 0,
  npm_dls      bigint      NOT NULL DEFAULT 0,
  so_questions int         NOT NULL DEFAULT 0,
  PRIMARY KEY (tech_id, year, quarter)
);

-- ─── Stacks ───────────────────────────────
CREATE TABLE IF NOT EXISTS stacks (
  slug        text        PRIMARY KEY,
  title       text        NOT NULL,
  description text,
  tech_slugs  text[]      NOT NULL DEFAULT '{}',
  tech_names  text[]      NOT NULL DEFAULT '{}',
  use_cases   text[]      NOT NULL DEFAULT '{}',
  popularity  int         NOT NULL DEFAULT 0,
  is_published boolean    NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── Subcategories (opcjonalne) ───────────
CREATE TABLE IF NOT EXISTS subcategories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid        NOT NULL REFERENCES categories(id),
  slug        text        UNIQUE NOT NULL,
  name        text        NOT NULL
);

-- ─── Indeksy ──────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tech_category    ON technologies (category_id);
CREATE INDEX IF NOT EXISTS idx_tech_slug        ON technologies (slug);
CREATE INDEX IF NOT EXISTS idx_tech_stars       ON technologies (gh_stars DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_tech_npm         ON technologies (npm_weekly_downloads DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_tech_published   ON technologies (is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_tech_ecosystem   ON technologies USING GIN (ecosystem);
CREATE INDEX IF NOT EXISTS idx_tech_tags        ON technologies USING GIN (tags);

-- Trigram index dla LIKE/ILIKE search w category hub
CREATE INDEX IF NOT EXISTS idx_tech_name_trgm ON technologies USING GIN (name gin_trgm_ops);

-- ─── Auto-updated_at trigger ──────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tech_updated_at ON technologies;
CREATE TRIGGER tech_updated_at
  BEFORE UPDATE ON technologies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS cat_updated_at ON categories;
CREATE TRIGGER cat_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── View: category stats ─────────────────
CREATE OR REPLACE VIEW category_stats AS
SELECT
  c.slug,
  c.name,
  COUNT(t.id)::int              AS tech_count,
  MAX(t.gh_stars)               AS max_stars,
  SUM(t.npm_weekly_downloads)   AS total_npm_dls
FROM categories c
LEFT JOIN technologies t ON t.category_id = c.id AND t.is_published
GROUP BY c.id, c.slug, c.name;
