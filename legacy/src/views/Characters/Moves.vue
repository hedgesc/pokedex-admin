<template>
  <div id="character-moves">
    <nav aria-label="breadcrumb">
      <b-breadcrumb>
        <b-breadcrumb-item to="/character/list">Characters</b-breadcrumb-item>
        <b-breadcrumb-item :to="{ name: 'CharacterEdit', params: { id }}">{{ nameOrId }}</b-breadcrumb-item>
        <b-breadcrumb-item active>Moves</b-breadcrumb-item>
      </b-breadcrumb>
    </nav>
    <loading :active.sync="loading" color="#343a40" loader="dots"></loading>
    <b-row>
      <b-col md="8">
        <b-card header-tag="header" v-if="character">
          <template v-slot:header>
            <h4 class="mb-0">Moves available to {{ character.name }}</h4>
          </template>
          <GenerationTabs :index="genIndex" @click="onTabClick" />
          <div style="border-bottom: 2px solid rgba(0, 0, 0, 0.125);margin-bottom: 10px;">
            <b-row>
              <b-col><label style="padding: 0.25rem 0.5rem;font-weight:600;">Move</label></b-col>
              <b-col class="text-center"><label style="padding: 0.25rem 0.5rem;font-weight:600;">Generation</label></b-col>
              <b-col><label style="padding: 0.25rem 0.5rem;font-weight:600;">Type</label></b-col>
              <b-col class="text-center"><label style="padding: 0.25rem 0.5rem;font-weight:600;">Power</label></b-col>
              <b-col class="text-center"><label style="padding: 0.25rem 0.5rem;font-weight:600;">Accuracy</label></b-col>
              <b-col class="text-center"><label style="padding: 0.25rem 0.5rem;font-weight:600;">Suggested</label></b-col>
            </b-row>
          </div>
          <div v-for="(cm, i) in characterMovesByGen" v-bind:key="cm.character_move_id">
            <CharacterMove
              :index="i"
              :item="cm"
              :count="suggestedCount"
              @checked="onChecked"
              @unchecked="onUnchecked" />
            <hr />
          </div>
        </b-card>
      </b-col>
      <b-col md="2">
        <b-list-group>
          <b-list-group-item :to="{ name: 'CharacterGames', params: { id }}">
            Manage Games
          </b-list-group-item>
          <b-list-group-item active>
            Manage Moves
          </b-list-group-item>
          <b-list-group-item :to="{ name: 'CharacterEdit', params: { id: nextId }}">
            <i class="material-icons float-right" style="vertical-align: middle;">chevron_right</i>
            Next Character
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col md="2"></b-col>
    </b-row>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import CharacterMove from './CharacterMove'
import CharactersApi from '@/apis/characters'
import MovesApi from '@/apis/moves'
import CharacterMovesApi from '@/apis/characterMoves'
import GenerationTabs from './GenerationTabs'

export default {
  name: 'CharacterMoves',
  components: {
    Loading,
    CharacterMove,
    GenerationTabs
  },
  data () {
    return {
      characterId: this.$route.params.id,
      gen: 1,
      loading: true,
      busy: false,
      character: null,
      moves: [],
      characterMoves: []
    }
  },
  created () {
    this.load()
  },
  computed: {
    id () {
      return this.characterId
    },
    nextId () {
      return parseInt(this.id) + 1
    },
    genIndex () {
      return this.gen - 1
    },
    nameOrId () {
      if (!this.character) {
        return this.id
      }
      return this.character.name
    },
    moveOptions () {
      if (!this.moves.length) return []

      return this.moves.map(m => {
        return { text: m.name, value: m.move_id }
      })
    },
    characterMovesByGen () {
      return this.characterMoves.filter(
        m => m.generation === this.gen)
    },
    suggestedCount () {
      return this.characterMovesByGen.filter(
        m => m.is_suggested).length
    }
  },
  methods: {
    load () {
      const getCharacter = this.loadCharacter()
      const getAllMoves = this.loadAllMoves()
      const getCharacterMoves = this.loadCharacterMoves()

      Promise.all([getCharacter, getAllMoves, getCharacterMoves])
        .then(values => {
          this.character = values[0]
          this.moves = values[1]
          this.characterMoves = values[2]
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$toasted.error(error.message, { icon: 'highlight_off' })
        })
    },
    loadCharacter () {
      return CharactersApi.get(this.characterId)
    },
    loadAllMoves () {
      return MovesApi.list({ limit: Number.MAX_SAFE_INTEGER })
    },
    loadCharacterMoves () {
      return CharacterMovesApi.list(this.characterId)
    },
    onTabClick (args) {
      this.gen = args.index + 1
    },
    async onChecked (args) {
      const success = await this.updateCharacterMove(args.id, true)
      if (success) {
        this.setIsSuggested(args.id, true)
      }
    },
    async onUnchecked (args) {
      const success = await this.updateCharacterMove(args.id, false)
      if (success) {
        this.setIsSuggested(args.id, false)
      }
    },
    async updateCharacterMove (id, isSuggested) {
      try {
        await CharacterMovesApi.put(id, { is_suggested: isSuggested })
      } catch (ex) {
        return false
      }
      return true
    },
    setIsSuggested (id, isSuggested) {
      const index = this.characterMoves.findIndex(
        m => m.character_move_id === id)

      if (index !== -1) {
        this.characterMoves[index].is_suggested = isSuggested
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
