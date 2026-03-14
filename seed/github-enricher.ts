/**
 * seed/github-enricher.ts
 *
 * Zaciąga dane z GitHub API dla każdej tech z tech-list.ts.
 *
 * Rate limits:
 *   Unauthenticated: 60 req/h → za mało dla 500 tech
 *   Authenticated:   5000 req/h → wystarczy (500 tech × ~2 req = 1000 req)
 *
 * WYMAGANE: GITHUB_TOKEN w .env
 *   github.com → Settings → Developer settings → Personal access tokens
 *   Scopes: public_repo (read-only, wystarczy)
 */

const GH_API    = 'https://api.github.com'
const GH_TOKEN  = process.env.GITHUB_TOKEN

export type GitHubData = {
  gh_stars:       number
  gh_forks:       number
  gh_open_issues: number
  latest_version: string | null
  first_release:  string | null
  description:    string | null
  license:        string | null
  language:       string | null
  topics:         string[]
  homepage:       string | null
  archived:       boolean
}

// ─────────────────────────────────────────────
// Fetch repo metadata
// ─────────────────────────────────────────────
export async function fetchGitHubRepo(ownerRepo: string): Promise<GitHubData | null> {
  try {
    const res = await ghFetch(`/repos/${ownerRepo}`)
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`  [GH] 404: ${ownerRepo}`)
        return null
      }
      throw new Error(`HTTP ${res.status}`)
    }

    const repo = await res.json()

    // Pobierz latest release osobno (repos nie zawsze mają release w base response)
    const release = await fetchLatestRelease(ownerRepo)

    return {
      gh_stars:       repo.stargazers_count,
      gh_forks:       repo.forks_count,
      gh_open_issues: repo.open_issues_count,
      latest_version: release?.tag_name?.replace(/^v/, '') ?? null,
      first_release:  repo.created_at,
      description:    repo.description,
      license:        repo.license?.spdx_id ?? null,
      language:       repo.language,
      topics:         repo.topics ?? [],
      homepage:       repo.homepage || null,
      archived:       repo.archived,
    }
  } catch (err) {
    console.error(`  [GH] Error fetching ${ownerRepo}:`, err)
    return null
  }
}

async function fetchLatestRelease(ownerRepo: string): Promise<{ tag_name: string } | null> {
  const res = await ghFetch(`/repos/${ownerRepo}/releases/latest`)
  if (!res.ok) return null
  return res.json()
}

// ─────────────────────────────────────────────
// Rate-limit aware fetch
// ─────────────────────────────────────────────
async function ghFetch(path: string): Promise<Response> {
  if (!GH_TOKEN) {
    throw new Error('❌ GITHUB_TOKEN nie jest ustawiony w .env')
  }

  const res = await fetch(`${GH_API}${path}`, {
    headers: {
      'Authorization': `Bearer ${GH_TOKEN}`,
      'Accept':        'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent':    'TechTrends-Seed/1.0',
    },
    signal: AbortSignal.timeout(10_000),
  })

  // Obsłuż rate limit — czekaj do reset time
  if (res.status === 403 || res.status === 429) {
    const resetAt  = Number(res.headers.get('X-RateLimit-Reset') ?? 0) * 1000
    const waitMs   = Math.max(resetAt - Date.now(), 60_000) + 1_000
    const waitMins = (waitMs / 60_000).toFixed(1)

    console.warn(`  [GH] Rate limit hit — czekam ${waitMins} min (do ${new Date(resetAt).toLocaleTimeString()})`)
    await sleep(waitMs)

    // Retry po czekaniu
    return ghFetch(path)
  }

  return res
}

// ─────────────────────────────────────────────
// Bulk fetch z progress tracking
// ─────────────────────────────────────────────
export async function bulkFetchGitHub(
  repos: string[],
  delayMs = 150   // ~400 req/min → bezpiecznie poniżej 5000/h limitu
): Promise<Map<string, GitHubData>> {
  if (!GH_TOKEN) {
    console.error('❌ GITHUB_TOKEN nie jest ustawiony w .env')
    console.error('   Idź na: github.com/settings/tokens → Generate new token (classic)')
    console.error('   Wymagane scope: public_repo')
    process.exit(1)
  }

  const results = new Map<string, GitHubData>()

  // Sprawdź pozostały limit przed startem
  await checkRateLimit()

  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i]
    const pct  = Math.round(((i + 1) / repos.length) * 100)

    process.stdout.write(`\r  [GH] ${i + 1}/${repos.length} (${pct}%) — ${repo}                    `)

    const data = await fetchGitHubRepo(repo)
    if (data) results.set(repo, data)

    // Nie czekaj po ostatnim
    if (i < repos.length - 1) await sleep(delayMs)
  }

  process.stdout.write('\n')
  return results
}

async function checkRateLimit() {
  const res  = await ghFetch('/rate_limit')
  if (!res.ok) return

  const data      = await res.json()
  const remaining = data.rate.remaining
  const resetAt   = data.rate.reset * 1000

  console.log(`  [GH] Rate limit: ${remaining}/5000 pozostało (reset: ${new Date(resetAt).toLocaleTimeString()})`)

  if (remaining < 100) {
    const waitMs = resetAt - Date.now() + 1_000
    console.warn(`  [GH] Mało kredytów — czekam ${(waitMs/60000).toFixed(1)} min`)
    await sleep(waitMs)
  }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
