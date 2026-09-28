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
    weaponIds: ['wall-breaker', 'thorn-spear', 'woodcutter-axe', 'thorn-whip'],
    armorIds: ['argnael-mail', 'light-forge-plate', 'hunter-leather'],
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

export const equipWeapon = (state: EquipmentState, weaponId: string): EquipmentState => {
  if (!state.inventory.weaponIds.includes(weaponId)) return state
  return {
    inventory: {
      ...state.inventory,
      weaponIds: [...state.inventory.weaponIds.filter(id => id !== weaponId), ...(state.equipped.weaponId ? [state.equipped.weaponId] : [])],
    },
    equipped: { ...state.equipped, weaponId },
  }
}

export const equipArmor = (state: EquipmentState, armorId: string): EquipmentState => {
  if (!state.inventory.armorIds.includes(armorId)) return state
  return {
    inventory: {
      ...state.inventory,
      armorIds: [...state.inventory.armorIds.filter(id => id !== armorId), ...(state.equipped.armorId ? [state.equipped.armorId] : [])],
    },
    equipped: { ...state.equipped, armorId },
  }
}
