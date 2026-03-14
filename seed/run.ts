/**
 * seed/run.ts
 *
 * Główny seed script. Uruchom raz przed startem projektu.
 *
 * Kolejność:
 *   1. Upsert kategorii
 *   2. Upsert technologii z tech-list.ts (dane bazowe)
 *   3. Enrich z GitHub API (stars, forks, releases, topics)
 *   4. Enrich z npm Registry (downloads, version)
 *   5. Snapshot trend (quarter 0 dla wykresów historii)
 *   6. Raport końcowy
 *
 * Uruchomienie:
 *   npx tsx seed/run.ts
 *   npx tsx seed/run.ts --skip-github    (szybkie, bez API calls)
 *   npx tsx seed/run.ts --only react     (tylko jedna tech)
 *   npx tsx seed/run.ts --update         (aktualizuj istniejące)
 */

import { db }               from '../src/lib/db'
import { TECH_LIST }        from './tech-list'
import { bulkFetchGitHub }  from './github-enricher'
import { bulkFetchNpm }     from './npm-enricher'

// ─────────────────────────────────────────────
// CLI args
// ─────────────────────────────────────────────
const args         = process.argv.slice(2)
const SKIP_GITHUB  = args.includes('--skip-github')
const ONLY_TECH    = args.includes('--only')
  ? args[args.indexOf('--only') + 1]
  : null
const UPDATE_MODE  = args.includes('--update')

// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────
const CATEGORIES = [
  { slug: 'languages',       name: 'Języki programowania',    description: 'Języki programowania ogólnego przeznaczenia i domain-specific.', icon: '💻' },
  { slug: 'frontend',        name: 'Frameworki Frontend',     description: 'Biblioteki i frameworki JavaScript/TypeScript do budowania UI.', icon: '🌐' },
  { slug: 'meta-frameworks', name: 'Meta-frameworki',         description: 'Full-stack frameworki łączące frontend z SSR/SSG i backendem.', icon: '⚡' },
  { slug: 'css',             name: 'CSS i Styling',           description: 'Frameworki CSS, preprocessory i narzędzia do stylowania.', icon: '🎨' },
  { slug: 'backend',         name: 'Frameworki Backend',      description: 'Frameworki serwerowe do budowania API i aplikacji webowych.', icon: '🔧' },
  { slug: 'databases',       name: 'Bazy danych',             description: 'Relacyjne, NoSQL, wektorowe bazy danych i ORM.', icon: '🗄️' },
  { slug: 'devops',          name: 'DevOps i Cloud',          description: 'Konteneryzacja, orchestracja, CI/CD i monitoring.', icon: '☁️' },
  { slug: 'ai-ml',           name: 'AI i Machine Learning',   description: 'Frameworki ML, LLM API i narzędzia do budowania AI.', icon: '🤖' },
  { slug: 'tools',           name: 'Narzędzia developerskie', description: 'Build tools, runtime i narzędzia DX dla developerów.', icon: '🛠️' },
  { slug: 'testing',         name: 'Testing',                 description: 'Frameworki do testów jednostkowych, integracyjnych i e2e.', icon: '✅' },
  { slug: 'mobile',          name: 'Mobile',                  description: 'Frameworki do budowania aplikacji mobilnych.', icon: '📱' },
  { slug: 'platforms',       name: 'Platformy i SaaS',        description: 'Platformy hostingowe, payment i inne usługi SaaS dla developerów.', icon: '🚀' },
  { slug: 'cms',             name: 'CMS i Headless',          description: 'Systemy zarządzania treścią tradycyjne i headless.', icon: '📝' },
]

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  console.log('══════════════════════════════════════')
  console.log('  TechTrends — Database Seed')
  console.log(`  ${new Date().toISOString()}`)
  if (SKIP_GITHUB) console.log('  Mode: --skip-github (szybkie)')
  if (ONLY_TECH)   console.log(`  Mode: --only ${ONLY_TECH}`)
  if (UPDATE_MODE) console.log('  Mode: --update (nadpisz istniejące)')
  console.log('══════════════════════════════════════\n')

  // Filtruj tech-list jeśli --only
  const techList = ONLY_TECH
    ? TECH_LIST.filter(t => t.slug === ONLY_TECH || t.name.toLowerCase() === ONLY_TECH.toLowerCase())
    : TECH_LIST

  if (!techList.length) {
    console.error(`Nie znaleziono tech: ${ONLY_TECH}`)
    process.exit(1)
  }

  // ── STEP 1: Categories ──
  console.log(`STEP 1/5  Upsert ${CATEGORIES.length} kategorii...`)
  await upsertCategories()
  console.log('  ✓ done\n')

  // ── STEP 2: Base tech data ──
  console.log(`STEP 2/5  Upsert ${techList.length} technologii (dane bazowe)...`)
  const categoryMap = await getCategoryIdMap()
  await upsertBaseTech(techList, categoryMap)
  console.log('  ✓ done\n')

  // ── STEP 3: GitHub enrichment ──
  if (!SKIP_GITHUB) {
    const ghRepos = techList
      .filter(t => t.github)
      .map(t => t.github!)

    console.log(`STEP 3/5  GitHub API enrichment (${ghRepos.length} repos)...`)
    const ghData = await bulkFetchGitHub(ghRepos)
    await applyGitHubData(techList, ghData)
    console.log(`  ✓ ${ghData.size}/${ghRepos.length} enriched\n`)
  } else {
    console.log('STEP 3/5  GitHub enrichment skipped (--skip-github)\n')
  }

  // ── STEP 4: npm enrichment ──
  const npmPackages = techList.filter(t => t.npm).map(t => t.npm!)
  console.log(`STEP 4/5  npm Registry enrichment (${npmPackages.length} packages)...`)
  const npmData = await bulkFetchNpm(npmPackages)
  await applyNpmData(techList, npmData)
  console.log(`  ✓ ${npmData.size}/${npmPackages.length} enriched\n`)

  // ── STEP 5: Initial trend snapshot ──
  console.log('STEP 5/5  Zapisuję snapshot trendów (Q0)...')
  await saveTrendSnapshot()
  console.log('  ✓ done\n')

  // ── Report ──
  await printReport()

  console.log('\n✅ Seed complete!')
  process.exit(0)
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
async function upsertCategories() {
  for (const cat of CATEGORIES) {
    await db
      .insertInto('categories')
      .values({
        slug:        cat.slug,
        name:        cat.name,
        description: cat.description,
        icon:        cat.icon,
        updated_at:  new Date(),
      })
      .onConflict((oc: any) =>
        UPDATE_MODE
          ? oc.column('slug').doUpdateSet({ name: (eb: any) => eb.ref('excluded.name'), description: (eb: any) => eb.ref('excluded.description') })
          : oc.column('slug').doNothing()
      )
      .execute()
  }
}

