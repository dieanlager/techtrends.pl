import Link          from 'next/link'
import { BookOpen, Briefcase } from 'lucide-react'
import type { PersonaData } from '@/lib/data/personas'

export function PersonaHero({ data }: { data: PersonaData }) {
  const { roleName, techName, techTagline, headline, roleSlug, techSlug } = data
  const year = new Date().getFullYear()

  return (
    <header className="pe-hero">
      <nav aria-label="Nawigacja okruszkowa" className="pe-bc">
        <ol>
          <li><Link href="/">TechTrends</Link></li>
          <li><Link href="/dla">Dla kogo</Link></li>
          <li><Link href={`/dla/${roleSlug}`}>{roleName}</Link></li>
          <li aria-current="page">{techName}</li>
        </ol>
      </nav>

      <div className="pe-hero__layout">
        <div className="pe-hero__main">
          {/* Dual badge */}
          <div className="pe-hero__badges">
            <span className="pe-badge pe-badge--role">{roleName}</span>
            <span className="pe-hero__plus" aria-hidden>+</span>
            <Link href={`/technologie/${techSlug}`} className="pe-badge pe-badge--tech">
              {techName}
            </Link>
          </div>

          <h1>
            {techName}
            <span className="pe-hero__role"> dla {roleName}</span>
          </h1>

          <p className="pe-hero__headline">{headline}</p>
          <p className="pe-hero__tagline">{techTagline}</p>

          {/* Quick links */}
          <div className="pe-hero__links">
            <a href="#kursy" className="pe-quick-link pe-quick-link--primary">
              <BookOpen size={14} aria-hidden/>
              Kursy i materiały
            </a>
            <a href="#praca" className="pe-quick-link pe-quick-link--secondary">
              <Briefcase size={14} aria-hidden/>
              Oferty pracy
            </a>
            <Link href={data.salaryHref} className="pe-quick-link pe-quick-link--salary">
              Zarobki {techName} Senior →
            </Link>
          </div>
        </div>

        {/* Quick stats */}
        <aside className="pe-hero__stats">
          <div className="pe-stat">
            <div className="pe-stat__label">Roadmapa nauki</div>
            <div className="pe-stat__value">{data.roadmap.length} etapów</div>
          </div>
          <div className="pe-stat">
            <div className="pe-stat__label">Polecane kursy</div>
            <div className="pe-stat__value">{data.courses.length} kursów</div>
          </div>
          <div className="pe-stat">
            <div className="pe-stat__label">Oferty pracy</div>
            <div className="pe-stat__value">
              {data.jobs.length > 0 ? `${data.jobs.length}+ aktualnych` : 'sprawdź JustJoin'}
            </div>
          </div>
          <div className="pe-stat">
            <div className="pe-stat__label">Rok</div>
            <div className="pe-stat__value">{year}</div>
          </div>
        </aside>
      </div>
    </header>
  )
}
