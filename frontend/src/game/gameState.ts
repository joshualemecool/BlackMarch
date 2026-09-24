// Définit l'état persistant et les écrans principaux de la partie.
import { starterQuests, type Quest } from './quests'
import type { LocationId } from '../data/world/types'
import { initialEquipmentState, type EquipmentState } from './equipmentState'

export type GameMode = 'world' | 'location' | 'combat'

// Toutes les informations nécessaires pour reprendre une partie.
export type GameState = {
  mode: GameMode
  location: LocationId
  visited: LocationId[]
  quests: Quest[]
  log: string[]
  inventoryOpen: boolean
  equipment: EquipmentState
  saveVersion: number
}

export const initialGameState: GameState = {
  mode: 'world', location: 'argnael-start-city', visited: ['argnael-start-city'], quests: starterQuests,
  log: ['The road opens beneath a moon the color of old silver.'], inventoryOpen: false, equipment: initialEquipmentState, saveVersion: 1,
}
