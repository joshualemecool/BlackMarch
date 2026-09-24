// Contrats pour les dialogues ramifiés et leurs conditions de statistiques.
import type { StatName } from '../equipment/types'

// Option proposée au joueur dans une conversation.
export type DialogueChoice = {
  id: string
  label: string
  nextDialogueId: string
  requirement?: { stat: StatName; minimum: number }
}

// Réplique affichée par le système de dialogue.
export type DialogueNode = { id: string; speaker: string; text: string; choices?: DialogueChoice[] }
