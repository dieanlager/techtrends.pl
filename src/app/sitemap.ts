import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { sql } from 'kysely'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://techtrends.pl'

export async function generateSitemaps() {
  // Dla projektu o tej skali, dzielimy sitemap tematycznie na chunk'i wg features:
  return [
    { id: 0 }, // core + pages
    { id: 1 }, // technologie
    { id: 2 }, // trendy historyczne
    { id: 3 }, // stacki / kategorie
    // docelowo generujemy wiele chunków pod "zarobki" i "personas" np id 4-10
  ]
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  
  if (id === 0) {
    return [
      { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${BASE_URL}/technologie`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}/zarobki`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}/trendy`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}/o-nas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${BASE_URL}/metodologia`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${BASE_URL}/polityka-prywatnosci`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ]
  }

  if (id === 1) {
    const techs = await db.selectFrom('technologies').select(['slug', 'updated_at']).where('is_published', '=', true).execute()
    return techs.map(t => ({
      url: `${BASE_URL}/technologie/${t.slug}`,
      lastModified: t.updated_at as Date || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  }

  if (id === 2) {
    // Sitemaps for Trendy - joining tech to get slugs
    const trends = await db.selectFrom('trend_snapshots as ts')
      .innerJoin('technologies as t', 't.id', 'ts.tech_id')
      .select(['t.slug', 'ts.year'])
      .distinct()
      .where('t.is_published', '=', true)
      .execute();

    return trends.map(t => ({
      url: `${BASE_URL}/trendy/${t.slug}/${t.year}`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // historical trends don't change often
      priority: 0.7,
    }))
  }

  if (id === 3) {
    const stacks = await db.selectFrom('stacks').select(['slug', 'updated_at']).where('is_published', '=', true).execute()
    return stacks.map(s => ({
      url: `${BASE_URL}/stack/${s.slug}`,
      lastModified: s.updated_at as Date || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  }

  return []
}
