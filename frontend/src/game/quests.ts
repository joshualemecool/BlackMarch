// Structure d'une quête et quêtes de départ du prototype.
export type Quest = { id: string; title: string; detail: string; complete: boolean }

export const starterQuests: Quest[] = [
  { id: 'bells', title: 'When the Bells Forget', detail: 'Find the source of the silence in Barthold.', complete: false },
  { id: 'thorn', title: 'A Green Oath', detail: 'Enter Argnael Forest and ask what the trees saw.', complete: false },
]
