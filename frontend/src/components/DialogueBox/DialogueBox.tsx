// Boîte de dialogue compacte utilisée pendant l'exploration.
import { MessageCircle } from 'lucide-react'

export function DialogueBox({ speaker, text, onContinue }: { speaker: string; text: string; onContinue: () => void }) {
  return <div className="dialogue-box"><div className="dialogue-icon"><MessageCircle size={18} /></div><div><p className="dialogue-speaker">{speaker}</p><p className="dialogue-text">{text}</p></div><button className="icon-button" onClick={onContinue} title="Continue dialogue">→</button></div>
}
