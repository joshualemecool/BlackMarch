// Orchestrateur de la tranche jouable: navigation, dialogue, combat et sauvegarde.
import { useState } from 'react'
import { ArrowLeft, Backpack, BookOpen, Compass, Menu, Save, X } from 'lucide-react'
import { CharacterPanel } from './components/CharacterPanel/CharacterPanel'
import { GameMap } from './components/GameMap/GameMap'
import { LocationCard } from './components/LocationCard/LocationCard'
import { DialogueBox } from './components/DialogueBox/DialogueBox'
import { Combat } from './components/Combat/Combat'
import { Inventory } from './components/Inventory/Inventory'
import { SaveMenu } from './components/SaveMenu/SaveMenu'
import { MainMenu } from './pages/MainMenu/MainMenu'
import { argnaelLocations, type LocationId } from './data/world'
import { dialogues } from './data/dialogues'
import { initialGameState, type GameState } from './game/gameState'
import { addLog, travelTo } from './game/gameEngine'
import { createCombatState, type CombatState } from './game/combat'
import { saveGame } from './save/saveGame'
import { loadGame } from './save/loadGame'

function App() {
  // L'état local sera remplacé par un contexte ou un store lorsque le jeu grandira.
  const [screen, setScreen] = useState<'menu' | 'game'>('menu')
  const [game, setGame] = useState<GameState>(initialGameState)
  const [combat, setCombat] = useState<CombatState | null>(null)
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [characterOpen, setCharacterOpen] = useState(() => window.matchMedia('(min-width: 701px)').matches)
  const [notesOpen, setNotesOpen] = useState(() => window.matchMedia('(min-width: 1251px)').matches)
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const location = argnaelLocations.find(item => item.id === game.location)!
  const lines = dialogues[game.location as keyof typeof dialogues] ?? dialogues['argnael-start-city']
  const currentDialogue = lines[dialogueIndex % lines.length]

  const hasSave = Boolean(localStorage.getItem('the-black-march-save'))

  // Commence une partie neuve en réinitialisant les systèmes de la tranche jouable.
  const startNewGame = () => {
    setGame(initialGameState)
    setCombat(null)
    setDialogueIndex(0)
    setScreen('game')
  }

  // Charge l'état sauvegardé et revient au dernier écran de jeu connu.
  const resumeGame = () => {
    const savedGame = loadGame()
    if (savedGame) {
      setGame(savedGame)
      setScreen('game')
    }
  }

  // Déplace le joueur vers une destination et ajoute l'événement au journal.
  const travel = (id: LocationId) => {
    setGame(previous => addLog(travelTo(previous, id), `Arrived at ${argnaelLocations.find(item => item.id === id)?.name}.`))
    setDialogueIndex(0)
  }
  // Lance la rencontre de démon liée à l'exploration du lieu.
  const beginCombat = () => {
    setCombat(createCombatState())
    setGame(previous => ({ ...previous, mode: 'combat' }))
  }
  const flee = () => { setCombat(null); setGame(previous => ({ ...previous, mode: 'location' })) }
  // Quitte le lieu actuel et revient à la carte sans annuler la progression.
  const returnToMap = () => setGame(previous => ({ ...previous, mode: 'world' }))
  // Enregistre l'état courant puis affiche l'heure de confirmation.
  const recordSave = () => { const result = saveGame(game); setSavedAt(new Date(result.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) }

  if (screen === 'menu') return <MainMenu hasSave={hasSave} onNewGame={startNewGame} onLoadGame={resumeGame} />

  return <main className="app-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">†</span><div><b>THE BLACK MARCH</b><small>FIELD JOURNAL / 01</small></div></div><div className="topbar-actions"><span className="day-count">DAY 04 <i /></span><button className="icon-button" onClick={() => setInventoryOpen(true)} title="Open inventory"><Backpack size={18} /></button><button className="icon-button" onClick={() => setSaveOpen(value => !value)} title="Open save menu"><Save size={18} /></button><button className="icon-button mobile-menu" title="Open menu"><Menu size={18} /></button></div>{saveOpen && <SaveMenu savedAt={savedAt} onSave={recordSave} onClose={() => setSaveOpen(false)} />}</header>
    <div className={`layout ${characterOpen ? 'character-open' : 'character-collapsed'} ${notesOpen ? 'notes-open' : 'notes-collapsed'}`}>
      <CharacterPanel equipment={game.equipment} />
      <section className="main-column">
        <nav className="section-nav">
          <button type="button" className={`icon-button character-toggle ${characterOpen ? '' : 'is-collapsed'}`} onClick={() => setCharacterOpen(open => !open)} title={characterOpen ? 'Hide character panel' : 'Show character panel'} aria-label={characterOpen ? 'Hide character panel' : 'Show character panel'} aria-expanded={characterOpen}><ArrowLeft size={15} /></button>
          <span className="active"><Compass size={15} /> WORLD MAP</span><span><BookOpen size={15} /> JOURNAL <em>2</em></span>
          <button type="button" className={`icon-button notes-toggle ${notesOpen ? 'is-open' : ''}`} onClick={() => setNotesOpen(open => !open)} title={notesOpen ? 'Hide field notes' : 'Show field notes'} aria-label={notesOpen ? 'Hide field notes' : 'Show field notes'} aria-expanded={notesOpen}><ArrowLeft size={15} /></button>
        </nav>
        {game.mode === 'world' && <GameMap active={game.location} visited={game.visited} onTravel={travel} />}
        {game.mode === 'location' && <><LocationCard locationId={game.location} onExplore={beginCombat} onReturnToMap={returnToMap} /><DialogueBox speaker={currentDialogue.speaker} text={currentDialogue.text} onContinue={() => setDialogueIndex(index => index + 1)} /></>}
        {game.mode === 'combat' && combat && <Combat state={combat} onStateChange={setCombat} onFlee={flee} />}
      </section>
      <aside className="right-rail"><div className="rail-heading"><span>ACTIVE THREADS</span><small>02</small></div>{game.quests.map(quest => <div className="quest" key={quest.id}><span className="quest-dot" /><div><b>{quest.title}</b><p>{quest.detail}</p></div></div>)}<div className="rail-heading log-heading"><span>FIELD NOTES</span><small><X size={12} /></small></div>{game.log.map((entry, index) => <p className="log-entry" key={`${entry}-${index}`}>{entry}</p>)}</aside>
    </div>
    {inventoryOpen && <Inventory equipment={game.equipment} onClose={() => setInventoryOpen(false)} />}<footer><span>© Unholy Light</span><span>{location.name.toUpperCase()} · {location.type.toUpperCase()}</span></footer>
  </main>
}

export default App
