import fs from 'fs';
import path from 'path';

/**
 * TEN SKRYPT TO SERCE TWOJEGO PSEO.
 * Pozwala na masowe generowanie rekordów dla technologii, których nie chcesz wprowadzać ręcznie.
 * 
 * Użycie: 
 * 1. Dodaj listę nazw technologii do tablicy `rawList`
 * 2. Uruchom: npx tsx scripts/seed-large-database.ts
 */

const rawList = [
  // Tu wklej listę od użytkownika (wyciąg z ogromnej listy)
  "Lit", "Preact", "Alpine.js", "Stimulus", "Ember.js", "Mithril", "Riot.js", 
  "NestJS", "Fastify", "Hono", "Koa", "Hapi", "AdonisJS", "Sails.js",
  "Casandra", "Druid", "InfluxDB", "ScyllaDB", "Neo4j", "ArangoDB", "OrientDB",
  "Ansible", "Pulumi", "OpenTofu", "Nomad", "Consul", "Vault", "Boundary"
  // ... tu może być 2000 nazw
];

const categoryTemplates: any = {
  "Framework": { sub: "Frontend", diff: "Intermediate", sal: 17000 },
  "Backend": { sub: "Node.js", diff: "Intermediate", sal: 18000 },
  "Database": { sub: "NoSQL", diff: "Advanced", sal: 21000 },
  "Infrastructure": { sub: "DevOps", diff: "Advanced", sal: 24000 },
};

function generateTech(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-0]/g, '-');
  return {
    id: `auto-${Math.random().toString(36).substr(2, 9)}`,
    slug: slug,
    name: name,
    tagline: `Nowoczesne rozwiązanie ${name} dla developerów.`,
    category: "Auto-Generated",
    gh_stars: Math.floor(Math.random() * 50000),
    npm_dls: Math.floor(Math.random() * 1000000),
    description: `${name} to innowacyjne narzędzie wspierające procesy wytwarzania oprogramowania w nowoczesnych ekosystemach IT.`,
    salary_avg: 15000 + Math.floor(Math.random() * 10000),
    difficulty: "Intermediate",
    alternatives: ["react", "nodejs"], // Fallback linki
    roles: ["fullstack-developer"],
    integrations: ["docker", "github-actions"]
  };
}

async function run() {
  console.log(`🚀 Rozpoczynam generowanie ${rawList.length} technologii...`);
  
  const results = rawList.map(name => generateTech(name));
  
  const targetPath = path.join(process.cwd(), 'src/data/categories/generated.ts');
  
  const content = `import { Technology } from '../technologies';

export const generated: Technology[] = ${JSON.stringify(results, null, 2)};
`;

  fs.writeFileSync(targetPath, content);
  console.log(`✅ Sukces! Plik wygenerowany: ${targetPath}`);
}

run();
