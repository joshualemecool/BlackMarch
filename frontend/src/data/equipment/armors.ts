// Armures disponibles dans les premières régions d'Argnael.
import type { ArmorDefinition } from './types'

export const armors: ArmorDefinition[] = [
  { id: 'traveler-cloth', name: 'Traveler\'s Tunic', type: 'cloth', material: 'Black linen', armor: 1, protection: { slashing: 0.5, piercing: 0.5, blunt: 0.5 } },
  { id: 'argnael-mail', name: 'Argnael Mail', type: 'mail', material: 'Dull steel', armor: 3, protection: { slashing: 0.5, piercing: 1.5, blunt: 1 } },
  { id: 'light-forge-plate', name: 'Light Forge Plate', type: 'plate', material: 'Solar metal', armor: 5, protection: { slashing: 1.5, piercing: 1, blunt: 0.5 } },
  { id: 'hunter-leather', name: 'Hunter Leather', type: 'leather', material: 'Treated hide', armor: 2, protection: { slashing: 1, piercing: 0.5, blunt: 1 } },
]
