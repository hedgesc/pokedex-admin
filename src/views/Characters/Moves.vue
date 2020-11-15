<template>
  <div id="character-moves">
    <nav aria-label="breadcrumb">
      <b-breadcrumb>
        <b-breadcrumb-item to="/characters/list">Characters</b-breadcrumb-item>
        <b-breadcrumb-item :to="{ name: 'CharacterEdit', params: { id }}">{{ nameOrId }}</b-breadcrumb-item>
        <b-breadcrumb-item active>Moves</b-breadcrumb-item>
      </b-breadcrumb>
    </nav>
    <loading :active.sync="loading" color="#343a40" loader="dots"></loading>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import CharactersApi from '@/apis/characters'

export default {
  name: 'CharacterMoves',
  components: {
    Loading
  },
  data () {
    return {
      busy: false,
      character: null
    }
  },
  async beforeMount () {
    this.loadCharacter(this.id)
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
      if (this.character) {
        return this.busy
      }
      return true
    }
  },
  methods: {
    async loadCharacter (id) {
      this.character = await CharactersApi.get(id)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
