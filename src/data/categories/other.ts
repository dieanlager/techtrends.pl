import { Technology } from '../technologies';

export const ai: Technology[] = [
  { id: 'a1', slug: 'pytorch', name: 'PyTorch', tagline: 'Wiodący framework Deep Learning', category: 'AI', subcategory: 'Framework', gh_stars: 82000, npm_dls: 0, description: 'Faworyt badaczy i inżynierów ML.', salary_avg: 29000, difficulty: 'Advanced', alternatives: ['tensorflow', 'jax'], roles: ['ai-engineer', 'ml-engineer'] },
  { id: 'a2', slug: 'langchain', name: 'LangChain', tagline: 'Łączenie LLM w aplikacje', category: 'AI', subcategory: 'LLM Tools', gh_stars: 92000, npm_dls: 0, description: 'Standard do budowania agentów i potoków RAG.', salary_avg: 31000, difficulty: 'Intermediate', alternatives: ['llamaindex'], roles: ['ai-engineer', 'backend-developer'] },
  { id: 'a3', slug: 'openai-api', name: 'OpenAI API', tagline: 'Najpotężniejsze modele językowe', category: 'AI', subcategory: 'API', gh_stars: 0, npm_dls: 0, description: 'Dostęp do GPT-4o i o1-preview.', salary_avg: 35000, difficulty: 'Beginner', alternatives: ['anthropic-api'], roles: ['ai-engineer', 'fullstack-developer'] },
  { id: 'a4', slug: 'huggingface', name: 'Hugging Face', tagline: 'GitHub dla AI', category: 'AI', subcategory: 'Model Hub', gh_stars: 128000, npm_dls: 0, description: 'Największa baza modeli open-source.', salary_avg: 28500, difficulty: 'Intermediate', alternatives: [], roles: ['ml-engineer', 'ai-engineer'] },
];

export const tools: Technology[] = [
  { id: 't1', slug: 'vscode', name: 'VS Code', tagline: 'Najlepszy edytor kodu', category: 'Tools', subcategory: 'IDE', gh_stars: 162000, npm_dls: 0, description: 'Lekki, szybki i nieskończenie rozszerzalny.', salary_avg: 16000, difficulty: 'Beginner', alternatives: ['cursor', 'zed'], roles: ['frontend-developer', 'backend-developer'] },
  { id: 't2', slug: 'vite', name: 'Vite', tagline: 'Następca Webpacka', category: 'Tools', subcategory: 'Bundler', gh_stars: 67000, npm_dls: 17000000, description: 'Najszybszy frontend build tool.', salary_avg: 18000, difficulty: 'Beginner', alternatives: ['webpack', 'esbuild'], roles: ['frontend-developer'] },
  { id: 't3', slug: 'prisma', name: 'Prisma', tagline: 'Wygodny ORM dla TypeScripta', category: 'Tools', subcategory: 'ORM', gh_stars: 39000, npm_dls: 4000000, description: 'Zapewnia pełne bezpieczeństwo typów przy pracy z bazą.', salary_avg: 20500, difficulty: 'Intermediate', alternatives: ['drizzle'], roles: ['backend-developer', 'fullstack-developer'] },
  { id: 't4', slug: 'playwright', name: 'Playwright', tagline: 'Nowoczesne testy E2E', category: 'Tools', subcategory: 'Testing', gh_stars: 66000, npm_dls: 6500000, description: 'Najlepsze narzędzie do automatyzacji przeglądarek od Microsoftu.', salary_avg: 19000, difficulty: 'Intermediate', alternatives: ['cypress', 'selenium'], roles: ['qa-engineer', 'frontend-developer'] },
  { id: 't5', slug: 'git', name: 'Git', tagline: 'Fundament kontroli wersji', category: 'Tools', subcategory: 'VCS', gh_stars: 0, npm_dls: 0, description: 'Niezbędny w każdym projekcie programistycznym.', salary_avg: 15500, difficulty: 'Beginner', alternatives: [], roles: ['frontend-developer', 'backend-developer', 'devops'] },
];

export const security: Technology[] = [
  { id: 's1', slug: 'auth0', name: 'Auth0', tagline: 'Tożsamość w chmurze', category: 'Security', subcategory: 'Auth', gh_stars: 0, npm_dls: 0, description: 'Kompleksowe rozwiązanie do uwierzytelniania.', salary_avg: 22500, difficulty: 'Intermediate', alternatives: ['clerk', 'supabase-auth'], roles: ['backend-developer', 'security-engineer'] },
  { id: 's2', slug: 'snyk', name: 'Snyk', tagline: 'Bezpieczeństwo kodu', category: 'Security', subcategory: 'Scanning', gh_stars: 0, npm_dls: 1000000, description: 'Wykrywanie podatności w zależnościach i kodzie.', salary_avg: 21000, difficulty: 'Intermediate', alternatives: ['trivy'], roles: ['devops', 'security-engineer'] },
];
