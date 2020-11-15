<template>
  <div id="character-games">
    <nav aria-label="breadcrumb">
      <b-breadcrumb>
        <b-breadcrumb-item to="/character/list">Characters</b-breadcrumb-item>
        <b-breadcrumb-item :to="{ name: 'CharacterEdit', params: { id }}">{{ nameOrId }}</b-breadcrumb-item>
        <b-breadcrumb-item active>Games</b-breadcrumb-item>
      </b-breadcrumb>
    </nav>
    <loading :active.sync="loading" color="#343a40" loader="dots"></loading>
    <b-row>
      <b-col md="8">
        <b-card header-tag="header" v-if="character">
          <template v-slot:header>
            <h4 class="mb-0">Games featuring {{ character.name }}</h4>
          </template>
          <b-form inline @submit="onAddSubmit" @reset="onAddReset">
            <b-form-select
              v-model="model.game_id"
              :options="gameOptions"
              size="sm"
              class="mb-2 mr-sm-2 mb-sm-0">
              <template #first>
                <b-form-select-option :value="null" disabled>Game</b-form-select-option>
              </template>
            </b-form-select>
            <b-form-input
              id="generation-input"
              v-model="model.generation"
              type="number"
              size="sm"
              placeholder="Generation"
              class="mb-2 mr-sm-2 mb-sm-0"></b-form-input>
            <b-form-input
              id="game-character-id-input"
              v-model="model.game_character_id"
              type="number"
              size="sm"
              placeholder="Character Id"
              class="mb-2 mr-sm-2 mb-sm-0"></b-form-input>
            <b-button
              type="submit"
              variant="primary"
              class="mb-2 mr-sm-2 mb-sm-0"
              size="sm">Add</b-button>
            <b-button
              type="reset"
              variant="danger"
              size="sm">Reset</b-button>
          </b-form>

          <hr />

          <div style="border-bottom-width: 2px;border-bottom-color: #000;">
            <b-row>
              <b-col><label style="padding: 0.25rem 0.5rem;font-weight:600;">Game</label></b-col>
              <b-col><label style="padding: 0.25rem 0.5rem;font-weight:600;">Generation</label></b-col>
              <b-col><label style="padding: 0.25rem 0.5rem;font-weight:600;">Character Id</label></b-col>
              <b-col></b-col>
            </b-row>
          </div>
          <div v-for="cg in characterGames" v-bind:key="cg.character_game_id">
            <CharacterGame :item="cg" :games="gameOptions" />
            <hr />
          </div>
        </b-card>
      </b-col>
      <b-col md="2">
        <b-list-group>
          <b-list-group-item active>
            Manage Games
          </b-list-group-item>
          <b-list-group-item :to="{ name: 'CharacterMoves', params: { id }}">
            Manage Moves
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col md="2"></b-col>
    </b-row>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import CharactersApi from '@/apis/characters'
import GamesApi from '@/apis/games'
import CharacterGamesApi from '@/apis/characterGames'
import CharacterGame from './CharacterGame'

export default {
  name: 'CharacterGames',
  components: {
    Loading,
    CharacterGame
  },
  data () {
    return {
      busy: false,
      character: null,
      games: [],
      characterGames: [],
      characterGameFields: [
        { key: 'name', label: 'Game' },
        'generation',
        { key: 'game_character_id', label: 'Dex #' }
      ],
      model: {
        character_id: this.id,
        game_id: null,
        generation: null,
        game_character_id: null
      }
    }
  },
  async beforeMount () {
    this.loadCharacter(this.id)
    this.loadAllGames()
    this.loadCharacterGames(this.id)
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    nameOrId () {
      if (!this.character) {
        return this.id
      }
      return this.character.name
    },
    loading () {
      if (this.character && this.games && this.characterGames) {
        return this.busy
      }
      return true
    },
    gameOptions () {
      if (!this.games.length) return []

      return this.games.map(g => {
        return { text: g.name, value: g.game_id }
      })
    }
  },
  methods: {
    async loadCharacter (id) {
      this.character = await CharactersApi.get(id)
    },
    async loadAllGames () {
      this.games = await GamesApi.list()
    },
    async loadCharacterGames (id) {
      this.characterGames = await CharacterGamesApi.list(id)
    },
    async onAddSubmit (evt) {
      this.busy = true

      try {
        const response = await CharacterGamesApi.post(this.id, this.model)
        this.$toasted.success(response.data, { icon: 'check_circle_outline' })
        this.characterGames.push(response.data)
        this.resetModel()
      } catch (ex) {
        this.$toasted.error(ex.message, { icon: 'highlight_off' })
      }

      this.busy = false

      evt.preventDefault()
    },
    resetModel () {
      this.model.game = null
      this.model.game_id = null
      this.model.generation = null
      this.model.game_character_id = null
    },
    onAddReset (evt) {
      evt.preventDefault()

      this.resetModel()

      // Trick to reset/clear native browser form validation state
      this.showAdd = false
      this.$nextTick(() => {
        this.showAdd = true
      })
    },
    onSave (evt) {

    },
    async onRemove (index) {
      const item = this.characterGames[index]
      this.characterGames.splice(index, 1)

      this.busy = true

      try {
        const response = await CharacterGamesApi.remove(this.id, item.game_id)
        this.$toasted.success(response.data, { icon: 'check_circle_outline' })
      } catch (ex) {
        this.characterGames.push(item)
        this.$toasted.error(ex.message, { icon: 'highlight_off' })
      }

      this.busy = false
    },
    onAddClick () {
      this.showAdd = true
      this.showEdit = false
    },
    onEditSubmit () {

    },
    onEditClick (index) {
      this.characterGameModels[index].isEditing = true
      console.log('Edit', index, this.characterGameModels[index].isEditing)
    },
    onCancelClick (index) {
      this.characterGameModels[index].isEditing = false
      console.log('Editing', index, this.characterGameModels[index].isEditing)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-remove {
  vertical-align: middle;
  cursor: pointer;
  color: #000;
}
</style>
