// Menu de confirmation de sauvegarde affiché depuis la barre supérieure.
import { Check, Save, X } from 'lucide-react'

export function SaveMenu({ savedAt, onSave, onClose }: { savedAt: string | null; onSave: () => void; onClose: () => void }) {
  return <div className="save-menu"><div><p className="eyebrow">FIELD RECORD</p><p>{savedAt ? `Last saved ${savedAt}` : 'No record made this session.'}</p></div><button className="secondary-button" onClick={onSave}>{savedAt ? <Check size={15} /> : <Save size={15} />} {savedAt ? 'Recorded' : 'Save game'}</button><button className="icon-button" onClick={onClose} title="Close save menu"><X size={16} /></button></div>
}
