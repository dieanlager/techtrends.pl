import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Polityka Prywatności | TechTrends.pl',
  description: 'Zasady przetwarzania danych, cookies i RODO w serwisie TechTrends.pl',
  alternates: {
    canonical: 'https://techtrends.pl/polityka-prywatnosci',
  },
}

export default function PrivacyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Polityka Prywatności',
    description: metadata.description,
    url: 'https://techtrends.pl/polityka-prywatnosci'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-3xl mx-auto py-20 px-6 prose dark:prose-invert">
        <h1 className="text-4xl font-extrabold mb-6" style={{ fontFamily: 'var(--font-sans)', color: 'var(--fg-main)' }}>Polityka Prywatności</h1>

        <p className="mb-4 text-lg">Prywatność użytkowników jest dla nas sprawą nadrzędną (zgodnie z RODO).</p>

        <section className="mb-6 border-b pb-4 border-[var(--border-color)]">
          <h2 className="text-2xl font-bold mb-4 text-[var(--fg-main)]">Gromadzenie Osobistych Danych</h2>
          <p className="mb-2">Serwis jest darmowy, otwarty i nie nakłada wymogu rejestracji ani podawania danych personalnych (takich jak e-mail czy imię).</p>
        </section>

        <section className="mb-6 border-b pb-4 border-[var(--border-color)]">
          <h2 className="text-2xl font-bold mb-4 text-[var(--fg-main)]">Analityka i Cookies</h2>
          <p className="mb-2">Nasza analityka (np. Google Analytics 4) gromadzi wyłącznie dane zdepersonalizowane za pomocą zaufanych mechanizmów Cookie zgodnie z regulacjami UE.</p>
          <ul className="list-disc pl-6 space-y-2 text-[var(--fg-main)]">
            <li>Nie śledzimy unikalnych wzorców użytkowników w ramach sprzedaży i wymiany (ads).</li>
            <li>Utrzymujemy platformę przy wsparciu modelów powiązanych – Afiliacji (np. platform edukacyjnych), na wyznaczonych zasadach. Przejście z naszego środowiska do podmiotu trzeciego egzekwuje osobną weryfikację.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[var(--fg-main)]">Kontakt z nami / Administrator Danych</h2>
          <p className="mb-2">Zastrzegamy sobie prawo do modyfikacji ze względu na zmiany ustawowe. Wszelkie dyspozycje kierować na: <strong>prywatnosc@techtrends.pl</strong>.</p>
        </section>

        <p className="text-sm border-l-4 border-[var(--accent)] pl-4 py-2 text-[var(--fg-muted)]" style={{ backgroundColor: 'var(--border-color)' }}>
          Aktualizowano: {new Date().toLocaleDateString('pl-PL')} 
        </p>
      </div>
    </>
  )
}
