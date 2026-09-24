// Armes classées par style: tranchant, contondant ou pique.
import type { WeaponDefinition } from './types'

export const weapons: WeaponDefinition[] = [
  { id: 'argnael-sabre', name: 'Argnael Sabre', type: 'slashing', improves: { stat: 'force', amount: 2 } },
  { id: 'wall-breaker', name: 'Wall Breaker', type: 'blunt', improves: { stat: 'endurance', amount: 3 } },
  { id: 'thorn-spear', name: 'Thorn Spear', type: 'piercing', improves: { stat: 'speed', amount: 2 } },
]
