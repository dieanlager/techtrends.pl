import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Layers } from 'lucide-react';
import { Breadcrumbs, TechCard, SectionHeader, LoadingSpinner, NotFoundSection } from '../components/UI';

export const StackIndexPage = () => {
  const [stacks, setStacks] = useState<any[]>([]);
  useEffect(() => { fetch('/api/stacks').then(r => r.json()).then(setStacks); }, []);

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Stacki', path: '/stack' }]} />
      <SectionHeader label="Popularne Zestawy" title="Tech Stacki" subtitle="Gotowe kombinacje technologii do różnych typów projektów" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stacks.map((stack: any) => (
          <Link key={stack.slug} to={`/stack/${stack.slug}`}
            className="group bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl hover:border-orange-500/30 hover:bg-white/[0.06] transition-all">
            <div className="flex justify-between items-start mb-5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">{stack.use_case}</span>
              <span className="text-[9px] font-mono text-white/20">{stack.techs?.length || 0} technologii</span>
            </div>
            <h3 className="font-display text-2xl uppercase tracking-tight mb-3 group-hover:text-orange-400 transition-colors">{stack.name}</h3>
            <p className="text-white/40 text-sm mb-6">{stack.description}</p>
            <div className="flex flex-wrap gap-2">
              {stack.techs?.map((t: string) => (
                <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-mono text-white/40">{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const StackDetailPage = () => {
  const { slug } = useParams();
  const [stack, setStack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/stacks/${slug}`).then(r => r.json())
      .then(d => { setStack(d?.error ? null : d); }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!stack) return <NotFoundSection />;

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Stacki', path: '/stack' }, { name: stack.name, path: '#' }]} />
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500 mb-4">{stack.use_case} Stack</p>
      <h1 className="font-display text-[clamp(2rem,7vw,5rem)] uppercase tracking-tighter leading-none mb-4">{stack.name}</h1>
      <p className="text-white/40 text-lg max-w-2xl mb-14">{stack.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        {stack.tech_data?.map((tech: any) => tech && <TechCard key={tech.id} tech={tech} />)}
      </div>
      <div className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl">
        <h2 className="font-display text-2xl uppercase tracking-tight mb-5">Dlaczego ten stack?</h2>
        <p className="text-white/50 leading-relaxed">
          Stack {stack.name} to sprawdzona kombinacja narzędzi do budowania {stack.use_case}. 
          Każda z technologii dopełnia pozostałe — razem tworzą spójny ekosystem z dobrą DX i produkcyjną niezawodnością.
        </p>
      </div>
    </div>
  );
};

export const RoleForTechPage = () => {
  const { role, tech: techSlug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allTechs, setAllTechs] = useState<any[]>([]);

  useEffect(() => {
    if (!role || !techSlug) return;
    setLoading(true);
    fetch(`/api/dla/${role}/${techSlug}`).then(r => r.json())
      .then(d => { setData(d?.error ? null : d); }).finally(() => setLoading(false));
    fetch(`/api/technologies?role=${role}`).then(r => r.json()).then(setAllTechs);
  }, [role, techSlug]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <NotFoundSection />;

  const { tech, role: roleInfo } = data;

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Dla Roli', path: '/dla' }, { name: roleInfo.name, path: `/dla/${role}` }, { name: tech.name, path: '#' }]} />
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500 mb-4">Przewodnik</p>
      <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] uppercase tracking-tighter leading-none mb-4">
        {tech.name} dla<br /><span className="text-orange-500">{roleInfo.name}</span>
      </h1>
      <p className="text-white/40 text-lg max-w-2xl mb-14">{tech.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl">
            <h2 className="font-display text-2xl uppercase mb-5">Dlaczego {roleInfo.name} używa {tech.name}?</h2>
            <p className="text-white/50 leading-relaxed">
              {tech.name} jest jedną z kluczowych technologii dla {roleInfo.name}. 
              {data.is_relevant
                ? ` Bezpośrednio wspiera codzienne zadania tej roli — od ${tech.use_cases?.[0] || 'web development'} po ${tech.use_cases?.[1] || 'API building'}.`
                : ` Choć nie jest pierwszym wyborem, wiele firm wymaga znajomości ${tech.name} od ${roleInfo.name}.`}
            </p>
          </div>
          {tech.roles && (
            <div className="bg-white/[0.03] border border-white/[0.07] p-8 rounded-3xl">
              <h2 className="font-display text-2xl uppercase mb-5">Inne Role używające {tech.name}</h2>
              <div className="flex flex-wrap gap-3">
                {tech.roles.map((r: string) => (
                  <Link key={r} to={`/dla/${r}/${tech.slug}`}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${r === role ? 'bg-orange-500 text-white' : 'bg-white/5 border border-white/10 hover:border-orange-500/40'}`}>
                    {r.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="bg-orange-500 text-white p-8 rounded-3xl mb-4">
            <h3 className="font-display text-xl uppercase mb-4">Zarobki {roleInfo.name} z {tech.name}</h3>
            <p className="font-display text-4xl">{tech.salary_avg.toLocaleString()} PLN</p>
            <p className="text-white/60 text-xs mt-1">Średnia miesięczna</p>
            <Link to={`/zarobki/${tech.slug}`} className="mt-6 block text-center py-3 bg-black/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/30 transition-all">
              Szczegóły zarobków →
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl uppercase tracking-tight mb-6">Inne tech dla {roleInfo.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allTechs.filter(t => t.slug !== techSlug).slice(0, 6).map((t: any) => (
            <Link key={t.id} to={`/dla/${role}/${t.slug}`}
              className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-orange-500/30 transition-all group">
              <span className="font-bold text-sm">{t.name}</span>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-orange-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const RoleIndexPage = () => {
  const roles = [
    { slug: 'frontend-developer', name: 'Frontend Developer', icon: '🎨', desc: 'Specjalista od UI/UX i przeglądarki' },
    { slug: 'backend-developer', name: 'Backend Developer', icon: '⚙️', desc: 'API, bazy danych i logika serwera' },
    { slug: 'fullstack-developer', name: 'Fullstack Developer', icon: '🚀', desc: 'Front i backend w jednej osobie' },
    { slug: 'data-scientist', name: 'Data Scientist', icon: '📊', desc: 'Analiza danych i machine learning' },
    { slug: 'ai-engineer', name: 'AI Engineer', icon: '🤖', desc: 'Budowanie aplikacji z LLM i AI' },
    { slug: 'devops', name: 'DevOps Engineer', icon: '🛠️', desc: 'Infrastruktura, CI/CD i cloud' },
    { slug: 'mobile-developer', name: 'Mobile Developer', icon: '📱', desc: 'Aplikacje iOS i Android' },
    { slug: 'ml-engineer', name: 'ML Engineer', icon: '🧠', desc: 'Produkcyjne systemy machine learning' },
  ];

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Dla Roli', path: '/dla' }]} />
      <SectionHeader label="Persona Targeting" title="Technologie Dla Twojej Roli" subtitle="Odkryj najlepsze tech dla swojego stanowiska" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map(r => (
          <Link key={r.slug} to={`/dla/${r.slug}`}
            className="group p-7 bg-white/[0.03] border border-white/[0.07] rounded-3xl hover:border-orange-500/30 hover:bg-white/[0.06] transition-all">
            <span className="text-4xl mb-4 block">{r.icon}</span>
            <h3 className="font-bold text-sm uppercase tracking-wide mb-2 group-hover:text-orange-400 transition-colors">{r.name}</h3>
            <p className="text-white/40 text-xs">{r.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const RoleTechListPage = () => {
  const { role } = useParams();
  const [techs, setTechs] = useState<any[]>([]);
  const roles: Record<string, string> = {
    'frontend-developer': 'Frontend Developer',
    'backend-developer': 'Backend Developer',
    'fullstack-developer': 'Fullstack Developer',
    'data-scientist': 'Data Scientist',
    'ai-engineer': 'AI Engineer',
    'devops': 'DevOps Engineer',
    'mobile-developer': 'Mobile Developer',
    'ml-engineer': 'ML Engineer',
  };

  useEffect(() => {
    if (!role) return;
    fetch(`/api/technologies?role=${role}`).then(r => r.json()).then(setTechs);
  }, [role]);

  const roleName = roles[role || ''] || role || '';

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-24">
      <Breadcrumbs items={[{ name: 'Dla Roli', path: '/dla' }, { name: roleName, path: '#' }]} />
      <SectionHeader label="Przewodnik Technologiczny" title={roleName} subtitle={`Wszystkie technologie używane przez ${roleName}`} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techs.map(tech => (
          <Link key={tech.id} to={`/dla/${role}/${tech.slug}`}
            className="group bg-white/[0.03] border border-white/[0.07] p-7 rounded-3xl hover:border-orange-500/30 hover:bg-white/[0.06] transition-all">
            <div className="flex justify-between items-start mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white font-bold">
                {tech.name.charAt(0)}
              </div>
              <span className="text-[9px] bg-white/5 px-2 py-1 rounded-full font-mono text-white/30">{tech.category}</span>
            </div>
            <h3 className="font-display text-2xl uppercase mb-2 group-hover:text-orange-400 transition-colors">{tech.name}</h3>
            <p className="text-white/40 text-xs line-clamp-2 mb-4">{tech.tagline}</p>
            <div className="flex items-center gap-2 text-orange-500 text-[10px] font-bold uppercase tracking-widest">
              <span>{tech.name} dla {roleName} →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
