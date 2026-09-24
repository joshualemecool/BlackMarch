// Types de matériaux, d'armes et de statistiques modifiables par l'équipement.
export type ArmorMaterial = 'cloth' | 'leather' | 'mail' | 'plate'
export type WeaponType = 'slashing' | 'blunt' | 'piercing'
export type StatName = 'force' | 'endurance' | 'intelligence' | 'resilience' | 'speed' | 'materials'

// Amélioration directe d'une statistique apportée par l'équipement.
export type StatImprovement = { stat: StatName; amount: number }

// Fiche de données d'une armure.
export type ArmorDefinition = {
  id: string
  name: string
  type: ArmorMaterial
  material: string
  improves: StatImprovement
}

// Fiche de données d'une arme.
export type WeaponDefinition = {
  id: string
  name: string
  type: WeaponType
  improves: StatImprovement
}
