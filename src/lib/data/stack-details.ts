import { db } from '@/lib/db'
import { cache } from 'react'

export type StackRecipe = {
  slug: string
  title: string
  description: string
  technologies: Array<{
    slug: string
    name: string
    role: string
  }>
  tco: {
    hosting: number
    database: number
    auth: number
    total: number
    freeTierAvailable: boolean
  }
  courses: Array<{
    title: string
    platform: string
    url: string
    instructor: string
  }>
}

const STATIC_STACKS: Record<string, Partial<StackRecipe>> = {
  'startup-mvp-2026': {
    title: 'Idealny Stack pod SaaS MVP w 2026',
    description: 'Błyskawiczny time-to-market. Zero opłat na start dzięki potężnym free tierom.',
    tco: { hosting: 0, database: 0, auth: 0, total: 0, freeTierAvailable: true },
    courses: [
      { title: 'The Ultimate Next.js Fullstack SaaS', platform: 'Udemy', url: '#', instructor: 'TechTrends' }
    ]
  },
  'high-performance-fintech': {
    title: 'High-Performance Fintech Stack',
    description: 'Bezpieczeństwo, typowanie statyczne i bezkompromisowa wydajność.',
    tco: { hosting: 50, database: 100, auth: 0, total: 150, freeTierAvailable: false },
    courses: [
      { title: 'Rust Backend Development', platform: 'Coursera', url: '#', instructor: 'Fintech Pro' }
    ]
  }
}

export const getStackData = cache(async (slug: string): Promise<StackRecipe | null> => {
  const stack = await db.selectFrom('stacks').selectAll().where('slug', '=', slug).executeTakeFirst()
  
  if (!stack) return null
  
  const techSlugs = stack.tech_slugs as string[]
  
  const techs = await db.selectFrom('technologies').select(['slug', 'name', 'category_id']).where('slug', 'in', techSlugs).execute()
  
  const staticData = STATIC_STACKS[slug] || {}
  
  return {
    slug,
    title: staticData.title || stack.title as string,
    description: staticData.description || 'Kompletny ekosystem',
    technologies: techs.map(t => ({ slug: t.slug as string, name: t.name as string, role: t.category_id as string })),
    tco: staticData.tco || { hosting: 0, database: 0, auth: 0, total: 0, freeTierAvailable: true },
    courses: staticData.courses || [],
  }
})

export async function getAllStacks() {
  const rows = await db.selectFrom('stacks').select('slug').where('is_published', '=', true).execute()
  return rows.map(r => r.slug as string)
}
