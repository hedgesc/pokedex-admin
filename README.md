# Pokédex Admin

Admin site for managing Pokédexes, games, characters and moves against the Pokédex REST API.

The app is being migrated from Vue 2 to React 19 + TypeScript + Vite. The React app lives at the
repository root; the original Vue app is in [`legacy/`](legacy/) until every screen is ported.
The last Vue-only commit is tagged `vue2-final`.

## Getting started

```sh
npm install
cp .env.example .env.local   # set VITE_API_URL if the API isn't on localhost:3000
npm run dev                  # http://localhost:8080
```

## Scripts

| Script              | What it does                   |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start the Vite dev server      |
| `npm run build`     | Typecheck and build to `dist/` |
| `npm run preview`   | Serve the production build     |
| `npm run lint`      | Lint with oxlint               |
| `npm run format`    | Format with Prettier           |
| `npm run typecheck` | Run the TypeScript compiler    |
| `npm test`          | Run unit tests with Vitest     |

## Layout

- `src/routes.tsx` — every route, mirroring `legacy/src/router/index.js`. Games, Moves,
  Characters, and Pokédexes are ported.
- `src/pages/games/` — Games list, create, and edit.
- `src/pages/moves/` — Moves list, create, and edit. The list is paged.
- `src/pages/characters/` — Characters list, create, edit, detail, games, and moves.
- `src/pages/pokedexes/` — Pokédex list, create, edit, and the games in a Pokédex.
- `src/components/ToastProvider.tsx` — success, error, and confirm toasts.
- `src/components/Layout.tsx` — navbar and page shell.
- `src/lib/config.ts` — runtime config (`VITE_API_URL`).
- `src/api/` — typed functions for each API endpoint.
- `src/queries/` — TanStack Query hooks that pages use to load and save data.
- `docs/file-guide.md` — what each file is for, updated every migration phase.
