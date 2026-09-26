export type AttackType = 'slash' | 'pierce'
export type AttackMoveId = AttackType
export type TimingGrade = 'perfect' | 'good' | 'miss'
export type CombatPhase = 'planning' | 'player-timing' | 'enemy-timing' | 'victory' | 'defeat'
export type CombatImpact = 'enemy' | 'player' | null

export type AttackMove = {
  id: AttackMoveId
  name: string
  type: AttackType
  input: string
  staminaCost: number
  damage: number
}

export type CombatState = {
  playerHealth: number
  playerMaxHealth: number
  playerStamina: number
  playerMaxStamina: number
  enemyHealth: number
  enemyMaxHealth: number
  enemyName: string
  phase: CombatPhase
  sequence: AttackMoveId[]
  sequenceIndex: number
  enemyAttackIndex: number
  round: number
  message: string
  lastImpact: CombatImpact
  impactId: number
}

export const playerMoves: AttackMove[] = [
  { id: 'slash', name: 'Taille', type: 'slash', input: 'A', staminaCost: 3, damage: 8 },
  { id: 'pierce', name: 'Estoc', type: 'pierce', input: 'P', staminaCost: 4, damage: 11 },
]

export type EnemyAttack = { type: AttackType; name: string; direction: string; input: string }

const enemyAttackPatterns: AttackType[][] = [
  ['slash', 'pierce'],
  ['slash', 'slash'],
  ['pierce', 'slash'],
  ['pierce', 'pierce'],
]

const enemyAttackByType: Record<AttackType, EnemyAttack> = {
  slash: { type: 'slash', name: 'Taille ennemie', direction: 'Esquive à gauche', input: 'Q' },
  pierce: { type: 'pierce', name: 'Estoc ennemi', direction: 'Esquive à droite', input: 'D' },
}

const getEnemyAttackPattern = (round: number) => enemyAttackPatterns[(round - 1) % enemyAttackPatterns.length]

export const getIncomingAttacks = (state: CombatState): EnemyAttack[] => {
  const pattern = getEnemyAttackPattern(state.round)
  if (pattern[0] !== pattern[1]) return pattern.map(type => enemyAttackByType[type])
  const nextType = pattern[state.enemyAttackIndex]
  return nextType ? [enemyAttackByType[nextType]] : []
}

export const dodgeStaminaCost = 1
const staminaRecovery = 4
const enemyDamage = 6

export const createCombatState = (): CombatState => ({
  playerHealth: 34,
  playerMaxHealth: 34,
  playerStamina: 10,
  playerMaxStamina: 10,
  enemyHealth: 28,
  enemyMaxHealth: 28,
  enemyName: 'Hollow Knight',
  phase: 'planning',
  sequence: [],
  sequenceIndex: 0,
  enemyAttackIndex: 0,
  round: 1,
  message: 'Préparez votre enchaînement.',
  lastImpact: null,
  impactId: 0,
})

export const queueMove = (state: CombatState, moveId: AttackMoveId): CombatState => {
  const move = playerMoves.find(item => item.id === moveId)
  if (state.phase !== 'planning' || !move || state.playerStamina < move.staminaCost) return state
  return {
    ...state,
    playerStamina: state.playerStamina - move.staminaCost,
    sequence: [...state.sequence, moveId],
    message: `${move.name} ajouté à l'enchaînement.`,
  }
}

export const removeQueuedMove = (state: CombatState, index: number): CombatState => {
  if (state.phase !== 'planning' || index < 0 || index >= state.sequence.length) return state
  const removedMove = state.sequence[index]
  const move = playerMoves.find(item => item.id === removedMove)
  return {
    ...state,
    sequence: state.sequence.filter((_, itemIndex) => itemIndex !== index),
    playerStamina: Math.min(state.playerMaxStamina, state.playerStamina + (move?.staminaCost ?? 0)),
    message: 'Coup retiré de l’enchaînement.',
  }
}

export const beginPlayerSequence = (state: CombatState): CombatState => {
  if (state.phase !== 'planning' || state.sequence.length === 0) return state
  return { ...state, phase: 'player-timing', sequenceIndex: 0, message: 'Le chevalier se prépare à riposter.' }
}

