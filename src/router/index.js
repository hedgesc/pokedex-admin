import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/pages/Home'
import Games from '@/pages/Games'
import Characters from '@/pages/Characters'
import Character from '@/pages/Character'
import Moves from '@/pages/Moves'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/', component: Home },
        { path: '/games', component: Games },
        { path: '/characters', component: Characters, name: 'Characters' },
        { path: '/characters/:id', component: Character, name: 'Character' },
        { path: '/moves', component: Moves }
    ]
})

export default router