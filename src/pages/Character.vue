<template>
  <Layout>
    <template v-slot:header>
      <router-link class="nav-item nav-link" to="/">Home</router-link>
      <router-link class="nav-item nav-link" to="/games">Games</router-link>
      <router-link class="nav-item nav-link active" to="/characters">Characters</router-link>
      <router-link class="nav-item nav-link" to="/moves">Moves</router-link>
    </template>

    <main role="main">
        <nav class="mt-3" aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link :to="{name: 'Characters', query: { gen: generation }}">Generation {{ generation }} Pok&eacute;mon</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{ character && character.name }}</li>
            </ol>
        </nav>

        <div class="row mb-3">
            <div class="col-sm-4">
                <a class="btn btn-primary" href="#" v-on:click="gotoPrevious()" v-if="previousCharacter">
                    <i class="fas fa-chevron-left"></i> {{ previousCharacter.name }} ({{ previousCharacter.dexNumber }})
                </a>
            </div>
            <div class="col-sm-4">
              <h3 class="text-center">{{ character && character.name }}</h3>
            </div>
            <div class="col-sm-4 text-right">
                <a class="btn btn-primary" href="#" v-on:click="gotoNext()" v-if="nextCharacter">
                    ({{ nextCharacter.dexNumber }}) {{ nextCharacter.name }} <i class="fas fa-chevron-right"></i>
                </a>
            </div>
        </div>

        <div class="row" v-for="(moves, i) in rows" v-bind:key="i">
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4" v-for="m in moves" v-bind:key="m.moveId">
                <a class="move-link" href="#" v-on:click="suggestMove(m, $event)">
                    <div class="card" :class="cardClasses(m)">
                        <h5 class="card-header">{{ m.name }} <i class="far fa-check-circle float-right" v-if="m.isSuggested"></i></h5>
                        <div class="card-body" :class="moveTypeClasses(m)">
                            <span class="stats float-right">{{ m.pp }}</span>
                            <span class="stats float-right">{{ m.power || 0 }} / {{ m.accuracy || 0 }}</span>
                            {{ m.type }}
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </main>
  </Layout>
</template>

<script>
import _ from 'lodash'
import Layout from '@/layouts/Layout'
import CharactersApi from '@/apis/characters'
import CharacterMovesApi from '@/apis/character_moves'

export default {
    name: 'Character',
    components: {
        Layout
    },
    data () {
        return {
            previousCharacter: null,
            character: null,
            nextCharacter: null,
            rows: [],
            generation: this.$route.query && this.$route.query.gen,
            characterMoveId: ''
        }
    },
    
    created () {
        this.getCharacter(this.$route.params.id)
        this.getPreviousCharacter(this.$route.params.id)
        this.getNextCharacter(this.$route.params.id)
    },

    methods: {     
      getPreviousCharacter (id) {
        return CharactersApi.getPrevious(id, 1)
          .then(res => {
            this.previousCharacter = res.data
          })
          .catch(err => {
            console.log(err)
          })
      },
      
      getCharacter (id) {
        return CharactersApi.get(id)
          .then(res => {
            this.character = res.data
            this.listMoves(this.generation, this.character.nameId)
          })
          .catch(err => {
            console.log(err)
          })
      },

      getNextCharacter (id) {
        return CharactersApi.getNext(id, 1)
          .then(res => {
            this.nextCharacter = res.data
          })
          .catch(err => {
            console.log(err)
          })
      },
        
      listMoves (gen, nameId) {
        return CharacterMovesApi.list({ 'generation': gen, 'name': nameId })
          .then(res => {
            this.characterMoveId = res.data[0]._id
            this.rows = []
            var _tmp = res.data[0].moves
            while(_tmp.length) {
              this.rows.push(_tmp.splice(0, 4))
            }
          })
          .catch(err => {
            console.log(err)           
          })
      },
        
      cardClasses (m) {
        var classes = {
          border: m.isSuggested,
          'border-primary': m.isSuggested
        }

        return classes
      },

      moveTypeClasses (m) {
        var classes = {}
        classes[m.type.toLowerCase()] = true
        return classes;
      },

      suggestMove (move, e) {
        e.preventDefault()

        if(move.isSuggested) {
          move.isSuggested = false
        }
        else {
          if(this.suggestedCount() >= 4)
            return
              
            move.isSuggested = true
        }
      },

      suggested () {
        var all = _.flatten(this.rows)
        return _.filter(all, 'isSuggested')
      },

      suggestedCount () {
        return _.size(this.suggested())
      },

      gotoPrevious () {
        this.updateCharacterMoves()
          .then((resp) => {
            console.log(resp)

            // :to="{name: 'Character', params: { id: previousCharacter._id }, query: { gen: generation }}"
            this.$router.push({
              name: 'Character', 
              params: { id: this.previousCharacter._id }, 
              query: { gen: this.generation }})
          })
      },

      gotoNext () {
        this.updateCharacterMoves()
          .then((resp) => {
            console.log(resp)

            // :to="{name: 'Character', params: { id: nextCharacter._id }, query: { gen: generation }}"
            this.$router.push({
              name: 'Character', 
              params: { id: this.nextCharacter._id }, 
              query: { gen: this.generation }})
          })
      },

      updateCharacterMoves () {
        var count = this.suggestedCount()
            
        if(count == 0) {
          Promise.resolve()
        }

        var data = {
          id: this.characterMoveId,
          on: _.map(this.suggested(), 'moveId')
        }

        return CharacterMovesApi
          .update(this.characterMoveId, data)
          .then(res => {
            return res.data
          })
          .catch(err => {
            console.log(err)
          })
      }

    },

    computed: {
         
    }
};
</script>

<style lang="scss">
    .move-link {
        color: inherit;

        &:hover {
            color: inherit;
            text-decoration: none
        }
    }
    .card-body {
        font-weight: 600;
    }
    .stats {
        background-color: #343a40;
        color: #ffffff;
        padding: 2px 10px;
        font-weight: 600;
        border-radius: 12px;

        & + .stats {
            margin-right: 5px;
        }
    }
    .fa-check-circle {
        font-size: 24px;
        line-height: 24px;
        color: #007bff;
    }
</style>