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

- `src/routes.tsx` — every route, mirroring `legacy/src/router/index.js`. Unported pages render a
  placeholder.
- `src/components/Layout.tsx` — navbar and page shell.
- `src/lib/config.ts` — runtime config (`VITE_API_URL`).
