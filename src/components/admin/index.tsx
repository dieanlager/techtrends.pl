import React from 'react'

export function StatsCard({ title, value, change, color = 'green' }: { title: string, value: string | number, change?: string, color?: string }) {
  // Mapowanie ogólnych klas Tailwind wprost na style if PurgeCSS isn't grabbing dynamic classes easily
  return (
    <div className={`p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
      <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">{title}</h3>
      <div className="text-4xl font-extrabold text-slate-900">{value}</div>
      {change && (
        <div className={`text-sm mt-3 font-semibold ${change.startsWith('+') ? 'text-green-600' : 'text-slate-600'}`}>
          {change}
        </div>
      )}
    </div>
  )
}

export function LogTable({ logs }: { logs: any[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs tracking-wider">
          <tr>
            <th className="p-4">Czas</th>
            <th className="p-4">Zdarzenie</th>
            <th className="p-4">Źródło</th>
            <th className="p-4">Status</th>
            <th className="p-4">Szczegóły</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.map((log, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                {new Date(log.created_at).toLocaleString('pl-PL')}
              </td>
              <td className="p-4 font-bold text-slate-700">{log.event_type}</td>
              <td className="p-4 text-slate-500">{log.source}</td>
              <td className="p-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                  log.status === 'ERROR' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {log.status}
                </span>
              </td>
              <td className="p-4 font-mono text-xs text-slate-500 max-w-[200px] truncate" title={JSON.stringify(log.payload)}>
                {JSON.stringify(log.payload)}
              </td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">Brak logów w systemie.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function HealthChart() {
  return <div className="h-40 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 font-medium opacity-50">Wykres dostępny wkrótce</div>
}
