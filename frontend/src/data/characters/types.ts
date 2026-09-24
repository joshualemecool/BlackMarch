// Contrats communs aux personnages jouables et aux futurs compagnons.
export type CharacterRole = 'player' | 'companion'

// Les cinq statistiques principales d'un personnage.
export type CharacterStats = {
  force: number
  endurance: number
  intelligence: number
  resilience: number
  speed: number
}

// Décrit un personnage de contenu, indépendamment de son affichage.
export type CharacterDefinition = {
  id: string
  name: string
  title: string
  role: CharacterRole
  description: string
  stats: CharacterStats
  level: number
  health: number
  maxHealth: number
  resolve: number
  maxResolve: number
  attack: number
  defense: number
  gold: number
}
