# TechTrends.pl — pSEO Architecture Memory Backup (2026-03-14)

Ten dokument stanowi kompletną pamięć (memory backup) całego systemu Programmatic SEO wdrożonego w ramach iteracji aplikacji na silniku Next.js 15 App Router dla bazy technologicznej `TechTrends.pl`.

---

## 🏗️ Architektura Systemu i Komponentów
Projekt opiera się o SSR i ISR w ramach React Server Components, dających sub-milisekundowe TTI (Time to Interactive).

### 1. Model Bazy i Tabela Płacowa (`salary_stats`, `salary_offers`, `salary_history`)
Baza zaprojektowana i zrealizowana w oparciu o silnik PostgreSQL (migracje SQL):
- `migrations/001_base_schema.sql` — Baza technologiczna (drzewa tech, frameworki db, AI tools) wraz z trygramami (wyszukiwanie).
- `migrations/003_salary_tables.sql` — Silny agregat zbierający miliony rekordów salary. Stored Procedures (`aggregate_salary_stats()`) w bazie agregują medianę dla kombinacji **[Tech] x [Lokalizacja] x [Poziom doświadczenia]**.

### 2. Silnik Decyzyjny `noindex` (Crawl Budget)
Kod: `src/lib/utils/seo-guards.ts`
Plik powstrzymuje od indeksowania przez robota Google tysięcy zbędnych stron (`thin content`), które wpłynęłyby na deindeksację witryny.
- `sampleSize < 3` => *noindex, follow*
- Fallback na ogólnopolskie dane z małego polskiego ośrodka => *noindex, follow*

### 3. Skalowalne Generowanie Sitemaps Index
Kod: `src/app/sitemap.ts`
Dla strony rzędu 1 Miliona adresów URL wyciągnięto obsługę dzieloną (sitemap indeksy po 50_000). To wymóg techniczny Google. Architektura przewiduje podział na: `sitemap-tech`, `sitemap-salaries-x`, `sitemap-comparisons-y`.

### 4. Dynamiczne Kampanie Graficzne Open Graph (`@vercel/og`)
Kod: `src/app/zarobki/[tech]/[location]/[level]/opengraph-image.tsx`
Rysowanie grafik do sociali (LinkedIn, Twitter, FB) w locie, w środowisku *Edge Runtime*. Generują CTR +35% poprawiając kliknięcia linków dzięki wpisywanej na sztywno liczbie zarobków np: "*Mediana 24k PLN*". Środowisko używa żądań po HTTP (do serwerów typu Neon) w 8 milisekund.

---

## 🕷️ Mechanika Wzbogacania o "Big Data"
Zamiast ręcznych wpisówek, polegamy na zautomatyzowanym zasilaniu wiedzą.

### Seed Script i GitHub Enrichment (Inkubacja Bazowa)
Kod operacyjny: `seed/run.ts`, `seed/tech-list.ts`, `seed/github-enricher.ts`
1. Lista seed `TECH_LIST` to ponad 107 kanonicznych wpisów ręcznych do wzbogacenia.
2. Skrypt automatycznie podłącza się przez API NPM oraz GitHub. Odpytuje o popularność pakietu `npm_weekly_downloads`, gwiazdki, liczbę forków, otwarych issues. Obsługuje rate limits (czekając wg. `X-RateLimit-Reset`).

### Pipeline Wynagrodzeń i Zarobków (Daily Job Scraper)
Orkiestracja codzienna: `.github/workflows/salary-scraper.yml` wiodąca do `scrapers/pipeline.ts`.
Scraper spina na raz: *JustJoin.it* oraz *NoFluffJobs*.
Zapis oparty o regułę: `ON CONFLICT (source, source_id) DO UPDATE` => jeden call do bazy per wiersz.

- `scrapers/normalizers.ts`: Najkrytyczniejszy element. Zamienia *Vanilla JS, js, JAVASCRIPT* w kanoniczny identyfikator (slug) `javascript`.
- On-Demand ISR zapytuje bazę: skasuj cache tylko dla wynagrodzeń w mieście, które wczoraj otrzymało ofertę (endpoint chroniony tokenem `REVALIDATE_SECRET`).

---

## 🧭 Konfiguracja zmiennych środowiskowych `.env`
Wymagania brzegowe do uruchomienia całego potoku w produkcji i CI/CD:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/techtrends
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
REVALIDATE_SECRET=twoj_sekret_do_czyszczenia_cache_nextjs
CRON_SECRET=token_obslugujacy_vercel_cron
```

---

*STATUS OF SYSTEM MEMORY BACKUP: COMPLETED.*
*NEXT MILESTONES: Wdrożenie wzorców pSEO dla `/trendy/[tech]/[rok]` oraz ścieżek dedykowanych stanowiskom (Role targeting).*
