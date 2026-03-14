/**
 * TechTrends.pl — Programmatic SEO Database
 * Largest Polish tech knowledge base for Google dominance
 */
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HomePage, TechnologiesIndexPage, CategoryPage, SalaryIndexPage } from './pages/IndexPages';
import { TechProfilePage, SalaryPage, SalaryDetailPage, AlternativesPage, CoursePage, RecruitmentQuestionsPage, IntegrationsPage } from './pages/TechPages';
import { ComparisonPage, ComparisonIndexPage, TrendsPage, TechTrendPage, TechTrendIndexPage } from './pages/ComparisonPages';
import { StackIndexPage, StackDetailPage, RoleForTechPage, RoleIndexPage, RoleTechListPage } from './pages/StackRolePages';
import { ProblemIndexPage, ProblemDetailPage } from './pages/ProblemPages';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500 selection:text-white font-sans">
        <Navbar />

        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Technologies */}
          <Route path="/technologie" element={<TechnologiesIndexPage />} />
          <Route path="/technologie/:slug" element={<TechProfilePage />} />
          <Route path="/technologie/:slug/zarobki" element={<SalaryPage />} />
          <Route path="/technologie/:slug/kurs" element={<CoursePage />} />
          <Route path="/technologie/:slug/pytania" element={<RecruitmentQuestionsPage />} />
          <Route path="/technologie/:slug/integracje" element={<IntegrationsPage />} />

          {/* Categories */}
          <Route path="/kategorie" element={<TechnologiesIndexPage />} />
          <Route path="/kategorie/:category" element={<CategoryPage />} />

          {/* Comparison Engine */}
          <Route path="/porownaj" element={<ComparisonIndexPage />} />
          <Route path="/porownaj/:comparison" element={<ComparisonPage />} />

          {/* Alternatives */}
          <Route path="/alternatywy/:slug" element={<AlternativesPage />} />
          {/* legacy alias */}
          <Route path="/technologie/:slug/alternatywy" element={<AlternativesPage />} />

          {/* Salary Tree */}
          <Route path="/zarobki" element={<SalaryIndexPage />} />
          <Route path="/zarobki/:slug" element={<SalaryPage />} />
          <Route path="/zarobki/:slug/:location/:level" element={<SalaryDetailPage />} />

          {/* Trends */}
          <Route path="/trendy" element={<TrendsPage />} />
          <Route path="/trendy/:slug" element={<TechTrendIndexPage />} />
          <Route path="/trendy/:slug/:year" element={<TechTrendPage />} />

          {/* Stacks */}
          <Route path="/stack" element={<StackIndexPage />} />
          <Route path="/stack/:slug" element={<StackDetailPage />} />

          {/* Role targeting */}
          <Route path="/dla" element={<RoleIndexPage />} />
          <Route path="/dla/:role" element={<RoleTechListPage />} />
          <Route path="/dla/:role/:tech" element={<RoleForTechPage />} />

          {/* Problems / Troubleshooting */}
          <Route path="/problemy/:tech" element={<ProblemIndexPage />} />
          <Route path="/problemy/:tech/:slug" element={<ProblemDetailPage />} />
        </Routes>

        <footer className="border-t border-white/[0.07] py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Zap className="text-white w-5 h-5" />
                  </div>
                  <span className="font-display text-xl tracking-tighter uppercase">TechTrends<span className="text-orange-500">.pl</span></span>
                </div>
                <p className="text-white/30 text-sm leading-relaxed max-w-xs">
                  Największa polska baza technologii developerskich. Programmatic SEO, zarobki, porównania i trendy.
                </p>
              </div>
              {[
                { title: 'Technologie', links: [{ to: '/technologie', l: 'Wszystkie' }, { to: '/kategorie/frontend', l: 'Frontend' }, { to: '/kategorie/backend', l: 'Backend' }, { to: '/kategorie/ai', l: 'AI/ML' }] },
                { title: 'Narzędzia', links: [{ to: '/porownaj', l: 'Porównywarka' }, { to: '/zarobki', l: 'Zarobki' }, { to: '/trendy', l: 'Trendy' }, { to: '/stack', l: 'Stacki' }] },
                { title: 'Role', links: [{ to: '/dla/frontend-developer', l: 'Frontend Dev' }, { to: '/dla/backend-developer', l: 'Backend Dev' }, { to: '/dla/ai-engineer', l: 'AI Engineer' }, { to: '/dla/devops', l: 'DevOps' }] },
              ].map(section => (
                <div key={section.title}>
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 mb-4">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.links.map(link => (
                      <li key={link.to}>
                        <Link to={link.to} className="text-sm text-white/40 hover:text-white transition-colors">{link.l}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
                Programmatic SEO Database © {new Date().getFullYear()} TechTrends.pl
              </p>
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                {100}+ technologii · {200}+ porównań · 8 lokalizacji zarobkowych
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
