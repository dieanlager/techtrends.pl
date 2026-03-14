import type { TrendData } from '@/lib/data/trends'
import { formatNumber } from '@/lib/utils/format'

// ═════════════════════════════════════════════
// TrendSchema — Dataset + Article + FAQ
// ═════════════════════════════════════════════
export function TrendSchema({ data, url }: { data: TrendData; url: string }) {
  const { techName, year, summary } = data

  const faqs = [
    {
      q: `Jak zmieniała się popularność ${techName} w ${year}?`,
      a: summary.headline,
    },
    {
      q: `Ile gwiazdek GitHub ma ${techName}?`,
      a: `${techName} ma ${formatNumber(summary.gh_stars_end)} gwiazdek na GitHub na koniec ${year}. W ciągu roku liczba wzrosła o ${formatNumber(summary.gh_stars_delta)} (${summary.gh_growth_pct}%).`,
    },
    {
      q: `Który kwartał ${year} był najlepszy dla ${techName}?`,
      a: `Szczytowa popularność ${techName} w ${year} przypadła na Q${summary.peak_quarter}. W tym kwartale odnotowano najwyższy wzrost aktywności na GitHub.`,
    },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':       'Article',
        '@id':         `${url}#article`,
        headline:      summary.headline,
        description:   `Analiza popularności ${techName} w ${year} — dane GitHub, npm i Stack Overflow.`,
        url,
        inLanguage:    'pl',
        datePublished: `${year}-12-31`,
        dateModified:  new Date().toISOString().split('T')[0],
        author:        { '@type': 'Organization', name: 'TechTrends.pl' },
        publisher:     { '@type': 'Organization', name: 'TechTrends.pl', url: 'https://techtrends.pl' },
      },
      {
        // Dataset — Google może pokazać rich result dla danych
        '@type':       'Dataset',
        '@id':         `${url}#dataset`,
        name:          `Popularność ${techName} w ${year} — dane kwartalne`,
        description:   `Kwartalne statystyki popularności ${techName}: GitHub Stars, npm downloads, Stack Overflow questions.`,
        url,
        creator:       { '@type': 'Organization', name: 'TechTrends.pl' },
        temporalCoverage: `${year}/${year}`,
        dateModified:  new Date().toISOString().split('T')[0],
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'GitHub Stars Q4',      value: summary.gh_stars_end },
          { '@type': 'PropertyValue', name: 'Wzrost GitHub Stars',  value: `${summary.gh_growth_pct}%` },
          { '@type': 'PropertyValue', name: 'npm Downloads Q4/tydz', value: summary.npm_dls_q4 },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id':   `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'TechTrends',  item: 'https://techtrends.pl' },
          { '@type': 'ListItem', position: 2, name: 'Trendy',      item: 'https://techtrends.pl/trendy' },
          { '@type': 'ListItem', position: 3, name: techName,      item: `https://techtrends.pl/technologie/${data.techSlug}` },
          { '@type': 'ListItem', position: 4, name: String(year),  item: url },
        ],
      },
      {
        '@type':     'FAQPage',
        '@id':       `${url}#faq`,
        mainEntity:  faqs.map(f => ({
          '@type':        'Question',
          name:           f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
