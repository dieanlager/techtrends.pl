import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { TrendData } from '@/lib/data/trends'

// ═════════════════════════════════════════════
// TrendRelated — internal linking
// ═════════════════════════════════════════════
export function TrendRelated({ data }: { data: TrendData }) {
  const { related, techName } = data

  return (
    <nav className="tr-related" aria-label={`Powiązane strony — ${techName}`}>
      <h2>Sprawdź też</h2>
      <ul className="tr-related__list" role="list">
        {related.map(r => (
          <li key={r.href}>
            <Link href={r.href} className="tr-related-card">
              <span className={`tr-related-card__type tr-related-card__type--${r.type}`}>
                {r.type === 'salary'     && '💰'}
                {r.type === 'trend'      && '📈'}
                {r.type === 'comparison' && '⚡'}
              </span>
              <span className="tr-related-card__label">{r.label}</span>
              <ArrowRight size={13} className="tr-related-card__arrow" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
