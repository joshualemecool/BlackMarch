// Endroits secondaires sélectionnables une fois entré dans une ville.
export const pointsOfInterest = {
  armory: { id: 'armory', name: 'Armory', type: 'shop', description: 'Buy and inspect weapons and armor for the road ahead.' },
  'starting-castle': { id: 'starting-castle', name: 'Castle', type: 'story', description: 'The seat of Barthold\'s first oath and its oldest secrets.' },
  'training-ground': { id: 'training-ground', name: 'Training Ground', type: 'training', description: 'Practice your abilities before facing the demons beyond the walls.' },
  'light-forge': { id: 'light-forge', name: 'Light Forge', type: 'crafting', description: 'A legendary forge where sunlight is folded into metal.' },
  'capital-castle': { id: 'capital-castle', name: 'Capital Castle', type: 'story', description: 'The royal heart of Argnael, guarded by old politics.' },
  'three-walls': { id: 'three-walls', name: 'The Three Walls', type: 'landmark', description: 'Three colossal defenses standing between the kingdom and the night.' },
} as const
