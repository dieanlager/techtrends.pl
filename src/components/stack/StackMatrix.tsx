import type { StackRecipe } from '@/lib/data/stack-details'
import Link from 'next/link'

export function StackMatrix({ data }: { data: StackRecipe }) {
  return (
    <section id="matrix" className="mt-16 border-t pt-10 border-[var(--border-color)]">
      <h2 className="text-3xl font-bold text-[var(--navy)] mb-6">Interoperability Matrix</h2>
      <p className="text-[var(--fg-muted)] mb-8 max-w-2xl">
        Dlaczego te narzędzia do siebie pasują? Zobacz, jak poszczególne technologie w tym stacku rozwiązują realne problemy komunikacyjne w projekcie.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.technologies.map((tech) => (
          <div key={tech.slug} className="p-6 bg-[var(--bgc)] border border-[var(--border-color)] rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold text-[var(--navy)] mb-2 capitalize">{tech.name}</h3>
            <p className="text-sm font-medium text-[var(--accent)] mb-4">{tech.role}</p>
            <p className="text-sm text-[var(--fg-muted)] mb-4 leading-relaxed">
              Odpala natywne mechanizmy integracji. Idealnie wpasowuje się w ekosystem zapewniając 100% type safety.
            </p>
            <Link href={`/technologie/${tech.slug}`} className="text-sm font-bold text-[var(--accent)] hover:underline">
              Profil {tech.name} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
