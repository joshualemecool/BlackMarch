// Affiche les statistiques et ressources principales du personnage actif.
import { Heart, Shield, Sparkles } from 'lucide-react'
import { playerCharacter } from '../../data/characters'
import { percent } from '../../game/stats'
import { applyEquipmentStats, type EquipmentState } from '../../game/equipmentState'
import { lorethPortrait } from '../../assets/characters/Loreth-placeholder.png'

export function CharacterPanel({ equipment }: { equipment: EquipmentState }) {
  // Les jauges utilisent des pourcentages afin de rester adaptatives.
  const currentStats = applyEquipmentStats(playerCharacter.stats, equipment)
  const maxHealth = 40 + currentStats.resilience * 2
  const health = Math.min(playerCharacter.health, maxHealth)
  return <aside className="character-panel panel">
    <div className="portrait"><img src={lorethPortrait} alt={playerCharacter.name} /><div className="portrait-glow" /></div>
    <div className="character-heading"><div><p className="eyebrow">{playerCharacter.title.toUpperCase()}</p><h2>{playerCharacter.name}</h2></div><span className="level">LVL {playerCharacter.level}</span></div>
    <div className="stat-row"><Heart size={15} /><div className="meter-wrap"><div className="stat-label"><span>VITALITY</span><b>{health}/{maxHealth}</b></div><div className="meter"><i className="health" style={{ width: `${percent(health, maxHealth)}%` }} /></div></div></div>
    <div className="stat-row"><Sparkles size={15} /><div className="meter-wrap"><div className="stat-label"><span>RESOLVE</span><b>{playerCharacter.resolve}/{playerCharacter.maxResolve}</b></div><div className="meter"><i className="resolve" style={{ width: `${percent(playerCharacter.resolve, playerCharacter.maxResolve)}%` }} /></div></div></div>
    <div className="combat-stats"><span><strong>{currentStats.force}</strong> STR</span><span><strong>{currentStats.endurance}</strong> END</span><span><strong>{currentStats.intelligence}</strong> INT</span><span><Shield size={13} /> <strong>{currentStats.resilience}</strong> RES</span><span><strong>{currentStats.agility}</strong> AGI</span></div>
  </aside>
}
