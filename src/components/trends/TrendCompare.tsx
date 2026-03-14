import Link from 'next/link'
import { formatNumber } from '@/lib/utils/format'
import type { TrendData } from '@/lib/data/trends'

// ═════════════════════════════════════════════
// TrendCompare — bar chart vs konkurenci
// ═════════════════════════════════════════════
export function TrendCompare({ data }: { data: TrendData }) {
  const { competitors, techName, techSlug, year, quarters } = data
  if (!competitors.length) return null

  // Dodaj bieżącą tech do porównania
  const lastQ = quarters[quarters.length - 1]
  const allTechs = [
    { tech_slug: techSlug, tech_name: techName, gh_stars: lastQ.gh_stars, npm_dls: lastQ.npm_dls },
    ...competitors,
  ].sort((a, b) => (b.gh_stars ?? 0) - (a.gh_stars ?? 0))

  const maxStars = Math.max(...allTechs.map(t => t.gh_stars ?? 0))

  return (
    <section className="tr-compare">
      <h2>Popularność w kategorii — {year}</h2>
      <p className="tr-compare__lead">
        GitHub Stars Q4 {year} — {techName} na tle technologii z tej samej kategorii:
      </p>

      <ul className="tr-compare__list" role="list">
        {allTechs.map(t => {
          const pct = maxStars > 0 ? (t.gh_stars ?? 0) / maxStars * 100 : 0
          const isActive = t.tech_slug === techSlug

          return (
            <li key={t.tech_slug} className={`tr-bar ${isActive ? 'tr-bar--active' : ''}`}>
              <Link href={`/trendy/${t.tech_slug}/${year}`} className="tr-bar__name">
                {t.tech_name}
              </Link>
              <div className="tr-bar__track">
                <div
                  className="tr-bar__fill"
                  style={{ width: `${pct.toFixed(1)}%` }}
                  role="progressbar"
                  aria-valuenow={t.gh_stars ?? 0}
                  aria-valuemax={maxStars}
                  aria-label={`${t.tech_name}: ${formatNumber(t.gh_stars ?? 0)} stars`}
                />
              </div>
              <span className="tr-bar__value mono">
                {formatNumber(t.gh_stars ?? 0)}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
