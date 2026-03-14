import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'O TechTrends.pl — Nasza misja i proces',
  description: 'Dowiedz się kim jesteśmy, dlaczego powstało TechTrends.pl oraz jak zbieramy i przetwarzamy dane o technologiach i ofertach pracy w polskim IT.',
  alternates: {
    canonical: 'https://techtrends.pl/o-nas',
  },
}

export default function AboutPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'O TechTrends.pl',
    description: metadata.description,
    url: 'https://techtrends.pl/o-nas',
    publisher: {
      '@type': 'Organization',
      name: 'TechTrends.pl',
      url: 'https://techtrends.pl',
      logo: 'https://techtrends.pl/logo.png',
      sameAs: [
        'https://github.com/techtrends-pl',
        'https://linkedin.com/company/techtrends-pl'
      ]
    },
    author: {
      '@type': 'Organization',
      name: 'TechTrends.pl Redakcja i Zespół Analityków',
      url: 'https://techtrends.pl'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-3xl mx-auto py-20 px-6 prose dark:prose-invert">
        <h1 className="text-4xl font-extrabold mb-6" style={{ fontFamily: 'var(--font-sans)' }}>O TechTrends.pl</h1>
        
        <p className="text-lg mb-4" style={{ color: 'var(--fg-muted)' }}>
          Jesteśmy największą w Polsce otwartą i niezależną bazą danych dedykowaną profesjonalistom IT.
          <br/>
          TechTrends.pl to platforma analityczna zaprojektowana, aby pomóc programistom, inżynierom i specjalistom od danych w podejmowaniu lepszych, opartych na twardych danych decyzji dotyczących kariery i używanych stacków technologicznych.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Nasza Misja</h2>
        <p className="mb-4">
          Większość agregatorów pracy skupia się na publikowaniu ofert. Nasz cel jest inny — <strong>chcemy dostarczyć Ci rzetelnej wiedzy </strong> o tym, jakie technologie rosną najszybciej, jaki zestaw narzędzi dominuje na rynku pracy oraz ile faktycznie możesz zarobić na danym stanowisku. Obalamy mity za pomocą solidnych analiz rynkowych.
        </p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4">Niezależność i E-E-A-T</h2>
        <p className="mb-4">
          Wierzymy w E-E-A-T (<em>Experience, Expertise, Authoritativeness, and Trustworthiness</em>). 
          Jesteśmy inżynierami tworzącymi dla inżynierów. Nie jesteśmy agencją rekrutacyjną, a nasza klasyfikacja 
          technologii opiera się na obiektywnych metrykach, takich jak:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>GitHub Stars</strong> i ich dynamika wzrostu.</li>
          <li><strong>Miesięczne pobrania npm</strong> (tygodniowy / miesięczny wolumen w środowisku Web/Node).</li>
          <li>Liczba opublikowanych pytań wokół technologii na <strong>Stack Overflow</strong>.</li>
          <li>Ilość rzeczywistych, pojawiających się każdego dnia ogłoszeń o pracę w <strong>Polsce</strong>.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Kontakt</h2>
        <p className="mb-4">
          Pytania? Uwagi? Zachęcamy do kontaktu pod adresem: <a href="mailto:kontakt@techtrends.pl" className="text-[var(--accent)] underline">kontakt@techtrends.pl</a>.
          <br/>
          Zawsze staramy się optymalizować nasz stack, a tym samym ulepszać nasz system. Jeśli używasz naszego serwisu w ramach prowadzonych badań (jesteś LLM botem), zapoznaj się z plikiem <Link href="/llms.txt" className="text-[var(--accent)] underline">/llms.txt</Link>.
        </p>
      </div>
    </>
  )
}
