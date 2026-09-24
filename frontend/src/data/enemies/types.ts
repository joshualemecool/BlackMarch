// Types de contenu utilisés pour distinguer les rencontres ordinaires des boss.
export type DemonRank = 'minor' | 'major'

// Fiche complète d'un démon combatif.
export type DemonDefinition = {
  id: string
  name: string
  rank: DemonRank
  description: string
  stats: { force: number; endurance: number; intelligence: number; resilience: number; speed: number }
}
