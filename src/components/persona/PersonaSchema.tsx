import type { PersonaData } from '@/lib/data/personas'

export function PersonaSchema({ data, url }: { data: PersonaData; url: string }) {
  const { techName, roleName, roadmap, courses, headline } = data
  const year = new Date().getFullYear()

  const faqs = [
    { q: `Jak nauczyć się ${techName} jako ${roleName}?`, a: headline },
    { q: `Ile czasu zajmuje nauka ${techName}?`, a: `Zależnie od etapu: ${roadmap.map(s => `${s.title} — ${s.duration}`).join('; ')}.` },
    { q: `Jakie kursy ${techName} są polecane dla ${roleName}?`, a: courses.length > 0 ? `Polecamy: ${courses.slice(0, 2).map(c => `"${c.title}" (${c.platform})`).join(', ')}.` : `Sprawdź oficjalną dokumentację ${techName}.` },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':     'WebPage',
        '@id':       `${url}#webpage`,
        url,
        name:        `${techName} dla ${roleName} — roadmapa i kursy [${year}]`,
        description: headline,
        inLanguage:  'pl',
        breadcrumb:  { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id':   `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'TechTrends',  item: 'https://techtrends.pl' },
          { '@type': 'ListItem', position: 2, name: 'Dla kogo',    item: 'https://techtrends.pl/dla' },
          { '@type': 'ListItem', position: 3, name: roleName,      item: `https://techtrends.pl/dla/${data.roleSlug}` },
          { '@type': 'ListItem', position: 4, name: techName,      item: url },
        ],
      },
      // LearningResource — Google może pokazać rich result dla ścieżek nauki
      {
        '@type':           'LearningResource',
        '@id':             `${url}#learning`,
        name:              `${techName} dla ${roleName} — roadmapa nauki`,
        description:       headline,
        url,
        inLanguage:        'pl',
        educationalLevel:  'beginner to advanced',
        teaches:           techName,
        timeRequired:      `P${roadmap.reduce((acc, s) => acc + 6, 0)}W`,  // szacunkowe tygodnie
        author:            { '@type': 'Organization', name: 'TechTrends.pl' },
      },
      // HowTo — roadmapa jako kroki
      {
        '@type':      'HowTo',
        '@id':        `${url}#howto`,
        name:         `Jak nauczyć się ${techName} jako ${roleName}`,
        description:  headline,
        totalTime:    `P${roadmap.length * 6}W`,
        step:         roadmap.map((s, i) => ({
          '@type':    'HowToStep',
          position:   i + 1,
          name:       s.title,
          text:       `${s.description} Tematy: ${s.topics.join(', ')}. Czas: ${s.duration}.`,
        })),
      },
      // Kursy jako ItemList
      ...(courses.length > 0 ? [{
        '@type':    'ItemList',
        '@id':      `${url}#courses`,
        name:       `Kursy ${techName} dla ${roleName}`,
        numberOfItems: courses.length,
        itemListElement: courses.map((c, i) => ({
          '@type':    'ListItem',
          position:   i + 1,
          name:       c.title,
          url:        c.url,
          description: `${c.title} — ${c.instructor} na ${c.platform}`,
        })),
      }] : []),
      {
        '@type':    'FAQPage',
        '@id':      `${url}#faq`,
        mainEntity: faqs.map(f => ({
          '@type':        'Question',
          name:           f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ].filter(Boolean),
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
