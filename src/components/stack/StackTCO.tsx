import type { StackRecipe } from '@/lib/data/stack-details'

export function StackTCO({ data }: { data: StackRecipe }) {
  const { tco } = data

  return (
    <section id="tco" className="mt-16 border-t pt-10 border-[var(--border-color)]">
      <h2 className="text-3xl font-bold text-[var(--navy)] mb-6">Total Cost of Ownership (TCO) na start</h2>
      <p className="text-[var(--fg-muted)] mb-8 max-w-2xl">Szacunkowy koszt hostingu i infrastruktury potrzebnej na start dla tego zestawu. Przekalkulowany z darmowymi tier'ami weryfikowanymi w 2026.</p>

      <div className="bg-[var(--bg2)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="grid grid-cols-2 p-6 border-b border-[var(--border-color)]">
          <span className="font-bold text-[var(--navy)] text-lg">Platforma Hostingowa</span>
          <span className="text-right font-mono font-bold text-lg text-[var(--green)]">{tco.hosting} PLN / mc</span>
        </div>
        <div className="grid grid-cols-2 p-6 border-b border-[var(--border-color)]">
          <span className="font-bold text-[var(--navy)] text-lg">Bazy danych & Storage</span>
          <span className="text-right font-mono font-bold text-lg text-[var(--green)]">{tco.database} PLN / mc</span>
        </div>
        <div className="grid grid-cols-2 p-6 border-b border-[var(--border-color)]">
          <span className="font-bold text-[var(--navy)] text-lg">Autoryzacja (Auth)</span>
          <span className="text-right font-mono font-bold text-lg text-[var(--green)]">{tco.auth} PLN / mc</span>
        </div>
        
        <div className="grid grid-cols-2 p-6 bg-[var(--accent)] text-white font-extrabold text-xl">
          <span>SUMA TCO</span>
          <span className="text-right">{tco.total} PLN / mc</span>
        </div>
        
        {tco.freeTierAvailable && (
          <div className="p-4 text-center text-sm font-semibold bg-[var(--greenl)] text-[var(--green)]">
            ✅ Ten stack posiada doskonałe warunki Free Tier – możesz zacząć zupełnie za darmo!
          </div>
        )}
      </div>
    </section>
  )
}
