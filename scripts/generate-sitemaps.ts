/**
 * Sitemap Generator Utility for TechTrends.pl
 * Demonstrates how to generate millions of URLs for pSEO indexing.
 */
import fs from 'fs';
import { technologies, SALARY_LOCATIONS, SALARY_LEVELS } from '../src/data/technologies';

async function generateSitemap() {
  const BASE_URL = 'https://techtrends.pl';
  const urls: string[] = [];

  // 1. Tech Profiles
  technologies.forEach(t => urls.push(`${BASE_URL}/technologie/${t.slug}`));

  // 2. Comparisons (A vs B in same category)
  technologies.forEach(t1 => {
    technologies.forEach(t2 => {
      if (t1.slug !== t2.slug && t1.category === t2.category) {
        urls.push(`${BASE_URL}/porownaj/${t1.slug}-vs-${t2.slug}`);
      }
    });
  });

  // 3. Salaries (Tech x Location x Level)
  technologies.forEach(t => {
    SALARY_LOCATIONS.forEach(l => {
      SALARY_LEVELS.forEach(lvl => {
        urls.push(`${BASE_URL}/zarobki/${t.slug}/${l.slug}/${lvl.slug}`);
      });
    });
  });

  // 4. Trends, Problems, Courses... etc.
  // [Logic would continue...]

  console.log(`\n✅ Generated ${urls.length} candidate URLs for sitemaps.`);
  
  // Split into chunks of 50,000 (Sitemap standard)
  const chunkSize = 50000;
  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize);
    const sitemapId = Math.floor(i / chunkSize);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${chunk.map(url => `<url><loc>${url}</loc><changefreq>weekly</changefreq></url>`).join('\n  ')}
</urlset>`;
    
    // In a real app, write to public/sitemaps/
    // fs.writeFileSync(`./public/sitemap-${sitemapId}.xml`, xml);
  }
}

// simulate run
generateSitemap();
