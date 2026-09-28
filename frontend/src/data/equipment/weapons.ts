// Weapon attack types stack their primary and secondary multipliers.
import type { WeaponDefinition } from './types'

export const weapons: WeaponDefinition[] = [
  { id: 'argnael-sabre', name: 'Argnael Sword', baseDamage: 5, primaryType: 'slashing', secondaryType: 'piercing', primaryMultiplier: 1.5, secondaryMultiplier: 1.2 },
  { id: 'wall-breaker', name: 'Iron Mace', baseDamage: 5, primaryType: 'blunt', secondaryType: 'blunt', primaryMultiplier: 1.5, secondaryMultiplier: 1.2 },
  { id: 'thorn-spear', name: 'Thorn Spear', baseDamage: 5, primaryType: 'piercing', secondaryType: 'piercing', primaryMultiplier: 1.5, secondaryMultiplier: 1.2 },
  { id: 'woodcutter-axe', name: 'Woodcutter Axe', baseDamage: 5, primaryType: 'blunt', secondaryType: 'slashing', primaryMultiplier: 1.5, secondaryMultiplier: 1.2 },
  { id: 'thorn-whip', name: 'Thorn Whip', baseDamage: 5, primaryType: 'slashing', secondaryType: 'slashing', primaryMultiplier: 1.5, secondaryMultiplier: 1.2 },
]
