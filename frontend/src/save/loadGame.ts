// Recharge une partie sauvegardée sans faire échouer l'application si le JSON est invalide.
import type { GameState } from '../game/gameState'
import { SAVE_KEY, type SaveData } from './saveFormat'

export const loadGame = (): GameState | null => {
  const raw = localStorage.getItem(SAVE_KEY)
  if (!raw) return null
  try { return (JSON.parse(raw) as SaveData).state } catch { return null }
}
