// Types et règles minimales du combat au tour par tour.
export type CombatState = { playerHealth: number; enemyHealth: number; enemyName: string; turn: 'player' | 'enemy'; ended: boolean }

// Applique une attaque du joueur puis la riposte de l'ennemi.
export const playerStrike = (state: CombatState, attack: number, defense: number): CombatState => {
  const enemyHealth = Math.max(0, state.enemyHealth - Math.max(1, attack - 3))
  if (enemyHealth === 0) return { ...state, enemyHealth, ended: true }
  return { ...state, enemyHealth, playerHealth: Math.max(0, state.playerHealth - Math.max(1, 7 - defense)) }
}
