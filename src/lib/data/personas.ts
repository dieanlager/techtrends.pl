import { db }    from '@/lib/db'
import { cache } from 'react'
import { type Course } from '@/lib/data/stacks'

// ─────────────────────────────────────────────
// Taksonomia ról
// ─────────────────────────────────────────────
export const ROLES: Record<string, {
  name:       string
  nameGen:    string    // dopełniacz: "dla [role_gen]"
  icon:       string
  description:string
  related:    string[]  // inne role_slug w tej samej rodzinie
}> = {
  'frontend-developer': {
    name:        'Frontend Developer',
    nameGen:     'Frontend Developera',
    icon:        '🌐',
    description: 'Specjalista od interfejsów użytkownika — HTML, CSS, JavaScript i frameworki JS.',
    related:     ['fullstack-developer', 'ui-designer'],
  },
  'backend-developer': {
    name:        'Backend Developer',
    nameGen:     'Backend Developera',
    icon:        '⚙️',
    description: 'Architekt systemów serwerowych — API, bazy danych, wydajność i bezpieczeństwo.',
    related:     ['fullstack-developer', 'devops-engineer'],
  },
  'fullstack-developer': {
    name:        'Fullstack Developer',
    nameGen:     'Fullstack Developera',
    icon:        '🔄',
    description: 'Developer łączący frontend i backend — end-to-end ownership produktu.',
    related:     ['frontend-developer', 'backend-developer'],
  },
  'data-scientist': {
    name:        'Data Scientist',
    nameGen:     'Data Scientist',
    icon:        '📊',
    description: 'Analityk danych i ML — buduje modele predykcyjne i wyciąga insights z danych.',
    related:     ['ml-engineer', 'data-engineer'],
  },
  'ml-engineer': {
    name:        'ML Engineer',
    nameGen:     'ML Engineera',
    icon:        '🤖',
    description: 'Inżynier wdrażający modele ML do produkcji — MLOps, skalowanie, monitoring.',
    related:     ['data-scientist', 'backend-developer'],
  },
  'devops-engineer': {
    name:        'DevOps Engineer',
    nameGen:     'DevOps Engineera',
    icon:        '☁️',
    description: 'Inżynier infrastruktury i CI/CD — konteneryzacja, orchestracja, monitoring.',
    related:     ['backend-developer', 'cloud-architect'],
  },
  'mobile-developer': {
    name:        'Mobile Developer',
    nameGen:     'Mobile Developera',
    icon:        '📱',
    description: 'Specialist od aplikacji mobilnych — iOS, Android lub cross-platform.',
    related:     ['frontend-developer', 'fullstack-developer'],
  },
  'data-engineer': {
    name:        'Data Engineer',
    nameGen:     'Data Engineera',
    icon:        '🗄️',
    description: 'Budowniczy pipeline danych — ETL, data warehouse, streaming.',
    related:     ['data-scientist', 'backend-developer'],
  },
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type RoadmapStep = {
  phase:       'beginner' | 'intermediate' | 'advanced'
  title:       string
  description: string
  topics:      string[]
  duration:    string    // "2-4 tygodnie"
  resources:   Array<{ label: string; url: string; free: boolean }>
}

export type JobListing = {
  title:       string
  company:     string
  location:    string
  salary_from: number | null
  salary_to:   number | null
  url:         string
  source:      string
  posted_at:   string
}

export type PersonaData = {
  roleSlug:    string
  techSlug:    string
  roleName:    string
  roleNameGen: string
  techName:    string
  techTagline: string
  headline:    string       // meta description + H1 subtitle
  roadmap:     RoadmapStep[]
  courses:     Course[]
  jobs:        JobListing[]
  jobSearchUrl:string       // deep-link JustJoin z filtrami
  relatedStacks:Array<{ slug: string; title: string }>
  salaryHref:  string
  trendHref:   string
  relatedPersonas: Array<{ role: string; roleName: string; href: string }>
  shouldIndex: boolean      // false gdy za mało danych
}

// ─────────────────────────────────────────────
// Main fetch
// ─────────────────────────────────────────────
export const getPersonaData = cache(async (
  roleSlug: string,
  techSlug: string
): Promise<PersonaData | null> => {

  const roleMeta = ROLES[roleSlug]
  if (!roleMeta) return null

  const tech = await db
    .selectFrom('technologies')
    .select(['slug', 'name', 'tagline'])
    .where('slug', '=', techSlug)
    .where('is_published', '=', true)
    .executeTakeFirst()

  if (!tech) return null

  const [courses, jobs, relatedStacks] = await Promise.all([
    getPersonaCourses(techSlug, roleSlug),
    getRecentJobs(techSlug, roleSlug),
    getRelatedStacks(techSlug),
  ])

  const roadmap = buildRoadmap(techSlug, roleSlug, tech.name as string)
  const headline = buildHeadline(roleMeta.name, tech.name as string)

  // noindex gdy zbyt mało wartości dla użytkownika
  const shouldIndex = courses.length >= 2 || jobs.length >= 3

  const relatedPersonas = roleMeta.related.map(r => ({
    role:     r,
    roleName: ROLES[r]?.name ?? r,
    href:     `/dla/${r}/${techSlug}`,
  }))

  return {
    roleSlug,
    techSlug,
    roleName:    roleMeta.name,
    roleNameGen: roleMeta.nameGen,
    techName:    tech.name as string,
    techTagline: tech.tagline as string,
    headline,
    roadmap,
    courses,
    jobs,
    jobSearchUrl: buildJobSearchUrl(techSlug, roleSlug),
    relatedStacks,
    salaryHref:  `/zarobki/${techSlug}/polska/mid`,
    trendHref:   `/trendy/${techSlug}/${new Date().getFullYear()}`,
    relatedPersonas,
    shouldIndex,
  }
})

// ─────────────────────────────────────────────
// Roadmap builder — per (tech, role)
// ─────────────────────────────────────────────

// Generyczne bloki re-używane w wielu ścieżkach
const ROADMAP_BLOCKS = {
  python_basics: {
    phase: 'beginner' as const,
    title: 'Podstawy Python',
    description: 'Składnia, typy danych, funkcje, OOP i środowisko pracy.',
    topics:   ['zmienne i typy', 'listy/słowniki/sety', 'funkcje i lambda', 'klasy i OOP', 'venv i pip'],
    duration: '3-6 tygodni',
    resources: [
      { label: 'Python.org Tutorial', url: 'https://docs.python.org/3/tutorial/', free: true },
      { label: '100 Days of Code Python (Udemy)', url: 'https://www.udemy.com/course/100-days-of-code/', free: false },
    ],
  },
  js_basics: {
    phase: 'beginner' as const,
    title: 'Podstawy JavaScript/TypeScript',
    description: 'ES2024+, async/await, TypeScript, narzędzia budowania.',
    topics:   ['var/let/const', 'async/await/Promises', 'modules ESM', 'TypeScript basics', 'npm/pnpm'],
    duration: '4-6 tygodni',
    resources: [
      { label: 'javascript.info', url: 'https://javascript.info', free: true },
      { label: 'TypeScript Docs', url: 'https://www.typescriptlang.org/docs/', free: true },
    ],
  },
  git_basics: {
    phase: 'beginner' as const,
    title: 'Git i workflow',
    description: 'Podstawy kontroli wersji niezbędne w każdej roli.',
    topics:   ['git init/add/commit', 'branch/merge/rebase', 'PR workflow', 'GitHub/GitLab'],
    duration: '1 tydzień',
    resources: [
      { label: 'Pro Git (darmowa książka)', url: 'https://git-scm.com/book', free: true },
    ],
  },
}

type RoadmapKey = `${string}__${string}`

// Roadmapy per (tech, role) — fallback do generic gdy brak
const ROADMAPS: Partial<Record<RoadmapKey, RoadmapStep[]>> = {
  'nextjs__fullstack-developer': [
    ROADMAP_BLOCKS.js_basics,
    { phase: 'beginner', title: 'React fundamentals', description: 'Komponenty, props, state, hooks — fundament Next.js.', topics: ['JSX', 'useState/useEffect', 'props drilling', 'Context API', 'React DevTools'], duration: '4-6 tygodni', resources: [{ label: 'react.dev', url: 'https://react.dev', free: true }, { label: 'React — The Complete Guide (Udemy)', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', free: false }] },
    { phase: 'intermediate', title: 'Next.js App Router', description: 'Server Components, ISR, route handlers, middleware.', topics: ['App Router vs Pages', 'Server Components', 'generateStaticParams', 'ISR/SSR/SSG', 'Route Handlers'], duration: '3-4 tygodnie', resources: [{ label: 'Next.js Docs', url: 'https://nextjs.org/docs', free: true }] },
    { phase: 'intermediate', title: 'Baza danych i ORM', description: 'PostgreSQL z Prisma lub Drizzle — schema, migracje, queries.', topics: ['SQL basics', 'Prisma schema', 'migracje', 'relacje', 'query optimization'], duration: '3-4 tygodnie', resources: [{ label: 'Prisma Docs', url: 'https://www.prisma.io/docs', free: true }, { label: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com', free: true }] },
    { phase: 'advanced', title: 'Auth, deployment, performance', description: 'NextAuth.js, Vercel deployment, Core Web Vitals, monitoring.', topics: ['NextAuth.js', 'Vercel/Railway', 'Core Web Vitals', 'Sentry', 'caching strategies'], duration: '4-6 tygodni', resources: [{ label: 'Web.dev Performance', url: 'https://web.dev/performance', free: true }] },
  ],

  'python__data-scientist': [
    ROADMAP_BLOCKS.python_basics,
    { phase: 'beginner', title: 'NumPy i Pandas', description: 'Macierze, DataFramy, eksploracja danych i preprocessing.', topics: ['ndarray operacje', 'DataFrame CRUD', 'groupby/merge', 'handling NaN', 'matplotlib basics'], duration: '4-6 tygodni', resources: [{ label: 'Pandas Docs', url: 'https://pandas.pydata.org/docs/', free: true }, { label: 'Kaggle Learn Python', url: 'https://www.kaggle.com/learn/python', free: true }] },
    { phase: 'intermediate', title: 'Machine Learning z scikit-learn', description: 'Klasyczne algorytmy ML, walidacja, feature engineering.', topics: ['train/test split', 'linear/logistic regression', 'decision trees', 'cross-validation', 'feature importance'], duration: '6-8 tygodni', resources: [{ label: 'scikit-learn User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', free: true }] },
    { phase: 'intermediate', title: 'Statystyka i wizualizacja', description: 'Testy statystyczne, rozkłady, Seaborn/Plotly.', topics: ['rozkłady prawdopodobieństwa', 'testy hipotez', 'korelacje', 'Seaborn', 'Plotly/Dash'], duration: '4-5 tygodni', resources: [{ label: 'StatQuest YouTube', url: 'https://www.youtube.com/@statquest', free: true }] },
    { phase: 'advanced', title: 'Deep Learning i projekty', description: 'Podstawy sieci neuronowych, PyTorch/Keras, Kaggle competitions.', topics: ['neural networks basics', 'PyTorch tensors', 'CNN/RNN intro', 'transfer learning', 'Kaggle workflow'], duration: '8-12 tygodni', resources: [{ label: 'fast.ai', url: 'https://www.fast.ai', free: true }] },
  ],

  'docker__devops-engineer': [
    ROADMAP_BLOCKS.git_basics,
    { phase: 'beginner', title: 'Linux i sieci', description: 'Bash, procesy, sieć — fundamenty DevOps.', topics: ['bash scripting', 'procesy i sygnały', 'TCP/IP basics', 'SSH', 'cron'], duration: '3-4 tygodnie', resources: [{ label: 'The Linux Command Line (darmowa)', url: 'https://linuxcommand.org/tlcl.php', free: true }] },
    { phase: 'beginner', title: 'Docker fundamentals', description: 'Obrazy, kontenery, Dockerfile, Docker Compose.', topics: ['Dockerfile best practices', 'multi-stage builds', 'docker-compose', 'volumes/networks', 'Docker Hub'], duration: '3-4 tygodnie', resources: [{ label: 'Docker Docs', url: 'https://docs.docker.com', free: true }, { label: 'Docker & Kubernetes: The Practical Guide (Udemy)', url: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/', free: false }] },
    { phase: 'intermediate', title: 'Kubernetes', description: 'Pods, Deployments, Services, Ingress, Helm.', topics: ['kubectl', 'Deployments/StatefulSets', 'Services/Ingress', 'ConfigMaps/Secrets', 'Helm charts'], duration: '6-8 tygodni', resources: [{ label: 'Kubernetes.io Docs', url: 'https://kubernetes.io/docs/', free: true }] },
    { phase: 'advanced', title: 'CI/CD i monitoring', description: 'GitHub Actions, Terraform, Prometheus, Grafana.', topics: ['GitHub Actions workflows', 'Terraform basics', 'Prometheus/Grafana', 'ArgoCD GitOps', 'cost optimization'], duration: '6-8 tygodni', resources: [{ label: 'HashiCorp Learn', url: 'https://developer.hashicorp.com/terraform/tutorials', free: true }] },
  ],
}

function buildRoadmap(techSlug: string, roleSlug: string, techName: string): RoadmapStep[] {
  const key = `${techSlug}__${roleSlug}` as RoadmapKey
  const custom = ROADMAPS[key]
  if (custom) return custom

  // Generic fallback
  return [
    { phase: 'beginner', title: `Podstawy ${techName}`, description: `Fundamenty ${techName} — instalacja, konfiguracja i pierwsze kroki.`, topics: ['instalacja i setup', 'podstawowa składnia', 'kluczowe koncepty', 'pierwsze projekty'], duration: '4-6 tygodni', resources: [{ label: `Oficjalna dokumentacja ${techName}`, url: '#', free: true }] },
    { phase: 'intermediate', title: `${techName} w praktyce`, description: `Realne projekty, integracje i best practices dla ${ROLES[roleSlug]?.name ?? roleSlug}.`, topics: ['integracje z innymi narzędziami', 'wzorce projektowe', 'testowanie', 'deployment'], duration: '6-8 tygodni', resources: [] },
    { phase: 'advanced', title: `Senior ${techName} skillset`, description: 'Architektura, wydajność i mentoring.', topics: ['optymalizacja wydajności', 'architektura systemów', 'code review', 'mentoring'], duration: '3-6 miesięcy', resources: [] },
  ]
}

const PERSONA_COURSES: Record<string, Course[]> = {
  'nextjs__fullstack-developer': [
    { title: 'Next.js 15 & React — The Complete Guide', platform: 'udemy', url: 'https://www.udemy.com/course/nextjs-react-the-complete-guide/?couponCode=TECHTRENDS', instructor: 'Maximilian Schwarzmüller', rating: 4.7, students: 95000, price_pln: 49, tech_slugs: ['nextjs', 'react'] },
    { title: 'Full Stack Next.js 14', platform: 'frontendmasters', url: 'https://frontendmasters.com/courses/fullstack-v3/', instructor: 'Scott Moss', rating: 4.8, students: null, price_pln: 79, tech_slugs: ['nextjs'] },
  ],
  'python__data-scientist': [
    { title: 'Python for Data Science and Machine Learning Bootcamp', platform: 'udemy', url: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/', instructor: 'Jose Portilla', rating: 4.6, students: 520000, price_pln: 49, tech_slugs: ['python'] },
    { title: 'Machine Learning Specialization', platform: 'coursera', url: 'https://www.coursera.org/specializations/machine-learning-introduction', instructor: 'Andrew Ng', rating: 4.9, students: 2000000, price_pln: 0, tech_slugs: ['python', 'scikit-learn'] },
    { title: 'Practical Deep Learning for Coders', platform: 'egghead', url: 'https://course.fast.ai', instructor: 'Jeremy Howard', rating: 4.9, students: null, price_pln: 0, tech_slugs: ['python', 'pytorch'] },
  ],
  'docker__devops-engineer': [
    { title: 'Docker & Kubernetes: The Practical Guide', platform: 'udemy', url: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/', instructor: 'Maximilian Schwarzmüller', rating: 4.7, students: 120000, price_pln: 49, tech_slugs: ['docker', 'kubernetes'] },
    { title: 'Complete DevOps Bootcamp', platform: 'udemy', url: 'https://www.udemy.com/course/devcops-bootcamp/', instructor: 'Bogdan Stashchuk', rating: 4.6, students: 45000, price_pln: 49, tech_slugs: ['docker', 'kubernetes', 'terraform'] },
  ],
}

async function getPersonaCourses(techSlug: string, roleSlug: string): Promise<Course[]> {
  const key = `${techSlug}__${roleSlug}`
  return PERSONA_COURSES[key] ?? PERSONA_COURSES[`${techSlug}__*`] ?? []
}

// ─────────────────────────────────────────────
// Jobs — z salary_offers + live fetch fallback
// ─────────────────────────────────────────────
async function getRecentJobs(techSlug: string, roleSlug: string): Promise<JobListing[]> {
  // Pobierz ostatnie oferty z naszej bazy (ze scrapera)
  const rows = await db
    .selectFrom('salary_offers as so')
    .select(['so.source', 'so.source_id', 'so.salary_min', 'so.salary_max', 'so.location_slug', 'so.scraped_at'])
    .where('so.tech_slug', '=', techSlug)
    .where('so.scraped_at', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .orderBy('so.scraped_at', 'desc')
    .limit(5)
    .execute()

  return rows.map(r => ({
    title:       `${techSlug.charAt(0).toUpperCase() + techSlug.slice(1)} Developer`,
    company:     '—',
    location:    r.location_slug as string,
    salary_from: r.salary_min as number | null,
    salary_to:   r.salary_max as number | null,
    url:         buildJobUrl(r.source as string, r.source_id as string),
    source:      r.source as string,
    posted_at:   new Date(r.scraped_at as Date).toLocaleDateString('pl-PL'),
  }))
}

function buildJobUrl(source: string, sourceId: string): string {
  if (source === 'justjoin') return `https://justjoin.it/offers/${sourceId}`
  if (source === 'nofluff')  return `https://nofluffjobs.com/pl/job/${sourceId}`
  return '#'
}

function buildJobSearchUrl(techSlug: string, roleSlug: string): string {
  const techQuery = encodeURIComponent(techSlug.replace(/-/g, ' '))
  return `https://justjoin.it/?q=${techQuery}&orderBy=published&order=desc`
}

// ─────────────────────────────────────────────
// Related stacks
// ─────────────────────────────────────────────
async function getRelatedStacks(techSlug: string) {
  return db
    .selectFrom('stacks')
    .select(['slug', 'title'])
    .where(eb => eb(
      eb.fn('array_position', ['tech_slugs', eb.val(techSlug)]),
      'is not', null
    ))
    .where('is_published', '=', true)
    .orderBy('popularity', 'desc')
    .limit(4)
    .execute()
    .then(rows => rows.map(r => ({ slug: r.slug as string, title: r.title as string })))
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function buildHeadline(roleName: string, techName: string): string {
  return `Kompletny przewodnik po ${techName} dla ${roleName} — roadmapa nauki, najlepsze kursy i aktualne oferty pracy.`
}

// generateStaticParams helper — tylko pary które mają dane
export async function getAllPersonas(): Promise<Array<{ role_slug: string; tech_slug: string }>> {
  // Krzyżuj role z technologiami które mają kursy lub oferty pracy
  const techsWithData = await db
    .selectFrom('salary_offers')
    .select('tech_slug')
    .groupBy('tech_slug')
    .having(db.fn.count('id'), '>=', db.val(3))
    .execute()

  const techSlugs = techsWithData.map(r => r.tech_slug as string)
  const pairs: Array<{ role_slug: string; tech_slug: string }> = []

  for (const techSlug of techSlugs) {
    for (const roleSlug of Object.keys(ROLES)) {
      // Generuj tylko pary które mają roadmapę lub kursy
      const key = `${techSlug}__${roleSlug}`
      const hasRoadmap = key in ROADMAPS
      const hasCourses = key in PERSONA_COURSES
      if (hasRoadmap || hasCourses) {
        pairs.push({ role_slug: roleSlug, tech_slug: techSlug })
      }
    }
  }

  return pairs
}
