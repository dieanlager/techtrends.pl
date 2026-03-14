import { formatNumber } from '@/lib/utils/format'
import type { TrendData, QuarterPoint } from '@/lib/data/trends'

// ═════════════════════════════════════════════
// TrendInsights — narracja Q1-Q4
// ═════════════════════════════════════════════
export function TrendInsights({ data }: { data: TrendData }) {
  const { quarters, techName, year, summary } = data

  // Generuj wnioski automatycznie na podstawie danych
  // (w docelowej wersji: LLM-generated per year)
  const insights = buildInsights(quarters, techName, year, summary)

  return (
    <section className="tr-insights">
      <h2>{techName} w {year} — analiza kwartalna</h2>
      <div className="tr-insights__grid">
        {insights.map((ins, i) => (
          <div key={i} className="tr-insight">
            <div className="tr-insight__quarter">Q{ins.quarter} {year}</div>
            <div className="tr-insight__text">{ins.text}</div>
            {ins.highlight && (
              <div className="tr-insight__highlight">{ins.highlight}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function buildInsights(
  quarters: QuarterPoint[],
  name:     string,
  year:     number,
  summary:  TrendData['summary']
) {
  return quarters.map(q => {
    const delta = q.gh_delta_pct
    let text: string
    let highlight: string | null = null

    if (delta === null) {
      text = `Pierwsze dane dostępne dla ${name} w ${year}. GitHub: ${formatNumber(q.gh_stars)} stars.`
    } else if (delta > 15) {
      text = `Dynamiczny wzrost popularności ${name} — ${delta}% więcej gwiazdek niż w poprzednim kwartale.`
      highlight = 'Najlepszy kwartał roku'
    } else if (delta > 5) {
      text = `Solidny wzrost ${name}: +${delta}% QoQ. npm downloads: ${formatNumber(q.npm_dls)}/tydzień.`
    } else if (delta > -5) {
      text = `Stabilny kwartał dla ${name}. GitHub Stars: ${formatNumber(q.gh_stars)}, praktycznie bez zmian.`
    } else {
      text = `Korekta popularności ${name} — ${Math.abs(delta)}% mniej aktywności na GitHub.`
    }

    if (q.quarter === summary.peak_quarter) {
      highlight = 'Szczytowy kwartał roku'
    }

    return { quarter: q.quarter, text, highlight }
  })
}
