/**
 * lib/data/trends.ts
 *
 * Dane trendów popularności technologii.
 * Źródła:
 *   - trend_snapshots (własna baza, kwartalne)
 *   - GitHub API stars/forks (historyczne przez scraper)
 *   - npm download stats
 *
 * Kluczowy insight: "trendy" to nie tylko liczby ale NARRACJA.
 * Każda strona ma summary.headline — zdanie które opisuje rok.
 * Google chętniej wyświetla strony z konkretnym wnioskiem
 * niż suche tabele danych.
 */

import { db }    from '@/lib/db'
import { cache } from 'react'
import { sql }   from 'kysely'

export type QuarterPoint = {
  quarter:     number
  gh_stars:    number
  npm_dls:     number
  so_questions:number
  // Zmiana QoQ (quarter-over-quarter) w %
  gh_delta_pct:    number | null
  npm_delta_pct:   number | null
}

export type YearSummary = {
  gh_stars_start:  number
  gh_stars_end:    number
  gh_stars_delta:  number    // absolutna zmiana
  gh_growth_pct:   number    // procentowa zmiana r/r
  npm_dls_q4:      number    // downloads w Q4 (peak sezonu)
  npm_dls_yearly:  number    // suma wszystkich kwartałów
  peak_quarter:    number    // który kwartał był najlepszy
  headline:        string    // "Python urósł o 34% w 2024"
  sentiment:       'rising' | 'stable' | 'declining'
}

export type ComparePoint = {
  tech_slug: string
  tech_name: string
  gh_stars:  number | null
  npm_dls:   number | null
}

export type YearLink = {
  year:       number
  gh_stars:   number | null
  growth_pct: number | null
}

export type TrendData = {
  techSlug:   string
  techName:   string
  techTagline:string
  category:   string
  year:       number
  quarters:   QuarterPoint[]
  summary:    YearSummary
  // Dane z innych lat — nawigacja i porównanie
  allYears:   YearLink[]
  // Top 5 tech z tej samej kategorii do porównania
  competitors:ComparePoint[]
  // Linki do powiązanych stron
  related: Array<{
    label: string
    href:  string
    type:  'salary' | 'comparison' | 'trend'
  }>
}

// ─────────────────────────────────────────────
// Main data fetch
// ─────────────────────────────────────────────
export const getTrendData = cache(async (
  techSlug: string,
  year:     number
): Promise<TrendData | null> => {

  const tech = await fetchTechMeta(techSlug)
  if (!tech) return null

  const [quarters, allYears, competitors] = await Promise.all([
    fetchQuarters(tech.id, year),
    fetchAllYears(tech.id),
    fetchCompetitors(tech.category_id, techSlug, year),
  ])

  // Potrzebujemy min 1 kwartału danych
  if (!quarters.length) return null

  const summary  = buildSummary(quarters, allYears, year, tech.name)
  const related  = buildRelatedLinks(techSlug, year)

  return {
    techSlug,
    techName:    tech.name,
    techTagline: tech.tagline as string,
    category:    tech.category as string,
    year,
    quarters,
    summary,
    allYears,
    competitors,
    related,
  }
})

// ─────────────────────────────────────────────
// generateStaticParams helper
// ─────────────────────────────────────────────
export async function getAvailableTrends(): Promise<Array<{ tech_slug: string; year: number }>> {
  const rows = await db
    .selectFrom('trend_snapshots as ts')
    .innerJoin('technologies as t', 't.id', 'ts.tech_id')
    .select(['t.slug as tech_slug', 'ts.year'])
    .where('t.is_published', '=', true)
    .groupBy(['t.slug', 'ts.year', 't.gh_stars']) // added gh_stars to groupBy to satisfy postgres
    .orderBy('t.gh_stars', 'desc')
    .execute()

  return rows as Array<{ tech_slug: string; year: number }>
}

// ─────────────────────────────────────────────
// DB queries
// ─────────────────────────────────────────────
async function fetchTechMeta(slug: string) {
  return db
    .selectFrom('technologies as t')
    .innerJoin('categories as c', 'c.id', 't.category_id')
    .select([
      't.id', 't.slug', 't.name', 't.tagline',
      't.category_id',
      'c.name as category',
    ])
    .where('t.slug', '=', slug)
    .where('t.is_published', '=', true)
    .executeTakeFirst()
}

async function fetchQuarters(techId: string, year: number): Promise<QuarterPoint[]> {
  const rows = await db
    .selectFrom('trend_snapshots')
    .select(['quarter', 'gh_stars', 'npm_dls', 'so_questions'])
    .where('tech_id', '=', techId)
    .where('year',    '=', year)
    .orderBy('quarter', 'asc')
    .execute()

  // Oblicz delty QoQ
  return rows.map((row, i) => {
    const prev = rows[i - 1]
    return {
      quarter:      row.quarter as number,
      gh_stars:     row.gh_stars as number,
      npm_dls:      Number(row.npm_dls) as number,
      so_questions: row.so_questions as number,
      gh_delta_pct: prev
        ? calcPct(row.gh_stars as number, prev.gh_stars as number)
        : null,
      npm_delta_pct: prev
        ? calcPct(Number(row.npm_dls) as number, Number(prev.npm_dls) as number)
        : null,
    }
  })
}

