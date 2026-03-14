import { BookOpen, ChevronRight } from 'lucide-react'
import type { StackRecipe } from '@/lib/data/stack-details'

export function StackAffiliate({ data }: { data: StackRecipe }) {
  if (!data.courses || data.courses.length === 0) return null

  return (
    <section className="pe-courses mt-16 border-t pt-10 border-[var(--border-color)]">
      <div className="pe-section-header flex gap-3 text-2xl font-bold mb-6 text-[var(--navy)]">
        <BookOpen size={28} className="text-[var(--accent)]" />
        <h2>Praktyczne szkolenia i materiały do całego Stacku</h2>
      </div>
      
      <p className="pe-disclosure" role="note">
        Linki poniżej mogą być linkami afiliacyjnymi. Zakup przez nasz link nie zmienia Twojej ceny netto, a Ty wspierasz niezależną analitykę w TechTrends.pl.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {data.courses.map((course, idx) => (
          <a
            key={idx}
            href={course.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`pe-course-card bg-[var(--bgc)] border border-[var(--border-color)] rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between hover:border-[var(--accent)] ${idx === 0 ? 'border-[var(--accent)] border-2' : ''}`}
          >
            {idx === 0 && (
              <span className="absolute -top-3 left-4 bg-[var(--am)] text-white font-bold text-xs uppercase px-2 py-1 rounded-full">Polecany Krok po Kroku</span>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#a435f0] mb-2">{course.platform}</p>
              <h3 className="text-lg font-bold text-[var(--navy)] mb-2 leading-tight">{course.title}</h3>
              <p className="text-sm text-[var(--fg-muted)]">by {course.instructor}</p>
            </div>
            <div className="mt-6 flex items-center justify-between font-bold text-[var(--accent)]">
              <span>Zdobądź dostęp</span>
              <ChevronRight size={16} />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
