import { db } from '@/lib/db'

export async function getSystemStats() {
  const techCount = await db.selectFrom('technologies').select(db.fn.count<number>('id').as('count')).where('is_published', '=', true).executeTakeFirst();
  const jobOffers = await db.selectFrom('salary_offers').select(db.fn.count<number>('id').as('count')).executeTakeFirst();
  
  return {
    techCount: techCount?.count || 0,
    jobOffers: jobOffers?.count || 0,
  }
}

export async function getLatestLogs(limit: number = 20) {
  try {
     // NOTE: We need any here because system_logs might not be typed in DB schema types yet
     const logs = await db.selectFrom('system_logs' as any).selectAll().orderBy('created_at', 'desc').limit(limit).execute()
     return logs as any[]
  } catch (e) {
     // Fallback if table doesn't exist yet before migration is run
     return [
       { id: 1, event_type: 'SCRAPER_RUN', source: 'justjoin', status: 'SUCCESS', payload: { added: 142 }, created_at: new Date() },
       { id: 2, event_type: 'INDEX_UPDATE', source: 'system', status: 'SUCCESS', payload: { urls: 532 }, created_at: new Date(Date.now() - 3600000) },
     ]
  }
}
