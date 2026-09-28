// Types de contenu utilisés pour distinguer les rencontres ordinaires des boss.
import type { ArmorMaterial, WeaponType } from '../equipment'

export type DemonRank = 'minor' | 'major'
export type DemonAttackDefinition = {
  id: string
  name: string
  type: WeaponType
  staminaCost: number
  baseDamage: number
  defenseAction: 'dodge' | 'block' | 'jump'
}

// Fiche complète d'un démon combatif.
export type DemonDefinition = {
  id: string
  name: string
  rank: DemonRank
  description: string
  stats: { force: number; endurance: number; intelligence: number; resilience: number; agility: number }
  level?: number
  armorType?: ArmorMaterial
  attacks?: DemonAttackDefinition[]
}
