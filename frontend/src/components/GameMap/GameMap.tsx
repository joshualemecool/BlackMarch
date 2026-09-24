// Carte interactive permettant de choisir une destination connue.
import { MapPin, Navigation } from 'lucide-react'
import { argnaelLocations, type LocationId } from '../../data/world'

export function GameMap({ active, visited, onTravel }: { active: LocationId; visited: LocationId[]; onTravel: (id: LocationId) => void }) {
  // Chaque position est exprimée en pourcentage pour fonctionner sur mobile.
  return <section className="map panel"><div className="map-top"><div><p className="eyebrow">THE NORTHERN REACHES</p><h1>Black March</h1></div><span className="map-coords"><Navigation size={13} /> 44.08° N / 12.71° W</span></div><div className="map-canvas"><div className="map-grid" /><div className="mountain mountain-a" /><div className="mountain mountain-b" /><div className="river" /><div className="route route-one" /><div className="route route-two" />{argnaelLocations.map(location => <button key={location.id} className={`map-pin ${active === location.id ? 'active' : ''}`} style={{ left: `${location.x}%`, top: `${location.y}%`, '--pin-accent': location.accent } as React.CSSProperties} onClick={() => onTravel(location.id)} title={`Travel to ${location.name}`}><MapPin size={18} /><span>{location.name}</span>{visited.includes(location.id) && <small>visited</small>}</button>)}</div></section>
}
