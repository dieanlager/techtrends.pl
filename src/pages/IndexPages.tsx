import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Breadcrumbs, TechCard, SectionHeader, LoadingSpinner } from '../components/UI';

export const HomePage = () => {
  const [techs, setTechs] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    fetch('/api/technologies').then(r => r.json()).then(setTechs);
    fetch('/api/meta').then(r => r.json()).then(setMeta);
  }, []);

  const topTechs = [...techs].sort((a, b) => b.gh_stars - a.gh_stars).slice(0, 9);
  const categories = meta?.categories || [];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="pt-36 pb-24 px-6 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-orange-500 mb-6">Wyszukiwarka Technologii IT</p>
          <h1 className="font-display text-[clamp(3.5rem,14vw,11rem)] uppercase tracking-tighter leading-none mb-8">
            Największa<br />
            <span className="text-white/15">Baza</span><br />
            Technologii<span className="text-orange-500">.</span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mb-12 leading-relaxed">
            {meta?.total_technologies || '100'}+ technologii, {' '}
            {meta?.top_comparison_pairs?.length || '200'}+ porównań, zarobki w każdym mieście. 
            TechTrends.pl to największy w Polsce katalog technologii dla developerów.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/technologie" className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/30">
              Przeglądaj technologie →
            </Link>
            <Link to="/porownaj" className="border border-white/10 px-8 py-4 rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-white/5 transition-all">
              Porównaj technologie
            </Link>
          </div>
        </motion.div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {[
            { label: 'Technologii', value: meta?.total_technologies || '100+' },
            { label: 'Porównań', value: `${meta?.top_comparison_pairs?.length || '200'}+` },
            { label: 'Kategorii', value: categories.length || '10' },
            { label: 'Lokalizacji zarobkowych', value: '8' },
          ].map(s => (
            <div key={s.label} className="text-center p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
              <p className="font-display text-4xl text-orange-500">{s.value}</p>
              <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-white/[0.07] py-4 overflow-hidden mb-20">
        <div className="flex animate-marquee whitespace-nowrap gap-12">
          {[...techs, ...techs].map((t, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-orange-500" /> {t.name}
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <SectionHeader label="Taksonomia" title="Kategorie" subtitle="Przeglądaj teknologie według dziedziny" />
        <div className="flex flex-wrap gap-3">
          {categories.map((cat: string) => (
            <Link key={cat} to={`/kategorie/${cat.toLowerCase()}`}
              className="px-5 py-3 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all font-bold uppercase text-[10px] tracking-widest">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Top technologie */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <div className="flex justify-between items-end mb-10">
          <SectionHeader label="Top Technologie" title="Najbardziej Popularne" />
          <Link to="/technologie" className="text-[10px] font-bold uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors mb-12">
            Zobacz wszystkie →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topTechs.map((tech, i) => (
            <motion.div key={tech.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <TechCard tech={tech} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison CTA */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-32 -translate-y-32" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-32 translate-y-32" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 mb-4 relative z-10">Baza Wiedzy</p>
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-6 text-white relative z-10">
            Porównaj Technologie
          </h2>
          <p className="text-white/80 text-lg mb-10 relative z-10">
            {meta?.top_comparison_pairs?.length || 200}+ stron porównawczych — React vs Vue, Python vs JavaScript, i wiele więcej
          </p>
          <Link to="/porownaj" className="relative z-10 inline-block bg-white text-black px-10 py-4 rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-orange-100 transition-all shadow-xl">
            Przejdź do porównań →
          </Link>
        </div>
      </section>

      {/* Salary CTA */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/[0.07] p-10 rounded-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500 mb-4">Zarobki</p>
            <h3 className="font-display text-4xl uppercase tracking-tight mb-4">Ile zarabia developer w Polsce?</h3>
            <p className="text-white/40 text-sm mb-7">Zarobki według technologii, miasta i poziomu doświadczenia</p>
            <Link to="/zarobki" className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest hover:gap-3 transition-all">
              Sprawdź zarobki <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.07] p-10 rounded-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500 mb-4">Stacki</p>
            <h3 className="font-display text-4xl uppercase tracking-tight mb-4">Popularne Tech Stacki</h3>
            <p className="text-white/40 text-sm mb-7">Gotowe zestawy technologii do różnych typów projektów</p>
            <Link to="/stack" className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest hover:gap-3 transition-all">
              Przeglądaj stacki <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export const TechnologiesIndexPage = () => {
  const [techs, setTechs] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    fetch('/api/technologies').then(r => r.json()).then(setTechs);
    fetch('/api/meta').then(r => r.json()).then(setMeta);
  }, []);

  const filtered = techs.filter(t =>
    (!category || t.category.toLowerCase() === category.toLowerCase()) &&
    (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tagline.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Technologie', path: '/technologie' }]} />
      <SectionHeader label={`${techs.length} Technologii`} title="Baza Technologii" subtitle="Największy w Polsce katalog technologii, frameworków i narzędzi" />

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input type="text" placeholder="Szukaj technologii..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-orange-500 transition-colors" />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-orange-500 transition-colors min-w-40">
          <option value="">Wszystkie kategorie</option>
          {meta?.categories?.map((c: string) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-6">{filtered.length} wyników</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tech, i) => (
          <motion.div key={tech.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}>
            <TechCard tech={tech} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const CategoryPage = () => {
  const { category } = useParams();
  const [techs, setTechs] = useState<any[]>([]);

  useEffect(() => {
    if (!category) return;
    fetch(`/api/technologies?category=${category}`).then(r => r.json()).then(setTechs);
  }, [category]);

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Kategorie', path: '/kategorie' }, { name: category || '', path: '#' }]} />
      <h1 className="font-display text-[clamp(3rem,10vw,8rem)] uppercase tracking-tighter leading-none mb-4">
        {category} <span className="text-white/15">Technologie</span>
      </h1>
      <p className="text-white/40 text-lg mb-14">{techs.length} technologii w tej kategorii</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {techs.map(tech => <TechCard key={tech.id} tech={tech} />)}
      </div>
    </div>
  );
};

export const SalaryIndexPage = () => {
  const [techs, setTechs] = useState<any[]>([]);
  useEffect(() => { fetch('/api/technologies').then(r => r.json()).then(setTechs); }, []);

  const sorted = [...techs].sort((a, b) => b.salary_avg - a.salary_avg);

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Zarobki', path: '/zarobki' }]} />
      <SectionHeader label="Ranking Zarobków 2026" title="Ile Zarabia Developer?" subtitle="Porównaj zarobki według technologii w Polsce" />
      <div className="space-y-3">
        {sorted.map((tech, i) => (
          <Link key={tech.id} to={`/zarobki/${tech.slug}`}
            className="flex items-center gap-6 p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-orange-500/30 hover:bg-white/[0.05] transition-all group">
            <span className="text-3xl font-display text-white/10 group-hover:text-orange-500 transition-colors w-10 flex-shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-sm group-hover:text-orange-400 transition-colors">{tech.name}</span>
                <span className="font-display text-xl text-orange-500">{tech.salary_avg.toLocaleString()} PLN</span>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-mono text-white/20 uppercase">
                <span>{tech.category}</span>
                <span>·</span>
                <span>Senior: {(tech.salary_avg * 1.55).toLocaleString()} PLN</span>
                <span>·</span>
                <span>Junior: {(tech.salary_avg * 0.6).toLocaleString()} PLN</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-orange-500 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
};
