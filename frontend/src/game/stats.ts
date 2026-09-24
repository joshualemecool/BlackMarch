// Outils communs pour calculer et afficher les statistiques.
export type Stats = { health: number; maxHealth: number; attack: number; defense: number }

// Convertit une valeur actuelle en pourcentage borné entre 0 et 100.
export const percent = (value: number, max: number) => Math.max(0, Math.min(100, (value / max) * 100))
