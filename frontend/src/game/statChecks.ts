// Vérifie si les statistiques du personnage autorisent une option de dialogue.
import type { CharacterStats } from '../data/characters/types'
import type { StatName } from '../data/equipment/types'

export const meetsStatRequirement = (stats: CharacterStats, stat: StatName, minimum: number) => {
  // Les matériaux appartiennent à l'armure et ne sont pas une statistique du personnage.
  if (stat === 'materials') return false
  return stats[stat] >= minimum
}
