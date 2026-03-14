/**
 * Deterministyczna reguła noindex pod crawl budget.
 */
export function getSalaryIndexDecision(
  sampleSize:   number,
  canonicalUrl: string,
  isFallback:   boolean
) {
  if (isFallback) {
    return { robots: { index: false, follow: true }, canonical: canonicalUrl };
  }
  if (sampleSize >= 3) {
    return { robots: { index: true, follow: true }, canonical: canonicalUrl };
  }
  if (sampleSize >= 1) {
    return { robots: { index: true, follow: true }, canonical: canonicalUrl };
  }
  return { robots: { index: false, follow: true }, canonical: canonicalUrl };
}
