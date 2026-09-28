import { armors, weapons, type ArmorDefinition, type WeaponDefinition, type WeaponType } from '../data/equipment'
import type { CharacterStats } from '../data/characters/types'
import { minorDemons } from '../data/enemies/demons'
import type { DemonAttackDefinition, DemonDefinition } from '../data/enemies/types'

export type AttackType = WeaponType
export type AttackMoveId = 'slash' | 'pierce' | 'smash'
export type TimingGrade = 'perfect' | 'good' | 'miss'
export type CombatPhase = 'planning' | 'player-timing' | 'enemy-timing' | 'victory' | 'defeat'
export type CombatImpact = 'enemy' | 'player' | null
export type DefenseAction = 'dodge' | 'block' | 'jump'

export type AttackMove = {
  id: AttackMoveId
  name: string
  type: AttackType
  input: string
  staminaCost: number
}

export type CombatState = {
  playerHealth: number
  playerMaxHealth: number
  playerStamina: number
  playerMaxStamina: number
  enemyHealth: number
  enemyMaxHealth: number
  enemyStamina: number
  enemyMaxStamina: number
  enemyName: string
  enemyLevel: number
  enemyAttacks: EnemyAttack[]
  phase: CombatPhase
  sequence: AttackMoveId[]
  sequenceIndex: number
  enemyAttackIndex: number
  round: number
  message: string
  lastImpact: CombatImpact
  impactId: number
  playerStats: CharacterStats
  enemyStats: CharacterStats
  playerWeapon: WeaponDefinition
  playerArmor: ArmorDefinition
  enemyArmor: ArmorDefinition
  lastPlayerAttackId: AttackMoveId | null
  playerRepeatCount: number
  lastEnemyAttackId: string | null
  enemyRepeatCount: number
}

const allPlayerMoves: AttackMove[] = [
  { id: 'slash', name: 'Vertical Slash', type: 'slashing', input: 'A', staminaCost: 3 },
  { id: 'pierce', name: 'Thrust', type: 'piercing', input: 'P', staminaCost: 4 },
  { id: 'smash', name: 'Crushing Blow', type: 'blunt', input: 'S', staminaCost: 4 },
]

export type EnemyAttack = DemonAttackDefinition & { direction: string; inputs: string[]; timingDifficulty: number }
export type IncomingAttack = EnemyAttack & { sequenceIndex: number }

const enemy = minorDemons.find(item => item.id === 'demon-hound')!
const enemyAttackPatterns = [
  ['scratch', 'bite', 'charge'],
  ['charge', 'scratch', 'bite'],
  ['bite', 'charge', 'scratch'],
]
const attributeNames = ['force', 'endurance', 'intelligence', 'resilience', 'agility'] as const

export const getEnemyStatsAtLevel = (definition: DemonDefinition, level: number, random = Math.random): CharacterStats => {
  const stats = { ...definition.stats }
  for (let increase = 1; increase < Math.max(1, Math.floor(level)); increase += 1) {
    const attribute = attributeNames[Math.floor(random() * attributeNames.length)]
    stats[attribute] += 1
  }
  return stats
}

const createEnemyAttackSequence = (round: number): EnemyAttack[] => {
  const pattern = enemyAttackPatterns[(round - 1) % enemyAttackPatterns.length]
  const directionByAction: Record<DefenseAction, string> = { dodge: 'Dodge', block: 'Block', jump: 'Jump' }
  const keysByAction: Record<DefenseAction, string[]> = { dodge: ['z', 'q', 's', 'd'], block: ['a', 'e'], jump: [' '] }

  return pattern.flatMap(id => {
    const definition = enemy.attacks?.find(attack => attack.id === id)
    if (!definition) return []
    const options = keysByAction[definition.defenseAction]
    const input = options[Math.floor(Math.random() * options.length)]
    return [{ ...definition, direction: directionByAction[definition.defenseAction], inputs: [input], timingDifficulty: 1 }]
  })
}

export const getIncomingAttacks = (state: CombatState): IncomingAttack[] => {
  let lastAttackId = state.lastEnemyAttackId
  let repeatCount = state.enemyRepeatCount
  return state.enemyAttacks.slice(state.enemyAttackIndex).map((attack, index) => {
    repeatCount = attack.id === lastAttackId ? repeatCount + 1 : 0
    lastAttackId = attack.id
    const sequenceIndex = state.enemyAttackIndex + index
    return { ...attack, timingDifficulty: 1 + repeatCount * 0.2, sequenceIndex }
  })
}

export const dodgeStaminaCost = 1
const staminaRecoveryBase = 4

