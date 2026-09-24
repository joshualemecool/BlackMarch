// Contient les transitions simples qui modifient l'état du monde.
import type { GameState } from './gameState'
import type { LocationId } from '../data/world/types'

export const travelTo = (state: GameState, location: LocationId): GameState => ({
  ...state, mode: 'location', location, visited: state.visited.includes(location) ? state.visited : [...state.visited, location],
})

// Ajoute un événement récent au journal de bord en limitant sa taille.
export const addLog = (state: GameState, message: string): GameState => ({ ...state, log: [message, ...state.log].slice(0, 5) })
