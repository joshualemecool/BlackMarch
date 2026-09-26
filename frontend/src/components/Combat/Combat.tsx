import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, Heart, Swords } from 'lucide-react'
import { percent } from '../../game/stats'
import {
  dodgeStaminaCost,
  getIncomingAttacks,
  playerMoves,
  queueMove,
  removeQueuedMove,
  beginPlayerSequence,
  passTurn,
  resolveEnemyTiming,
  resolvePlayerTiming,
  type AttackType,
  type CombatState,
  type TimingGrade,
} from '../../game/combat'

const timingDuration = 1900
const targetPosition = 50
const perfectWindow = 3.5
const goodWindow = 10

function TimingChallenge({ actionLabel, inputKey, angle, delayMs = 0, disabled = false, onResult }: { actionLabel: string; inputKey: string; angle: AttackType | 'incoming'; delayMs?: number; disabled?: boolean; onResult: (grade: TimingGrade) => void }) {
  const [position, setPosition] = useState(0)
  const positionRef = useRef(0)
  const resultRef = useRef(onResult)
  const settledRef = useRef(false)
  const feedbackTimerRef = useRef<number | null>(null)
  const [feedback, setFeedback] = useState<TimingGrade | null>(null)
  resultRef.current = onResult

  const finishRef = useRef<(grade: TimingGrade) => void>(() => {})
  finishRef.current = (grade: TimingGrade) => {
    if (settledRef.current) return
    settledRef.current = true
    setFeedback(grade)
    if (grade === 'miss') {
      feedbackTimerRef.current = window.setTimeout(() => resultRef.current(grade), 500)
    } else {
      resultRef.current(grade)
    }
  }

  useEffect(() => {
    const startedAt = performance.now()
    let frame = 0
    const animate = (now: number) => {
      const elapsed = now - startedAt - delayMs
      const nextPosition = Math.max(0, Math.min(100, elapsed / timingDuration * 100))
      positionRef.current = nextPosition
      setPosition(nextPosition)
      if (elapsed > 0 && nextPosition > targetPosition + goodWindow) {
        finishRef.current('miss')
        return
      }
      if (nextPosition <= 100) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [delayMs])

  useEffect(() => () => {
    if (feedbackTimerRef.current !== null) window.clearTimeout(feedbackTimerRef.current)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (disabled) return
      const matches = inputKey.startsWith('Arrow') ? event.key === inputKey : event.key.toUpperCase() === inputKey.toUpperCase()
      if (matches) {
        event.preventDefault()
        submit()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [inputKey, disabled])

  const submit = () => {
    const distance = Math.abs(positionRef.current - targetPosition)
    finishRef.current(distance <= perfectWindow ? 'perfect' : distance <= goodWindow ? 'good' : 'miss')
  }

  return <div className={`timing-challenge timing-${angle}`}>
    <div className={`timing-track ${feedback === 'miss' ? 'is-miss' : ''}`} aria-label={`Barre de timing, touche ${inputKey}`}>
      <span className="timing-target" style={{ left: `${targetPosition}%` }} />
      <button className="timing-cursor" style={{ left: `${angle === 'incoming' ? 100 - position : position}%` }} onClick={submit} disabled={disabled} aria-label={`Appuyer sur ${inputKey}`}><span className="timing-cursor-key">{inputKey === 'ArrowLeft' ? '←' : inputKey === 'ArrowRight' ? '→' : inputKey}</span></button>
    </div>
    <span className="timing-action-label">{actionLabel}</span>
  </div>
}

function BattleScene({ enemyName, enemyHealth, enemyMaxHealth, phase, lastImpact, impactId, children }: { enemyName: string; enemyHealth: number; enemyMaxHealth: number; phase: CombatState['phase']; lastImpact: CombatState['lastImpact']; impactId: number; children?: ReactNode }) {
  return <div className={`battle-scene ${phase === 'player-timing' ? 'is-player-turn' : ''} ${phase === 'enemy-timing' ? 'is-enemy-turn' : ''} ${lastImpact ? `impact-${lastImpact}` : ''}`}>
    <svg className="battle-art" viewBox="0 0 960 360" role="img" aria-label={`Loreth affronte ${enemyName} sur une ancienne route forestière`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="battle-sky" x2="0" y2="1"><stop stopColor="#18271f" /><stop offset="1" stopColor="#756345" /></linearGradient>
        <linearGradient id="battle-ground" x2="0" y2="1"><stop stopColor="#51563d" /><stop offset="1" stopColor="#191e18" /></linearGradient>
        <linearGradient id="battle-cloak" x2="1" y2="1"><stop stopColor="#a7a18a" /><stop offset=".45" stopColor="#596350" /><stop offset="1" stopColor="#252b25" /></linearGradient>
        <radialGradient id="battle-moon"><stop stopColor="#e2c18c" stopOpacity=".8" /><stop offset="1" stopColor="#e2c18c" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="960" height="360" fill="url(#battle-sky)" />
      <circle cx="690" cy="100" r="100" fill="url(#battle-moon)" />
      <circle cx="690" cy="100" r="29" fill="#ddc594" opacity=".7" />
      <path d="M0 213 76 124l48 69 65-107 79 116 76-79 89 97 91-119 82 104 67-84 93 96 75-99 119 107v83H0Z" fill="#26372d" />
      <path d="M0 233 58 173l52 67 77-83 66 86 69-64 65 70 84-92 66 77 66-54 78 62 61-78 76 66 66-69 81 76v105H0Z" fill="#1c2a22" />
      <path d="M0 234q220-36 430 13t530-9v122H0Z" fill="url(#battle-ground)" />
      <path d="M0 281q248-40 497 0t463-14" fill="none" stroke="#a58c5e" strokeOpacity=".28" strokeWidth="2" />
      <g key={lastImpact === 'enemy' ? `enemy-hit-${impactId}` : 'enemy-idle'} className={`battle-enemy ${lastImpact === 'enemy' ? 'is-hit' : ''}`} transform="translate(672 170)">
        <ellipse cx="0" cy="111" rx="49" ry="10" fill="#0c100d" opacity=".55" />
        <path d="m-32 102 9-55q-19-12-15-35l4-25 16-16 24 1 18 17 3 24q1 18-15 34l12 55q-28 17-56 0Z" fill="#171a17" stroke="#a84f3e" strokeWidth="2" />
        <path d="m-17-16-17-30 25 17m21 13 20-28-27 14" fill="#171a17" stroke="#a84f3e" strokeWidth="4" strokeLinejoin="round" />
        <path d="M-16 7h8m15 0h8" stroke="#e0a16a" strokeWidth="4" strokeLinecap="round" />
        <path d="m-31 47-31 42m68-39 30 38" stroke="#171a17" strokeWidth="13" strokeLinecap="round" />
        <path d="m48 87 23-50" stroke="#c8c0a3" strokeWidth="5" />
      </g>
      <g key={lastImpact === 'player' ? `player-hit-${impactId}` : 'player-idle'} className={`battle-player ${lastImpact === 'player' ? 'is-hit' : ''}`} transform="translate(235 239)">
        <ellipse cx="0" cy="91" rx="105" ry="18" fill="#0c100d" opacity=".6" />
        <path d="m-71 87 15-88q8-38 49-40 46 4 52 42l17 86-38 13-28-56-27 57Z" fill="url(#battle-cloak)" stroke="#c6b78e" strokeOpacity=".55" strokeWidth="2" />
        <path d="m-35-34 1-29q4-23 29-24 27 4 29 25l-4 29-26 16Z" fill="#b0a58a" />
        <path d="m-39-52-28-21 10 45 27 12m48-35 29-21-12 48-28 10" fill="#6d755f" stroke="#c6b78e" strokeWidth="3" />
        <path d="m-53 9-49 52m129-54 43 45" stroke="#303a30" strokeWidth="23" strokeLinecap="round" />
        <path d="m66 51 63-112" stroke="#d6d0bb" strokeWidth="8" strokeLinecap="round" />
        <path d="m129-61 6-17 4 17-6 8Z" fill="#d89b5b" />
        <path d="m-48 26 47 31 47-33" fill="none" stroke="#d89b5b" strokeOpacity=".6" strokeWidth="4" />
      </g>
      {lastImpact === 'enemy' && <g key={`enemy-slash-${impactId}`} className="battle-impact enemy-impact"><path d="M610 105 Q664 151 725 235" fill="none" stroke="#f0d9a9" strokeWidth="9" strokeLinecap="round" /><path d="M610 105 Q664 151 725 235" fill="none" stroke="#fff1cf" strokeWidth="2" strokeLinecap="round" /></g>}
      {lastImpact === 'player' && <g key={`player-slash-${impactId}`} className="battle-impact player-impact"><path d="M154 172 Q228 228 306 313" fill="none" stroke="#d96f5e" strokeWidth="10" strokeLinecap="round" /><path d="M154 172 Q228 228 306 313" fill="none" stroke="#ffd1a1" strokeWidth="2" strokeLinecap="round" /></g>}
    </svg>
    <div className="battle-enemy-health"><div><span>VITALITÉ</span><b>{enemyHealth} <i>/ {enemyMaxHealth}</i></b></div><div className="battle-meter"><i style={{ width: `${percent(enemyHealth, enemyMaxHealth)}%` }} /></div></div>
    <div className="scene-caption"><span>LORETH</span><span>{enemyName.toUpperCase()}</span></div>
    <div className="scene-vignette" />
    {children && <div className="timing-overlay">{children}</div>}
  </div>
}

export function Combat({ state, onStateChange, onFlee }: { state: CombatState; onStateChange: (state: CombatState) => void; onFlee: () => void }) {
  const activeMove = playerMoves.find(move => move.id === state.sequence[state.sequenceIndex])
  const incomingAttacks = getIncomingAttacks(state)
  const pendingEnemyGrades = useRef<Map<number, TimingGrade>>(new Map())
  const [resolvedEnemyCues, setResolvedEnemyCues] = useState<number[]>([])

  useEffect(() => {
    if (state.phase !== 'planning') return
    const handlePlanningKey = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.target instanceof HTMLElement && (event.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName))) return

      const key = event.key.toLowerCase()
      if (event.code === 'Digit1' || key === '&' || key === '1') {
        event.preventDefault()
        onStateChange(queueMove(state, 'slash'))
      } else if (event.code === 'Digit2' || key === 'é' || key === '2') {
        event.preventDefault()
        onStateChange(queueMove(state, 'pierce'))
      } else if (event.key === 'Enter' && state.sequence.length > 0) {
        event.preventDefault()
        onStateChange(beginPlayerSequence(state))
      } else if (event.key === 'Escape') {
        event.preventDefault()
        onStateChange(passTurn(state))
      }
    }

    window.addEventListener('keydown', handlePlanningKey)
    return () => window.removeEventListener('keydown', handlePlanningKey)
  }, [state, onStateChange])

  const showEnemyTiming = (attackIndex: number, grade: TimingGrade) => {
    if (pendingEnemyGrades.current.has(attackIndex)) return
    pendingEnemyGrades.current.set(attackIndex, grade)
    setResolvedEnemyCues(current => [...current, attackIndex])
    if (pendingEnemyGrades.current.size < incomingAttacks.length) return
    const grades = incomingAttacks.map((_, index) => pendingEnemyGrades.current.get(index) ?? 'miss')
    pendingEnemyGrades.current.clear()
    setResolvedEnemyCues([])
    onStateChange(resolveEnemyTiming(state, grades))
  }

  return <section className="combat battle panel">
    <header className="battle-header"><div><p className="eyebrow">ENCOUNTER / THE OLD ROAD</p><h2><Swords size={20} /> {state.enemyName}</h2></div><div className="battle-round">ROUND {String(state.round).padStart(2, '0')}</div><button className="battle-retreat" onClick={onFlee}><ArrowLeft size={14} /> Fuir</button></header>
    <BattleScene enemyName={state.enemyName} enemyHealth={state.enemyHealth} enemyMaxHealth={state.enemyMaxHealth} phase={state.phase} lastImpact={state.lastImpact} impactId={state.impactId}>
      {state.phase === 'player-timing' && activeMove && <TimingChallenge key={`player-${state.sequenceIndex}`} actionLabel={activeMove.name} inputKey={activeMove.input} angle={activeMove.type} onResult={grade => onStateChange(resolvePlayerTiming(state, grade))} />}
      {state.phase === 'enemy-timing' && incomingAttacks.map((attack, index) => resolvedEnemyCues.includes(index) ? null : <TimingChallenge key={`enemy-${state.enemyAttackIndex}-${attack.type}`} actionLabel={attack.direction} inputKey={attack.input} angle={attack.type} delayMs={index * 1100} disabled={state.playerStamina < dodgeStaminaCost * (index + 1)} onResult={grade => showEnemyTiming(index, grade)} />)}
    </BattleScene>
    <div className="battle-vitals">
      <div className="battle-vital"><div><span><Heart size={13} /> VITALITÉ</span><b>{state.playerHealth}<i> / {state.playerMaxHealth}</i></b></div><div className="battle-meter health-meter"><i style={{ width: `${percent(state.playerHealth, state.playerMaxHealth)}%` }} /></div></div>
      <div className="battle-vital"><div><span>✦ ENDURANCE</span><b>{state.playerStamina}<i> / {state.playerMaxStamina}</i></b></div><div className="battle-meter stamina-meter"><i style={{ width: `${percent(state.playerStamina, state.playerMaxStamina)}%` }} /></div></div>
    </div>
    <div className="battle-action-panel">
      <div className="battle-status"><span className="battle-phase">{state.phase === 'planning' ? 'PRÉPARATION' : state.phase === 'player-timing' ? 'À VOUS DE JOUER' : state.phase === 'enemy-timing' ? 'GARDEZ VOTRE SANG-FROID' : state.phase === 'victory' ? 'VICTOIRE' : 'DÉFAITE'}</span><p>{state.message}</p></div>
      {state.phase === 'planning' && <div className="planning-panel">
        <div className="move-list">{playerMoves.map(move => <button key={move.id} className="move-button" disabled={state.playerStamina < move.staminaCost} onClick={() => onStateChange(queueMove(state, move.id))}><span className={`move-mark ${move.type}`}>{move.type === 'slash' ? '╱' : '↗'}</span><span className="move-copy"><b>{move.name}</b><small>{move.type === 'slash' ? 'SLASH' : 'PIQUE'} · {move.damage} DÉGÂTS</small></span><span className="move-hotkey"><kbd>{move.id === 'slash' ? '&' : 'é'}</kbd><small>{move.id === 'slash' ? '1' : '2'}</small></span><span className="move-cost">− {move.staminaCost}</span></button>)}</div>
        <div className="planned-sequence"><span className="eyebrow">ENCHAÎNEMENT</span>{state.sequence.length ? <div className="sequence-list">{state.sequence.map((moveId, index) => { const move = playerMoves.find(item => item.id === moveId)!; return <button className="sequence-step" key={`${moveId}-${index}`} onClick={() => onStateChange(removeQueuedMove(state, index))} title="Retirer ce coup"><span>{index + 1}</span><b>{move.name}</b><small>×</small></button> })}</div> : <span className="sequence-empty">Choisissez vos coups</span>}</div>
        <div className="planning-actions"><button className="primary-button" disabled={!state.sequence.length} onClick={() => onStateChange(beginPlayerSequence(state))}><Swords size={15} /> Exécuter <kbd className="planning-hotkey">Enter</kbd><span className="action-count">{state.sequence.length || ''}</span></button><button className="secondary-button" onClick={() => onStateChange(passTurn(state))}>Passer <kbd className="planning-hotkey">Esc</kbd></button></div>
      </div>}
      {state.phase === 'enemy-timing' && incomingAttacks.length > 0 && <div className={`enemy-cue ${incomingAttacks.length > 1 ? 'multiple' : ''}`}>{incomingAttacks.map((attack, index) => resolvedEnemyCues.includes(index) ? null : <div className="enemy-cue-copy" key={`${attack.type}-${index}`}><span>ATTAQUE IMMINENTE</span><b>{attack.name}</b><small>{state.playerStamina < dodgeStaminaCost * (index + 1) ? 'Épuisé · coup inévitable' : `${attack.direction} · ${dodgeStaminaCost} END`}</small></div>)}</div>}
      {state.phase === 'enemy-timing' && state.playerStamina < dodgeStaminaCost && <div className="exhausted-warning"><span>Épuisé. Impossible d’esquiver.</span></div>}
      {(state.phase === 'victory' || state.phase === 'defeat') && <button className="primary-button battle-finish" onClick={onFlee}>{state.phase === 'victory' ? 'Continuer' : 'Quitter le combat'}</button>}
    </div>
  </section>
}
