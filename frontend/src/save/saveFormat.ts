// Contrat sérialisé utilisé par localStorage et les futures migrations.
import type { GameState } from '../game/gameState'

export type SaveData = { version: number; savedAt: string; state: GameState }

// Clé unique pour éviter de disperser le nom du stockage dans l'application.
export const SAVE_KEY = 'the-black-march-save'
