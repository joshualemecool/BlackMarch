// Première conversation de test avec le gardien d'Argnael.
import type { DialogueNode } from './types'

export const starterDialogue: DialogueNode[] = [
  { id: 'gatekeeper-intro', speaker: 'Argnael Gatekeeper', text: 'The road to the forest has been closed since the demons appeared.', choices: [
    { id: 'ask-force', label: 'Insist with force', nextDialogueId: 'gatekeeper-force', requirement: { stat: 'force', minimum: 6 } },
    { id: 'ask-intelligence', label: 'Ask what happened', nextDialogueId: 'gatekeeper-intel', requirement: { stat: 'intelligence', minimum: 5 } },
    { id: 'leave', label: 'Leave for the training ground', nextDialogueId: 'gatekeeper-exit' },
  ] },
  { id: 'gatekeeper-force', speaker: 'Argnael Gatekeeper', text: 'Very well. Open the gate yourself if you think you can survive outside.' },
  { id: 'gatekeeper-intel', speaker: 'Argnael Gatekeeper', text: 'They come from the Black Forest. Someone is guiding them from the other side.' },
  { id: 'gatekeeper-exit', speaker: 'Argnael Gatekeeper', text: 'The training ground is open. Return when you are ready.' },
]
