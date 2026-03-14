import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Zarobki IT 2026'
export const size = { width: 1200, height: 630 }

export default async function Image({ params }: { params: { tech: string, location: string, level: string } }) {
  const { tech, location, level } = params
  
  return new ImageResponse(
    (
      <div style={{
        background: '#0f172a',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '80px'
      }}>
        <div style={{ fontSize: 32, color: '#94a3b8', marginBottom: 20 }}>Ile zarabia</div>
        <div style={{ fontSize: 80, fontWeight: 900, marginBottom: 20 }}>{tech.toUpperCase()}</div>
        <div style={{ fontSize: 40, color: '#3b82f6' }}>{level.toUpperCase()} • {location.toUpperCase()}</div>
        <div style={{ fontSize: 24, marginTop: 40, opacity: 0.5 }}>TechTrends.pl — Raport Płacowy 2026</div>
      </div>
    ),
    { ...size }
  )
}
