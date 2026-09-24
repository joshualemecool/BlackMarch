// Types qui décrivent la carte, ses régions et les lieux visitables.
export type RegionId = 'argnael' | 'black-forest' | 'golden-throne'
export type LocationType = 'city' | 'forest' | 'landmark'
export type LocationId = 'argnael-start-city' | 'argnael-forest' | 'capital-city' | 'black-forest' | 'golden-throne'

// Un lieu connaît ses connexions et les endroits accessibles à l'intérieur.
export type WorldLocation = {
  id: LocationId
  region: RegionId
  name: string
  type: LocationType
  description: string
  unlockAfter?: string
  connections: LocationId[]
  pointsOfInterest: string[]
  x: number
  y: number
  accent: string
}
