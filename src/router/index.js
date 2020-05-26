import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/views/Home";
import GameList from "@/views/Games/List";
import GameEdit from "@/views/Games/Edit";
import GameCreate from "@/views/Games/Create";
import CharacterList from "@/views/Characters/List";
import CharacterEdit from '@/views/Characters/Edit';
import CharacterCreate from '@/views/Characters/Create';
import Moves from "@/views/Moves/List";
import PokedexList from "@/views/Pokedexes/List";
import PokedexEdit from "@/views/Pokedexes/Edit";
import PokedexCreate from "@/views/Pokedexes/Create";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/home", component: Home },
    { path: "/game/list", component: GameList, name: "GameList" },
    { path: "/game/edit", component: GameEdit, name: "GameEdit" },
    { path: "/game/create", component: GameCreate, name: "GameCreate" },
    { path: "/character/list", component: CharacterList, name: "CharacterList" },
    { path: "/character/edit", component: CharacterEdit, name: "CharacterEdit" },
    { path: "/character/create", component: CharacterCreate, name: "CharacterCreate" },
    { path: "/moves", component: Moves, name: "Moves" },
    { path: "/pokedex/list", component: PokedexList, name: "PokedexList" },
    { path: "/pokedex/edit", component: PokedexEdit, name: "PokedexEdit" },
    { path: "/pokedex/create", component: PokedexCreate, name: "PokedexCreate" }
  ]
});

export default router;
