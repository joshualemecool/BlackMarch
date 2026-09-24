// Personnages sélectionnables et compagnons prévus pour Argnael.
import type { CharacterDefinition } from './types'

export const playableCharacters: CharacterDefinition[] = [
  {
    id: 'loreth',
    name: 'Loreth',
    title: 'Young adventurer',
    role: 'player',
    description: 'A young man, ready to protect his nation against the encroaching darkness.',
    stats: { force: 6, endurance: 5, intelligence: 4, resilience: 4, speed: 6 },
    level: 1,
    health: 30,
    maxHealth: 30,
    resolve: 12,
    maxResolve: 12,
    attack: 6,
    defense: 4,
    gold: 25,
  },
]

export const companions: CharacterDefinition[] = []

// Point d'accès unique au personnage contrôlé par le joueur.
export const playerCharacter = playableCharacters[0]
