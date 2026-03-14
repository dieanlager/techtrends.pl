import { scrapeJustJoin } from './justjoin'
import { scrapeNoFluffJobs } from './nofluff'
import { db } from '../src/lib/db'

async function runPipeline() {
  console.log('🚀 Starting Salary Pipeline...')
  
  const jj = await scrapeJustJoin()
  console.log(`[JustJoin] Done: +${jj.inserted}, skipped ${jj.skipped}`)
  
  const nfj = await scrapeNoFluffJobs()
  console.log(`[NoFluff] Done: +${nfj.inserted}, skipped ${nfj.skipped}`)
  
  console.log('📊 Aggregating stats...')
  // Symulacja wywołania procedury SQL
  // await db.executeQuery(db.sql`SELECT aggregate_salary_stats()`.compile(db))
  
  console.log('✅ Pipeline finished.')
  process.exit(0)
}

runPipeline().catch(err => {
  console.error('Pipeline crashed:', err)
  process.exit(1)
})
