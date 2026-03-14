import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Search, TrendingUp, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface Technology { id: string; slug: string; name: string; category: string; }

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Technology[]>([]);
  const [allTechs, setAllTechs] = useState<Technology[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    fetch('/api/technologies').then(r => r.json()).then(setAllTechs).catch(() => {});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      setSearchResults(allTechs.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8));
    } else setSearchResults([]);
  }, [searchQuery, allTechs]);

  const navLinks = [
    { to: '/technologie', label: 'Technologie' },
    { to: '/porownaj', label: 'Porównaj' },
    { to: '/zarobki', label: 'Zarobki' },
    { to: '/trendy', label: 'Trendy' },
    { to: '/stack', label: 'Stacki' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
      scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center rounded-xl rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-lg shadow-orange-500/30">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="font-display text-xl tracking-tighter uppercase">TechTrends<span className="text-orange-500">.pl</span></span>
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.25em]">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className="hover:text-orange-500 transition-colors relative group">
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-orange-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          <div className="relative">
            <button onClick={() => setShowMore(!showMore)} className="flex items-center gap-1 hover:text-orange-500 transition-colors">
              Więcej <ChevronDown className={cn("w-3 h-3 transition-transform", showMore && "rotate-180")} />
            </button>
            <AnimatePresence>
              {showMore && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute top-6 right-0 bg-black border border-white/10 rounded-2xl p-4 shadow-xl w-48 space-y-2">
                  {[
                    { to: '/dla', label: 'Dla Roli' },
                    { to: '/alternatywy', label: 'Alternatywy' },
                    { to: '/kategorie', label: 'Kategorie' },
                  ].map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setShowMore(false)}
                      className="block px-3 py-2 rounded-xl hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-colors">
                      {l.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {showSearch && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 shadow-2xl">
                  <input autoFocus type="text" placeholder="Szukaj technologii..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  {searchResults.length > 0 && (
                    <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                      {searchResults.map(tech => (
                        <Link key={tech.id} to={`/technologie/${tech.slug}`}
                          onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                          className="flex items-center justify-between p-2.5 hover:bg-white/5 rounded-xl transition-colors">
                          <span className="text-xs font-bold uppercase tracking-wider">{tech.name}</span>
                          <span className="text-[8px] text-white/30 uppercase bg-white/5 px-2 py-1 rounded-full">{tech.category}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/technologie" className="hidden sm:block bg-orange-500 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20">
            Przeglądaj →
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 border-t border-white/10 pt-4 space-y-2">
            {[...navLinks, { to: '/stack', label: 'Stacki' }, { to: '/dla', label: 'Dla Roli' }].map(l => (
              <Link key={l.to} to={l.to} onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl hover:bg-white/5 text-[11px] font-bold uppercase tracking-widest transition-colors">
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
