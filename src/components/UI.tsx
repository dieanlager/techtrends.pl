import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = ({ items }: { items: { name: string; path: string }[] }) => (
  <nav className="flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest mb-8" aria-label="Breadcrumb">
    <Link to="/" className="hover:text-white transition-colors">Home</Link>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <Link to={item.path} className="hover:text-white transition-colors last:text-white/60 last:pointer-events-none">
          {item.name}
        </Link>
      </React.Fragment>
    ))}
  </nav>
);

interface Technology {
  id: string; slug: string; name: string; category: string;
  tagline: string; gh_stars: number; npm_dls: number;
  salary_avg?: number; difficulty?: string;
}

export const TechCard = ({ tech }: { tech: Technology }) => (
  <Link to={`/technologie/${tech.slug}`}
    className="group relative bg-white/[0.03] border border-white/[0.07] p-7 rounded-3xl hover:bg-white/[0.07] hover:border-orange-500/30 transition-all duration-300 overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl translate-x-8 -translate-y-8 group-hover:bg-orange-500/10 transition-all" />
    <div className="flex justify-between items-start mb-5">
      <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold text-sm">
        {tech.name.charAt(0)}
      </div>
      <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-full">{tech.category}</span>
    </div>
    <h3 className="text-2xl font-display uppercase tracking-tight mb-2 group-hover:text-orange-400 transition-colors">{tech.name}</h3>
    <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-5">{tech.tagline}</p>
    <div className="flex items-center gap-4 text-[9px] font-mono text-white/25">
      {tech.gh_stars > 0 && <span>★ {(tech.gh_stars / 1000).toFixed(0)}k stars</span>}
      {tech.salary_avg && <span>💰 {tech.salary_avg.toLocaleString()} PLN avg</span>}
      <span className="ml-auto text-orange-500/50 group-hover:text-orange-500 transition-colors">→</span>
    </div>
  </Link>
);

export const SectionHeader = ({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) => (
  <div className="mb-12">
    {label && <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500 mb-4">{label}</p>}
    <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-4">{title}</h2>
    {subtitle && <p className="text-white/40 text-lg max-w-2xl">{subtitle}</p>}
  </div>
);

export const StatCard = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className={`p-7 rounded-3xl border text-center ${accent ? 'bg-orange-500 border-transparent text-black' : 'bg-white/[0.03] border-white/[0.07]'}`}>
    <span className={`text-[10px] font-bold uppercase tracking-widest block mb-3 ${accent ? 'text-black/50' : 'text-white/30'}`}>{label}</span>
    <span className="text-4xl font-display">{value}</span>
  </div>
);

export const TechSchema = ({ tech }: { tech: any }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tech.name,
        description: tech.tagline,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform',
        ...(tech.gh_stars > 1000 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.7',
            ratingCount: tech.gh_stars,
          }
        }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Technologie', item: 'https://techtrends.pl/technologie' },
          { '@type': 'ListItem', position: 2, name: tech.name, item: `https://techtrends.pl/technologie/${tech.slug}` },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

export const FAQSchema = ({ questions }: { questions: { q: string; a: string }[] }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: q.a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

export const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-2 border-white/10 rounded-full animate-spin border-t-orange-500" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-orange-500/20 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

export const NotFoundSection = ({ message }: { message?: string }) => (
  <div className="pt-32 min-h-screen flex flex-col items-center justify-center text-center px-6">
    <p className="text-[10px] font-mono text-orange-500 uppercase tracking-widest mb-6">404 Error</p>
    <h1 className="font-display text-8xl uppercase tracking-tighter mb-6">Nie znaleziono</h1>
    <p className="text-white/40 text-lg mb-10">{message || 'Szukana strona lub technologia nie istnieje w naszej bazie.'}</p>
    <Link to="/technologie" className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-orange-400 transition-all">
      Przeglądaj wszystkie technologie
    </Link>
  </div>
);
