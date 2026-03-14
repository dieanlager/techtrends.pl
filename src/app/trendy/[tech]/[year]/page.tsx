/**
 * app/trendy/[tech]/[year]/page.tsx
 *
 * Evergreen content — strona "/trendy/python/2024" będzie
 * zbierać ruch PRZEZ LATA po tym jak rok minie.
 * Google preferuje historyczne dane nad świeżymi dla tych fraz.
 *
 * Strategia URL:
 *   /trendy/[tech]/[year]     → dane roczne (główna strona)
 *   /trendy/[tech]            → redirect → bieżący rok
 *
 * ISR: 7 dni dla bieżącego roku, 0 (static) dla lat historycznych
 */

import { notFound, redirect } from 'next/navigation'
import type { Metadata }       from 'next'
import '@/styles/trends.css'

import { getTrendData, getAvailableTrends } from '@/lib/data/trends'
import { TrendHero }     from '@/components/trends/TrendHero'
import { TrendChart }    from '@/components/trends/TrendChart'
import { TrendInsights } from '@/components/trends/TrendInsights'
import { TrendCompare }  from '@/components/trends/TrendCompare'
import { TrendRelated }  from '@/components/trends/TrendRelated'
import { TrendSchema }   from '@/components/trends/TrendSchema'

const CURRENT_YEAR = new Date().getFullYear()
const MIN_YEAR     = 2019   // pierwsze dane w bazie

export async function generateStaticParams() {
  const available = await getAvailableTrends()
  return available.map(r => ({
    tech: r.tech_slug,
    year: String(r.year),
  }))
}

// Historyczne lata = static (revalidate: false)
// Bieżący rok = ISR 7 dni (dane rosną w ciągu roku)
export function generateStaticProps() {}  // placeholder
export const revalidate = CURRENT_YEAR   // Next.js 15: dynamic per-page

export async function generateMetadata(
  { params }: { params: Promise<{ tech: string; year: string }> }
): Promise<Metadata> {
  const { tech, year } = await params
  const yearNum = parseInt(year, 10)
  if (isNaN(yearNum)) return {}

  const data = await getTrendData(tech, yearNum)
  if (!data) return {}

  const { techName, summary } = data
  const isCurrentYear = yearNum === CURRENT_YEAR
  const title = isCurrentYear
    ? `Popularność ${techName} w ${year} — trendy, statystyki i prognozy`
    : `${techName} w ${year} — jak zmieniała się popularność [dane historyczne]`

  const desc = summary.headline

  const canonical = `https://techtrends.pl/trendy/${tech}/${year}`

  return {
    title,
    description: desc,
    alternates:  { canonical },
    openGraph: {
      title, description: desc,
      type:   'article',
      url:    canonical,
      images: [{ url: `/trendy/${tech}/${year}/opengraph-image`, width: 1200, height: 630 }],
    },
  }
}

export default async function TrendPage(
  { params }: { params: Promise<{ tech: string; year: string }> }
) {
  const { tech, year } = await params
  const yearNum = parseInt(year, 10)

  // Walidacja roku
  if (isNaN(yearNum) || yearNum < MIN_YEAR || yearNum > CURRENT_YEAR + 1) {
    notFound()
  }

  // Przyszły rok bez danych → redirect do bieżącego
  if (yearNum > CURRENT_YEAR) {
    redirect(`/trendy/${tech}/${CURRENT_YEAR}`)
  }

  const data = await getTrendData(tech, yearNum)
  if (!data) notFound()

  const url = `https://techtrends.pl/trendy/${tech}/${year}`

  return (
    <>
      <TrendSchema data={data} url={url} />
      <main className="trend-page">
        <TrendHero    data={data} />
        <TrendChart   data={data} />
        <TrendInsights data={data} />
        <TrendCompare  data={data} />
        <TrendRelated  data={data} />
      </main>
    </>
  )
}
