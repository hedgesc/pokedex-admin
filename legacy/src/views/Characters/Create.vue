<template>
  <div id="character-create">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/character/list">Characters</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Create</li>
      </ol>
    </nav>
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <h4 class="card-header">
            Create a Character
          </h4>
          <div class="card-body">
            <form>
              <fieldset :disabled="busy">
                <div class="form-row">
                  <div class="from-group col-md-6">
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
                      :option-height="66"
                      >
                      <!-- <template slot="singleLabel" slot-scope="props">
                        <img class="option__image" :src="props.option.img" alt="No Man’s Sky">
                        <span class="option__desc">
                          <span class="option__title">{{ props.option.title }}</span>
                        </span>
                      </template> -->
                      <!-- <template slot="option" slot-scope="props"><img class="option__image" :src="props.option.img" alt="No Man’s Sky">
                        <div class="option__desc"><span class="option__title">{{ props.option.title }}</span><span class="option__small">{{ props.option.desc }}</span></div>
                      </template> -->
                    </multiselect>
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
      </div>
      <div class="col-md-4"></div>
    </div>
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
        <router-link to="/character/list" class="a-cancel">Cancel</router-link>
      </div>
      <div class="col-md-4"></div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import _ from 'lodash'
import { CharacterTypes } from '@/constants/characterTypes.js'
// import Autocomplete from "@/components/Autocomplete/Autocomplete";
import CharactersApi from '@/apis/characters'

export default {
  name: 'CharacterCreate',
  components: {
    Multiselect
  },
  data () {
    return {
      model: {},
      evolvesFrom: null,
      characterOptions: [],
      typeOptions: CharacterTypes,
      loaded: false,
      busy: false
    }
  },
  async created () {
    await this.loadCharacters()
    this.loaded = true
    console.log('loaded')
  },
  methods: {
    async loadCharacters () {
      const characters = await CharactersApi.list()
      this.characterOptions = _.map(characters, this.characterToOption)
    },
    characterToOption (character) {
      return {
        text: character.name,
        value: character.character_id,
        icon: character.image_url
      }
    },
    async onSubmit (e) {
      this.busy = true

      if (this.evolvesFrom) {
        // this character evolves from another character
        // we have to grab the id before saving
        this.model.evolves_from_id = this.evolvesFrom.value
      }

      try {
        const response = await CharactersApi.post(this.model)
        this.$toasted.success(response.data, { icon: 'check_circle_outline' })
        this.$router.push({ name: 'CharacterList' })
      } catch (ex) {
        this.$toasted.error(ex.message, { icon: 'highlight_off' })
      }

      this.busy = false

      e.preventDefault()
    }
  }
}
</script>