async function getCategoryIdMap(): Promise<Map<string, string>> {
  const cats = await db.selectFrom('categories').select(['id', 'slug']).execute()
  return new Map(cats.map((c: any) => [c.slug, c.id as string]))
}

async function upsertBaseTech(
  techList: typeof TECH_LIST,
  categoryMap: Map<string, string>
) {
  for (const tech of techList) {
    const categoryId = categoryMap.get(tech.category_slug)
    if (!categoryId) {
      console.warn(`  ⚠ Brak kategorii: ${tech.category_slug} dla ${tech.slug}`)
      continue
    }

    await db
      .insertInto('technologies')
      .values({
        slug:         tech.slug,
        name:         tech.name,
        tagline:      tech.tagline,
        category_id:  categoryId,
        ecosystem:    tech.ecosystem,
        website_url:  tech.website_url ?? null,
        repo_url:     tech.github ? `https://github.com/${tech.github}` : null,
        license:      tech.license ?? null,
        language:     tech.language ?? null,
        is_published: true,
        updated_at:   new Date(),
      })
      .onConflict((oc: any) =>
        UPDATE_MODE
          ? oc.column('slug').doUpdateSet({
              name:        (eb: any) => eb.ref('excluded.name'),
              tagline:     (eb: any) => eb.ref('excluded.tagline'),
              ecosystem:   (eb: any) => eb.ref('excluded.ecosystem'),
              updated_at:  (eb: any) => eb.ref('excluded.updated_at'),
            })
          : oc.column('slug').doNothing()
      )
      .execute()
  }
}

