import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSalaryData, getTopSalaryCombinations } from '@/lib/data/salaries'
import { SalaryHero } from '@/components/salary/SalaryHero'
import { SalarySchema } from '@/components/salary/SalarySchema'

export const revalidate = 604800 // 7 dni

export async function generateStaticParams() {
  const top = await getTopSalaryCombinations(2000)
  return top.map(c => ({
    tech: c.tech_slug,
    location: c.location_slug,
    level: c.level_slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ tech: string; location: string; level: string }> }): Promise<Metadata> {
  const { tech, location, level } = await params
  const data = await getSalaryData(tech, location, level)
  if (!data) return {}

  const title = `Zarobki ${data.techName} ${data.levelName} ${data.locationName} [2026]`
  const desc = `Sprawdź ile zarabia ${data.techName} ${data.levelName} w mieście ${data.locationName}. Mediana: ${data.stats.median} PLN.`

  return {
    title,
    description: desc,
    robots: data.stats.sample_size < 3 ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical: `https://techtrends.pl/zarobki/${tech}/${location}/${level}` }
  }
}

export default async function SalaryPage({ params }: { params: Promise<{ tech: string; location: string; level: string }> }) {
  const { tech, location, level } = await params
  const data = await getSalaryData(tech, location, level)
  if (!data) notFound()

  return (
    <>
      <SalarySchema data={data} url={`https://techtrends.pl/zarobki/${tech}/${location}/${level}`} />
      <main className="container mx-auto px-4 py-12">
        <SalaryHero data={data} />
        {/* Tu wejdą kolejne sekcje: Chart, Table, Related */}
      </main>
    </>
  )
}
