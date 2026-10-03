<template>
  <div id="character-edit">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/character/list">Characters</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">{{ nameOrId }}</li>
      </ol>
    </nav>
    <loading :active.sync="loading" color="#343a40" loader="dots"></loading>
    <div v-if="!loading">
      <b-row>
        <b-col md="8">
          <div class="card">
            <h4 class="card-header">
              <button
                type="button"
                class="btn btn-danger btn-sm float-right"
                v-on:click="removeCharacter"
              >
                Delete
              </button>
              Editing {{ nameOrId }}
            </h4>
            <div class="card-body">
              <form>
                <fieldset :disabled="busy">
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="inputCharacterId">Character Id</label>
                      <input
                        type="number"
                        class="form-control form-control-lg"
                        id="inputCharacterId"
                        v-model="model.character_id" />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="inputGeneration">Generation</label>
                      <input
                        type="number"
                        class="form-control form-control-lg"
                        id="inputGeneration"
                        v-model="model.generation"
                      />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="inputName">Name</label>
                      <input
                        type="text"
                        class="form-control form-control-lg"
                        id="inputName"
                        v-model="model.name"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="inputNameId">Name ID</label>
                      <input
                        type="text"
                        class="form-control form-control-lg"
                        id="inputNameId"
                        v-model="model.name_id"
                      />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-3">
                      <label for="inputHP">HP</label>
                      <input
                        type="number"
                        class="form-control form-control-lg"
                        id="inputHP"
                        v-model="model.hp"
                      />
                    </div>
                    <div class="form-group col-md-3">
                      <label for="inputAttack">Attack</label>
                      <input
                        type="number"
                        class="form-control form-control-lg"
                        id="inputAttack"
                        v-model="model.attack"
                      />
                    </div>
                    <div class="form-group col-md-3">
                      <label for="inputDefense">Defense</label>
                      <input
                        type="number"
                        class="form-control form-control-lg"
                        id="inputDefense"
                        v-model="model.defense"
                      />
                    </div>
                    <div class="form-group col-md-3">
                      <label for="inputSpeed">Speed</label>
                      <input
                        type="number"
                        class="form-control form-control-lg"
                        id="inputSpeed"
                        v-model="model.speed"
                      />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-3">
                      <label for="inputSpecialAttack">Special Attack</label>
                      <input
                        type="number"
                        class="form-control form-control-lg"
                        id="inputSpecialAttack"
                        v-model="model.special_attack"
                      />
                    </div>
                    <div class="form-group col-md-3">
                      <label for="inputSpecialDefense">Special Defense</label>
                      <input
                        type="number"
                        class="form-control form-control-lg"
                        id="inputSpecialDefense"
                        v-model="model.special_defense"
                      />
                    </div>
                    <div class="form-group col-md-3">
                      <label for="inputTotal">Total</label>
                      <input
                        type="number"
                        class="form-control form-control-lg"
                        id="inputTotal"
                        v-model="model.total"
                      />
                    </div>

                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <label for="inputImageUrl">Image URL</label>
                      <input
                        type="text"
                        class="form-control form-control-lg"
                        id="inputImageUrl"
                        v-model="model.image_url"
                      />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="inputEvolvesFrom">Evolves From</label>
                      <multiselect
                        v-model="evolvesFrom"
                        :searchable="true"
                        label="text"
                        track-by="value"
                        :options="characterOptions"
                        :option-height="66"></multiselect>
                    </div>
                    <div class="form-group col-md-6">
                      <label for="inputTypes">Types</label>
                      <multiselect
                        v-model="model.types"
                        :options="typeOptions"
                        :multiple="true"
                        :searchable="false"
                        :hide-selected="true">
                        <template slot="tag" slot-scope="{ option, remove }">
                          <span class="multiselect__tag" :class="option.toLowerCase()">
                            <span>{{ option }}</span> <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon" @click="remove(option)"></i>
                          </span>
                        </template>
                      </multiselect>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </b-col>
        <b-col md="2">
          <b-list-group>
            <b-list-group-item :to="{ name: 'CharacterGames', params: { id }}">
              Manage Games
            </b-list-group-item>
            <b-list-group-item :to="{ name: 'CharacterMoves', params: { id }}">
              Manage Moves
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col md="2"></b-col>
      </b-row>
      <div class="row form-actions">
        <div class="col-md-8">
          <button
            type="button"
            class="btn btn-primary float-right"
            v-on:click="onSubmit"
            :disabled="busy"
          >
            Save
          </button>
          <router-link to="/character/list" class="a-cancel">Back</router-link>
        </div>
        <div class="col-md-4"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import Multiselect from 'vue-multiselect'
import _ from 'lodash'
import { CharacterTypes } from '@/constants/characterTypes.js'
import CharactersApi from '@/apis/characters'

export default {
  name: 'CharacterEdit',
  components: {
    Loading,
    Multiselect
  },
  data () {
    return {
      model: null,
      characters: [],
      evolvesFrom: null,
      typeOptions: CharacterTypes,
      loading: true,
      busy: false
    }
  },
  created () {
    this.load()
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    nameOrId () {
      if (!this.model) {
        return this.id
      }
      return this.model.name
    },
    characterOptions () {
      return _.map(this.characters, this.characterToOption)
    }
  },
  methods: {
    load () {
      const getCharacter = this.loadCharacter()
      const getAllCharacters = this.loadAllCharacters()

      Promise.all([getCharacter, getAllCharacters])
        .then((values) => {
          this.model = { ...values[0] }
          this.characters = [...values[1]]
          this.initEvolvesFrom()
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$toasted.error(error.message, { icon: 'highlight_off' })
        })
    },
    loadCharacter () {
      return CharactersApi.get(this.$route.params.id)
    },
    loadAllCharacters () {
      return CharactersApi.list()
    },
    initEvolvesFrom () {
      if (this.model.evolves_from_id) {
        const c = _.find(this.characters, ['character_id', this.model.evolves_from_id])
        this.evolvesFrom = this.characterToOption(c)
      }
    },
    characterToOption (c) {
      return {
        text: c.name,
        value: c.character_id,
        icon: c.image_url
      }
    },
    async onSubmit (e) {
      this.busy = true

      if (this.evolvesFrom) {
        // came in set, lets see if it changed
        if (this.evolvesFrom.value !== this.model.evolves_from_id) {
          // it changed so update it
          this.model.evolves_from_id = this.evolvesFrom.value
        }
        // didn't change, leave it alone
      }

      try {
        const response = await CharactersApi.put(this.model.character_id, this.model)
        this.$toasted.success(response.data, { icon: 'check_circle_outline' })
      } catch (ex) {
        this.$toasted.error(ex.message, { icon: 'highlight_off' })
      }
      this.busy = false

      e.preventDefault()
    },
    removeCharacter () {
      this.$toasted.show('Are you sure?', {
        duration: null,
        icon: 'contact_support',
        action: [
          {
            text: 'Yes',
            onClick: async (e, toastObject) => {
              toastObject.goAway(0)
              try {
                const response = await CharactersApi.remove(
                  this.$route.params.id
                )
                this.$toasted.success(response.data, {
                  icon: 'check_circle_outline'
                })
                this.$router.push({ name: 'CharacterList' })
              } catch (ex) {
                this.$toasted.error(ex.message, {
                  icon: 'highlight_off'
                })
              }
            }
          },
          {
            text: 'No',
            onClick: (e, toastObject) => {
              toastObject.goAway(0)
            }
          }
        ]
      })
    }
  }
}
</script>
