import { db } from '@/lib/db'
import { cache } from 'react'

export type SalaryLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
export type ContractType = 'b2b' | 'uop' | 'both'

export type SalaryStats = {
  min: number | null
  p25: number | null
  median: number | null
  p75: number | null
  max: number | null
  mean: number | null
  sample_size: number
  contract: ContractType
  yoy_delta_pct: number | null
}

export type SalaryData = {
  techSlug: string
  techName: string
  locationSlug: string
  locationName: string
  levelSlug: string
  levelName: string
  stats: SalaryStats
  allLevels: any[]
  allLocations: any[]
  history: any[]
  related: any[]
  dataWarning: string | null
}

export const LEVELS: Record<string, { name: string; order: number }> = {
  junior: { name: 'Junior', order: 1 },
  mid: { name: 'Mid', order: 2 },
  senior: { name: 'Senior', order: 3 },
  lead: { name: 'Lead', order: 4 },
  principal: { name: 'Principal', order: 5 },
}

export const LOCATIONS: Record<string, string> = {
  polska: 'Polska',
  warszawa: 'Warszawa',
  krakow: 'Kraków',
  wroclaw: 'Wrocław',
  // ... reszta miast
}

export const getSalaryData = cache(async (techSlug: string, locationSlug: string, levelSlug: string): Promise<SalaryData | null> => {
  // Symulacja fetchowania danych pod pSEO
  return {
    techSlug,
    techName: techSlug.toUpperCase(),
    locationSlug,
    locationName: LOCATIONS[locationSlug] || locationSlug,
    levelSlug,
    levelName: LEVELS[levelSlug]?.name || levelSlug,
    stats: {
      min: 15000, p25: 18000, median: 22000, p75: 26000, max: 35000,
      mean: 23000, sample_size: 42, contract: 'b2b', yoy_delta_pct: 12.5
    },
    allLevels: [],
    allLocations: [],
    history: [],
    related: [],
    dataWarning: null
  }
})

export async function getTopSalaryCombinations(limit: number) {
  return [
    { tech_slug: 'python', location_slug: 'warszawa', level_slug: 'senior' },
    { tech_slug: 'javascript', location_slug: 'krakow', level_slug: 'mid' }
  ]
}
