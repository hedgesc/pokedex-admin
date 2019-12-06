<template>
    <div>
        <div v-for="(c, i) in characters" v-bind:key="c.charIndex">
            <h2>{{ c.name }}</h2>
            <h3>{{ c.game }} <small>({{ suggestedCount(i) }} of 4)</small></h3>
            <div v-for="m in c.moves" v-bind:key="m.moveId">
                <div>
                    <label v-bind:style="{ color: m.color }">
                        <input type="checkbox" v-model="m.isSuggested" />
                        {{ m.name }}
                    </label>
                    {{ m.power }}
                    {{ m.accuracy }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//import CharacterMove from './components/CharacterMove'
import axios from 'axios';
export default {
    props: {
        gameId: String
    },
    data () {
        return {
            characters: []
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        fetchData () {
            axios
                .get("http://db3514a4.ngrok.io/api/character-moves?game=" + this.gameId)
                .then(response => (this.characters = response))
        },
        fetchCharacters () {
            return fetch(
                    "http://db3514a4.ngrok.io/api/character-moves?game=" +
                    this.gameId
                )
                .then(res => res.json())
                .then(res => (this.characters = res.data));
        },
        suggestedCount: function (index) {
            const moves = this.characters[index].moves
            const len = moves.length
            let ct = 0

            for(var i = 0; i < len; i++) {
                if(moves[i].isSuggested) {
                    ct++;
                }
            }
            
            return ct;
        }
    }
}
</script>