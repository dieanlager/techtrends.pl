import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://techtrends.pl'
  return [
    { url: `${base}/sitemap-tech.xml`, lastModified: new Date() },
    { url: `${base}/sitemap-salaries-0.xml`, lastModified: new Date() },
    { url: `${base}/sitemap-comparisons-0.xml`, lastModified: new Date() },
  ]
}
