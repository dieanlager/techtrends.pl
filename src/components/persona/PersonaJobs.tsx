import Link from 'next/link'
import { Briefcase, ExternalLink, ArrowRight } from 'lucide-react'
import type { PersonaData } from '@/lib/data/personas'

export function PersonaJobs({ data }: { data: PersonaData }) {
  const { jobs, techName, roleName, jobSearchUrl, salaryHref } = data

  return (
    <section className="pe-jobs" id="praca">
      <div className="pe-section-header">
        <Briefcase size={20} aria-hidden className="pe-section-icon"/>
        <h2>Praca jako {roleName} — {techName}</h2>
      </div>

      {jobs.length > 0 ? (
        <>
          <p className="pe-section-lead">
            Aktualne oferty z wymaganiem {techName} ({jobs.length}+ ofert w ostatnim tygodniu):
          </p>

          <ul className="pe-jobs__list" role="list">
            {jobs.map((job, i) => (
              <li key={i}>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pe-job-card"
                >
                  <div className="pe-job-card__main">
                    <div className="pe-job-card__title">{job.title}</div>
                    <div className="pe-job-card__meta">
                      <span className="pe-job-card__source">{job.source}</span>
                      {job.location && <span>{job.location}</span>}
                      <span className="pe-job-card__date">{job.posted_at}</span>
                    </div>
                  </div>
                  {(job.salary_from || job.salary_to) && (
                    <div className="pe-job-card__salary">
                      {job.salary_from && `${job.salary_from.toLocaleString('pl-PL')}`}
                      {job.salary_from && job.salary_to && ' – '}
                      {job.salary_to && `${job.salary_to.toLocaleString('pl-PL')} PLN`}
                    </div>
                  )}
                  <ExternalLink size={13} className="pe-job-card__ext" aria-hidden/>
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="pe-section-lead">
          Znajdź aktualne oferty na największych polskich portalach pracy IT:
        </p>
      )}

      {/* Job board CTAs */}
      <div className="pe-jobs__ctas">
        <a
          href={jobSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pe-job-cta pe-job-cta--primary"
        >
          Wszystkie oferty {techName} na JustJoin
          <ArrowRight size={14} aria-hidden/>
        </a>
        <a
          href={`https://nofluffjobs.com/pl?criteria=${encodeURIComponent(techName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pe-job-cta pe-job-cta--secondary"
        >
          Sprawdź NoFluffJobs
          <ArrowRight size={14} aria-hidden/>
        </a>
      </div>

      {/* Cross-link do zarobków */}
      <Link href={salaryHref} className="pe-salary-link">
        💰 Sprawdź ile zarabia {techName} {roleName} w Polsce →
      </Link>
    </section>
  )
}
