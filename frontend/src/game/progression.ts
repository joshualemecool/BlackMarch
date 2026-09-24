// Fonctions de progression utilisées par les futurs systèmes d'expérience.
export const xpForLevel = (level: number) => level * 100

// Ajoute de l'expérience sans modifier la valeur existante.
export const grantExperience = (current: number, amount: number) => current + amount
