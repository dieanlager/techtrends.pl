import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getStackData, getAllStacks } from '@/lib/data/stack-details'
import { StackHero } from '@/components/stack/StackHero'
import { StackMatrix } from '@/components/stack/StackMatrix'
import { StackTCO } from '@/components/stack/StackTCO'
import { StackAffiliate } from '@/components/stack/StackAffiliate'
import { StackSchema } from '@/components/stack/StackSchema'
import '@/styles/persona.css' // Reuse the persona styles or generic globals for layout spacing
import '@/styles/globals.css'

export const revalidate = 604_800 // Tydzień

export async function generateStaticParams() {
  const slugs = await getAllStacks()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const data = await getStackData(slug)
  if (!data) return {}

  const title = `${data.title} — Przegląd i Mapa Drogowa Architektury [${new Date().getFullYear()}]`
  const desc = data.description
  const canonical = `https://techtrends.pl/stack/${slug}`

  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title,
      description: desc,
      type: 'article',
      url: canonical,
    },
  }
}

export default async function StackPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const data = await getStackData(slug)
  
  if (!data) notFound()

  const url = `https://techtrends.pl/stack/${slug}`

  return (
    <>
      <StackSchema data={data} url={url} />
      <main className="persona-page min-h-screen">
        <StackHero data={data} />
        <StackMatrix data={data} />
        <StackTCO data={data} />
        <StackAffiliate data={data} />
      </main>
    </>
  )
}
