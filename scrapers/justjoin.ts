import { db } from '../src/lib/db'
import { normalizeTech, normalizeLocation, normalizeLevel } from './normalizers'

const JJ_API = 'https://justjoin.it/api/offers'
const DELAY_MS = 2000

export async function scrapeJustJoin(options: { techFilter?: string[] } = {}) {
  let inserted = 0, skipped = 0, errors = 0
  
  try {
    const res = await fetch(JJ_API)
    const offers = await res.json()
    
    for (const offer of offers) {
      const techSlug = extractTechSlug(offer, options.techFilter)
      const locationSlug = normalizeLocation(offer.city, offer.remote)
      const levelSlug = normalizeLevel(offer.experience_level)
      const salary = extractSalary(offer)
      
      if (!techSlug || !locationSlug || !levelSlug || !salary) {
        skipped++
        continue
      }
      
      await db.insertInto('salary_offers').values({
        tech_slug: techSlug,
        location_slug: locationSlug,
        level_slug: levelSlug,
        salary_min: salary.min,
        salary_max: salary.max,
        contract: salary.contract,
        source: 'justjoin',
        source_id: offer.id,
        scraped_at: new Date()
      }).onConflict((oc: any) => oc.columns(['source', 'source_id']).doUpdateSet({
        salary_min: db.ref('excluded.salary_min'),
        salary_max: db.ref('excluded.salary_max'),
        scraped_at: db.ref('excluded.scraped_at')
      })).execute()
      
      inserted++
      await new Promise(r => setTimeout(r, 10))
    }
  } catch (err) {
    console.error('[JustJoin] Fatal error:', err)
    errors++
  }
  
  return { inserted, skipped, errors }
}

function extractTechSlug(offer: any, filter?: string[]): string | null {
  const candidates = [offer.marker_icon, ...offer.skills.map((s: any) => s.name)]
  for (const c of candidates) {
    const s = normalizeTech(c)
    if (s && (!filter || filter.includes(s))) return s
  }
  return null
}

function extractSalary(offer: any) {
  const b2b = offer.employment_types.find((e: any) => e.type === 'b2b' && e.salary?.currency === 'pln')
  const uop = offer.employment_types.find((e: any) => e.type === 'permanent' && e.salary?.currency === 'pln')
  const s = b2b?.salary || uop?.salary
  if (!s) return null
  return { min: s.from, max: s.to, contract: b2b ? (uop ? 'both' : 'b2b') : 'uop' }
}
