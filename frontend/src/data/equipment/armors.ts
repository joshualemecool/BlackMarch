// Armures disponibles dans les premières régions d'Argnael.
import type { ArmorDefinition } from './types'

export const armors: ArmorDefinition[] = [
  { id: 'traveler-cloth', name: 'Traveler\'s Tunic', type: 'cloth', material: 'Black linen', improves: { stat: 'speed', amount: 2 } },
  { id: 'argnael-mail', name: 'Argnael Mail', type: 'mail', material: 'Dull steel', improves: { stat: 'endurance', amount: 3 } },
  { id: 'light-forge-plate', name: 'Light Forge Plate', type: 'plate', material: 'Solar metal', improves: { stat: 'materials', amount: 4 } },
]
