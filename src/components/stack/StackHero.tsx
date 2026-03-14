import Link from 'next/link'
import type { StackRecipe } from '@/lib/data/stack-details'

export function StackHero({ data }: { data: StackRecipe }) {
  return (
    <header className="st-hero">
      <nav aria-label="Nawigacja okruszkowa" className="pe-bc">
        <ol>
          <li><Link href="/">TechTrends</Link></li>
          <li aria-current="page">{data.title}</li>
        </ol>
      </nav>

      <div className="st-hero__layout mt-6">
        <div className="st-hero__badges flex gap-2 mb-4">
          <span className="pe-badge pe-badge--role bg-[var(--accent)] text-white">Rekomendacja 2026</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--navy)] leading-tight mb-4">{data.title}</h1>
        <p className="text-lg text-[var(--fg-muted)] mb-8 max-w-2xl">{data.description}</p>
        
        <div className="flex gap-4">
          <a href="#tco" className="pe-quick-link pe-quick-link--primary">Koszt TCO</a>
          <a href="#matrix" className="pe-quick-link pe-quick-link--secondary">Interoperability Matrix</a>
        </div>
      </div>
    </header>
  )
}