export const getPlayerMoves = (weapon: WeaponDefinition): AttackMove[] => allPlayerMoves.filter(move => [weapon.primaryType, weapon.secondaryType].includes(move.type))

export const getPlayerAttackDifficulty = (state: CombatState, moveId: AttackMoveId) =>
  1 + (state.lastPlayerAttackId === moveId ? state.playerRepeatCount + 1 : 0) * 0.2

export const createCombatState = (stats: CharacterStats, weapon: WeaponDefinition, armor: ArmorDefinition, level = enemy.level ?? 1): CombatState => {
  const enemyStats = getEnemyStatsAtLevel(enemy, level)
  const enemyArmor = armors.find(item => item.type === enemy.armorType) ?? armors[0]
  const playerMaxStamina = stats.endurance * 2
  const enemyMaxStamina = enemyStats.endurance * 2
  const playerMaxHealth = 40 + stats.resilience * 2
  const enemyMaxHealth = 40 + enemyStats.resilience * 2
  return {
    playerHealth: playerMaxHealth, playerMaxHealth,
    playerStamina: playerMaxStamina, playerMaxStamina,
    enemyHealth: enemyMaxHealth, enemyMaxHealth,
    enemyStamina: enemyMaxStamina, enemyMaxStamina, enemyName: enemy.name, enemyLevel: level, enemyAttacks: [],
    phase: 'planning', sequence: [], sequenceIndex: 0, enemyAttackIndex: 0, round: 1,
    message: 'Plan your sequence.', lastImpact: null, impactId: 0,
    playerStats: stats, enemyStats, playerWeapon: weapon, playerArmor: armor, enemyArmor,
    lastPlayerAttackId: null, playerRepeatCount: 0, lastEnemyAttackId: null, enemyRepeatCount: 0,
  }
}

export const getAttackTimingDuration = (ownStat: number, opposingStat: number) => Math.max(700, Math.min(3800, 1900 * ownStat / Math.max(1, opposingStat)))

export const getWeaponMultiplier = (weapon: WeaponDefinition, type: AttackType) =>
  (weapon.primaryType === type ? weapon.primaryMultiplier : 1) * (weapon.secondaryType === type ? weapon.secondaryMultiplier : 1)

const getDamage = (rawDamage: number, type: AttackType, defense: number, armor: ArmorDefinition) => {
  const effectiveDefense = defense / armor.protection[type]
  return Math.max(1, Math.round(rawDamage * (100 / (100 + effectiveDefense))))
}

export const queueMove = (state: CombatState, moveId: AttackMoveId): CombatState => {
  const move = getPlayerMoves(state.playerWeapon).find(item => item.id === moveId)
  if (state.phase !== 'planning' || !move || state.playerStamina < move.staminaCost) return state
  return {
    ...state,
    playerStamina: state.playerStamina - move.staminaCost,
    sequence: [...state.sequence, moveId],
    message: `${move.name} added to the sequence.`,
  }
}

export const removeQueuedMove = (state: CombatState, index: number): CombatState => {
  if (state.phase !== 'planning' || index < 0 || index >= state.sequence.length) return state
  const removedMove = state.sequence[index]
  const move = getPlayerMoves(state.playerWeapon).find(item => item.id === removedMove)
  return {
    ...state,
    sequence: state.sequence.filter((_, itemIndex) => itemIndex !== index),
    playerStamina: Math.min(state.playerMaxStamina, state.playerStamina + (move?.staminaCost ?? 0)),
    message: 'Move removed from the sequence.',
  }
}

export const beginPlayerSequence = (state: CombatState): CombatState => {
  if (state.phase !== 'planning' || state.sequence.length === 0) return state
  return { ...state, phase: 'player-timing', sequenceIndex: 0, message: 'You prepare to strike.' }
}

const beginEnemyTurn = (state: CombatState, message = 'The Hound attacks.'): CombatState => {
  const enemyAttacks = createEnemyAttackSequence(state.round)
  if (enemyAttacks.length === 0) {
    const recovery = staminaRecoveryBase + state.enemyStats.resilience
    return {
      ...state,
      phase: 'planning',
      enemyStamina: Math.min(state.enemyMaxStamina, state.enemyStamina + recovery),
      playerStamina: Math.min(state.playerMaxStamina, state.playerStamina + staminaRecoveryBase + state.playerStats.resilience),
      round: state.round + 1,
      message: 'The Hound catches its breath.',
    }
  }
  return {
    ...state,
    phase: 'enemy-timing',
    enemyAttackIndex: 0,
    enemyAttacks,
    message,
  }
}

