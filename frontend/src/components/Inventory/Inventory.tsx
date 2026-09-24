// Fenêtre modale qui regroupe les armes et armures portées.
import { Backpack, X } from 'lucide-react'
import { armors, weapons } from '../../data/equipment'
import type { EquipmentState } from '../../game/equipmentState'

export function Inventory({ equipment, onClose }: { equipment: EquipmentState; onClose: () => void }) {
  const inventoryWeapons = weapons.filter(item => equipment.inventory.weaponIds.includes(item.id))
  const inventoryArmors = armors.filter(item => equipment.inventory.armorIds.includes(item.id))
  const equippedWeapon = weapons.find(item => item.id === equipment.equipped.weaponId)
  const equippedArmor = armors.find(item => item.id === equipment.equipped.armorId)
  const inventoryItems = [...inventoryWeapons, ...inventoryArmors]

  return <div className="overlay"><section className="inventory panel"><div className="modal-heading"><div><p className="eyebrow">EQUIPMENT LOADOUT</p><h2><Backpack size={20} /> Inventory</h2></div><button className="icon-button" onClick={onClose} title="Close inventory"><X size={18} /></button></div><div className="equipped-section"><p className="eyebrow">EQUIPPED / MODIFIES STATS</p><div className="equipped-items">{[equippedWeapon, equippedArmor].filter(Boolean).map(item => <div className="item equipped-item" key={item!.id}><div className="item-mark">✦</div><div><b>{item!.name}</b><p>Improves {item!.improves.stat} by +{item!.improves.amount}</p></div></div>)}</div></div><div className="item-list"><p className="eyebrow">INVENTORY / NOT EQUIPPED</p>{inventoryItems.length > 0 ? inventoryItems.map(item => <div className="item" key={item.id}><div className="item-mark">✦</div><div><b>{item.name}</b><p>{item.type} · Improves {item.improves.stat} by +{item.improves.amount}</p></div><span>STORED</span></div>) : <p className="poi-empty">No unequipped items.</p>}</div></section></div>
}