async function fetchAllYears(techId: string): Promise<YearLink[]> {
  // Per year: weź Q4 (lub ostatni dostępny kwartał) jako reprezentatywny
  const rows = await sql<{
    year: number
    gh_stars: number
  }>`
    SELECT DISTINCT ON (year)
      year,
      gh_stars
    FROM trend_snapshots
    WHERE tech_id = ${techId}
    ORDER BY year, quarter DESC
  `.execute(db)

  const years = rows.rows

  return years.map((row, i) => {
    const prev = years[i - 1]
    return {
      year:       row.year,
      gh_stars:   row.gh_stars,
      growth_pct: prev ? calcPct(row.gh_stars, prev.gh_stars) : null,
    }
  })
}

async function fetchCompetitors(
  categoryId: string,
  excludeSlug: string,
  year: number
): Promise<ComparePoint[]> {
  const res = await db
    .selectFrom('technologies as t')
    .innerJoin('trend_snapshots as ts', join =>
      join.onRef('ts.tech_id', '=', 't.id')
          .on('ts.year', '=', year)
          .on('ts.quarter', '=', 4)   // Q4 jako reprezentatywny
    )
    .select([
      't.slug as tech_slug',
      't.name as tech_name',
      'ts.gh_stars',
      'ts.npm_dls',
    ])
    .where('t.category_id', '=', categoryId)
    .where('t.slug', '!=', excludeSlug)
    .where('t.is_published', '=', true)
    .orderBy('ts.gh_stars', 'desc')
    .limit(5)
    .execute();
    
    return res.map(r => ({ ...r, npm_dls: Number(r.npm_dls) }));
}

// ─────────────────────────────────────────────
// Summary builder — kluczowe dla E-E-A-T
// ─────────────────────────────────────────────
function buildSummary(
  quarters: QuarterPoint[],
  allYears:  YearLink[],
  year:      number,
  techName:  string
): YearSummary {
  const first = quarters[0]
  const last  = quarters[quarters.length - 1]

  const gh_growth_pct = first.gh_stars > 0
    ? calcPct(last.gh_stars, first.gh_stars) ?? 0
    : 0

  // Wyznacz szczytowy kwartał
  const peak = quarters.reduce((max, q) =>
    q.gh_stars > max.gh_stars ? q : max, quarters[0])

  // Sentyment: rosnący/stabilny/spadający
  let sentiment: YearSummary['sentiment'] = 'stable'
  if (gh_growth_pct > 10)  sentiment = 'rising'
  if (gh_growth_pct < -5)  sentiment = 'declining'

  // YoY zmiana (vs rok poprzedni)
  const prevYear = allYears.find(y => y.year === year - 1)
  const yoyStr   = prevYear?.growth_pct != null
    ? ` (${prevYear.growth_pct > 0 ? '+' : ''}${Math.round(prevYear.growth_pct)}% r/r)`
    : ''

  // Headline — to pojawi się w meta description i schema
  const headline = buildHeadline(techName, year, gh_growth_pct, sentiment, yoyStr)

  return {
    gh_stars_start: first.gh_stars,
    gh_stars_end:   last.gh_stars,
    gh_stars_delta: last.gh_stars - first.gh_stars,
    gh_growth_pct,
    npm_dls_q4:     last.npm_dls,
    npm_dls_yearly: quarters.reduce((s, q) => s + q.npm_dls, 0),
    peak_quarter:   peak.quarter,
    headline,
    sentiment,
  }
}

function buildHeadline(
  name:       string,
  year:       number,
  growthPct:  number,
  sentiment:  string,
  yoyStr:     string
): string {
  const currentYear = new Date().getFullYear()

  if (year === currentYear) {
    if (sentiment === 'rising')
      return `${name} rośnie w ${year} — popularność wzrosła o ${Math.round(growthPct)}% od początku roku${yoyStr}.`
    if (sentiment === 'declining')
      return `${name} traci momentum w ${year} — popularność spadła o ${Math.abs(Math.round(growthPct))}%${yoyStr}.`
    return `${name} w ${year} — stabilna popularność bez większych zmian${yoyStr}.`
  }

  // Lata historyczne
  if (sentiment === 'rising')
    return `${name} urósł o ${Math.round(growthPct)}% w ${year} — rok dynamicznego rozwoju${yoyStr}.`
  if (sentiment === 'declining')
    return `${name} w ${year} — popularność spadła o ${Math.abs(Math.round(growthPct))}%. Analiza historyczna.`
  return `${name} w ${year} — stabilny rok, dane historyczne i analiza popularności${yoyStr}.`
}

// ─────────────────────────────────────────────
// Related links — internal linking engine
// ─────────────────────────────────────────────
function buildRelatedLinks(
  techSlug: string,
  year:     number
): TrendData['related'] {
  return [
    {
      label: `Zarobki ${techSlug} developer`,
      href:  `/zarobki/${techSlug}/polska/mid`,
      type:  'salary',
    },
    {
      label: `Poprzedni rok — ${year - 1}`,
      href:  `/trendy/${techSlug}/${year - 1}`,
      type:  'trend',
    },
    {
      label: `Profil technologii`,
      href:  `/technologie/${techSlug}`,
      type:  'comparison',
    },
  ]
}

const calcPct = (current: number, base: number): number | null => {
  if (!base) return null
  return Math.round(((current - base) / base) * 100)
}
