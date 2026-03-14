import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { technologies, SALARY_LOCATIONS, SALARY_LEVELS, POPULAR_STACKS, TREND_YEARS, ROLES } from "./src/data/technologies";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3001;

  app.use(cors());
  app.use(express.json());

  // === GET /api/technologies ===
  app.get("/api/technologies", (req, res) => {
    const { category, subcategory, role, limit } = req.query as Record<string, string>;
    let results = technologies.filter(t => t.name !== undefined);
    if (category) results = results.filter(t => t.category.toLowerCase() === category.toLowerCase());
    if (subcategory) results = results.filter(t => t.subcategory?.toLowerCase() === subcategory.toLowerCase());
    if (role) results = results.filter(t => t.roles?.includes(role));
    if (limit) results = results.slice(0, parseInt(limit));
    res.json(results);
  });

  // === GET /api/technologies/:slug ===
  app.get("/api/technologies/:slug", (req, res) => {
    const tech = technologies.find(t => t.slug === req.params.slug);
    if (!tech) return res.status(404).json({ error: "Not found" });
    res.json(tech);
  });

  // === GET /api/compare/:comparison ===
  app.get("/api/compare/:comparison", (req, res) => {
    const parts = req.params.comparison.split("-vs-");
    const slugA = parts[0];
    const slugB = parts.slice(1).join("-");
    const techA = technologies.find(t => t.slug === slugA);
    const techB = technologies.find(t => t.slug === slugB);
    if (!techA || !techB) return res.status(404).json({ error: "One or both technologies not found" });

    const verdict = techA.category === techB.category
      ? `${techA.name} i ${techB.name} to bezpośredni konkurenci w kategorii ${techA.category}. ${
          techA.gh_stars > techB.gh_stars
            ? `${techA.name} dominuje pod względem popularności (${techA.gh_stars.toLocaleString()} vs ${techB.gh_stars.toLocaleString()} GitHub stars).`
            : `${techB.name} ma więcej gwiazdek GitHub (${techB.gh_stars.toLocaleString()} vs ${techA.gh_stars.toLocaleString()}).`
        } ${
          techA.salary_avg > techB.salary_avg
            ? `Pod względem zarobków ${techA.name} developer zarabia więcej (avg ${techA.salary_avg.toLocaleString()} PLN vs ${techB.salary_avg.toLocaleString()} PLN).`
            : `${techB.name} developer zarabia wyżej (avg ${techB.salary_avg.toLocaleString()} PLN vs ${techA.salary_avg.toLocaleString()} PLN).`
        } Wybór między nimi zależy od specyfiki projektu i zespołu.`
      : `${techA.name} (${techA.category}) i ${techB.name} (${techB.category}) operują w różnych warstwach stacku technologicznego — najczęściej używa się ich razem, a nie zamiast siebie. Sprawdź ich integracje aby zobaczyć jak mogą współpracować.`;

    const metrics = [
      { key: 'GitHub Stars', a: techA.gh_stars.toLocaleString(), b: techB.gh_stars.toLocaleString(), winner: techA.gh_stars >= techB.gh_stars ? 'a' : 'b' },
      { key: 'Avg Zarobki (PLN)', a: `${techA.salary_avg.toLocaleString()} PLN`, b: `${techB.salary_avg.toLocaleString()} PLN`, winner: techA.salary_avg >= techB.salary_avg ? 'a' : 'b' },
      { key: 'Trudność', a: techA.difficulty, b: techB.difficulty, winner: techA.difficulty === 'Beginner' ? 'a' : techB.difficulty === 'Beginner' ? 'b' : 'tie' },
      { key: 'Rok premiery', a: techA.first_release || 'N/A', b: techB.first_release || 'N/A', winner: 'tie' },
    ];

    res.json({ techA, techB, verdict, metrics });
  });

  // === GET /api/zarobki/:tech/:location/:level ===
  app.get("/api/zarobki/:tech/:location/:level", (req, res) => {
    const { tech: techSlug, location, level } = req.params;
    const tech = technologies.find(t => t.slug === techSlug);
    const loc = SALARY_LOCATIONS.find(l => l.slug === location);
    const lvl = SALARY_LEVELS.find(l => l.slug === level);
    if (!tech || !loc || !lvl) return res.status(404).json({ error: "Not found" });

    const base = tech.salary_avg;
    const salary = Math.round(base * loc.multiplier * lvl.multiplier / 100) * 100;
    const yearSalary = salary * 12;

    res.json({
      tech,
      location: loc,
      level: lvl,
      salary_monthly: salary,
      salary_yearly: yearSalary,
      salary_junior: Math.round(salary * 0.6 / 100) * 100,
      salary_senior: Math.round(salary * 1.4 / 100) * 100,
      market_demand: tech.gh_stars > 50000 ? 'Bardzo wysokie' : tech.gh_stars > 10000 ? 'Wysokie' : 'Umiarkowane',
    });
  });

  // === GET /api/zarobki/:tech ===
  app.get("/api/zarobki/:tech", (req, res) => {
    const tech = technologies.find(t => t.slug === req.params.tech);
    if (!tech) return res.status(404).json({ error: "Not found" });
    res.json({ tech, locations: SALARY_LOCATIONS, levels: SALARY_LEVELS });
  });

  // === GET /api/trendy/:tech/:year ===
  app.get("/api/trendy/:tech/:year", (req, res) => {
    const tech = technologies.find(t => t.slug === req.params.tech);
    const year = parseInt(req.params.year);
    if (!tech || !TREND_YEARS.includes(year)) return res.status(404).json({ error: "Not found" });

    // Synthetic trend data based on tech metrics
    const yearIndex = TREND_YEARS.indexOf(year);
    const growthFactors: Record<number, number> = { 0: 0.6, 1: 0.75, 2: 0.88, 3: 0.95, 4: 1.0 };
    const factor = growthFactors[yearIndex] ?? 1.0;
    const noise = (seed: number) => 1 + (Math.sin(seed * 97.3 + tech.id.length * 17) * 0.08);

    const quarterly = [1,2,3,4].map(q => ({
      quarter: `Q${q} ${year}`,
      gh_stars: Math.round(tech.gh_stars * factor * noise(q) * 0.95),
      npm_dls: tech.npm_dls ? Math.round(tech.npm_dls * factor * noise(q + 10)) : null,
      so_questions: Math.round(1000 + tech.gh_stars * factor * 0.02 * noise(q + 20)),
    }));

    const yoy_growth = yearIndex > 0 ? Math.round((1 / growthFactors[yearIndex - 1]! - 1) * factor * 100) : 0;

    res.json({ tech, year, quarterly, yoy_growth, trends_summary: `W ${year} roku ${tech.name} ${yoy_growth > 10 ? 'dynamicznie rosło' : yoy_growth > 0 ? 'utrzymywało stabilność' : 'nieznacznie spadło'} — ${yoy_growth > 0 ? `+${yoy_growth}%` : `${yoy_growth}%`} YoY według liczby GitHub Stars.` });
  });

  // === GET /api/dla/:role/:tech ===
  app.get("/api/dla/:role/:tech", (req, res) => {
    const { role, tech: techSlug } = req.params;
    const tech = technologies.find(t => t.slug === techSlug);
    const roleInfo = ROLES.find(r => r.slug === role);
    if (!tech || !roleInfo) return res.status(404).json({ error: "Not found" });
    const isRelevant = tech.roles?.includes(role);
    res.json({ tech, role: roleInfo, is_relevant: isRelevant, relevance_score: isRelevant ? 95 : 40 });
  });

  // === GET /api/stacks ===
  app.get("/api/stacks", (req, res) => {
    const withTechs = POPULAR_STACKS.map(s => ({
      ...s,
      tech_data: s.techs.map(slug => technologies.find(t => t.slug === slug)).filter(Boolean),
    }));
    res.json(withTechs);
  });

  // === GET /api/stacks/:slug ===
  app.get("/api/stacks/:slug", (req, res) => {
    const stack = POPULAR_STACKS.find(s => s.slug === req.params.slug);
    if (!stack) return res.status(404).json({ error: "Not found" });
    const tech_data = stack.techs.map(slug => technologies.find(t => t.slug === slug)).filter(Boolean);
    res.json({ ...stack, tech_data });
  });

  // === PROBLEMS ENGINE (SEO PATTERN: /problemy/[tech]/[error]) ===
  app.get("/api/problems/:tech/:slug?", (req, res) => {
    const { tech: techSlug, slug } = req.params;
    const tech = technologies.find(t => t.slug === techSlug);
    if (!tech) return res.status(404).json({ error: "Technology not found" });

    // Mock common problems per technology category
    const problems = [
      { slug: "installation-failed", name: "Installation Failed", category: "Setup", solution: "Check your local environment and version compatibility." },
      { slug: "performance-issues", name: "Slow Performance", category: "Optimization", solution: "Identify bottlenecks using profiling tools and optimize rendering/queries." },
      { slug: "deployment-error", name: "Deployment failed on Vercel/AWS", category: "DevOps", solution: "Verify environmental variables and build command configurations." },
    ];

    if (slug) {
      const problem = problems.find(p => p.slug === slug);
      if (!problem) return res.status(404).json({ error: "Problem not found" });
      return res.json({ tech, ...problem });
    }

    res.json({ tech, problems });
  });

  // === GET /api/meta ===
  app.get("/api/meta", (_req, res) => {
    const categories = [...new Set(technologies.map(t => t.category))];
    const pairs = technologies.flatMap((t, i) =>
      technologies.slice(i + 1).filter(t2 => t2.category === t.category).map(t2 => ({
        slug: `${t.slug}-vs-${t2.slug}`, priority: t.gh_stars + t2.gh_stars
      }))
    ).sort((a, b) => b.priority - a.priority).slice(0, 200);

    res.json({
      total_technologies: technologies.length,
      categories,
      top_comparison_pairs: pairs,
      salary_locations: SALARY_LOCATIONS,
      salary_levels: SALARY_LEVELS,
      trend_years: TREND_YEARS,
      roles: ROLES,
    });
  });

  // API-only mode: Vite runs as separate dev server (npm run dev)
  // In production, serve the built frontend
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => { res.sendFile(path.join(distPath, "index.html")); });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 TechTrends.pl server running on http://0.0.0.0:${PORT}`);
    console.log(`📊 ${technologies.length} technologies in database`);
  });
}

startServer();
