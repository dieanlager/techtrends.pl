/**
 * app/dla/[role]/[tech]/page.tsx
 *
 * Wzorzec: /dla/fullstack-developer/nextjs
 *          /dla/data-scientist/python
 *          /dla/devops-engineer/kubernetes
 *
 * Najwyższy conversion intent — user wie czego chce i dla kogo.
 * Frazy: "python dla data scientist", "react dla frontend developera"
 * → bezpośrednie linki do kursów i ofert pracy.
 *
 * Monetyzacja:
 *   - Affiliate kursy (Udemy/Coursera/FrontendMasters) — inline sekcja
 *   - Job board deep-link z pre-filled filtrami (rola + tech)
 *
 * noindex gdy brak danych (rola+tech niszowa):
 *   < 2 kursy + < 3 oferty pracy = noindex + follow
 */

import { notFound }      from 'next/navigation'
import type { Metadata } from 'next'

import { getPersonaData, getAllPersonas } from '@/lib/data/personas'
import { PersonaHero }    from '@/components/persona/PersonaHero'
import { PersonaRoadmap } from '@/components/persona/PersonaRoadmap'
import { PersonaCourses } from '@/components/persona/PersonaCourses'
import { PersonaJobs }    from '@/components/persona/PersonaJobs'
import { PersonaStack }   from '@/components/persona/PersonaStack'
import { PersonaSchema }  from '@/components/persona/PersonaSchema'
import '@/styles/persona.css'

export const revalidate = 86_400   // 24h

export async function generateStaticParams() {
  const pairs = await getAllPersonas()
  return pairs.map(p => ({ role: p.role_slug, tech: p.tech_slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ role: string; tech: string }> }
): Promise<Metadata> {
  const { role, tech } = await params
  const data = await getPersonaData(role, tech)
  if (!data) return {}

  const { roleName, techName, headline } = data
  const year  = new Date().getFullYear()
  const title = `${techName} dla ${roleName} — roadmapa, kursy i oferty pracy [${year}]`
  const desc  = headline
  const canonical = `https://techtrends.pl/dla/${role}/${tech}`

  return {
    title,
    description: desc,
    robots: data.shouldIndex
      ? { index: true,  follow: true }
      : { index: false, follow: true },
    alternates:  { canonical },
    openGraph: {
      title, description: desc, type: 'article', url: canonical,
      // images: [{ url: `/dla/${role}/${tech}/opengraph-image`, width: 1200, height: 630 }],
    },
  }
}

export default async function PersonaPage(
  { params }: { params: Promise<{ role: string; tech: string }> }
) {
  const { role, tech } = await params
  const data = await getPersonaData(role, tech)
  if (!data) notFound()

  const url = `https://techtrends.pl/dla/${role}/${tech}`

  return (
    <>
      <PersonaSchema data={data} url={url} />
      <main className="persona-page">
        <PersonaHero    data={data} />
        <PersonaRoadmap data={data} />
        <PersonaCourses data={data} />   {/* ← affiliate */}
        <PersonaJobs    data={data} />   {/* ← job board */}
        <PersonaStack   data={data} />
      </main>
    </>
  )
}
