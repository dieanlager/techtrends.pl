import { getSystemStats, getLatestLogs } from '@/lib/data/admin'
import { StatsCard, LogTable } from '@/components/admin'
export const revalidate = 0 // Dashboard zawsze świeży

export default async function AdminDashboard() {
  const stats = await getSystemStats()
  const logs = await getLatestLogs(20)

  return (
    <main className="p-8 bg-slate-50 min-h-screen font-sans" style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">TechTrends Control Tower</h1>
            <p className="text-slate-500 font-medium text-lg">Zarządzanie flotą 2.2M podstron pSEO</p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-xs font-extrabold text-green-700 bg-green-200 border border-green-300 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Online
            </span>
          </div>
        </header>

        {/* TOP STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard title="Zindeksowane Tech" value={stats.techCount} change="+12 nowy indeks" />
          <StatsCard title="Aktywne Oferty" value={stats.jobOffers} change="+142 today" color="blue" />
          <StatsCard title="Wszystkie URL (pSEO)" value="2,240,150" color="purple" />
          <StatsCard title="Est. Miesięczny Ruch" value="~450k" color="orange" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* SCRAPER & SYSTEM LOGS */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-extrabold mb-6 text-slate-900 tracking-tight">Logi Systemowe (Real-time)</h2>
            <LogTable logs={logs} />
          </div>

          {/* REVENUE & CLICK TRACKER */}
          <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl border border-slate-800">
              <h2 className="text-lg font-bold mb-4 text-slate-400 uppercase tracking-widest">Affiliate Revenue (Est.)</h2>
              <div className="text-6xl font-black text-cyan-400 mb-2 tabular-nums">
                $4,120<span className="text-3xl text-cyan-700">.50</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Ostatnie 30 dni (Udemy + Stacks)</p>
              
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-slate-400 font-medium whitespace-nowrap">Program click-throughs</span>
                  <span className="font-bold text-lg tabular-nums">12,402</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Conversion Rate</span>
                  <span className="font-bold text-green-400 text-lg tabular-nums">3.2%</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight">Szybkie Akcje</h3>
              <div className="grid grid-cols-1 gap-4">
                <button className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 transition shadow-sm flex items-center gap-3">
                  <span className="text-xl">🔄</span> Wymuś rewalidację sitemapy
                </button>
                <button className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 text-sm font-bold text-blue-700 transition shadow-sm flex items-center gap-3">
                  <span className="text-xl">🚀</span> Odpal Scraper (Manual Run)
                </button>
                <button className="w-full text-left p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl border border-red-200 text-sm font-bold transition shadow-sm flex items-center gap-3">
                  <span className="text-xl">⚠️</span> Wyczyść Cache (Flush All)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
