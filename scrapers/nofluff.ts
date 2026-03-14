import { db } from '../src/lib/db'
import { normalizeTech, normalizeLocation, normalizeLevel } from './normalizers'

const NFJ_API = 'https://nofluffjobs.com/api/search/posting'

export async function scrapeNoFluffJobs() {
  let inserted = 0, skipped = 0, errors = 0
  
  try {
    const res = await fetch(`${NFJ_API}?region=pl&pageSize=100`)
    const data = await res.json()
    const postings = data.postings || []
    
    for (const p of postings) {
      const techSlug = normalizeTech(p.technology)
      const locationSlug = normalizeLocation(p.location.places[0]?.city, p.location.fullyRemote)
      const levelSlug = normalizeLevel(p.seniority[0])
      
      if (!techSlug || !locationSlug || !levelSlug || !p.salary || p.salary.currency !== 'PLN') {
        skipped++
        continue
      }
      
      await db.insertInto('salary_offers').values({
        tech_slug: techSlug,
        location_slug: locationSlug,
        level_slug: levelSlug,
        salary_min: p.salary.from,
        salary_max: p.salary.to,
        contract: p.salary.type === 'b2b' ? 'b2b' : 'uop',
        source: 'nofluff',
        source_id: p.id,
        scraped_at: new Date()
      }).onConflict((oc: any) => oc.columns(['source', 'source_id']).doUpdateSet({
        salary_min: db.ref('excluded.salary_min'),
        salary_max: db.ref('excluded.salary_max'),
        scraped_at: db.ref('excluded.scraped_at')
      })).execute()
      
      inserted++
    }
  } catch (err) {
    console.error('[NoFluff] Fatal error:', err)
    errors++
  }
  
  return { inserted, skipped, errors }
}
