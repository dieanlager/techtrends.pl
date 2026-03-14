import type { SalaryData } from '@/lib/data/salaries'

export function SalarySchema({ data, url }: { data: SalaryData; url: string }) {
  const { techName, locationName, levelName, stats } = data
  const year = 2026

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    'name': `Zarobki ${techName} ${levelName} ${locationName} ${year}`,
    'description': `Statystyki wynagrodzeń ${techName} developera (${levelName}) w lokalizacji ${locationName}`,
    'url': url,
    'variableMeasured': [
      { '@type': 'PropertyValue', 'name': 'Mediana', 'value': stats.median },
      { '@type': 'PropertyValue', 'name': 'Próbka', 'value': stats.sample_size }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