export const passTurn = (state: CombatState): CombatState => {
  if (state.phase !== 'planning') return state
  return beginEnemyTurn(state, 'You yield the initiative. The Hound attacks.')
}

export const resolvePlayerTiming = (state: CombatState, grade: TimingGrade): CombatState => {
  if (state.phase !== 'player-timing') return state
  const move = getPlayerMoves(state.playerWeapon).find(item => item.id === state.sequence[state.sequenceIndex])
  if (!move) return beginEnemyTurn(state)

  const rawDamage = (state.playerWeapon.baseDamage + state.playerStats.force * 3) * getWeaponMultiplier(state.playerWeapon, move.type)
  const damage = grade === 'miss' ? 1 : getDamage(rawDamage * (grade === 'perfect' ? 1.4 : 1), move.type, state.enemyArmor.armor, state.enemyArmor)
  const enemyHealth = Math.max(0, state.enemyHealth - damage)
  const lastImpact: CombatImpact = grade === 'miss' ? null : 'enemy'
  const impactId = state.impactId + 1
  const playerRepeatCount = state.lastPlayerAttackId === move.id ? state.playerRepeatCount + 1 : 0
  const attackState = { ...state, enemyHealth, lastPlayerAttackId: move.id, playerRepeatCount }
  if (enemyHealth === 0) return { ...attackState, phase: 'victory', lastImpact, impactId, message: `${state.enemyName} is defeated.` }

  const sequenceIndex = state.sequenceIndex + 1
  const sequenceComplete = sequenceIndex >= state.sequence.length
  const message = grade === 'perfect' ? `Perfect hit: ${damage} damage.` : grade === 'good' ? `Hit: ${damage} damage.` : 'The attack glances off the armor: 1 damage.'
  const nextState = {
    ...attackState,
    sequenceIndex,
    lastImpact,
    impactId,
    phase: 'player-timing' as const,
    message,
  }
  return sequenceComplete ? beginEnemyTurn(nextState, `${message} The Hound counterattacks.`) : nextState
}

export const resolveEnemyTiming = (state: CombatState, grade: TimingGrade): CombatState => {
  if (state.phase !== 'enemy-timing') return state
  const attack = getIncomingAttacks(state)[0]
  if (!attack) return state

  let enemyStamina = state.enemyStamina
  if (enemyStamina < attack.staminaCost) enemyStamina = Math.min(state.enemyMaxStamina, enemyStamina + staminaRecoveryBase + state.enemyStats.resilience)
  enemyStamina -= attack.staminaCost

  const avoided = state.playerStamina >= dodgeStaminaCost && grade !== 'miss'
  const playerStamina = avoided ? state.playerStamina - dodgeStaminaCost : state.playerStamina
  const rawDamage = attack.baseDamage + state.enemyStats.force * 3
  const damage = avoided ? 0 : getDamage(rawDamage, attack.type, state.playerArmor.armor, state.playerArmor)
  const playerHealth = Math.max(0, state.playerHealth - damage)
  const enemyAttackIndex = state.enemyAttackIndex + 1
  const lastEnemyAttackId = attack.id
  const enemyRepeatCount = state.lastEnemyAttackId === attack.id ? state.enemyRepeatCount + 1 : 0
  const lastImpact: CombatImpact = damage > 0 ? 'player' : null
  const impactId = state.impactId + 1
  const message = avoided ? `You avoid the Hound's ${attack.name}.` : `The Hound's ${attack.name} hits for ${damage} damage.`

  if (playerHealth === 0) return { ...state, playerHealth, playerStamina, enemyStamina, enemyAttackIndex, phase: 'defeat', lastImpact, impactId, lastEnemyAttackId, enemyRepeatCount, message: 'You can no longer continue.' }
  if (enemyAttackIndex < state.enemyAttacks.length) {
    return { ...state, playerHealth, playerStamina, enemyStamina, enemyAttackIndex, lastImpact, impactId, lastEnemyAttackId, enemyRepeatCount, message }
  }

  const staminaRecovery = staminaRecoveryBase + state.playerStats.resilience
  const nextStamina = Math.min(state.playerMaxStamina, playerStamina + staminaRecovery)
  return {
    ...state,
    playerHealth,
    playerStamina: nextStamina,
    enemyStamina,
    lastImpact,
    impactId,
    phase: 'planning',
    sequence: [],
    sequenceIndex: 0,
    enemyAttackIndex: 0,
    enemyAttacks: [],
    round: state.round + 1,
    lastEnemyAttackId,
    enemyRepeatCount,
    message: `${message} +${nextStamina - playerStamina} stamina.`,
  }
}
