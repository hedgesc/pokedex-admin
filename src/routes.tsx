import type { RouteObject } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Placeholder from './pages/Placeholder'
import GameCreate from './pages/games/Create'
import GameEdit from './pages/games/Edit'
import GameList from './pages/games/List'

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

      { path: 'character/list', element: page('Characters') },
      { path: 'character/edit/:id', element: page('Edit Character') },
      { path: 'character/edit/:id/games', element: page('Character Games') },
      { path: 'character/edit/:id/moves', element: page('Character Moves') },
      { path: 'character/detail/:id', element: page('Character Detail') },
      { path: 'character/create', element: page('Create Character') },

      { path: 'move/list', element: page('Moves') },
      { path: 'move/edit/:id', element: page('Edit Move') },
      { path: 'move/create', element: page('Create Move') },

      { path: 'pokedex/list', element: page('Pokédexes') },
      { path: 'pokedex/edit/:id', element: page('Edit Pokédex') },
      { path: 'pokedex/edit/:id/games', element: page('Pokédex Games') },
      { path: 'pokedex/create', element: page('Create Pokédex') },

      { path: '*', element: <NotFound /> },
    ],
  },
]
