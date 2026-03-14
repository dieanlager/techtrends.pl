/**
 * Deterministyczne URL-e zapobiegające kanibalizacji.
 */
const BASE_URL = 'https://techtrends.pl';

export function buildSalaryCanonical(tech: string, location: string, level: string) {
  return `${BASE_URL}/zarobki/${tech.toLowerCase()}/${location.toLowerCase()}/${level.toLowerCase()}`;
}

export function buildComparisonCanonical(slugA: string, slugB: string) {
  const [a, b] = [slugA, slugB].sort();
  return `${BASE_URL}/porownaj/${a.toLowerCase()}-vs-${b.toLowerCase()}`;
}
