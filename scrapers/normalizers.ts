/**
 * scrapers/normalizers.ts
 *
 * Serce scrapera — mapuje "dzikie" dane z portali na kanoniczne slugi bazy.
 */

const TECH_ALIASES: Record<string, string> = {
  'javascript': 'javascript', 'js': 'javascript', 'vanilla js': 'javascript',
  'typescript': 'typescript', 'ts': 'typescript',
  'react': 'react', 'react.js': 'react', 'reactjs': 'react', 'react native': 'react-native',
  'next.js': 'nextjs', 'nextjs': 'nextjs',
  'vue': 'vue', 'vue.js': 'vue', 'vuejs': 'vue', 'nuxt': 'nuxtjs',
  'angular': 'angular', 'svelte': 'svelte', 'sveltekit': 'sveltekit',
  'python': 'python', 'python3': 'python', 'django': 'django', 'fastapi': 'fastapi',
  'node.js': 'nodejs', 'nodejs': 'nodejs', 'node': 'nodejs',
  'php': 'php', 'laravel': 'laravel',
  'java': 'java', 'spring': 'spring-boot', 'spring boot': 'spring-boot',
  'kotlin': 'kotlin', 'go': 'go', 'golang': 'go', 'rust': 'rust',
  'c#': 'csharp', 'c sharp': 'csharp', '.net': 'dotnet',
  'ruby': 'ruby', 'rails': 'rails', 'swift': 'swift', 'flutter': 'flutter',
  'postgresql': 'postgresql', 'mysql': 'mysql', 'mongodb': 'mongodb', 'redis': 'redis',
  'docker': 'docker', 'kubernetes': 'kubernetes', 'aws': 'aws', 'azure': 'azure', 'gcp': 'gcp',
  'terraform': 'terraform', 'pytorch': 'pytorch', 'tensorflow': 'tensorflow'
};

const LOCATION_MAP: Record<string, string> = {
  'warszawa': 'warszawa', 'warsaw': 'warszawa',
  'kraków': 'krakow', 'krakow': 'krakow',
  'wrocław': 'wroclaw', 'wroclaw': 'wroclaw',
  'poznań': 'poznan', 'poznan': 'poznan',
  'gdańsk': 'gdansk', 'gdansk': 'gdansk',
  'katowice': 'katowice', 'łódź': 'lodz', 'lodz': 'lodz',
  'lublin': 'lublin', 'rzeszów': 'rzeszow', 'rzeszow': 'rzeszow',
  'białystok': 'bialystok', 'bialystok': 'bialystok', 'szczecin': 'szczecin',
  'remote': 'zdalnie', 'zdalnie': 'zdalnie'
};

const LEVEL_MAP: Record<string, string> = {
  'junior': 'junior', 'entry': 'junior', 'mid': 'mid', 'regular': 'mid',
  'senior': 'senior', 'sr': 'senior', 'lead': 'lead', 'principal': 'principal', 'staff': 'principal'
};

export function normalizeTech(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const normalized = raw.toLowerCase().trim().replace(/[®™]/g, '').replace(/\s+/g, ' ');
  return TECH_ALIASES[normalized] ?? null;
}

export function normalizeLocation(city: string | null | undefined, remote: boolean = false): string | null {
  if (remote && (!city || city.trim() === '')) return 'zdalnie';
  const normalized = (city ?? '').toLowerCase().normalize('NFC').trim();
  return LOCATION_MAP[normalized] ?? (remote ? 'zdalnie' : null);
}

export function normalizeLevel(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const normalized = raw.toLowerCase().trim();
  return LEVEL_MAP[normalized] ?? null;
}
