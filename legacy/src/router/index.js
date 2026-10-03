import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home'
import GameList from '@/views/Games/List'
import GameEdit from '@/views/Games/Edit'
import GameCreate from '@/views/Games/Create'
import CharacterList from '@/views/Characters/List'
import CharacterEdit from '@/views/Characters/Edit'
import CharacterGames from '@/views/Characters/Games'
import CharacterMoves from '@/views/Characters/Moves'
import CharacterDetail from '@/views/Characters/Detail'
import CharacterCreate from '@/views/Characters/Create'
import MoveList from '@/views/Moves/List'
import MoveEdit from '@/views/Moves/Edit'
import MoveCreate from '@/views/Moves/Create'
import PokedexList from '@/views/Pokedexes/List'
import PokedexEdit from '@/views/Pokedexes/Edit'
import PokedexCreate from '@/views/Pokedexes/Create'
import PokedexGamesEdit from '@/views/Pokedexes/Games'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/game/list', component: GameList, name: 'GameList' },
    { path: '/game/edit/:id', component: GameEdit, name: 'GameEdit' },
    { path: '/game/create', component: GameCreate, name: 'GameCreate' },
    { path: '/character/list', component: CharacterList, name: 'CharacterList' },
    { path: '/character/edit/:id', component: CharacterEdit, name: 'CharacterEdit' },
    { path: '/character/edit/:id/games', component: CharacterGames, name: 'CharacterGames' },
    { path: '/character/edit/:id/moves', component: CharacterMoves, name: 'CharacterMoves' },
    { path: '/character/detail/:id', component: CharacterDetail, name: 'CharacterDetail' },
    { path: '/character/create', component: CharacterCreate, name: 'CharacterCreate' },
    { path: '/move/list', component: MoveList, name: 'MoveList' },
    { path: '/move/edit/:id', component: MoveEdit, name: 'MoveEdit' },
    { path: '/move/create', component: MoveCreate, name: 'MoveCreate' },
    { path: '/pokedex/list', component: PokedexList, name: 'PokedexList' },
    { path: '/pokedex/edit/:id', component: PokedexEdit, name: 'PokedexEdit' },
    { path: '/pokedex/edit/:id/games', component: PokedexGamesEdit, name: 'PokedexGamesEdit' },
    { path: '/pokedex/create', component: PokedexCreate, name: 'PokedexCreate' }
  ]
})

export default router