async function applyGitHubData(
  techList: typeof TECH_LIST,
  ghData:   Map<string, import('./github-enricher').GitHubData>
) {
  for (const tech of techList) {
    if (!tech.github) continue
    const data = ghData.get(tech.github)
    if (!data) continue

    await db
      .updateTable('technologies')
      .set({
        gh_stars:       data.gh_stars,
        gh_forks:       data.gh_forks,
        latest_version: data.latest_version,
        first_release:  data.first_release ? new Date(data.first_release) : null,
        license:        data.license,
        language:       data.language,
        tags:           data.topics,
        updated_at:     new Date(),
      })
      .where('slug', '=', tech.slug)
      .execute()
  }
}

async function applyNpmData(
  techList: typeof TECH_LIST,
  npmData:  Map<string, import('./npm-enricher').NpmData>
) {
  for (const tech of techList) {
    if (!tech.npm) continue
    const data = npmData.get(tech.npm)
    if (!data) continue

    await db
      .updateTable('technologies')
      .set({
        npm_weekly_downloads: data.npm_weekly_downloads,
        // Nie nadpisuj version jeśli GitHub już ją ustawił
        ...(data.latest_version ? { latest_version: data.latest_version } : {}),
        updated_at: new Date(),
      })
      .where('slug', '=', tech.slug)
      .execute()
  }
}

async function saveTrendSnapshot() {
  const year    = new Date().getFullYear()
  const quarter = Math.ceil((new Date().getMonth() + 1) / 3)

  const techs = await db
    .selectFrom('technologies')
    .select(['id', 'gh_stars', 'npm_weekly_downloads', 'so_questions'])
    .where('is_published', '=', true)
    .execute()

  for (const tech of techs as any[]) {
    await db
      .insertInto('trend_snapshots')
      .values({
        tech_id:      tech.id as string,
        year,
        quarter,
        gh_stars:     tech.gh_stars ?? 0,
        npm_dls:      tech.npm_weekly_downloads ?? 0,
        so_questions: tech.so_questions ?? 0,
      })
      .onConflict((oc: any) =>
        oc.columns(['tech_id', 'year', 'quarter'])
          .doUpdateSet({
            gh_stars:  (eb: any) => eb.ref('excluded.gh_stars'),
            npm_dls:   (eb: any) => eb.ref('excluded.npm_dls'),
          })
      )
      .execute()
  }
}

async function printReport() {
  const [techCount, catCount, withStars, withNpm] = await Promise.all([
    db.selectFrom('technologies').select(db.fn.count('id').as('n')).where('is_published','=',true).executeTakeFirst(),
    db.selectFrom('categories').select(db.fn.count('id').as('n')).executeTakeFirst(),
    db.selectFrom('technologies').select(db.fn.count('id').as('n')).where('gh_stars','is not',null).executeTakeFirst(),
    db.selectFrom('technologies').select(db.fn.count('id').as('n')).where('npm_weekly_downloads','is not',null).executeTakeFirst(),
  ])

  console.log('── Database state ───────────────────')
  console.log(`  categories:      ${(catCount as any)?.n}`)
  console.log(`  technologies:    ${(techCount as any)?.n}`)
  console.log(`  with gh_stars:   ${(withStars as any)?.n}`)
  console.log(`  with npm DLs:    ${(withNpm as any)?.n}`)
  console.log('─────────────────────────────────────')

  // Top 5 po stars
  const top5 = await db
    .selectFrom('technologies')
    .select(['name', 'gh_stars', 'npm_weekly_downloads'])
    .where('gh_stars', 'is not', null)
    .orderBy('gh_stars', 'desc')
    .limit(5)
    .execute()

  console.log('\n  Top 5 po GitHub Stars:')
  top5.forEach((t: any, i: number) =>
    console.log(`  ${i+1}. ${t.name.padEnd(20)} ⭐ ${String(t.gh_stars).padStart(7)}`)
  )
}

// ─────────────────────────────────────────────
main().catch(err => {
  console.error('Seed fatal error:', err)
  process.exit(1)
})
