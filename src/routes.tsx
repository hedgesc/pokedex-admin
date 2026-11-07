import type { RouteObject } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Placeholder from './pages/Placeholder'
import GameCreate from './pages/games/Create'
import GameEdit from './pages/games/Edit'
import GameList from './pages/games/List'
import CharacterCreate from './pages/characters/Create'
import CharacterDetail from './pages/characters/Detail'
import CharacterEdit from './pages/characters/Edit'
import CharacterGames from './pages/characters/Games'
import CharacterList from './pages/characters/List'
import CharacterMoves from './pages/characters/Moves'
import MoveCreate from './pages/moves/Create'
import MoveEdit from './pages/moves/Edit'
import MoveList from './pages/moves/List'

// Mirrors legacy/src/router/index.js. Each Placeholder is replaced by the real
// page as that section is ported.
const page = (title: string) => <Placeholder title={title} />

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

      { path: 'pokedex/list', element: page('Pokédexes') },
      { path: 'pokedex/edit/:id', element: page('Edit Pokédex') },
      { path: 'pokedex/edit/:id/games', element: page('Pokédex Games') },
      { path: 'pokedex/create', element: page('Create Pokédex') },

      { path: '*', element: <NotFound /> },
    ],
  },
]
