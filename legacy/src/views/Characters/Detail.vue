<template>
  <div id="character-detail">
    <loading :active.sync="waiting" color="#343a40" loader="dots"></loading>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/character/list">Characters</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">{{ id }}</li>
      </ol>
    </nav>
    <b-row>
      <b-col sm="8">
        <b-card header-tag="header">
          <template v-slot:header>
            <h4 class="mb-0">
              <button
                type="button"
                class="btn btn-info btn-sm float-right"
                v-on:click="onEditClick(id)"
              >Edit</button>
              {{ name }}
            </h4>
          </template>
          <b-card-body>
            <b-row>
              <b-col>
                <b-form-group
                  label="Character Id"
                  label-for="inputCharacterId">
                  <b-form-input
                    id="inputCharacterId"
                    size="lg"
                    v-model="character.character_id"
                    plaintext />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  label="Generation"
                  label-for="inputGenerate">
                  <b-form-input
                    id="inputGeneration"
                    size="lg"
                    v-model="character.generation"
                    plaintext />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  label="Name ID"
                  label-for="inputNameId">
                  <b-form-input
                    id="inputNameId"
                    size="lg"
                    v-model="character.name_id"
                    plaintext />
                </b-form-group>
              </b-col>
              <b-col></b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group label="HP" label-for="inputHP">
                  <b-form-input
                    id="inputHP"
                    size="lg"
                    v-model="character.hp"
                    plaintext />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Attack" label-for="inputAttack">
                  <b-form-input
                    id="inputAttack"
                    size="lg"
                    v-model="character.attack"
                    plaintext />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Defense" label-for="inputDefense">
                  <b-form-input
                    id="inputDefense"
                    size="lg"
                    v-model="character.defense"
                    plaintext />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Speed" label-for="inputSpeed">
                  <b-form-input
                    id="inputSpeed"
                    size="lg"
                    v-model="character.speed"
                    plaintext />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group
                  label="Special Attack"
                  label-for="inputSpecialAttack">
                  <b-form-input
                    id="inputSpecialAttack"
                    size="lg"
                    v-model="character.special_attack"
                    plaintext />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  label="Special Defense"
                  label-for="inputSpecialDefense">
                  <b-form-input
                    id="inputSpecialDefense"
                    size="lg"
                    v-model="character.special_defense"
                    plaintext />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  label="Total"
                  label-for="inputTotal">
                  <b-form-input
                    id="inputTotal"
                    size="lg"
                    v-model="character.total"
                    plaintext />
                </b-form-group>
              </b-col>
              <b-col></b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-form-group
                  label="Image URL"
                  label-for="imputImageUrl">
                  <b-form-input
                    id="inputImageUrl"
                    size="lg"
                    v-model="character.image_url"
                    plaintext />
                </b-form-group>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col sm="2"></b-col>
      <b-col sm="2">
        <b-list-group>
          <b-list-group-item active>
            Details
          </b-list-group-item>
          <b-list-group-item :to="{}">
            Games
          </b-list-group-item>
          <b-list-group-item :to="{}">
            Moves
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import CharactersApi from '@/apis/characters'

export default {
  name: 'CharacterDetail',
  data () {
    return {
      character: null,
      loaded: false,
      busy: false
    }
  },
  components: {
    Loading
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    name () {
      if (!this.character) return ''
      return `${this.character.name}`
    },
    waiting () {
      return !this.loaded || this.busy
    }
  },
  async created () {
    await this.loadCharacter()
    this.loaded = true
  },
  methods: {
    async loadCharacter () {
      this.busy = true
      const response = await CharactersApi.get(this.id)
      this.character = response
      console.log(this.character)
      this.busy = false
    },
    onEditClick (id) {
      this.$router.push({ name: 'CharacterEdit', params: { id } })
    }
  }
}
</script>

<style lang="scss" scoped>

.img {
  width: 85px;
  height: 85px;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #343a40;
  -webkit-box-shadow: 5px 5px 10px 0px rgba(52,58,64,0.44);
  -moz-box-shadow: 5px 5px 10px 0px rgba(52,58,64,0.44);
  box-shadow: 5px 5px 10px 0px rgba(52,58,64,0.44);
  img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    object-position: -20px -20px;
    border: none;
  }
}
</style>
