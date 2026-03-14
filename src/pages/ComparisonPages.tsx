import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs, LoadingSpinner, NotFoundSection, StatCard } from '../components/UI';

export const ComparisonPage = () => {
  const { comparison } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allComps, setAllComps] = useState<any[]>([]);

  useEffect(() => {
    if (!comparison) return;
    setLoading(true);
    fetch(`/api/compare/${comparison}`).then(r => r.json())
      .then(d => { setData(d?.error ? null : d); }).finally(() => setLoading(false));
    fetch('/api/meta').then(r => r.json()).then(d => setAllComps((d.top_comparison_pairs || []).slice(0, 12))).catch(() => {});
  }, [comparison]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <NotFoundSection message="Nie znaleziono jednej lub obu technologii w bazie." />;

  const { techA, techB, verdict, metrics } = data;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${techA.name} vs ${techB.name} — co wybrać w ${new Date().getFullYear()}?`,
    description: `Szczegółowe porównanie ${techA.name} i ${techB.name}: wydajność, zarobki, popularność, trudność.`,
    datePublished: `${new Date().getFullYear()}-01-01`,
    author: { '@type': 'Organization', name: 'TechTrends.pl' },
  };

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumbs items={[{ name: 'Porównaj', path: '/porownaj' }, { name: `${techA.name} vs ${techB.name}`, path: '#' }]} />

      <div className="text-center mb-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500 mb-6">Porównanie Technologii {new Date().getFullYear()}</p>
        <h1 className="font-display text-[clamp(3rem,12vw,9rem)] uppercase tracking-tighter leading-none">
          {techA.name} <span className="text-orange-500">VS</span> {techB.name}
        </h1>
        <p className="text-white/40 text-lg mt-4 max-w-2xl mx-auto">
          Szczegółowe porównanie wydajności, popularności i zarobków. Co wybrać?
        </p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {[techA, techB].map((tech: any, i: number) => (
          <div key={tech.id} className={`p-10 rounded-3xl border ${i === 0 ? 'bg-white/[0.04] border-white/10' : 'bg-white/[0.03] border-white/[0.07]'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center font-bold text-white text-lg">
                {tech.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-display text-4xl uppercase">{tech.name}</h2>
                <span className="text-[9px] font-mono text-white/30 uppercase">{tech.category}</span>
              </div>
            </div>
            <p className="text-white/50 text-sm mb-8">{tech.tagline}</p>
            <div className="space-y-3">
              {[
                { label: 'GitHub Stars', value: tech.gh_stars > 0 ? `${(tech.gh_stars / 1000).toFixed(0)}k` : 'N/A' },
                { label: 'Avg Zarobki', value: `${tech.salary_avg.toLocaleString()} PLN` },
                { label: 'Trudność', value: tech.difficulty },
                { label: 'Licencja', value: tech?.license || 'Open Source' },
                { label: 'Rok wydania', value: tech?.first_release || 'N/A' },
              ].map(m => (
                <div key={m.label} className="flex justify-between items-center py-2.5 border-b border-white/[0.05]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">{m.label}</span>
                  <span className="font-mono text-sm">{m.value}</span>
                </div>
              ))}
            </div>
            <Link to={`/technologie/${tech.slug}`} className="mt-6 flex items-center gap-2 text-orange-500 text-[10px] font-bold uppercase tracking-widest hover:gap-3 transition-all">
              Pełny profil <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>

      {/* Metrics comparison */}
      {metrics && (
        <div className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl mb-12">
          <h2 className="font-display text-2xl uppercase tracking-tight mb-6">Porównanie Metryk</h2>
          <div className="space-y-4">
            {metrics.map((m: any) => (
              <div key={m.key} className="grid grid-cols-3 gap-4 items-center py-3 border-b border-white/[0.05]">
                <div className={`text-sm font-bold text-right ${m.winner === 'a' ? 'text-orange-400' : 'text-white/60'}`}>
                  {m.a} {m.winner === 'a' && '✓'}
                </div>
                <div className="text-center text-[9px] font-mono text-white/30 uppercase tracking-widest">{m.key}</div>
                <div className={`text-sm font-bold ${m.winner === 'b' ? 'text-orange-400' : 'text-white/60'}`}>
                  {m.b} {m.winner === 'b' && '✓'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verdict */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-12 rounded-[3rem] mb-14 shadow-2xl shadow-orange-500/20">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 mb-4">Werdykt TechTrends.pl</p>
        <h3 className="font-display text-3xl md:text-4xl uppercase tracking-tighter mb-5">Co wybrać?</h3>
        <p className="text-lg md:text-xl leading-relaxed opacity-90">{verdict}</p>
      </div>

      {/* Use cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {[
          { tech: techA, title: `Kiedy wybrać ${techA.name}?`, points: techA.use_cases || ['Projekty webowe', 'API development', 'Szybki start'] },
          { tech: techB, title: `Kiedy wybrać ${techB.name}?`, points: techB.use_cases || ['Projekty webowe', 'Skalowalne systemy', 'Enterprise'] },
        ].map((item, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl">
            <h3 className="font-display text-2xl uppercase tracking-tight mb-5">{item.title}</h3>
            <ul className="space-y-2">
              {item.points.map((pt: string) => (
                <li key={pt} className="flex items-center gap-3 text-sm text-white/60">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                  {pt.replace(/-/g, ' ')}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Related comparison links */}
      <div>
        <h2 className="font-display text-2xl uppercase tracking-tight mb-5">Sprawdź też inne Porównania</h2>
        <div className="flex flex-wrap gap-3">
          {allComps.filter(c => c.slug !== comparison).slice(0, 10).map((c: any) => (
            <Link key={c.slug} to={`/porownaj/${c.slug}`}
              className="px-4 py-2 bg-white/[0.03] border border-white/[0.07] rounded-full text-[10px] font-bold uppercase tracking-wider hover:border-orange-500/40 hover:text-orange-400 transition-all">
              {c.slug.replace(/-vs-/, ' vs ').replace(/-/g, ' ')}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ComparisonIndexPage = () => {
  const [meta, setMeta] = useState<any>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/api/meta').then(r => r.json()).then(setMeta);
  }, []);

  const pairs = meta?.top_comparison_pairs?.filter((p: any) =>
    !filter || p.slug.includes(filter.toLowerCase())
  ) || [];

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Porównaj', path: '/porownaj' }]} />
      <h1 className="font-display text-[clamp(3rem,10vw,7rem)] uppercase tracking-tighter leading-none mb-4">
        Porównaj <span className="text-orange-500">Technologie</span>
      </h1>
      <p className="text-white/40 text-lg mb-10">Top {pairs.length} porównań według popularności</p>
      <input type="text" placeholder="Filtruj porównania..." value={filter} onChange={e => setFilter(e.target.value)}
        className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-orange-500 mb-10 transition-colors" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pairs.slice(0, 60).map((p: any) => {
          const [a, ...bParts] = p.slug.split('-vs-');
          const b = bParts.join('-');
          return (
            <Link key={p.slug} to={`/porownaj/${p.slug}`}
              className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-orange-500/30 hover:bg-white/[0.06] transition-all group">
              <span className="font-bold text-sm uppercase tracking-wide">
                <span className="group-hover:text-orange-400 transition-colors">{a.replace(/-/g, ' ')}</span> <span className="text-orange-500">vs</span> {b.replace(/-/g, ' ')}
              </span>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-orange-500 transition-colors flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const TrendsPage = () => {
  const [techs, setTechs] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/technologies').then(r => r.json()).then(d => setTechs([...d].sort((a, b) => b.gh_stars - a.gh_stars)));
  }, []);

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Trendy', path: '/trendy' }]} />
      <h1 className="font-display text-[clamp(3rem,10vw,7rem)] uppercase tracking-tighter leading-none mb-4">
        Trendy <span className="text-orange-500">{new Date().getFullYear()}</span>
      </h1>
      <p className="text-white/40 text-lg mb-14">Ranking popularności według GitHub Stars</p>
      <div className="space-y-3">
        {techs.map((tech, i) => {
          const maxStars = techs[0]?.gh_stars || 1;
          const pct = Math.max(5, (tech.gh_stars / maxStars) * 100);
          return (
            <motion.div key={tech.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.03, 1) }}
              className="flex items-center gap-6 p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-orange-500/20 transition-all group">
              <span className="font-display text-3xl text-white/10 group-hover:text-orange-500 transition-colors w-10 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-2">
                  <Link to={`/technologie/${tech.slug}`} className="font-bold text-sm uppercase tracking-wide group-hover:text-orange-400 transition-colors">{tech.name}</Link>
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono text-white/30">{tech.category}</span>
                    <span className="text-xs font-mono font-bold text-orange-400">{tech.gh_stars > 0 ? `★ ${(tech.gh_stars / 1000).toFixed(0)}k` : 'N/A'}</span>
                  </div>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.02 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                </div>
              </div>
              <Link to={`/trendy/${tech.slug}`} className="text-[9px] font-bold uppercase text-white/20 hover:text-orange-500 transition-colors flex-shrink-0">
                Historia →
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export const TechTrendPage = () => {
  const { slug, year } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !year) return;
    setLoading(true);
    fetch(`/api/trendy/${slug}/${year}`).then(r => r.json())
      .then(d => { setData(d?.error ? null : d); }).finally(() => setLoading(false));
  }, [slug, year]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <NotFoundSection />;

  const { tech, quarterly, yoy_growth, trends_summary } = data;
  const years = [2022, 2023, 2024, 2025, 2026];

  return (
    <div className="pt-28 px-6 max-w-5xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Trendy', path: '/trendy' }, { name: tech.name, path: `/trendy/${tech.slug}` }, { name: year || '', path: '#' }]} />
      <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] uppercase tracking-tighter leading-none mb-4">
        Popularność <span className="text-orange-500">{tech.name}</span> w {year}
      </h1>
      <p className="text-white/40 text-lg mb-8">{trends_summary}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <StatCard label="Wzrost YoY" value={`${yoy_growth > 0 ? '+' : ''}${yoy_growth}%`} accent={yoy_growth > 0} />
        <StatCard label="GitHub Stars (est.)" value={`${(tech.gh_stars / 1000).toFixed(0)}k`} />
        <StatCard label="Kategoria" value={tech.category} />
      </div>
      <div className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl mb-10">
        <h2 className="font-display text-2xl uppercase mb-6">Kwartalne Dane {year}</h2>
        <div className="space-y-5">
          {quarterly.map((q: any) => {
            const maxStars = Math.max(...quarterly.map((x: any) => x.gh_stars));
            const pct = (q.gh_stars / maxStars) * 100;
            return (
              <div key={q.quarter}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold">{q.quarter}</span>
                  <span className="text-xs font-mono text-orange-400">★ {(q.gh_stars / 1000).toFixed(0)}k stars</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h2 className="font-display text-2xl uppercase mb-4">Historia popularności {tech.name}</h2>
        <div className="flex gap-3 flex-wrap">
          {years.map(y => (
            <Link key={y} to={`/trendy/${tech.slug}/${y}`}
              className={`px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${parseInt(year || '0') === y ? 'bg-orange-500 text-white' : 'bg-white/[0.03] border border-white/[0.07] hover:border-orange-500/40'}`}>
              {y}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TechTrendIndexPage = () => {
  const { slug } = useParams();
  const years = [2022, 2023, 2024, 2025, 2026];
  const [tech, setTech] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/technologies/${slug}`).then(r => r.json()).then(d => { setTech(d?.error ? null : d); });
  }, [slug]);

  if (!tech) return <LoadingSpinner />;

  return (
    <div className="pt-28 px-6 max-w-4xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Trendy', path: '/trendy' }, { name: tech.name, path: '#' }]} />
      <h1 className="font-display text-[clamp(3rem,9vw,7rem)] uppercase tracking-tighter leading-none mb-4">
        Historia <span className="text-orange-500">{tech.name}</span>
      </h1>
      <p className="text-white/40 text-lg mb-10">Wybierz rok aby zobaczyć szczegółowe dane</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {years.map(y => (
          <Link key={y} to={`/trendy/${slug}/${y}`}
            className="p-8 bg-white/[0.03] border border-white/[0.07] rounded-3xl hover:border-orange-500/30 hover:bg-white/[0.06] transition-all group">
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">Dane historyczne</p>
            <p className="font-display text-6xl group-hover:text-orange-400 transition-colors">{y}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
