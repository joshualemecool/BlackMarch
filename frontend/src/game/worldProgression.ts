// Détermine si une région devient accessible après un chapitre donné.
import type { WorldLocation } from '../data/world/types'

export const isLocationUnlocked = (location: WorldLocation, completedChapters: string[]) => {
  return !location.unlockAfter || completedChapters.includes(location.unlockAfter)
}
