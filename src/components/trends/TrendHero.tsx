import Link          from 'next/link'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { TrendData } from '@/lib/data/trends'
import { formatNumber } from '@/lib/utils/format'

export function TrendHero({ data }: { data: TrendData }) {
  const { techName, techTagline, year, summary, allYears, techSlug } = data

  const SentimentIcon = summary.sentiment === 'rising'   ? TrendingUp
    : summary.sentiment === 'declining' ? TrendingDown
    : Minus

  const sentimentLabel = {
    rising:   'Rosnąca popularność',
    stable:   'Stabilna popularność',
    declining:'Malejąca popularność',
  }[summary.sentiment]

  return (
    <header className="tr-hero">
      {/* Breadcrumb */}
      <nav aria-label="Nawigacja okruszkowa" className="tr-bc">
        <ol>
          <li><Link href="/">TechTrends</Link></li>
          <li><Link href="/trendy">Trendy</Link></li>
          <li><Link href={`/technologie/${techSlug}`}>{techName}</Link></li>
          <li aria-current="page">{year}</li>
        </ol>
      </nav>

      <div className="tr-hero__body">
        <div className="tr-hero__left">
          {/* Sentiment badge */}
          <span className={`tr-badge tr-badge--${summary.sentiment}`}>
            <SentimentIcon size={13} aria-hidden />
            {sentimentLabel}
          </span>

          <h1>
            Popularność {techName}
            <span className="tr-hero__year"> w {year}</span>
          </h1>

          {/* Headline — kluczowe zdanie SEO */}
          <p className="tr-hero__headline">{summary.headline}</p>
          <p className="tr-hero__tagline">{techTagline}</p>

          {/* Year navigator */}
          <div className="tr-year-nav" aria-label="Nawigacja po latach">
            {allYears.map(y => (
              <Link
                key={y.year}
                href={`/trendy/${techSlug}/${y.year}`}
                className={`tr-year-link ${y.year === year ? 'tr-year-link--active' : ''}`}
                aria-current={y.year === year ? 'page' : undefined}
              >
                {y.year}
                {y.growth_pct !== null && (
                  <span className={`tr-year-link__delta ${y.growth_pct >= 0 ? 'pos' : 'neg'}`}>
                    {y.growth_pct >= 0 ? '+' : ''}{y.growth_pct}%
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <aside className="tr-hero__metrics">
          <MetricCard
            label={`GitHub Stars (Q4 ${year})`}
            value={formatNumber(summary.gh_stars_end)}
            delta={summary.gh_growth_pct}
            suffix="vs Q1"
            mono
          />
          <MetricCard
            label={`Wzrost Stars (${year})`}
            value={`+${formatNumber(summary.gh_stars_delta)}`}
            delta={null}
            mono
          />
          <MetricCard
            label="npm Downloads (Q4)"
            value={formatNumber(summary.npm_dls_q4)}
            delta={null}
            mono
          />
          <MetricCard
            label="Szczytowy kwartał"
            value={`Q${summary.peak_quarter} ${year}`}
            delta={null}
          />
        </aside>
      </div>
    </header>
  )
}

function MetricCard({ label, value, delta, suffix, mono }: {
  label:  string
  value:  string
  delta:  number | null
  suffix?: string
  mono?:  boolean
}) {
  return (
    <div className="tr-metric">
      <div className="tr-metric__label">{label}</div>
      <div className={`tr-metric__value ${mono ? 'mono' : ''}`}>{value}</div>
      {delta !== null && (
        <div className={`tr-metric__delta ${delta >= 0 ? 'pos' : 'neg'}`}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%{suffix ? ` ${suffix}` : ''}
        </div>
      )}
    </div>
  )
}