export const passTurn = (state: CombatState): CombatState => {
  if (state.phase !== 'planning') return state
  return { ...state, phase: 'enemy-timing', enemyAttackIndex: 0, message: 'Le chevalier prend l’initiative.' }
}

export const resolvePlayerTiming = (state: CombatState, grade: TimingGrade): CombatState => {
  if (state.phase !== 'player-timing') return state
  const move = playerMoves.find(item => item.id === state.sequence[state.sequenceIndex])
  if (!move) return { ...state, phase: 'enemy-timing', enemyAttackIndex: 0 }

  const damage = grade === 'perfect' ? Math.round(move.damage * 1.4) : grade === 'good' ? move.damage : 1
  const enemyHealth = Math.max(0, state.enemyHealth - damage)
  const lastImpact = grade === 'miss' ? null : 'enemy'
  const impactId = state.impactId + 1
  if (enemyHealth === 0) return { ...state, enemyHealth, phase: 'victory', lastImpact, impactId, message: `Impact parfait. ${state.enemyName} est vaincu.` }

  const sequenceIndex = state.sequenceIndex + 1
  const sequenceComplete = sequenceIndex >= state.sequence.length
  const message = grade === 'perfect' ? `Impact parfait : ${damage} dégâts.` : grade === 'good' ? `Coup porté : ${damage} dégâts.` : 'Le coup effleure l’armure : 1 dégât.'
  return {
    ...state,
    enemyHealth,
    sequenceIndex,
    lastImpact,
    impactId,
    phase: sequenceComplete ? 'enemy-timing' : 'player-timing',
    enemyAttackIndex: sequenceComplete ? 0 : state.enemyAttackIndex,
    message: sequenceComplete ? `${message} Le chevalier contre-attaque.` : message,
  }
}

export const resolveEnemyTiming = (state: CombatState, grades: TimingGrade | TimingGrade[]): CombatState => {
  if (state.phase !== 'enemy-timing') return state
  const incomingAttacks = getIncomingAttacks(state)
  if (incomingAttacks.length === 0) return state
  const results = Array.isArray(grades) ? grades : [grades]
  let playerStamina = state.playerStamina
  let playerHealth = state.playerHealth
  let dodgedCount = 0
  let hitCount = 0

  incomingAttacks.forEach((_, index) => {
    const canDodge = playerStamina >= dodgeStaminaCost
    const dodged = canDodge && results[index] !== 'miss'
    if (dodged) {
      playerStamina -= dodgeStaminaCost
      dodgedCount += 1
    } else {
      playerHealth = Math.max(0, playerHealth - enemyDamage)
      hitCount += 1
    }
  })

  const lastImpact = hitCount > 0 ? 'player' : null
  const impactId = state.impactId + incomingAttacks.length

  if (playerHealth === 0) return { ...state, playerHealth, playerStamina, phase: 'defeat', lastImpact, impactId, message: 'Vous ne pouvez plus continuer.' }

  const enemyAttackIndex = state.enemyAttackIndex + incomingAttacks.length
  if (enemyAttackIndex < getEnemyAttackPattern(state.round).length) {
    return {
      ...state,
      playerHealth,
      playerStamina,
      enemyAttackIndex,
      lastImpact,
      impactId,
      message: hitCount ? 'Le coup vous atteint. Une autre attaque arrive !' : 'Esquive réussie. Une autre attaque arrive !',
    }
  }

  const nextStamina = Math.min(state.playerMaxStamina, playerStamina + staminaRecovery)
  return {
    ...state,
    playerHealth,
    playerStamina: nextStamina,
    lastImpact,
    impactId,
    phase: 'planning',
    sequence: [],
    sequenceIndex: 0,
    enemyAttackIndex: 0,
    round: state.round + 1,
    message: `${hitCount ? `${hitCount} coup${hitCount > 1 ? 's' : ''} encaissé${hitCount > 1 ? 's' : ''}.` : `${dodgedCount} attaque${dodgedCount > 1 ? 's' : ''} esquivée${dodgedCount > 1 ? 's' : ''}.`} +${nextStamina - playerStamina} endurance.`,
  }
}
