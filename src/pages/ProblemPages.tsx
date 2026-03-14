import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { Breadcrumbs, LoadingSpinner, NotFoundSection, SectionHeader } from '../components/UI';

export const ProblemIndexPage = () => {
  const { tech: techSlug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!techSlug) return;
    setLoading(true);
    fetch(`/api/problems/${techSlug}`).then(r => r.json())
      .then(d => { setData(d?.error ? null : d); }).finally(() => setLoading(false));
  }, [techSlug]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <NotFoundSection />;

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Technologie', path: '/technologie' }, { name: data.tech.name, path: `/technologie/${data.tech.slug}` }, { name: 'Problemy', path: '#' }]} />
      <SectionHeader label="Troubleshooting" title={`Problemy z ${data.tech.name}`} subtitle="Najczęstsze błędy i ich rozwiązania" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.problems.map((prob: any) => (
          <Link key={prob.slug} to={`/problemy/${data.tech.slug}/${prob.slug}`}
            className="group flex items-center justify-between p-7 bg-white/[0.03] border border-white/[0.07] rounded-3xl hover:border-orange-500/30 hover:bg-white/[0.06] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide group-hover:text-orange-400 transition-colors">{prob.name}</h3>
                <span className="text-[9px] font-mono text-white/30 uppercase">{prob.category}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-orange-500 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export const ProblemDetailPage = () => {
  const { tech: techSlug, slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!techSlug || !slug) return;
    setLoading(true);
    fetch(`/api/problems/${techSlug}/${slug}`).then(r => r.json())
      .then(d => { setData(d?.error ? null : d); }).finally(() => setLoading(false));
  }, [techSlug, slug]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <NotFoundSection />;

  return (
    <div className="pt-28 px-6 max-w-4xl mx-auto pb-24">
      <Breadcrumbs items={[
        { name: 'Technologie', path: '/technologie' },
        { name: data.tech.name, path: `/technologie/${data.tech.slug}` },
        { name: 'Problemy', path: `/problemy/${data.tech.slug}` },
        { name: data.name, path: '#' }
      ]} />
      
      <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl mb-10">
        <div className="flex items-center gap-3 text-red-500 mb-6">
          <AlertCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Problem / Błąd</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-6">
          {data.name} <span className="text-white/20">w</span> {data.tech.name}
        </h1>
        <p className="text-white/60 text-lg">Typowy błąd w kategorii {data.category}.</p>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] p-10 rounded-3xl mb-10">
        <div className="flex items-center gap-3 text-green-500 mb-6">
          <CheckCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Szybkie Rozwiązanie</span>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-white/80 leading-relaxed mb-8">
            {data.solution}
          </p>
          <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm">
            <p className="text-white/40 mb-2"># Sugerowany krok:</p>
            <p className="text-orange-400">npm check {data.tech.slug} --fix</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to={`/technologie/${data.tech.slug}`} className="p-8 bg-white/[0.03] border border-white/[0.07] rounded-3xl hover:border-orange-500/30 transition-all">
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Więcej o...</p>
          <p className="font-display text-2xl uppercase">{data.tech.name} Profile</p>
        </Link>
        <Link to={`/problemy/${data.tech.slug}`} className="p-8 bg-white/[0.03] border border-white/[0.07] rounded-3xl hover:border-orange-500/30 transition-all">
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Inne błędy</p>
          <p className="font-display text-2xl uppercase">Troubleshooting →</p>
        </Link>
      </div>
    </div>
  );
};
