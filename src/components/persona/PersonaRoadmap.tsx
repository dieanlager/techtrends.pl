import { ExternalLink, Clock, Check } from 'lucide-react'
import type { PersonaData } from '@/lib/data/personas'

export function PersonaRoadmap({ data }: { data: PersonaData }) {
  const { roadmap, techName, roleName } = data

  const PHASE_CONFIG = {
    beginner:     { label: 'Początkujący', color: 'green',  order: 1 },
    intermediate: { label: 'Średniozaawansowany', color: 'blue', order: 2 },
    advanced:     { label: 'Zaawansowany', color: 'purple', order: 3 },
  }

  return (
    <section className="pe-roadmap" id="roadmapa">
      <h2>Roadmapa: {techName} dla {roleName}</h2>
      <p className="pe-section-lead">
        Krok po kroku od zera do specjalisty — każdy etap z konkretnymi tematami i zasobami:
      </p>

      <ol className="pe-timeline" role="list">
        {roadmap.map((step, i) => {
          const phase = PHASE_CONFIG[step.phase]
          return (
            <li key={i} className={`pe-step pe-step--${phase.color}`}>
              <div className="pe-step__marker" aria-hidden>
                <span className="pe-step__num">{i + 1}</span>
              </div>

              <div className="pe-step__content">
                <div className="pe-step__header">
                  <h3>{step.title}</h3>
                  <span className={`pe-phase-badge pe-phase-badge--${phase.color}`}>
                    {phase.label}
                  </span>
                  <span className="pe-step__duration">
                    <Clock size={12} aria-hidden/>
                    {step.duration}
                  </span>
                </div>

                <p className="pe-step__desc">{step.description}</p>

                {/* Topics */}
                <ul className="pe-step__topics" aria-label="Tematy do nauki">
                  {step.topics.map((topic, j) => (
                    <li key={j}>
                      <Check size={11} aria-hidden/>
                      {topic}
                    </li>
                  ))}
                </ul>

                {/* Resources */}
                {step.resources.length > 0 && (
                  <div className="pe-step__resources">
                    {step.resources.map((r, j) => (
                      <a
                        key={j}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`pe-resource ${r.free ? 'pe-resource--free' : 'pe-resource--paid'}`}
                      >
                        {r.free ? '📖' : '🎓'} {r.label}
                        <ExternalLink size={10} aria-hidden/>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
