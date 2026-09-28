// Types de matériaux, d'armes et de statistiques modifiables par l'équipement.
export type ArmorMaterial = 'cloth' | 'leather' | 'mail' | 'plate'
export type WeaponType = 'slashing' | 'blunt' | 'piercing'
export type StatName = 'force' | 'endurance' | 'intelligence' | 'resilience' | 'agility' | 'materials'

// Amélioration directe d'une statistique apportée par l'équipement.
export type StatImprovement = { stat: StatName; amount: number }

// Fiche de données d'une armure.
export type ArmorDefinition = {
  id: string
  name: string
  type: ArmorMaterial
  material: string
  armor: number
  protection: Record<WeaponType, number>
  improves?: StatImprovement
}

// Fiche de données d'une arme.
export type WeaponDefinition = {
  id: string
  name: string
  baseDamage: number
  primaryType: WeaponType
  secondaryType: WeaponType
  primaryMultiplier: number
  secondaryMultiplier: number
  improves?: StatImprovement
}
