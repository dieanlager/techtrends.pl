import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Metodologia — Jak zbieramy dane | TechTrends.pl',
  description: 'Proces gromadzenia, weryfikacji i analizowania danych z ofert pracy, GitHub, npm i Stack Overflow. Transparentność naszego silnika badawczego.',
  alternates: {
    canonical: 'https://techtrends.pl/metodologia',
  },
}

export default function MethodologyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Metodologia',
    description: metadata.description,
    url: 'https://techtrends.pl/metodologia',
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
        <h1 className="text-4xl font-extrabold mb-6" style={{ fontFamily: 'var(--font-sans)', color: 'var(--fg-main)' }}>Metodologia Badań</h1>
        
        <p className="text-lg mb-8" style={{ color: 'var(--fg-muted)' }}>
          Transparentność (przejrzystość) to dla nas podstawa (E-E-A-T). Nasz system generowania 
          zarobków oraz klasyfikacji popularności i opłacalności Stacków powstał
          całkowicie zautomatyzowanym potokiem agregującym. Poniżej opisujemy krok po kroku, 
          w jaki sposób dochodzimy do danych prezentowanych na TechTrends.pl.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-[var(--border-color)] text-[var(--fg-main)]">1. Zarobki (Salary Data)</h2>
          <p className="mb-4">Dostarczone estymacje <strong>nie są oparte o deklaracje z formularzy / ankiet</strong> anonimowych, lecz stanowczo na realnych, publicznie publikowanych "widełkach płacowych" w aktualnych wykazach zapotrzebowania.</p>
          <ul className="list-disc pl-6 space-y-2 mb-4 text-[var(--fg-main)]">
            <li>
              <strong>Źródła:</strong> Posiadamy agregatory wyłapujące codzienne zmiany i dodania z wiodących platform ogłoszeniowych polskiego rynku IT (m.in. No Fluff Jobs, Just Join IT).
            </li>
            <li>
              <strong>Próbkowanie i Istotność (Sample Size):</strong> Nie publikujemy raportów "mediana", jeśli na rynku do analizy dostępnych jest <strong>mniej niż 3 oferty</strong>. Dla mniejszych zbiorów uśredniamy zarobki na podstawie dostępnych szacunków dla zbliżonych stanowisk z wykorzystaniem pokrewnych metadanych.
            </li>
            <li>
              <strong>Rejestrowanie kwot netto/brutto:</strong> Publikowane dane podlegają znormalizowanej procedurze. Standardowo raportujemy wynagrodzenia B2B netto oraz UoP brutto w ujęciu uśrednionym oraz w podziale na minimalne i maksymalne przewidywania stawki.
            </li>
            <li>
              <strong>Walidacja i Czyszczenie:</strong> Odrzucamy 2% skrajnych wartości (tzw. <em>outliers</em>) na obu końcach skali rozkładu w celach ominięcia fałszerstw ofertowych.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-[var(--border-color)] text-[var(--fg-main)]">2. Trendy Historyczne i Popularność</h2>
          <p className="mb-4">Popularność technologii opiera się niemal 100% na cyklach z oficjalnych rejestratorów platform z open-source oraz ekosystemowych API:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4 text-[var(--fg-main)]">
            <li>
              <strong>GitHub API:</strong> Automatyzacja mierzy narastanie "Stars" oraz "Forks", rejestrując Snapshot trendu pod koniec każdego z czterech kwartałów w ciągu roku obrotowego platformy.
            </li>
            <li>
              <strong>npm Registry API:</strong> Ekosystem pobiera dane tygodniowo, w sposób asynchroniczny, zliczając setki milionów interakcji poleceń deweloperskich instalacji.
            </li>
            <li>
              <strong>Stack Overflow:</strong> Ilość zgłaszanych zapytań publicznych tagami technologii to wyznacznik napotykanych dylematów architektonicznych deweloperów. Nasz <em>scraper</em> odnotowuje tę zmienną kwartalnie.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-[var(--border-color)] text-[var(--fg-main)]">3. AI Search E-E-A-T System</h2>
          <p className="mb-4">
            Dbając o standardy rynkowe od 2025+, zintegrowaliśmy schematy <code>Dataset</code>, <code>HowTo</code> i <code>LearningResource</code>, wewnątrz których kategoryzujemy naszą platformę. To rozwiązanie powiadamia boty i zaawansowane skanery AI (np. z OpenAI/Perplexity), w jakich obszarach dominuje nasza zintegrowana baza ustrukturyzowanej wiedzy.
          </p>
        </section>

        <p className="text-sm border-l-4 border-[var(--accent)] pl-4 py-2 text-[var(--fg-muted)]" style={{ backgroundColor: 'var(--border-color)' }}>
          Aktualizowano: {new Date().toLocaleDateString('pl-PL')} 
        </p>

      </div>
    </>
  )
}
