import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Github, ExternalLink, Layers, Info } from 'lucide-react';
import { Breadcrumbs, TechSchema, FAQSchema, LoadingSpinner, NotFoundSection, StatCard } from '../components/UI';
import { cn } from '../lib/utils';

interface Technology {
  id: string; slug: string; name: string; tagline: string; category: string; subcategory?: string;
  gh_stars: number; npm_dls: number; description: string; salary_avg: number; difficulty: string;
  alternatives?: string[]; errors?: string[]; integrations?: string[]; license?: string;
  first_release?: string; latest_version?: string; repo_url?: string; roles?: string[]; use_cases?: string[];
}

function useTech(slug: string | undefined) {
  const [tech, setTech] = useState<Technology | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/technologies/${slug}`).then(r => r.json())
      .then(d => { setTech(d?.error ? null : d); })
      .finally(() => setLoading(false));
  }, [slug]);
  return { tech, loading };
}

const SubNav = ({ tech }: { tech: Technology }) => {
  const loc = useLocation();
  const items = [
    { name: 'Przegląd', path: `/technologie/${tech.slug}` },
    { name: 'Zarobki', path: `/technologie/${tech.slug}/zarobki` },
    { name: 'Alternatywy', path: `/alternatewy/${tech.slug}` },
    { name: 'Kursy', path: `/technologie/${tech.slug}/kurs` },
    { name: 'Pytania', path: `/technologie/${tech.slug}/pytania` },
    { name: 'Integracje', path: `/technologie/${tech.slug}/integracje` },
  ];
  return (
    <div className="flex gap-2 flex-wrap mb-10 border-b border-white/[0.07] pb-5">
      {items.map(item => (
        <Link key={item.path} to={item.path}
          className={cn(
            "text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all whitespace-nowrap",
            loc.pathname === item.path ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-white/40 hover:text-white hover:bg-white/5"
          )}>
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export const TechProfilePage = () => {
  const { slug } = useParams();
  const { tech, loading } = useTech(slug);
  const [allTechs, setAllTechs] = useState<Technology[]>([]);

  useEffect(() => { fetch('/api/technologies').then(r => r.json()).then(setAllTechs).catch(() => {}); }, []);
  if (loading) return <LoadingSpinner />;
  if (!tech) return <NotFoundSection />;

  const related = allTechs.filter(t => t.category === tech.category && t.slug !== tech.slug).slice(0, 4);
  const compareTargets = allTechs.filter(t => t.category === tech.category && t.slug !== tech.slug).slice(0, 5);
  const faqs = [
    { q: `Co to jest ${tech.name} i do czego służy?`, a: `${tech.name} to ${tech.tagline}. ${tech.description}` },
    { q: `Ile zarabia ${tech.name} developer w Polsce?`, a: `Średnie zarobki ${tech.name} developera wynoszą ${tech.salary_avg.toLocaleString()} PLN miesięcznie. Junior może liczyć na ok. ${(tech.salary_avg * 0.6).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} PLN, a senior na ${(tech.salary_avg * 1.55).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} PLN.` },
    { q: `Czy ${tech.name} jest trudne do nauczenia?`, a: `${tech.name} ma poziom trudności: ${tech.difficulty}. ${tech.difficulty === 'Beginner' ? 'Jest przystępne dla osób zaczynających przygodę z programowaniem.' : tech.difficulty === 'Intermediate' ? 'Wymaga podstawowej wiedzy programistycznej, ale jest dostępne dla większości developerów.' : 'Wymaga solidnej bazy technicznej i doświadczenia w programowaniu.'}` },
    { q: `Jakie są alternatywy dla ${tech.name}?`, a: `Najpopularniejsze alternatywy dla ${tech.name} to: ${tech.alternatives?.join(', ') || 'brak'}. Sprawdź nasze strony porównawcze, aby zobaczyć szczegółowe porównania.` },
    { q: `Jaka jest licencja ${tech.name}?`, a: `${tech.name} jest dostępne na licencji ${tech.license || 'Open Source'}. Pierwsza wersja ukazała się w ${tech.first_release || 'nieznany'} roku.` },
  ];

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <TechSchema tech={tech} />
      <FAQSchema questions={faqs} />
      <Breadcrumbs items={[{ name: 'Technologie', path: '/technologie' }, { name: tech.name, path: `/technologie/${tech.slug}` }]} />
      <SubNav tech={tech} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 text-orange-500 mb-5">
              <Info className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-[0.35em]">{tech.subcategory || tech.category} Profile</span>
            </div>
            <h1 className="font-display text-[clamp(4rem,12vw,9rem)] uppercase tracking-tighter leading-none mb-6">{tech.name}</h1>
            <p className="text-xl text-white/60 leading-relaxed max-w-2xl">{tech.description}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="GitHub Stars" value={tech.gh_stars > 0 ? `${(tech.gh_stars / 1000).toFixed(0)}k` : 'N/A'} />
            <StatCard label="Avg Zarobki" value={`${(tech.salary_avg / 1000).toFixed(0)}k PLN`} accent />
            <StatCard label="Trudność" value={tech.difficulty} />
            <StatCard label="Rok wydania" value={tech.first_release || 'N/A'} />
          </div>

          {tech.npm_dls > 0 && (
            <div className="bg-white/[0.03] border border-white/[0.07] p-6 rounded-3xl">
              <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-3">npm Downloads / tydzień</p>
              <div className="flex items-end gap-2">
                <span className="font-display text-4xl">{(tech.npm_dls / 1000000).toFixed(1)}M</span>
                <span className="text-white/40 text-sm mb-1">tygodniowo</span>
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-3xl uppercase tracking-tight mb-5">Powiązane Technologie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {related.map(r => (
                <Link key={r.id} to={`/technologie/${r.slug}`}
                  className="flex items-center justify-between p-5 bg-white/[0.03] rounded-2xl border border-white/[0.07] hover:border-orange-500/30 hover:bg-white/[0.06] transition-all group">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-sm">{r.name}</span>
                    <span className="block text-[9px] text-white/30 uppercase mt-1">{r.category}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl uppercase tracking-tight mb-5">FAQ — Najczęstsze Pytania</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.07] p-6 rounded-2xl">
                  <h3 className="font-bold text-orange-400 mb-3 text-sm">{faq.q}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {tech.roles && tech.roles.length > 0 && (
            <div>
              <h2 className="font-display text-3xl uppercase tracking-tight mb-5">{tech.name} Dla Roli</h2>
              <div className="flex flex-wrap gap-3">
                {tech.roles.map(role => (
                  <Link key={role} to={`/dla/${role}/${tech.slug}`}
                    className="px-5 py-3 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-orange-500/40 hover:bg-orange-500/5 transition-all text-[10px] font-bold uppercase tracking-widest">
                    {role.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-8 rounded-3xl shadow-xl shadow-orange-500/20">
            <h3 className="font-display text-2xl uppercase tracking-tight mb-5">Porównaj z...</h3>
            <div className="space-y-2">
              {compareTargets.map(t => (
                <Link key={t.id} to={`/porownaj/${tech.slug}-vs-${t.slug}`}
                  className="flex items-center justify-between p-3 bg-black/15 rounded-xl hover:bg-black/25 transition-all font-bold uppercase text-[10px] tracking-widest">
                  <span>{tech.name} vs {t.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {tech.repo_url && (
            <a href={tech.repo_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:bg-white/[0.06] transition-all">
              <Github className="w-5 h-5 text-orange-500" />
              <div><p className="text-xs font-bold">GitHub Repository</p><p className="text-[9px] text-white/30 mt-0.5">Kod źródłowy</p></div>
              <ExternalLink className="w-4 h-4 ml-auto text-white/20" />
            </a>
          )}

          <div className="bg-white/[0.03] border border-white/[0.07] p-6 rounded-3xl">
            <h3 className="font-display text-xl uppercase tracking-tight mb-5">Szczegóły</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Licencja', value: tech.license || 'N/A' },
                { label: 'Pierwsza wersja', value: tech.first_release || 'N/A' },
                { label: 'Kategoria', value: tech.category },
                { label: 'Trudność', value: tech.difficulty },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                  <span className="text-white/30 text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
                  <span className="font-mono text-xs">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <Link to={`/zarobki/${tech.slug}`}
            className="block p-6 bg-white/[0.03] border border-white/[0.07] rounded-3xl hover:border-orange-500/30 transition-all group">
            <p className="text-[9px] font-bold uppercase tracking-widest text-orange-500 mb-2">Sprawdź zarobki</p>
            <p className="font-display text-2xl uppercase">{tech.name} Developer</p>
            <p className="text-white/40 text-xs mt-2">od {(tech.salary_avg * 0.6).toLocaleString()} PLN do {(tech.salary_avg * 1.6).toLocaleString()} PLN</p>
            <div className="flex items-center gap-2 mt-4 text-orange-500 group-hover:translate-x-1 transition-transform">
              <span className="text-[10px] font-bold uppercase tracking-widest">Zobacz więcej</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {tech.integrations && tech.integrations.length > 0 && (
            <div className="bg-white/[0.03] border border-white/[0.07] p-6 rounded-3xl">
              <h3 className="font-display text-xl uppercase tracking-tight mb-4">Integracje</h3>
              <div className="flex flex-wrap gap-2">
                {tech.integrations.map(int => (
                  <Link key={int} to={`/technologie/${int}`}
                    className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.07] rounded-xl hover:border-orange-500/30 transition-all text-[9px] font-bold uppercase tracking-wider">
                    <Layers className="w-3 h-3 text-orange-500" /> {int}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SalaryPage = () => {
  const { slug } = useParams();
  const { tech, loading } = useTech(slug);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/zarobki/${slug}`).then(r => r.json()).then(d => { if (!d?.error) setData(d); }).catch(() => {});
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!tech) return <NotFoundSection />;

  const salarySchema = {
    '@context': 'https://schema.org',
    '@type': 'Occupation',
    name: `${tech.name} Developer`,
    occupationLocation: { '@type': 'Country', name: 'Polska' },
    estimatedSalary: {
      '@type': 'MonetaryAmountDistribution',
      name: 'base',
      currency: 'PLN',
      duration: 'P1M',
      percentile10: Math.round(tech.salary_avg * 0.55),
      median: tech.salary_avg,
      percentile90: Math.round(tech.salary_avg * 1.6),
    },
  };

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(salarySchema) }} />
      <Breadcrumbs items={[{ name: 'Zarobki', path: '/zarobki' }, { name: tech.name, path: `/zarobki/${tech.slug}` }]} />
      <h1 className="font-display text-[clamp(3rem,10vw,7rem)] uppercase tracking-tighter leading-none mb-4">
        Zarobki <span className="text-orange-500">{tech.name}</span> Developer
      </h1>
      <p className="text-white/40 text-lg mb-14">Aktualne widełki płac w Polsce, 2026</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <StatCard label="Junior (0–2 lata)" value={`${(tech.salary_avg * 0.6).toLocaleString()} PLN`} />
        <StatCard label="Mid (2–5 lat)" value={`${tech.salary_avg.toLocaleString()} PLN`} accent />
        <StatCard label="Senior (5+ lat)" value={`${(tech.salary_avg * 1.55).toLocaleString()} PLN`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
        <div className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl">
          <h2 className="font-display text-2xl uppercase tracking-tight mb-6">Zarobki vs Lokalizacja</h2>
          {data?.locations?.map((loc: any) => {
            const salary = Math.round(tech.salary_avg * loc.multiplier / 100) * 100;
            const pct = (salary / (tech.salary_avg * 2.5)) * 100;
            return (
              <div key={loc.slug} className="mb-4">
                <div className="flex justify-between mb-1">
                  <Link to={`/zarobki/${tech.slug}/${loc.slug}/mid`} className="text-xs font-bold hover:text-orange-500 transition-colors">{loc.name}</Link>
                  <span className="text-xs font-mono text-orange-400">{salary.toLocaleString()} PLN</span>
                </div>
                <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl">
          <h2 className="font-display text-2xl uppercase tracking-tight mb-6">Zarobki vs Poziom</h2>
          {data?.levels?.map((lvl: any) => {
            const salary = Math.round(tech.salary_avg * lvl.multiplier / 100) * 100;
            const pct = (salary / (tech.salary_avg * 2)) * 100;
            return (
              <div key={lvl.slug} className="mb-4">
                <div className="flex justify-between mb-1">
                  <Link to={`/zarobki/${tech.slug}/polska/${lvl.slug}`} className="text-xs font-bold hover:text-orange-500 transition-colors">{lvl.name}</Link>
                  <span className="text-xs font-mono text-orange-400">{salary.toLocaleString()} PLN</span>
                </div>
                <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl mb-10">
        <h2 className="font-display text-2xl uppercase tracking-tight mb-4">Zaробki {tech.name} w Miastach</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { city: 'Warszawa', slug: 'warszawa', mult: 1.35 },
            { city: 'Wrocław', slug: 'wroclaw', mult: 1.18 },
            { city: 'Kraków', slug: 'krakow', mult: 1.15 },
            { city: 'Gdańsk', slug: 'gdansk', mult: 1.12 },
          ].map(({ city, slug: cSlug, mult }) => (
            <Link key={cSlug} to={`/zarobki/${tech.slug}/${cSlug}/mid`}
              className="p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-orange-500/30 hover:bg-white/[0.06] transition-all text-center group">
              <p className="text-orange-500 font-display text-2xl">{Math.round(tech.salary_avg * mult / 100) * 100}</p>
              <p className="text-[9px] font-mono text-white/30 uppercase mt-1">PLN / mies.</p>
              <p className="text-xs font-bold mt-2 group-hover:text-orange-400 transition-colors">{city}</p>
            </Link>
          ))}
        </div>
      </div>

      <p className="text-white/40 text-base leading-relaxed max-w-3xl">
        Zarobki {tech.name} developer w Polsce w 2026 roku kształtują się w zależności od lokalizacji, doświadczenia i trybu pracy.
        Największe zarobki oferują firmy w Warszawie i projekty remote. Senior {tech.name} developer może liczyć 
        nawet na {(tech.salary_avg * 1.6).toLocaleString()} PLN miesięcznie przy pracy zdalnej z zachodnią firmą.
      </p>
    </div>
  );
};

export const SalaryDetailPage = () => {
  const { slug, location, level } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !location || !level) return;
    setLoading(true);
    fetch(`/api/zarobki/${slug}/${location}/${level}`).then(r => r.json())
      .then(d => { setData(d?.error ? null : d); }).finally(() => setLoading(false));
  }, [slug, location, level]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <NotFoundSection />;

  const { tech, location: loc, level: lvl, salary_monthly, salary_yearly } = data;

  return (
    <div className="pt-28 px-6 max-w-5xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Zarobki', path: '/zarobki' }, { name: tech.name, path: `/zarobki/${tech.slug}` }, { name: `${loc.name} / ${lvl.name}`, path: '#' }]} />
      <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] uppercase tracking-tighter leading-none mb-6">
        Zarobki {tech.name}<br />
        <span className="text-orange-500">{lvl.name}</span> — {loc.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard label="Miesięcznie (netto)" value={`${salary_monthly.toLocaleString()} PLN`} accent />
        <StatCard label="Rocznie (netto)" value={`${(salary_yearly / 1000).toFixed(0)}k PLN`} />
        <StatCard label="Popyt rynkowy" value={data.market_demand} />
      </div>
      <div className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl prose prose-invert max-w-none">
        <p className="text-white/60 leading-relaxed">
          {lvl.name} {tech.name} developer pracujący w {loc.name} zarabia w 2026 roku średnio {salary_monthly.toLocaleString()} PLN netto miesięcznie, 
          co daje {salary_yearly.toLocaleString()} PLN rocznie. Widełki wahają się od {data.salary_junior.toLocaleString()} PLN 
          do {data.salary_senior.toLocaleString()} PLN w zależności od firmy i dodatkowych umiejętności.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 w-full mb-2">Sprawdź inne lokalizacje:</p>
        {['warszawa', 'krakow', 'wroclaw', 'gdansk', 'zdalnie'].filter(l => l !== location).map(l => (
          <Link key={l} to={`/zarobki/${slug}/${l}/${level}`}
            className="px-4 py-2 bg-white/[0.03] border border-white/[0.07] rounded-full text-[10px] font-bold uppercase hover:border-orange-500/40 transition-all">
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </Link>
        ))}
      </div>
    </div>
  );
};

export const AlternativesPage = () => {
  const { slug } = useParams();
  const { tech, loading } = useTech(slug);
  const [allTechs, setAllTechs] = useState<Technology[]>([]);

  useEffect(() => { fetch('/api/technologies').then(r => r.json()).then(setAllTechs).catch(() => {}); }, []);
  if (loading) return <LoadingSpinner />;
  if (!tech) return <NotFoundSection />;

  const alternatives = tech.alternatives?.map(alt => allTechs.find(t => t.slug === alt)).filter(Boolean) as Technology[] || [];
  const sameCat = allTechs.filter(t => t.category === tech.category && t.slug !== tech.slug && !tech.alternatives?.includes(t.slug)).slice(0, 4);

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Technologie', path: '/technologie' }, { name: tech.name, path: `/technologie/${tech.slug}` }, { name: 'Alternatywy', path: '#' }]} />
      <h1 className="font-display text-[clamp(3rem,10vw,7rem)] uppercase tracking-tighter leading-none mb-4">
        Alternatywy dla <span className="text-orange-500">{tech.name}</span>
      </h1>
      <p className="text-white/40 text-lg mb-12">Najlepsze zamienniki i konkurenci w {new Date().getFullYear()}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        {alternatives.map((alt, i) => (
          <div key={alt.id} className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl hover:border-orange-500/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-orange-500">#{i + 1} Alternatywa</span>
                <h2 className="font-display text-4xl uppercase tracking-tight mt-2">{alt.name}</h2>
              </div>
              <span className="text-[9px] bg-white/5 px-3 py-1 rounded-full font-mono text-white/30">{alt.category}</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">{alt.tagline}</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Stars', value: alt.gh_stars > 0 ? `${(alt.gh_stars / 1000).toFixed(0)}k` : 'N/A' },
                { label: 'Zarobki', value: `${(alt.salary_avg / 1000).toFixed(0)}k PLN` },
                { label: 'Trudność', value: alt.difficulty },
              ].map(m => (
                <div key={m.label} className="text-center bg-white/[0.03] rounded-2xl p-3">
                  <p className="text-[8px] font-mono text-white/25 uppercase mb-1">{m.label}</p>
                  <p className="font-bold text-sm">{m.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Link to={`/technologie/${alt.slug}`} className="flex-1 text-center py-3 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Profil</Link>
              <Link to={`/porownaj/${tech.slug}-vs-${alt.slug}`} className="flex-1 text-center py-3 bg-orange-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-400 transition-all">
                {tech.name} vs {alt.name}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {sameCat.length > 0 && (
        <div>
          <h2 className="font-display text-3xl uppercase tracking-tight mb-6">Inne w kategorii {tech.category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sameCat.map(t => (
              <Link key={t.id} to={`/technologie/${t.slug}`}
                className="p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-orange-500/30 transition-all">
                <h3 className="font-display text-2xl uppercase">{t.name}</h3>
                <p className="text-[9px] text-white/30 mt-1 line-clamp-2">{t.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const CoursePage = () => {
  const { slug } = useParams();
  const { tech, loading } = useTech(slug);
  if (loading) return <LoadingSpinner />;
  if (!tech) return <NotFoundSection />;

  const courses = [
    { title: `Kompletny Kurs ${tech.name} od Zera do Pro`, level: 'Beginner', hours: 42, rating: 4.9, students: '32,850', platform: 'Udemy', price: '69 PLN' },
    { title: `${tech.name} dla Profesjonalistów — Zaawansowane Wzorce`, level: 'Advanced', hours: 28, rating: 4.8, students: '18,200', platform: 'Udemy', price: '79 PLN' },
    { title: `Buduj Realne Projekty z ${tech.name}`, level: 'Intermediate', hours: 35, rating: 4.7, students: '25,100', platform: 'Coursera', price: 'Subskrypcja' },
    { title: `${tech.name} Bootcamp 2026 — Pełny Startup od Zera`, level: 'Intermediate', hours: 56, rating: 4.85, students: '41,300', platform: 'Udemy', price: '89 PLN' },
  ];

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Technologie', path: '/technologie' }, { name: tech.name, path: `/technologie/${tech.slug}` }, { name: 'Kursy', path: '#' }]} />
      <h1 className="font-display text-[clamp(3rem,10vw,7rem)] uppercase tracking-tighter leading-none mb-4">
        Najlepsze Kursy <span className="text-orange-500">{tech.name}</span>
      </h1>
      <p className="text-white/40 text-lg mb-12">Sprawdzone kursy i materiały edukacyjne {new Date().getFullYear()}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((c, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl hover:border-orange-500/20 transition-all">
            <div className="flex justify-between items-start mb-5">
              <span className={cn("px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest",
                c.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                c.level === 'Advanced' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400')}>
                {c.level}
              </span>
              <span className="text-[9px] font-mono text-white/30">{c.platform}</span>
            </div>
            <h3 className="font-bold text-lg leading-tight mb-4">{c.title}</h3>
            <div className="flex items-center gap-4 text-[10px] font-mono text-white/40 mb-6">
              <span>★ {c.rating} / 5</span>
              <span>{c.hours}h materiałów</span>
              <span>{c.students} uczniów</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-orange-500">{c.price}</span>
              <button className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-400 transition-all">
                Sprawdź Kurs →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RecruitmentQuestionsPage = () => {
  const { slug } = useParams();
  const { tech, loading } = useTech(slug);
  const [open, setOpen] = useState<number | null>(0);
  if (loading) return <LoadingSpinner />;
  if (!tech) return <NotFoundSection />;

  const questions = [
    { level: 'Junior', q: `Co to jest ${tech.name} i jakie są jego główne zastosowania?`, a: `${tech.name} to ${tech.tagline}. Służy do ${tech.use_cases?.join(', ') || 'budowania nowoczesnych aplikacji'}.` },
    { level: 'Junior', q: `Jakie są zalety używania ${tech.name}?`, a: `Do głównych zalet ${tech.name} należą: wysoka popularność (${tech.gh_stars > 0 ? `${(tech.gh_stars / 1000).toFixed(0)}k gwiazdek GitHub` : 'duże community'}), aktywna społeczność, ${tech.license || 'otwarta'} licencja i szerokie zastosowanie w branży.` },
    { level: 'Junior', q: `Jak wygląda krzywa uczenia ${tech.name}?`, a: `${tech.name} ma poziom trudności "${tech.difficulty}". ${tech.difficulty === 'Beginner' ? 'Doskonały punkt startowy — pierwsze projekty możesz zbudować po 1–2 tygodniach nauki.' : tech.difficulty === 'Intermediate' ? 'Potrzebujesz solidnych podstaw, ale po 3–6 miesiącach praktyki możesz pracować komercyjnie.' : 'Wymaga doświadczenia — pełna biegłość przychodzi po 1–2 latach aktywnego użytkowania.'}` },
    { level: 'Mid', q: `Opisz architekturę typowej aplikacji ${tech.name} w środowisku produkcyjnym.`, a: `Produkcyjna aplikacja ${tech.name} zazwyczaj składa się z warstwy aplikacji, persystencji danych (np. ${tech.integrations?.[0] || 'PostgreSQL'}), cache'u (np. Redis), systemu kolejkowania i mechanizmu monitorowania. Kluczowe aspekty to skalowanie horyzontalne i obsługa błędów.` },
    { level: 'Mid', q: `Jak optymalizujesz wydajność w ${tech.name}?`, a: `Optymalizacja ${tech.name} obejmuje: profilowanie bottlenecków, caching na różnych poziomach, lazy loading, optymalizację zapytań do bazy danych, CDN dla statycznych zasobów oraz horizontal scaling przy dużym obciążeniu.` },
    { level: 'Senior', q: `Jak podchodzisz do design decisions przy wyborze ${tech.name} vs ${tech.alternatives?.[0] || 'alternatywy'}?`, a: `Decyzja architektoniczna powinna uwzględniać: team skills, scalability requirements, ecosystem maturity, TCO (Total Cost of Ownership), vendor lock-in risk i long-term maintenance. ${tech.name} sprawdza się świetnie w ${tech.use_cases?.[0] || 'web'} — ale zawsze oceniam projekt-specific constraints.` },
    { level: 'Senior', q: `Jaki jest twój podejście do migracji legacy systemu do ${tech.name}?`, a: `Migracja powinna być iteracyjna: zacznij od strangler fig pattern, wydziel bounded contexts, migruj moduł po module testując A/B. Pełna migracja big-bang jest zbyt ryzykowna. Kluczowe: feature flags, parallel running, gradual traffic switch i rollback plan.` },
  ];

  const faqs = questions.map(q => ({ q: q.q, a: q.a }));

  return (
    <div className="pt-28 px-6 max-w-4xl mx-auto pb-24">
      <FAQSchema questions={faqs} />
      <Breadcrumbs items={[{ name: 'Technologie', path: '/technologie' }, { name: tech.name, path: `/technologie/${tech.slug}` }, { name: 'Pytania Rekrutacyjne', path: '#' }]} />
      <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] uppercase tracking-tighter leading-none mb-4">
        Pytania Rekrutacyjne <span className="text-orange-500">{tech.name}</span>
      </h1>
      <p className="text-white/40 text-lg mb-12">Junior / Mid / Senior — kompletna lista {new Date().getFullYear()}</p>

      <div className="space-y-4">
        {questions.map((item, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
              onClick={() => setOpen(open === i ? null : i)}>
              <div className="flex items-center gap-4">
                <span className={cn("px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest flex-shrink-0",
                  item.level === 'Junior' ? 'bg-green-500/20 text-green-400' :
                  item.level === 'Mid' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400')}>
                  {item.level}
                </span>
                <span className="font-bold text-sm">{item.q}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 text-white/30 flex-shrink-0 transition-transform ml-4", open === i && "rotate-90")} />
            </button>
            {open === i && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="overflow-hidden">
                <div className="px-6 pb-6 text-white/50 text-sm leading-relaxed border-t border-white/[0.05] pt-4">
                  {item.a}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const IntegrationsPage = () => {
  const { slug } = useParams();
  const { tech, loading } = useTech(slug);
  const [allTechs, setAllTechs] = useState<Technology[]>([]);
  useEffect(() => { fetch('/api/technologies').then(r => r.json()).then(setAllTechs).catch(() => {}); }, []);
  if (loading) return <LoadingSpinner />;
  if (!tech) return <NotFoundSection />;

  const integrationTechs = tech.integrations?.map(s => allTechs.find(t => t.slug === s)).filter(Boolean) as Technology[] || [];

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Technologie', path: '/technologie' }, { name: tech.name, path: `/technologie/${tech.slug}` }, { name: 'Integracje', path: '#' }]} />
      <h1 className="font-display text-[clamp(3rem,10vw,7rem)] uppercase tracking-tighter leading-none mb-4">
        Z czym łączyć <span className="text-orange-500">{tech.name}</span>?
      </h1>
      <p className="text-white/40 text-lg mb-12">Najpopularniejsze integracje i stacki z {tech.name}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrationTechs.length > 0
          ? integrationTechs.map(t => (
              <div key={t.id} className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl hover:border-orange-500/30 transition-all group">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-2xl flex items-center justify-center mb-5">
                  <Layers className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-display text-3xl uppercase mb-3 group-hover:text-orange-400 transition-colors">{t.name}</h3>
                <p className="text-white/40 text-xs mb-5">{t.tagline}</p>
                <div className="flex gap-3">
                  <Link to={`/technologie/${t.slug}`} className="flex-1 text-center py-2.5 bg-white/5 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Profil</Link>
                  <Link to={`/integracje/${tech.slug}/${t.slug}`} className="flex-1 text-center py-2.5 bg-orange-500 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-orange-400 transition-all">Jak połączyć</Link>
                </div>
              </div>
            ))
          : tech.integrations?.map(int => (
              <div key={int} className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl hover:border-orange-500/30 transition-all">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-5">
                  <Layers className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-display text-3xl uppercase mb-2">{int}</h3>
                <p className="text-white/40 text-xs">Oficjalna integracja</p>
              </div>
            ))
        }
      </div>
    </div>
  );
};
