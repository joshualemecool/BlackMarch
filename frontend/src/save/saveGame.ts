// Sérialise l'état actuel et l'enregistre dans le navigateur.
import type { GameState } from '../game/gameState'
import { SAVE_KEY, type SaveData } from './saveFormat'

export const saveGame = (state: GameState) => {
  // La date permet d'afficher une confirmation lisible dans le menu.
  const payload: SaveData = { version: state.saveVersion, savedAt: new Date().toISOString(), state }
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
  return payload
}
