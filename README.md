# The Black March

A narrative exploration RPG built with React and TypeScript.

## Version

The current game version is stored in `VERSION` and mirrored in `frontend/package.json`.
Every push to `main` automatically increments the patch number, updates the package files, and creates a Git tag such as `v0.1.1`.

## Structure

- `frontend/src/components`: reusable game UI
- `frontend/src/pages`: screen-level views reserved for world, city, forest and combat flows
- `frontend/src/game`: game rules and runtime state
- `frontend/src/save`: versioned local save format
- `frontend/src/data/characters`: Main characters + secondary
- `frontend/src/data/enemies`: npc that you will fight
- `frontend/src/data/equipment`: weapons, gear, bonus
- `frontend/src/data/world`: The entire map
- `frontend/src/data/dialogues`: dialogues and texts
- `frontend/src/assets`: art and interface assets

## Run locally

```powershell
cd frontend
npm install
npm run dev
```

The current vertical slice includes the world map, location exploration, dialogue, combat encounter, inventory and local save record. The Argnael content model is now scaffolded for the next integration step. Backend, database and Docker layers are intentionally left for a later milestone.
