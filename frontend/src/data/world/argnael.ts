// Première carte narrative d'Argnael et ordre de progression des régions.
import type { WorldLocation } from './types'

export const argnaelLocations: WorldLocation[] = [
  { id: 'argnael-start-city', region: 'argnael', name: 'Barthold', type: 'city', description: 'Situated at the bottom south of Argnael, Barthold is the first fortified city of this young nation.', connections: ['argnael-forest'], pointsOfInterest: ['armory', 'starting-castle', 'training-ground'], x: 28, y: 62, accent: '#d89b5b' },
  { id: 'argnael-forest', region: 'argnael', name: 'Argnael Forest', type: 'forest', description: 'The forest links the cities and hides the old roads.', connections: ['argnael-start-city', 'capital-city', 'black-forest'], pointsOfInterest: [], x: 68, y: 30, accent: '#7f9b72' },
  { id: 'capital-city', region: 'argnael', name: 'The Capital', type: 'city', description: 'The political and military heart of the kingdom.', unlockAfter: 'chapter-2', connections: ['argnael-forest', 'golden-throne'], pointsOfInterest: ['light-forge', 'capital-castle', 'three-walls'], x: 48, y: 20, accent: '#c9b978' },
  { id: 'black-forest', region: 'black-forest', name: 'The Black Forest', type: 'forest', description: 'A forest whose old name was erased from every map.', unlockAfter: 'chapter-3', connections: ['argnael-forest', 'golden-throne'], pointsOfInterest: [], x: 82, y: 48, accent: '#596f5b' },
  { id: 'golden-throne', region: 'golden-throne', name: 'The Golden Throne', type: 'landmark', description: 'An ancient place where the borders between worlds grow thin.', unlockAfter: 'chapter-4', connections: ['capital-city', 'black-forest'], pointsOfInterest: [], x: 76, y: 78, accent: '#d2ad61' },
]
