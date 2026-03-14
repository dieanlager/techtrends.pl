/**
 * app/trendy/[tech]/[year]/opengraph-image.tsx
 *
 * OG image dla stron trendów — pokazuje wykres wzrostu.
 * "Python 2024: +34% wzrost popularności — 60k stars"
 */

import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const alt         = 'Trendy technologii'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

const SENTIMENT_COLORS = {
  rising:    { bg: '#001a0f', accent: '#00e5a0', label: 'Rosnąca popularność' },
  stable:    { bg: '#0d1424', accent: '#7b8db0', label: 'Stabilna popularność' },
  declining: { bg: '#1a0508', accent: '#ff5b5b', label: 'Malejąca popularność' },
}

export default async function OGTrend({
  params,
}: {
  params: Promise<{ tech: string; year: string }>
}) {
  const { tech, year } = await params

  // Edge query — tylko kluczowe dane
  const data = await fetchTrendSummaryForEdge(tech, parseInt(year, 10))

  const sentiment = data?.sentiment ?? 'stable'
  const colors    = SENTIMENT_COLORS[sentiment]
  const techName  = data?.techName ?? formatSlug(tech)
  const growthStr = data?.growthPct != null
    ? `${data.growthPct >= 0 ? '+' : ''}${data.growthPct}%`
    : null
  const starsStr  = data?.ghStars ? `${formatK(data.ghStars)} stars` : null

  return new ImageResponse(
    (
      <div style={{
        width:      '100%',
        height:     '100%',
        background: colors.bg,
        display:    'flex',
        flexDirection: 'column',
        padding:    '56px 72px',
        fontFamily: '"Syne", sans-serif',
        position:   'relative',
      }}>
        {/* Grid pattern */}
        <div style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: `linear-gradient(${colors.accent}06 1px, transparent 1px), linear-gradient(90deg, ${colors.accent}06 1px, transparent 1px)`,
          backgroundSize:  '56px 56px',
        }}/>

        {/* Top bar */}
        <div style={{
          display:     'flex',
          alignItems:  'center',
          justifyContent: 'space-between',
          marginBottom: 48,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: colors.accent, fontSize: 18 }}>
            <div style={{
              width:  32, height: 32,
              background: colors.accent,
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: colors.bg, fontSize: 16, fontWeight: 700,
            }}>T</div>
            TechTrends.pl
          </div>

          <div style={{
            background:   `${colors.accent}15`,
            border:       `1px solid ${colors.accent}30`,
            borderRadius: 100,
            padding:      '6px 18px',
            color:        colors.accent,
            fontSize:     12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
          }}>
            {colors.label}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 15, color: `${colors.accent}80`, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 16 }}>
            Popularność technologii
          </div>

          <div style={{ fontSize: 72, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 24 }}>
            {techName}
          </div>

          {/* Big growth number */}
          {growthStr && (
            <div style={{
              display:     'flex',
              alignItems:  'baseline',
              gap:         20,
              marginBottom: 16,
            }}>
              <span style={{
                fontSize:    80,
                fontWeight:  800,
                color:       colors.accent,
                fontFamily:  'monospace',
                letterSpacing: '-0.04em',
                lineHeight:  1,
              }}>{growthStr}</span>
              <span style={{ fontSize: 24, color: `${colors.accent}80` }}>w {year}</span>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div style={{
          display:     'flex',
          alignItems:  'center',
          gap:         32,
          borderTop:   `1px solid ${colors.accent}20`,
          paddingTop:  24,
        }}>
          {starsStr && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 11, color: `${colors.accent}60`, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>GitHub Stars</span>
              <span style={{ fontSize: 28, fontFamily: 'monospace', color: '#fff', fontWeight: 700 }}>{starsStr}</span>
            </div>
          )}
          <div style={{
            marginLeft: 'auto',
            fontSize:   14,
            color:      `${colors.accent}50`,
          }}>
            techtrends.pl/trendy/{tech}/{year}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

// ─────────────────────────────────────────────
// Edge helpers
// ─────────────────────────────────────────────
async function fetchTrendSummaryForEdge(techSlug: string, year: number) {
  try {
    const res = await fetch(
      `${process.env.DATABASE_HTTP_URL}/query`,
      {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${process.env.NEON_API_KEY}`,
        },
        body: JSON.stringify({
          query: `
            SELECT
              t.name,
              MAX(ts.gh_stars) FILTER (WHERE ts.quarter = 4) AS stars_q4,
              MIN(ts.gh_stars) FILTER (WHERE ts.quarter = 1) AS stars_q1
            FROM technologies t
            JOIN trend_snapshots ts ON ts.tech_id = t.id
            WHERE t.slug = $1 AND ts.year = $2
            GROUP BY t.name
            LIMIT 1
          `,
          params: [techSlug, year],
        }),
        signal: AbortSignal.timeout(3_000),
      }
    )

    if (!res.ok) return null
    const data = await res.json()
    const row  = data.rows?.[0]
    if (!row) return null

    const growthPct = row.stars_q1 > 0
      ? Math.round(((row.stars_q4 - row.stars_q1) / row.stars_q1) * 100)
      : null

    const sentiment = growthPct == null ? 'stable'
      : growthPct > 10 ? 'rising'
      : growthPct < -5 ? 'declining'
      : 'stable'

    return {
      techName:  row.name,
      ghStars:   row.stars_q4,
      growthPct,
      sentiment: sentiment as 'rising' | 'stable' | 'declining',
    }
  } catch {
    return null
  }
}

function formatSlug(s: string): string {
  return s.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ')
}

function formatK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`
  return String(n)
}
