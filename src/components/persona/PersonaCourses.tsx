import { BookOpen, ChevronRight } from 'lucide-react'
import { formatNumber } from '@/lib/utils/format'
import type { PersonaData } from '@/lib/data/personas'

export function PersonaCourses({ data }: { data: PersonaData }) {
  const { courses, techName, roleName } = data
  if (!courses.length) return null

  const PLATFORM_LABELS: Record<string, { label: string; color: string }> = {
    udemy:           { label: 'Udemy',           color: '#a435f0' },
    coursera:        { label: 'Coursera',         color: '#0056d3' },
    egghead:         { label: 'Egghead',          color: '#e8385b' },
    frontendmasters: { label: 'Frontend Masters', color: '#c94b32' },
    youtube:         { label: 'YouTube',          color: '#ff0000' },
  }

  return (
    <section className="pe-courses" id="kursy">
      <div className="pe-section-header">
        <BookOpen size={20} aria-hidden className="pe-section-icon"/>
        <h2>Najlepsze kursy {techName} dla {roleName}</h2>
      </div>
      <p className="pe-section-lead">
        Starannie wybrane kursy pokrywające roadmapę — ocenione przez społeczność programistów:
      </p>

      {/* Disclosure — wymóg prawny dla affiliate */}
      <p className="pe-disclosure" role="note">
        Linki oznaczone jako "kurs" mogą być linkami afiliacyjnymi.
        Zakup przez nasz link nie zmienia ceny dla Ciebie, a wspiera TechTrends.pl.
      </p>

      <ul className="pe-courses__list" role="list">
        {courses.map((course, i) => {
          const platform = PLATFORM_LABELS[course.platform]
          const isFree   = course.price_pln === 0 || course.price_pln === null && course.platform === 'youtube'

          return (
            <li key={i}>
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`pe-course-card ${i === 0 ? 'pe-course-card--featured' : ''}`}
              >
                {i === 0 && (
                  <div className="pe-course-card__featured-badge">
                    Polecany dla {roleName}
                  </div>
                )}

                <div className="pe-course-card__platform" style={{ color: platform?.color }}>
                  {platform?.label ?? course.platform}
                </div>

                <h3 className="pe-course-card__title">{course.title}</h3>
                <div className="pe-course-card__instructor">by {course.instructor}</div>

                <div className="pe-course-card__meta">
                  {course.rating && (
                    <span className="pe-course-card__rating">
                      ★ {course.rating}
                    </span>
                  )}
                  {course.students && (
                    <span>{formatNumber(course.students)} studentów</span>
                  )}
                  <span className={`pe-course-card__price ${isFree ? 'pe-course-card__price--free' : ''}`}>
                    {isFree ? 'Darmowy' : `od ${course.price_pln} PLN`}
                  </span>
                </div>

                <div className="pe-course-card__cta">
                  Przejdź do kursu
                  <ChevronRight size={14} aria-hidden/>
                </div>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
