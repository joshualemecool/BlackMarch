// Résumé du lieu sélectionné, de ses points d'intérêt et des actions de navigation.
import { ArrowLeft, ArrowUpRight, Footprints, MapPin } from 'lucide-react'
import { useState } from 'react'
import type { LocationId } from '../../data/world'
import { argnaelLocations, pointsOfInterest } from '../../data/world'

export function LocationCard({ locationId, onExplore, onReturnToMap }: { locationId: LocationId; onExplore: () => void; onReturnToMap: () => void }) {
  // Le point d'exclamation est sûr ici car l'identifiant vient du catalogue de lieux.
  const location = argnaelLocations.find(item => item.id === locationId)!
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const availablePoints = location.pointsOfInterest.map(id => pointsOfInterest[id as keyof typeof pointsOfInterest]).filter(Boolean)
  const selectedPoint = availablePoints.find(point => point.id === selectedPointId)

  return <div className="location-card"><div className="location-art" style={{ '--location-accent': location.accent } as React.CSSProperties}><span>{location.type.toUpperCase()}</span><b>{location.name.slice(0, 1)}</b></div><div className="location-copy"><p className="eyebrow">CURRENT DESTINATION</p><h2>{location.name}</h2><p>{location.description}</p><div className="location-actions"><button className="primary-button" onClick={onExplore}><Footprints size={16} /> Enter location <ArrowUpRight size={15} /></button><button className="secondary-button" onClick={onReturnToMap}><ArrowLeft size={15} /> Return to map</button></div><div className="poi-section"><div className="poi-heading"><p className="eyebrow">POINTS OF INTEREST</p><span>{availablePoints.length.toString().padStart(2, '0')}</span></div>{availablePoints.length > 0 ? <div className="poi-list">{availablePoints.map(point => <button className={`poi-button ${selectedPointId === point.id ? 'selected' : ''}`} key={point.id} onClick={() => setSelectedPointId(point.id)}><MapPin size={14} /><span>{point.name}</span><small>{point.type}</small></button>)}</div> : <p className="poi-empty">No points of interest mapped here yet.</p>}{selectedPoint && <div className="poi-detail"><b>{selectedPoint.name}</b><p>{selectedPoint.description}</p></div>}</div></div></div>
}
