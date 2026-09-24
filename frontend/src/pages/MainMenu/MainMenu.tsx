// Écran d'accueil qui contrôle l'entrée dans la partie.
import { BookOpen, Compass, Save, X } from 'lucide-react'
import { useState } from 'react'

type MainMenuProps = {
	hasSave: boolean
	onNewGame: () => void
	onLoadGame: () => void
}

export function MainMenu({ hasSave, onNewGame, onLoadGame }: MainMenuProps) {
	const [creditsOpen, setCreditsOpen] = useState(false)

	return <main className="main-menu-screen">
		<div className="menu-atmosphere" />
		<section className="main-menu-content">
			<p className="menu-kicker">A NARRATIVE RPG</p>
			<div className="menu-title-mark">†</div>
			<h1>THE BLACK<br /><span> MARCH</span></h1>
			<p className="menu-subtitle">The road remembers what the living forget.</p>
			<div className="main-menu-actions">
				<button className="menu-action primary-menu-action" onClick={onNewGame}><Compass size={17} /> New Game</button>
				<button className="menu-action" onClick={onLoadGame} disabled={!hasSave}><Save size={17} /> Load Game {!hasSave && <small>NO RECORD</small>}</button>
				<button className="menu-action" onClick={() => setCreditsOpen(true)}><BookOpen size={17} /> Credits</button>
			</div>
			<p className="menu-version">FIELD JOURNAL / 01 · v0.1.0</p>
		</section>
		{creditsOpen && <div className="credits-overlay"><section className="credits-panel"><button className="icon-button credits-close" onClick={() => setCreditsOpen(false)} title="Close credits"><X size={18} /></button><p className="eyebrow">THE BLACK MARCH</p><h2>Credits</h2><p>A small narrative RPG about roads, demons, and the things waiting beyond the walls.</p><span>Created for the March.</span></section></div>}
	</main>
}
