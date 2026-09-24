// Interface de combat: état de l'ennemi, jauge de vie et actions.
import { Flame, Swords } from 'lucide-react'
import { percent } from '../../game/stats'
import type { CombatState } from '../../game/combat'

export function Combat({ state, onAttack, onFlee }: { state: CombatState; onAttack: () => void; onFlee: () => void }) {
  return <section className="combat panel"><div className="combat-header"><div><p className="eyebrow">ENCOUNTER / THE OLD ROAD</p><h2><Swords size={22} /> {state.enemyName}</h2></div><span className="danger-tag">HOSTILE</span></div><div className="enemy-stage"><div className="enemy-sigil"><Flame size={48} /></div><div className="enemy-health"><span>VITALITY</span><b>{state.enemyHealth} / 28</b><div className="meter"><i className="enemy" style={{ width: `${percent(state.enemyHealth, 28)}%` }} /></div></div></div><div className="combat-actions"><button className="primary-button" onClick={onAttack} disabled={state.ended}><Swords size={16} /> Strike</button><button className="secondary-button" onClick={onFlee}>Retreat</button></div><p className="combat-hint">The hollow knight waits for your first mistake.</p></section>
}
