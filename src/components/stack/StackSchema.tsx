import type { StackRecipe } from '@/lib/data/stack-details'

export function StackSchema({ data, url }: { data: StackRecipe; url: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Technologie w stacku: ${data.title}`,
    description: data.description,
    url: url,
    itemListElement: data.technologies.map((tech, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tech.name,
        applicationCategory: tech.role,
        url: `https://techtrends.pl/technologie/${tech.slug}`
      }
    })),
    // Additional HowTo Schema indicating how to build this stack
    mainEntityOfPage: {
      '@type': 'HowTo',
      name: `Jak zbudować ${data.title}`,
      description: `Dokumentacja łączenia ${data.technologies.map(t=>t.name).join(', ')}.`,
      step: data.technologies.map((tech, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: `Krok ${idx + 1}: Konfiguracja ${tech.name}`,
        text: `Ustaw ${tech.name} jako ${tech.role} w swoim projekcie.`,
      }))
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
