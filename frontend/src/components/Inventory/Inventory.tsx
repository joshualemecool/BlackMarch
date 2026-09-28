import { Backpack, Shield, Swords, X } from 'lucide-react'
import { armors, weapons } from '../../data/equipment'
import type { EquipmentState } from '../../game/equipmentState'
import { getWeaponMultiplier } from '../../game/combat'

type InventoryView = 'inventory' | 'equipment'

const weaponProfile = (weapon: typeof weapons[number]) => [...new Set([weapon.primaryType, weapon.secondaryType])]
  .map(type => `${type} ×${Number(getWeaponMultiplier(weapon, type).toFixed(2))}`)
  .join(' · ')

export function Inventory({ view, equipment, onClose, onEquipWeapon, onEquipArmor }: {
  view: InventoryView
  equipment: EquipmentState
  onClose: () => void
  onEquipWeapon: (weaponId: string) => void
  onEquipArmor: (armorId: string) => void
}) {
  const inventoryWeapons = weapons.filter(item => equipment.inventory.weaponIds.includes(item.id))
  const inventoryArmors = armors.filter(item => equipment.inventory.armorIds.includes(item.id))
  const equippedWeapon = weapons.find(item => item.id === equipment.equipped.weaponId)
  const equippedArmor = armors.find(item => item.id === equipment.equipped.armorId)

  return <div className="overlay"><section className="inventory panel" aria-label={view === 'inventory' ? 'Inventory' : 'Equipment'}>
    <div className="modal-heading"><div><p className="eyebrow">{view === 'inventory' ? 'CARRIED ITEMS' : 'ACTIVE LOADOUT'}</p><h2>{view === 'inventory' ? <Backpack size={20} /> : <Shield size={20} />}{view === 'inventory' ? 'Inventory' : 'Equipment'}</h2></div><button className="icon-button" onClick={onClose} title="Close" aria-label="Close"><X size={18} /></button></div>
    {view === 'inventory' ? <div className="item-list inventory-list">
      <p className="eyebrow">WEAPONS</p>
      {inventoryWeapons.length ? inventoryWeapons.map(item => <div className="item" key={item.id}><div className="item-mark"><Swords size={16} /></div><div><b>{item.name}</b><p>{item.baseDamage} base damage · {weaponProfile(item)}{item.improves && ` · +${item.improves.amount} ${item.improves.stat}`}</p></div><span>IN BAG</span></div>) : <p className="poi-empty">No weapons in the bag.</p>}
      <p className="eyebrow inventory-subheading">ARMOR</p>
      {inventoryArmors.length ? inventoryArmors.map(item => <div className="item" key={item.id}><div className="item-mark"><Shield size={16} /></div><div><b>{item.name}</b><p>{item.type} · {item.armor} armor</p></div><span>IN BAG</span></div>) : <p className="poi-empty">No armor in the bag.</p>}
    </div> : <div className="item-list equipment-list">
      <p className="eyebrow">WEAPON SLOT</p>
      {equippedWeapon ? <div className="item equipped-item"><div className="item-mark"><Swords size={16} /></div><div><b>{equippedWeapon.name}</b><p>{equippedWeapon.baseDamage} base damage · {weaponProfile(equippedWeapon)}{equippedWeapon.improves && ` · +${equippedWeapon.improves.amount} ${equippedWeapon.improves.stat}`}</p></div><span>EQUIPPED</span></div> : <p className="poi-empty">No weapon equipped.</p>}
      {inventoryWeapons.map(item => <div className="item" key={item.id}><div className="item-mark"><Swords size={16} /></div><div><b>{item.name}</b><p>{item.baseDamage} base damage · {weaponProfile(item)}</p></div><button className="equip-button" onClick={() => onEquipWeapon(item.id)}>Equip</button></div>)}
      <p className="eyebrow inventory-subheading">ARMOR SLOT</p>
      {equippedArmor ? <div className="item equipped-item"><div className="item-mark"><Shield size={16} /></div><div><b>{equippedArmor.name}</b><p>{equippedArmor.type} · {equippedArmor.armor} armor · slash {equippedArmor.protection.slashing} / pierce {equippedArmor.protection.piercing} / blunt {equippedArmor.protection.blunt}{equippedArmor.improves && ` · +${equippedArmor.improves.amount} ${equippedArmor.improves.stat}`}</p></div><span>EQUIPPED</span></div> : <p className="poi-empty">No armor equipped.</p>}
      {inventoryArmors.map(item => <div className="item" key={item.id}><div className="item-mark"><Shield size={16} /></div><div><b>{item.name}</b><p>{item.type} · {item.armor} armor · slash {item.protection.slashing} / pierce {item.protection.piercing} / blunt {item.protection.blunt}</p></div><button className="equip-button" onClick={() => onEquipArmor(item.id)}>Equip</button></div>)}
    </div>}
  </section></div>
}