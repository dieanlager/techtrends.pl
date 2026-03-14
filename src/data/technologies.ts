import { languages } from './categories/languages';
import { frameworks } from './categories/frameworks';
import { databases, cloud } from './categories/databases';
import { ai, tools, security } from './categories/other';
import { generated } from './categories/generated';

export interface Technology {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  subcategory?: string;
  gh_stars: number;
  npm_dls: number;
  description: string;
  salary_avg: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  alternatives: string[];
  errors?: string[];
  integrations?: string[];
  ecosystem?: string[];
  license?: string;
  first_release?: string;
  latest_version?: string;
  repo_url?: string;
  roles?: string[];
  use_cases?: string[];
}

export const technologies: Technology[] = [
  ...languages,
  ...frameworks,
  ...databases,
  ...cloud,
  ...ai,
  ...tools,
  ...security,
  ...generated,
];

export const SALARY_LOCATIONS = [
  { slug: 'polska', name: 'Polska', multiplier: 1.0 },
  { slug: 'warszawa', name: 'Warszawa', multiplier: 1.35 },
  { slug: 'krakow', name: 'Kraków', multiplier: 1.15 },
  { slug: 'wroclaw', name: 'Wrocław', multiplier: 1.18 },
  { slug: 'gdansk', name: 'Gdańsk', multiplier: 1.12 },
  { slug: 'poznan', name: 'Poznań', multiplier: 1.10 },
  { slug: 'zdalnie', name: 'Zdalnie (Remote)', multiplier: 1.25 },
  { slug: 'zagranica', name: 'Praca zagraniczna (EU/US)', multiplier: 2.5 },
];

export const SALARY_LEVELS = [
  { slug: 'junior', name: 'Junior', multiplier: 0.6 },
  { slug: 'mid', name: 'Mid', multiplier: 1.0 },
  { slug: 'senior', name: 'Senior', multiplier: 1.55 },
  { slug: 'lead', name: 'Tech Lead', multiplier: 1.9 },
];

export const ROLES = [
  { slug: 'frontend-developer', name: 'Frontend Developer' },
  { slug: 'backend-developer', name: 'Backend Developer' },
  { slug: 'fullstack-developer', name: 'Fullstack Developer' },
  { slug: 'data-scientist', name: 'Data Scientist' },
  { slug: 'ai-engineer', name: 'AI Engineer' },
  { slug: 'devops', name: 'DevOps Engineer' },
  { slug: 'mobile-developer', name: 'Mobile Developer' },
  { slug: 'platform-engineer', name: 'Platform Engineer' },
  { slug: 'ml-engineer', name: 'ML Engineer' },
  { slug: 'sre', name: 'Site Reliability Engineer' },
];

export const TREND_YEARS = [2022, 2023, 2024, 2025, 2026];

export const POPULAR_STACKS = [
  { slug: 'nextjs-tailwind-prisma-postgresql', name: 'Next.js + Tailwind + Prisma + PostgreSQL', techs: ['nextjs', 'tailwind-css', 'prisma', 'postgresql'], use_case: 'SaaS/Web App', description: 'Najpopularniejszy stack fullstack w 2026. T3 Stack inspiracja — type-safe od bazy do UI.' },
  { slug: 'react-nodejs-mongodb', name: 'MERN Stack', techs: ['react', 'express', 'mongodb', 'nodejs'], use_case: 'Web App', description: 'MongoDB + Express + React + Node. Klasyczny javascript fullstack stack startupów.' },
  { slug: 'python-fastapi-postgresql-docker', name: 'Python API Stack', techs: ['python', 'fastapi', 'postgresql', 'docker'], use_case: 'API/Backend', description: 'Nowoczesny Python stack do API. FastAPI + async + PostgreSQL + konteneryzacja.' },
  { slug: 'flutter-firebase-dart', name: 'Flutter + Firebase', techs: ['flutter', 'firebase', 'dart'], use_case: 'Mobile App', description: 'Google stack do aplikacji mobilnych. Szybki MVP, wszystkie platformy.' },
  { slug: 'nextjs-supabase-tailwind', name: 'Next.js + Supabase', techs: ['nextjs', 'supabase', 'tailwind-css'], use_case: 'SaaS MVP', description: 'Stack do szybkiego startu SaaS. Auth, baza, storage i hosting out-of-box.' },
  { slug: 'vue-nuxt-postgresql-django', name: 'Vue + Django Full', techs: ['vue', 'nuxt', 'postgresql', 'django'], use_case: 'Enterprise Web', description: 'Django REST backend z Nuxt frontendem. Popular w enterprise polskim rynku.' },
  { id: 'st7', slug: 'kubernetes-terraform-aws-github-actions', name: 'DevOps PowerStack', techs: ['kubernetes', 'terraform', 'aws', 'github-actions'], use_case: 'DevOps', description: 'Kompletny stack do cloud-native infrastruktury. GitOps, IaC i pełna automatyzacja.' },
  { id: 'st8', slug: 'pytorch-fastapi-postgresql-mlflow', name: 'MLOps Stack', techs: ['pytorch', 'fastapi', 'postgresql', 'mlflow'], use_case: 'AI/ML', description: 'Stack do produkcyjnego ML. PyTorch do modeli, FastAPI do serwowania, MLflow do tracking.' },
];
