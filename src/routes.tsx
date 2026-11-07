import type { RouteObject } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import CharacterCreate from './pages/characters/Create'
import CharacterDetail from './pages/characters/Detail'
import CharacterEdit from './pages/characters/Edit'
import CharacterGames from './pages/characters/Games'
import CharacterList from './pages/characters/List'
import CharacterMoves from './pages/characters/Moves'
import GameCreate from './pages/games/Create'
import GameEdit from './pages/games/Edit'
import GameList from './pages/games/List'
import MoveCreate from './pages/moves/Create'
import MoveEdit from './pages/moves/Edit'
import MoveList from './pages/moves/List'
import PokedexCreate from './pages/pokedexes/Create'
import PokedexEdit from './pages/pokedexes/Edit'
import PokedexGames from './pages/pokedexes/Games'
import PokedexList from './pages/pokedexes/List'

// Mirrors legacy/src/router/index.js.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      { path: 'game/list', element: <GameList /> },
      { path: 'game/edit/:id', element: <GameEdit /> },
      { path: 'game/create', element: <GameCreate /> },

      { path: 'character/list', element: <CharacterList /> },
      { path: 'character/edit/:id', element: <CharacterEdit /> },
      { path: 'character/edit/:id/games', element: <CharacterGames /> },
      { path: 'character/edit/:id/moves', element: <CharacterMoves /> },
      { path: 'character/detail/:id', element: <CharacterDetail /> },
      { path: 'character/create', element: <CharacterCreate /> },

      { path: 'move/list', element: <MoveList /> },
      { path: 'move/edit/:id', element: <MoveEdit /> },
      { path: 'move/create', element: <MoveCreate /> },

      { path: 'pokedex/list', element: <PokedexList /> },
      { path: 'pokedex/edit/:id', element: <PokedexEdit /> },
      { path: 'pokedex/edit/:id/games', element: <PokedexGames /> },
      { path: 'pokedex/create', element: <PokedexCreate /> },

      { path: '*', element: <NotFound /> },
    ],
  },
]
