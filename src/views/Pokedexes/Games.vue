<template>
  <div id="pokedex-edit-games">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/pokedex/list">Pokédexes</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link :to="{ name: 'PokedexEdit', params: { id: id } }">{{ id }}</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Games</li>
      </ol>
    </nav>

    <div class="row">
      <div class="col-sm">
        <div class="card">
          <h4 class="card-header">Manage Games</h4>
          <div class="card-body">
            <b-form inline class="mb-3" style="width:100%">
              <label class="sr-only" for="inline-form-input-name">Game</label>
              <multiselect
                v-model="game"
                deselect-label="Can't remove this value"
                track-by="game_id"
                label="name"
                :options="games"
                :searchable="false"
                :allow-empty="false"
                style="flex:1;"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.name }}</strong>
                </template>
              </multiselect>
              <b-button class="btn-lg ml-2" v-on:click="onAdd" :disabled="!this.game">Add</b-button>
            </b-form>
            <b-list-group>
              <b-list-group-item v-for="(g, i) in model.games" v-bind:key="g.game_id">
                <i class="material-icons float-right" style="vertical-align:middle;cursor:pointer;color:" v-on:click="onRemove(i)">cancel</i>
                <!-- <b-button class="btn-danger btn-sm float-right" v-on:click="onRemove(g.game_id)">

                </b-button> -->
                <strong>{{ g.name }}</strong>
              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
      </div>
      <div class="col-sm"></div>
    </div>
    <div class="row form-actions">
      <div class="col-sm">
        <router-link class="a-cancel" :to="{ name: 'PokedexEdit', params: { id: id } }">Back</router-link>
      </div>
      <div class="col-sm"></div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Multiselect from 'vue-multiselect'
import GamesApi from '@/apis/games'
import PokedexesApi from '@/apis/pokedexes'

export default {
  name: 'PokedexGamesEdit',
  components: {
    Multiselect
  },
  data () {
    return {
      model: {
        games: null
      },
      game: null,
      games: [],
      loaded: false,
      busy: false
    }
  },
  async created () {
    await this.loadPokedexGames()
    await this.loadAllGames()
    this.loaded = true
  },
  methods: {
    async loadAllGames () {
      this.games = await GamesApi.list()
    },
    async loadPokedexGames () {
      this.model.games = await PokedexesApi.listGames(this.id)
    },
    onSuccess (message) {
      this.$toasted.success(message, {
        icon: 'check_circle_outline'
      })
    },
    onError (message) {
      this.$toasted.error(message, {
        icon: 'highlight_off'
      })
    },
    async onAdd (e) {
      if (_.findIndex(this.model.games, ['game_id', this.game.game_id]) !== -1) {
        this.onError(`Game ${this.game.game_id} has already been added.`)
        return
      }

      this.busy = true

      try {
        const response = await PokedexesApi.addGame(this.id, this.game)
        this.onSuccess(response.data)
      } catch (ex) {
        this.onError(ex.message)
        return
      }

      this.game = null
      await this.loadPokedexGames()
      this.busy = false
      e.preventDefault()
    },
    async onRemove (index) {
      this.busy = true

      try {
        const response = await PokedexesApi.removeGame(
          this.id,
          this.model.games[index].game_id)
        this.onSuccess(response.data)
      } catch (ex) {
        this.onError(ex.message)
        return
      }
      await this.loadPokedexGames()
      this.busy = false
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    noGame () {
      return !this.game
    }
  }
}
</script>
