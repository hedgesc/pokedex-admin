<template>
  <div id="game-edit">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/game/list">Games</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">{{ id }}</li>
      </ol>
    </nav>
    <div class="row">
      <div class="col-sm">
        <div class="card">
          <h4 class="card-header">
            <button
              type="button"
              class="btn btn-danger btn-sm float-right"
              v-on:click="removeGame"
            >
              Delete
            </button>
            Editing Game {{ model.game_id }}
          </h4>
          <div class="card-body">
            <form>
              <fieldset :disabled="busy">
                <div class="form-group">
                  <label for="inputGeneration">Generation</label>
                  <input
                    type="number"
                    class="form-control form-control-lg"
                    id="inputGeneration"
                    v-model="model.generation"
                  />
                </div>
                <div class="form-group">
                  <label for="inputNameId">Name ID</label>
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    id="inputNameId"
                    v-model="model.name_id"
                  />
                </div>
                <div class="form-group">
                  <label for="inputName">Name</label>
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    id="inputName"
                    v-model="model.name"
                  />
                </div>
                <div class="form-group">
                  <label for="inputRegions">Regions</label>
                  <multiselect
                    v-model="model.regions"
                    :options="regionOptions"
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
                <!-- <div class="form-group">
                  <label for="inputAltName">Alternate Name</label>
                  <input type="text" class="form-control form-control-lg" id="inputAltName" v-model="model.alternate_name">
                </div> -->
              </fieldset>
            </form>
          </div>
        </div>
      </div>
      <div class="col-sm"></div>
    </div>
    <div class="row form-actions">
      <div class="col-sm">
        <button
          type="button"
          class="btn btn-primary float-right"
          v-on:click="onSubmit"
          :disabled="busy"
        >
          Save
        </button>
        <router-link to="/game/list" class="a-cancel">Back</router-link>
      </div>
      <div class="col-sm"></div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { Regions } from '@/constants/regions.js'
import GamesApi from '@/apis/games'

export default {
  name: 'GameEdit',
  components: {
    Multiselect
  },
  data () {
    return {
      model: {},
      busy: false,
      regionOptions: Regions
    }
  },
  created () {
    this.getGame()
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  },
  methods: {
    async getGame () {
      this.model = await GamesApi.get(this.$route.params.id)
    },
    async onSubmit (e) {
      this.busy = true
      try {
        const response = await GamesApi.put(this.model.game_id, this.model)
        this.$toasted.success(response.data, { icon: 'check_circle_outline' })
      } catch (ex) {
        this.$toasted.error(ex.message, { icon: 'highlight_off' })
      }
      this.busy = false
      e.preventDefault()
    },
    removeGame () {
      this.$toasted.show('Are you sure?', {
        duration: null,
        icon: 'contact_support',
        action: [
          {
            text: 'Yes',
            onClick: async (e, toastObject) => {
              toastObject.goAway(0)
              try {
                const response = await GamesApi.remove(this.$route.params.id)
                this.$toasted.success(response.data, {
                  icon: 'check_circle_outline'
                })
                this.$router.push({ name: 'GameList' })
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
