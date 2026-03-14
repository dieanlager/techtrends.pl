/**
 * seed/npm-enricher.ts
 *
 * npm Registry API — publiczne, bez tokenu, 1000 req/min.
 * Dwa endpointy:
 *   registry.npmjs.org/{pkg}         → metadata (version, license, description)
 *   api.npmjs.org/downloads/point/last-month/{pkg} → monthly downloads
 */

const NPM_REGISTRY = 'https://registry.npmjs.org'
const NPM_STATS    = 'https://api.npmjs.org/downloads/point/last-month'

export type NpmData = {
  npm_weekly_downloads: number
  latest_version:       string | null
  npm_description:      string | null
  npm_license:          string | null
  npm_homepage:         string | null
  keywords:             string[]
}

// ─────────────────────────────────────────────
// Fetch single package
// ─────────────────────────────────────────────
export async function fetchNpmPackage(pkg: string): Promise<NpmData | null> {
  try {
    // Równolegle: metadata + download stats
    const [meta, downloads] = await Promise.allSettled([
      fetchNpmMeta(pkg),
      fetchNpmDownloads(pkg),
    ])

    const m = meta.status === 'fulfilled' ? meta.value : null
    const d = downloads.status === 'fulfilled' ? downloads.value : 0

    if (!m) return null

    return {
      npm_weekly_downloads: Math.round(d / 4.33),   // month → week estimate
      latest_version:       m.version ?? null,
      npm_description:      m.description ?? null,
      npm_license:          m.license ?? null,
      npm_homepage:         m.homepage ?? null,
      keywords:             m.keywords ?? [],
    }
  } catch (err) {
    console.error(`  [npm] Error fetching ${pkg}:`, err)
    return null
  }
}

async function fetchNpmMeta(pkg: string) {
  // Scoped packages: @scope/pkg → %40scope%2Fpkg w URL
  const encoded = pkg.startsWith('@')
    ? pkg.replace('/', '%2F')
    : pkg

  const res = await fetch(`${NPM_REGISTRY}/${encoded}/latest`, {
    headers: { 'Accept': 'application/json' },
    signal:  AbortSignal.timeout(8_000),
  })

  if (!res.ok) throw new Error(`npm meta HTTP ${res.status}`)
  return res.json()
}

async function fetchNpmDownloads(pkg: string): Promise<number> {
  const res = await fetch(`${NPM_STATS}/${pkg}`, {
    signal: AbortSignal.timeout(8_000),
  })
  if (!res.ok) return 0
  const data = await res.json()
  return data.downloads ?? 0
}

// ─────────────────────────────────────────────
// Bulk fetch
// ─────────────────────────────────────────────
export async function bulkFetchNpm(
  packages: string[],
  delayMs = 50   // npm API jest bardzo tolerancyjne
): Promise<Map<string, NpmData>> {
  const results = new Map<string, NpmData>()

  for (let i = 0; i < packages.length; i++) {
    const pkg = packages[i]
    const pct = Math.round(((i + 1) / packages.length) * 100)

    process.stdout.write(`\r  [npm] ${i + 1}/${packages.length} (${pct}%) — ${pkg}                `)

    const data = await fetchNpmPackage(pkg)
    if (data) results.set(pkg, data)

    if (i < packages.length - 1) await sleep(delayMs)
  }

  process.stdout.write('\n')
  return results
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
