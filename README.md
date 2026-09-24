# The Black March

A narrative exploration RPG built with React and TypeScript.

## Structure

- `frontend/src/components`: reusable game UI
- `frontend/src/pages`: screen-level views reserved for world, city, forest and combat flows
- `frontend/src/game`: game rules and runtime state
- `frontend/src/save`: versioned local save format
- `frontend/src/data/characters`: le Soleil de Minuit et ses compagnons
- `frontend/src/data/enemies`: démons mineurs et démons majeurs
- `frontend/src/data/equipment`: armes, armures, matériaux et bonus
- `frontend/src/data/world`: Argnael, régions et points d'intérêt
- `frontend/src/data/dialogues`: dialogues à choix et prérequis de statistiques
- `frontend/src/assets`: art and interface assets

## Run locally

```powershell
cd frontend
npm install
npm run dev
```

The current vertical slice includes the world map, location exploration, dialogue, combat encounter, inventory and local save record. The Argnael content model is now scaffolded for the next integration step. Backend, database and Docker layers are intentionally left for a later milestone.
