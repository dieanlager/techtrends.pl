import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import type { SalaryData } from '@/lib/data/salaries'

export function SalaryHero({ data }: { data: SalaryData }) {
  const { techName, locationName, levelName, stats, dataWarning } = data
  const year = 2026

  return (
    <header className="mb-12">
      {dataWarning && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg flex items-center gap-3 mb-6 border border-amber-200">
          <AlertTriangle size={20} />
          <p className="text-sm font-medium">{dataWarning}</p>
        </div>
      )}
      
      <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
        Zarobki {techName} <span className="text-blue-600">{levelName}</span> {locationName} [{year}]
      </h1>
      
      <p className="text-xl text-gray-600 mb-8 max-w-3xl">
        Kompletny raport płacowy dla technologii {techName}. Sprawdź medianę, widełki i trendy rynkowe na podstawie {stats.sample_size} ofert.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-gray-500 text-sm block mb-1">Mediana (brutto)</span>
          <span className="text-3xl font-bold">{stats.median?.toLocaleString()} PLN</span>
          <div className="text-green-600 text-sm mt-2 font-medium">↑ {stats.yoy_delta_pct}% r/r</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-gray-500 text-sm block mb-1">25. - 75. percentyl</span>
          <span className="text-3xl font-bold text-gray-400">{stats.p25?.toLocaleString()} - {stats.p75?.toLocaleString()}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-gray-500 text-sm block mb-1">Forma kontraktu</span>
          <span className="text-3xl font-bold">{stats.contract.toUpperCase()}</span>
        </div>
      </div>
    </header>
  )
}
