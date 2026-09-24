// Point d'entrée réservé aux transformations des anciennes sauvegardes.
import type { SaveData } from './saveFormat'

// Retourne la sauvegarde telle quelle tant qu'aucune migration n'est nécessaire.
export const migrateSave = (save: SaveData): SaveData => save
