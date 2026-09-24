// Catalogue initial des démons mineurs et majeurs d'Argnael.
import type { DemonDefinition } from './types'

export const minorDemons: DemonDefinition[] = [
  { id: 'demon-hound', name: 'Demon Hound', rank: 'minor', description: 'Born from the black illness that afflicts the beasts of these lands, these creatures are twisted into monstrous forms, driven by an insatiable thirst for blood.', stats: { force: 5, endurance: 4, intelligence: 2, resilience: 3, speed: 8 } },
  { id: 'demon-infant', name: 'Demon Infant', rank: 'minor', description: 'Born from the mingling of human and demonic blood, these monstrosities may have the size of an adult man, yet they are, in truth, nothing more than newborns.', stats: { force: 2, endurance: 3, intelligence: 5, resilience: 4, speed: 5 } },
  { id: 'succubus', name: 'Succubus', rank: 'minor', description: 'Lurking in the wilds, these demons prey upon the weak-minded, luring them into their grasp to bring forth new monstrosities.', stats: { force: 3, endurance: 4, intelligence: 8, resilience: 5, speed: 6 } },
  { id: 'flying-demon', name: 'Flying Demon', rank: 'minor', description: 'No larger than a wolf, these bat-like creatures often take to the skies in swarms. When the sun rises, they retreat beneath the earth, where they remain hidden until nightfall.', stats: { force: 4, endurance: 3, intelligence: 4, resilience: 3, speed: 9 } },
]

export const majorDemons: DemonDefinition[] = [
  { id: 'prince-of-night', name: 'The Prince of Night', rank: 'major', description: 'The major demon who rules beyond the Three Walls.', stats: { force: 10, endurance: 10, intelligence: 10, resilience: 10, speed: 8 } },
]
