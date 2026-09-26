// Sépare le catalogue mondial, les objets possédés et les objets équipés.
import { armors, weapons, type StatImprovement, type StatName } from '../data/equipment'
import type { CharacterStats } from '../data/characters/types'

export type EquipmentInventory = {
  // Objets possédés mais actuellement rangés dans l'inventaire.
  weaponIds: string[]
  armorIds: string[]
}

export type EquippedEquipment = {
  // Un seul équipement de chaque catégorie peut modifier les statistiques.
  weaponId: string | null
  armorId: string | null
}

export type EquipmentState = {
  inventory: EquipmentInventory
  equipped: EquippedEquipment
}

export const initialEquipmentState: EquipmentState = {
  inventory: {
    weaponIds: ['wall-breaker', 'thorn-spear'],
    armorIds: ['argnael-mail', 'light-forge-plate'],
  },
  equipped: {
    weaponId: 'argnael-sabre',
    armorId: 'traveler-cloth',
  },
}

// Retourne uniquement les améliorations des objets actuellement équipés.
export const getEquippedImprovements = (state: EquipmentState) => {
  const equippedWeapon = weapons.find(item => item.id === state.equipped.weaponId)
  const equippedArmor = armors.find(item => item.id === state.equipped.armorId)
  return [equippedWeapon?.improves, equippedArmor?.improves].filter(
    (improvement): improvement is StatImprovement => improvement !== undefined,
  )
}

// Applique les améliorations compatibles avec les statistiques du personnage.
export const applyEquipmentStats = (stats: CharacterStats, state: EquipmentState): CharacterStats => {
  const result = { ...stats }
  for (const improvement of getEquippedImprovements(state)) {
    if (improvement.stat !== 'materials') result[improvement.stat as Exclude<StatName, 'materials'>] += improvement.amount
  }
  return result
}
