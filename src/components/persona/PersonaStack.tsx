import Link          from 'next/link'
import { ArrowRight }  from 'lucide-react'
import type { PersonaData } from '@/lib/data/personas'

export function PersonaStack({ data }: { data: PersonaData }) {
  const { relatedStacks, techName, relatedPersonas, trendHref } = data
  if (!relatedStacks.length && !relatedPersonas.length) return null

  return (
    <nav className="pe-related" aria-label="Powiązane zasoby">
      {relatedStacks.length > 0 && (
        <div className="pe-related__block">
          <h2>Popularne stacki z {techName}</h2>
          <ul className="pe-related__grid" role="list">
            {relatedStacks.map(s => (
              <li key={s.slug}>
                <Link href={`/stack/${s.slug}`} className="pe-related-card">
                  {s.title}
                  <ArrowRight size={13} aria-hidden/>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedPersonas.length > 0 && (
        <div className="pe-related__block">
          <h2>Inne ścieżki kariery z {techName}</h2>
          <ul className="pe-related__grid" role="list">
            {relatedPersonas.map(p => (
              <li key={p.href}>
                <Link href={p.href} className="pe-related-card">
                  {techName} dla {p.roleName}
                  <ArrowRight size={13} aria-hidden/>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link href={trendHref} className="pe-trend-link">
        📈 Trendy popularności {techName} — dane historyczne →
      </Link>
    </nav>
  )
}
