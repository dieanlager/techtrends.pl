import { formatNumber } from '@/lib/utils/format'
import type { TrendData, QuarterPoint } from '@/lib/data/trends'

// ═════════════════════════════════════════════
// TrendChart — dual-axis SVG server component
// ═════════════════════════════════════════════
export function TrendChart({ data }: { data: TrendData }) {
  const { quarters, techName, year } = data
  if (!quarters.length) return null

  return (
    <section className="tr-charts">
      <h2>Dane kwartalne — {techName} {year}</h2>
      <div className="tr-charts__grid">
        <QuarterChart
          quarters={quarters}
          metric="gh_stars"
          label="GitHub Stars"
          color="var(--accent, #00e5a0)"
          techName={techName}
        />
        {quarters.some(q => q.npm_dls > 0) && (
          <QuarterChart
            quarters={quarters}
            metric="npm_dls"
            label="npm Downloads / tydzień"
            color="var(--amber, #f59e0b)"
            techName={techName}
          />
        )}
      </div>
    </section>
  )
}

function QuarterChart({ quarters, metric, label, color, techName }: {
  quarters: QuarterPoint[]
  metric:   'gh_stars' | 'npm_dls' | 'so_questions'
  label:    string
  color:    string
  techName: string
}) {
  const W = 520; const H = 160
  const PAD = { t: 20, r: 16, b: 40, l: 60 }
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b

  const values = quarters.map(q => q[metric] as number)
  const maxV   = Math.max(...values) || 1
  const minV   = Math.min(...values) * 0.85

  const toX = (i: number) => PAD.l + (i / (quarters.length - 1 || 1)) * innerW
  const toY = (v: number) => PAD.t + (1 - (v - minV) / (maxV - minV)) * innerH

  const linePath = quarters
    .map((q, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(q[metric] as number).toFixed(1)}`)
    .join(' ')

  const areaPath = `${linePath} L${toX(quarters.length - 1).toFixed(1)},${(H - PAD.b).toFixed(1)} L${toX(0).toFixed(1)},${(H - PAD.b).toFixed(1)}Z`

  const gradId = `g-${metric}`

  // Y axis: 3 etykiety
  const yLabels = [maxV, (maxV + minV) / 2, minV].map((v, i) => ({
    y:   PAD.t + (i / 2) * innerH,
    val: formatNumber(Math.round(v)),
  }))

  return (
    <figure className="tr-chart-card">
      <figcaption className="tr-chart-card__cap">{label}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        aria-label={`${label} — ${techName}`}
        role="img"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity=".3"/>
            <stop offset="100%" stopColor={color} stopOpacity=".02"/>
          </linearGradient>
        </defs>

        {/* Y grid + labels */}
        {yLabels.map((yl, i) => (
          <g key={i}>
            <line
              x1={PAD.l} y1={yl.y.toFixed(1)}
              x2={W - PAD.r} y2={yl.y.toFixed(1)}
              stroke="currentColor" strokeOpacity=".08" strokeWidth="1"
            />
            <text
              x={PAD.l - 6} y={yl.y}
              textAnchor="end" dominantBaseline="central"
              fontSize="10" fill="currentColor" fillOpacity=".5"
            >{yl.val}</text>
          </g>
        ))}

        {/* Area + line */}
        <path d={areaPath} fill={`url(#${gradId})`}/>
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Quarter dots + labels */}
        {quarters.map((q, i) => {
          const x = toX(i)
          const y = toY(q[metric] as number)
          const delta = metric === 'gh_stars' ? q.gh_delta_pct : q.npm_delta_pct
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="5" fill={color}/>
              {/* Q label */}
              <text
                x={x} y={H - PAD.b + 14}
                textAnchor="middle" fontSize="10"
                fill="currentColor" fillOpacity=".5"
              >Q{q.quarter}</text>
              {/* Delta badge */}
              {delta !== null && (
                <text
                  x={x} y={y - 10}
                  textAnchor="middle" fontSize="9"
                  fill={delta >= 0 ? '#34d399' : '#f87171'}
                >
                  {delta >= 0 ? '+' : ''}{delta}%
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Current value highlight */}
      <div className="tr-chart-card__footer">
        <span className="tr-chart-card__current" style={{ color }}>
          {formatNumber(values[values.length - 1])}
        </span>
        <span className="tr-chart-card__change">
          {(() => {
            const d = metric === 'gh_stars'
              ? quarters[quarters.length - 1].gh_delta_pct
              : quarters[quarters.length - 1].npm_delta_pct
            if (d === null) return ''
            return `${d >= 0 ? '▲ +' : '▼ '}${Math.abs(d)}% QoQ`
          })()}
        </span>
      </div>
    </figure>
  )
}
